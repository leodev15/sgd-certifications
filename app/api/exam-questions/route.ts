import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { Question } from "@/lib/mock-data";


// Función para obtener todas las preguntas
export async function getQuestions(): Promise<Question[]> {
  const res = await query("SELECT * FROM questions");
  return res.rows;
}

// Función para obtener preguntas aleatorias
export async function getRandomQuestions(count = 10): Promise<Question[]> {
  const res = await query(
    "SELECT * FROM questions ORDER BY RANDOM() LIMIT $1",
    [count]
  );
  return res.rows;
}

// Endpoint GET para /api/questions
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const countParam = url.searchParams.get("count");
    const count = countParam ? parseInt(countParam) : 10;

    const questions = countParam
      ? await getRandomQuestions(count)
      : await getQuestions();

    return NextResponse.json(questions, { status: 200 });
  } catch (err) {
    console.error("Error cargando preguntas:", err);
    return NextResponse.json(
      { error: "Error al cargar preguntas" },
      { status: 500 }
    );
  }
}
