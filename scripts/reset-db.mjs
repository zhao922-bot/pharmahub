import Database from "better-sqlite3";
import { join } from "node:path";
const db = new Database(join(process.cwd(),"data","pharmahub.db"));
db.exec("DELETE FROM quiz_attempt; DELETE FROM wrong_question; DELETE FROM review_log; DELETE FROM review_history; DELETE FROM favorite;");
console.log("reset ok");
db.close();
