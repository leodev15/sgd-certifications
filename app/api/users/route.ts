import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Certificate, ExamResult, Question, User } from "@/lib/mock-data";


export async function GET() {
  try {
    const result = await query("SELECT id, nombres, apellidos, email, dni, created_at FROM users LIMIT 10");

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Error consultando usuarios", err);
    return NextResponse.json({ error: "Error consultando usuarios" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dni, nombres, apellidos, email, telefono, password } = body;

    const result = await query(
      "INSERT INTO users (dni, nombres, apellidos, email, telefono, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [dni, nombres, apellidos, email, telefono, password]
    );

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("Error creando usuario", err);
    return NextResponse.json({ error: "No se pudo crear el usuario" }, { status: 500 });
  }
}

export async function getUsers(): Promise<User[]> {
  const result = await query("SELECT * FROM users ORDER BY created_at DESC");
  return result.rows;
}

export async function saveUser(user: User): Promise<User> {
  const result = await query(
    `INSERT INTO users (dni, nombres, apellidos, email, telefono, password, role)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (dni) DO UPDATE
       SET nombres = EXCLUDED.nombres,
           apellidos = EXCLUDED.apellidos,
           email = EXCLUDED.email,
           telefono = EXCLUDED.telefono,
           password = EXCLUDED.password,
           role = EXCLUDED.role
     RETURNING *`,
    [user.dni, user.nombres, user.apellidos, user.email, user.telefono, user.password, user.role]
  );
  return result.rows[0];
}

export async function getQuestions(): Promise<Question[]> {
  const result = await query("SELECT * FROM questions");
  return result.rows;
}

export async function getRandomQuestions(count = 10): Promise<Question[]> {
  const result = await query("SELECT * FROM questions ORDER BY RANDOM() LIMIT $1", [count]);
  return result.rows;
}

export async function saveExamResult(result: ExamResult): Promise<ExamResult> {
  const queryText = `
    INSERT INTO exam_results (user_id, score, total_questions, passed, completed_at, certificate_code)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`;
  const values = [
    result.userId,
    result.score,
    result.totalQuestions,
    result.passed,
    result.completedAt,
    result.certificateCode,
  ];
  const res = await query(queryText, values);
  return res.rows[0];
}

export async function saveCertificate(certificate: Certificate): Promise<Certificate> {
  const queryText = `
    INSERT INTO certificates (user_id, exam_result_id, codigo, fecha_emision, estado, pdf_path)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`;
  const values = [
    certificate.userId,
    certificate.examResultId,
    certificate.codigo,
    certificate.fechaEmision,
    certificate.estado,
    //certificate.pdfPath,
  ];
  const res = await query(queryText, values);
  return res.rows[0];
}