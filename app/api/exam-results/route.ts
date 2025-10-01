import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { ExamResult } from "@/lib/mock-data";

// Función para guardar el resultado del examen en la DB
export async function saveExamResult(result: ExamResult): Promise<ExamResult> {
  console.log("Esto se encuentra en el metodo: "+result.certificateCode);

  const res = await query(
    `INSERT INTO exam_results 
     (user_id, score, total_questions, passed, completed_at, certificate_code)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      result.userId,
      result.score,
      result.totalQuestions,
      result.passed,
      result.completedAt,
      result.certificateCode || null,
    ]
  );
  return res.rows[0];
}

// Función para obtener todos los resultados
export async function getExamResults(): Promise<ExamResult[]> {
  try {
    const res = await query(
      "SELECT * FROM exam_results ORDER BY completed_at DESC"
    );

    return res.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      score: row.score,
      totalQuestions: row.total_questions,
      passed: row.passed,
      completedAt: row.completed_at,
      certificateCode: row.certificate_code,
    }));
  } catch (error) {
    console.error("Error en getExamResults:", error);
    throw new Error("No se pudieron obtener los resultados de examen");
  }
}

// Función para obtener resultados de un usuario específico
export async function getUserExamResults(
  userId: number
): Promise<ExamResult[]> {
  try {
    const res = await query(
      "SELECT * FROM exam_results WHERE user_id = $1 ORDER BY completed_at DESC",
      [userId]
    );

    return res.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      score: row.score,
      totalQuestions: row.total_questions,
      passed: row.passed,
      completedAt: row.completed_at,
      certificateCode: row.certificate_code,
    }));
  } catch (error) {
    console.error("Error en getUserExamResults:", error);
    throw new Error("No se pudieron obtener los resultados del usuario");
  }
}

// Función para obtener un resultado específico por ID
export async function getExamResultById(
  id: string
): Promise<ExamResult | null> {
  try {
    const res = await query("SELECT * FROM exam_results WHERE id = $1", [id]);

    if (res.rows.length === 0) {
      return null;
    }

    const row = res.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      score: row.score,
      totalQuestions: row.total_questions,
      passed: row.passed,
      completedAt: row.completed_at,
      certificateCode: row.certificate_code,
    };
  } catch (error) {
    console.error("Error en getExamResultById:", error);
    throw new Error("No se pudo obtener el resultado del examen");
  }
}

// Endpoint POST /api/exam-results
export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log(body);
    const { userId, score, totalQuestions, passed, certificateCode } = body;

    console.log("Codigo del certificado: " + certificateCode);

    // Validación mínima
    if (!userId || score == null || totalQuestions == null || passed == null) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const examResult: ExamResult = {
      id: Date.now().toString(), // temporal, se puede reemplazar por serial de Postgres
      userId,
      score,
      totalQuestions,
      passed,
      completedAt: new Date().toISOString(),
      certificateCode: certificateCode || null,
    };

    const savedResult = await saveExamResult(examResult);

    return NextResponse.json(savedResult, { status: 201 });
  } catch (err) {
    console.error("Error guardando resultado de examen:", err);
    return NextResponse.json(
      { error: "Error interno al guardar el resultado" },
      { status: 500 }
    );
  }
}

// Endpoint GET /api/exam-results
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let results: ExamResult[];

    if (userId) {
      // Validar que userId sea un número válido
      const userIdNumber = Number(userId);
      if (isNaN(userIdNumber)) {
        return NextResponse.json(
          { error: "userId debe ser un número válido" },
          { status: 400 }
        );
      }

      results = await getUserExamResults(userIdNumber);
    } else {
      results = await getExamResults();
    }

    return NextResponse.json(
      {
        data: results,
        count: results.length,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error en GET /api/exam-results:", err);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: err instanceof Error ? err.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

// Opcional: Endpoint para obtener un resultado específico
export async function GET_ONE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await getExamResultById(params.id);

    if (!result) {
      return NextResponse.json(
        { error: "Resultado no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err) {
    console.error("Error obteniendo resultado específico:", err);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: err instanceof Error ? err.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
