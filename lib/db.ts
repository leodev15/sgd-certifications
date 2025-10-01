//import { PrismaClient } from "@prisma/client";

/*const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;*/


// db.ts - conexión a PostgreSQL
import { Pool } from "pg";

// Usa variables de entorno para mayor seguridad
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

/*export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log("Ejecutada:", { text, duration, rows: res.rowCount });
  return res;
}*/

export async function query(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res;
}