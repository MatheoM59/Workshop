import mysql from "mysql2/promise";

const globalForDb = globalThis as typeof globalThis & {
  pool?: mysql.Pool;
};

// DB_TARGET choisit le jeu de variables : LOCAL_* ou VM_*.
const p = process.env.DB_TARGET === "vm" ? "VM" : "LOCAL";

export const db =
  globalForDb.pool ??
  mysql.createPool({
    host: process.env[`${p}_DB_HOST`],
    port: Number(process.env[`${p}_DB_PORT`] ?? 3306),
    user: process.env[`${p}_DB_USER`],
    password: process.env[`${p}_DB_PASSWORD`],
    database: process.env[`${p}_DB_NAME`],
    connectionLimit: 10,
    waitForConnections: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = db;
}

type SqlValue = string | number | boolean | Date | null;

export async function query<T>(sql: string, params: SqlValue[] = []) {
  const [rows] = await db.execute(sql, params);
  return rows as T[];
}
