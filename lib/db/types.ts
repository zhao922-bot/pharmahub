export interface DataContext {
  userId: string;
  db: Pick<D1Database, "prepare" | "batch">;
}
export type ContextReader = () => Promise<DataContext>;

export async function rows<T>(statement: D1PreparedStatement): Promise<T[]> {
  const result = await statement.all<T>();
  return result.results;
}
