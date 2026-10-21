import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { D1StudyRepository } from '../lib/db/study-store.ts';
import { D1QuizRepository } from '../lib/db/quiz-store.ts';
import { D1ExportRepository } from '../lib/db/export-store.ts';
import { toDateKey, nextReviewDate, fromDateKey, calculateStreak } from '../lib/review/sm2.ts';
import { buildHeatmapGrid } from '../lib/review/heatmap.ts';

// Run the actual production SQL against SQLite, with D1's transactional batch semantics.
function fixture(t) {
  const sqlite = new DatabaseSync(':memory:');
  t.after(() => sqlite.close());
  const migrations = new URL('../drizzle/', import.meta.url);
  for (const file of readdirSync(migrations).filter(f => f.endsWith('.sql')).sort()) {
    sqlite.exec(readFileSync(new URL(file, migrations), 'utf8'));
  }
  const db = {
    prepare(sql) {
      let args = [];
      const stmt = {
        bind(...values) { args = values; return stmt; },
        execute() { return { results: sqlite.prepare(sql).all(...args).map(row => ({...row})) }; },
        async all() { return stmt.execute(); },
        async first() { return stmt.execute().results[0] ?? null; },
        async run() { return stmt.execute(); },
      };
      return stmt;
    },
    async batch(statements) {
      sqlite.exec('BEGIN');
      try { const result = statements.map(s => s.execute()); sqlite.exec('COMMIT'); return result; }
      catch (e) { sqlite.exec('ROLLBACK'); throw e; }
    },
  };
  const user = userId => {
    const context = async () => ({ db, userId });
    return { study: new D1StudyRepository(context), quiz: new D1QuizRepository(context), exports: new D1ExportRepository(context) };
  };
  return { db, sqlite, a: user('alice'), b: user('bob') };
}
const now = new Date('2026-10-21T16:05:00Z'); // Oct 22 in the study timezone.
const attempt = { questionId: 'q1', cardId: 'c1', kind: 'mechanism', selectedId: 'wrong', correctId: 'right', now };

test('all study reads and exports are isolated by signed-in user', async t => {
  const { a, b } = fixture(t);
  await a.study.recordReview('c1', 2, now);
  await a.study.toggleFavorite('c1', now);
  assert.equal((await a.study.getReviewLog('c1')).nextReviewAt, '2026-10-23');
  assert.equal((await a.study.getProgress(now)).reviewedTodayCount, 1);
  assert.deepEqual(await a.study.getDailyReviewCounts(now), [{date:'2026-10-22', count:1}]);
  assert.equal((await a.exports.getReviewHistory()).length, 1);
  assert.equal((await a.exports.getReviewStates()).length, 1);
  assert.equal((await a.exports.getFavorites()).length, 1);
  assert.equal(await b.study.getReviewLog('c1'), null);
  assert.deepEqual(await b.study.getReviewLogs(['c1']), []);
  assert.deepEqual(await b.study.getDueCardIds(new Date('2026-11-01')), []);
  assert.deepEqual(await b.study.getFavoriteCardIds(), []);
  assert.equal(await b.study.isFavorite('c1'), false);
  assert.equal((await b.study.getCardStats('c1')).reviewCount, 0);
  assert.equal((await b.study.getProgress(now)).learnedCount, 0);
  assert.deepEqual(await b.study.getDailyReviewCounts(now), []);
  for (const method of ['getReviewHistory','getReviewStates','getFavorites']) assert.deepEqual(await b.exports[method](), []);
});

test('simultaneous device reviews preserve both updates and exactly two history entries', async t => {
  const { a } = fixture(t);
  await Promise.all([a.study.recordReview('c1',2,now), a.study.recordReview('c1',2,now)]);
  const state = await a.study.getReviewLog('c1');
  assert.equal(state.repetitions, 2);
  assert.equal(state.intervalDays, 6);
  assert.equal((await a.exports.getReviewHistory()).length, 2);
});

test('favorite toggles remain atomic and never affect a second user', async t => {
  const { a,b } = fixture(t);
  await b.study.toggleFavorite('c1',now);
  await Promise.all([a.study.toggleFavorite('c1',now), a.study.toggleFavorite('c1',now)]);
  assert.equal(await a.study.isFavorite('c1'), false);
  assert.equal(await b.study.isFavorite('c1'), true);
  assert.deepEqual(await a.exports.getFavorites(), []);
});

test('quiz records, correction, removal, clear and exports cannot cross accounts', async t => {
  const { a,b } = fixture(t);
  await Promise.all([a.quiz.recordAttempt(attempt), a.quiz.recordAttempt(attempt), b.quiz.recordAttempt(attempt)]);
  assert.equal((await a.quiz.getWrongQuestions())[0].wrongCount, 2);
  await a.quiz.recordAttempt({...attempt, selectedId:'right'});
  assert.deepEqual(await a.quiz.getStats(now), {answeredToday:3,correctToday:1,answeredTotal:3,correctTotal:1,wrongCount:1});
  assert.equal((await a.exports.getQuizAttempts()).length, 3);
  assert.equal((await a.exports.getQuizAttempts())[2].isCorrect, true);
  assert.equal((await a.exports.getWrongQuestions())[0].lastCorrectAt, now.toISOString());
  assert.equal((await b.quiz.getWrongQuestions())[0].lastCorrectAt, null);
  await a.quiz.markCorrect('q1',now);
  await a.quiz.removeWrongQuestion('q1');
  await a.quiz.recordAttempt(attempt);
  await a.quiz.clearWrongQuestions();
  assert.deepEqual(await a.quiz.getWrongQuestions(), []);
  assert.equal((await b.exports.getWrongQuestions())[0].wrongCount, 1);
  assert.equal((await b.exports.getQuizAttempts()).length, 1);
});

test('a failed batch leaves no partial records', async t => {
  const { db, a } = fixture(t);
  await assert.rejects(db.batch([
    db.prepare("INSERT INTO favorite VALUES (?, ?, ?, 1)").bind('alice','c1',now.toISOString()),
    db.prepare('INSERT INTO nonexistent VALUES (1)'),
  ]));
  assert.deepEqual(await a.exports.getFavorites(), []);
});

test('a missing authenticated context cannot write study records', async () => {
  const study = new D1StudyRepository(async () => {throw new Error('sign-in required');});
  await assert.rejects(study.recordReview('c1',2,now), /sign-in required/);
});

test('UTC+8 midnight, month boundary, leap year and heatmap share the same date', () => {
  assert.equal(toDateKey(new Date('2026-10-21T15:59:59Z')), '2026-10-21');
  assert.equal(toDateKey(new Date('2026-10-21T16:00:00Z')), '2026-10-22');
  assert.equal(toDateKey(nextReviewDate(new Date('2026-12-31T12:00:00Z'),1)), '2027-01-01');
  assert.equal(toDateKey(nextReviewDate(fromDateKey('2028-02-28'),1)), '2028-02-29');
  assert.throws(() => fromDateKey('2026-02-30'));
  const dates = ['2026-10-21', '2026-10-22'];
  const grid = buildHeatmapGrid(dates.map(date => ({date,count:1})), now, 2);
  const today = grid.weeks.flatMap(w => w.cells).find(c => c?.isToday);
  assert.equal(today.date, '2026-10-22');
  assert.equal(grid.currentStreak, 2);
  assert.equal(calculateStreak(new Set(dates), now), 2);
});
