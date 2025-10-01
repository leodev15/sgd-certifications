import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Certificate } from "@/lib/mock-data";

export async function getCertificateByCode(
  codigo: string
): Promise<Certificate | null> {
  try {
    if (!codigo) {
      throw new Error("El código es requerido");
    }

    const res = await query("SELECT * FROM certificates WHERE codigo = $1", [
      codigo,
    ]);

    if (!res || res.rows.length === 0) {
      return null; // No se encontró certificado
    }

    return res.rows[0] as Certificate;
  } catch (err) {
    console.error("❌ Error al obtener certificado por código:", err);
    return null; // En caso de error, devolvemos null
  }
}

export async function getCertificateByDni(
  dni: string
): Promise<Certificate | null> {
  const res = await query(
    `SELECT c.*
     FROM certificates c
     JOIN users u ON c.user_id = u.id
     WHERE u.dni = $1
     ORDER BY c.fecha_emision DESC
     LIMIT 1`,
    [dni]
  );
  return res.rows[0] || null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("codigo");
  const dni = searchParams.get("dni");

  if (code) {
    const cert = await getCertificateByCode(code);
    if (!cert) {
      return NextResponse.json(
        { error: "Certificado no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(cert, { status: 200 });
  }

  if (dni) {
    const cert = await getCertificateByDni(dni);
    if (!cert) {
      return NextResponse.json(
        { error: "Certificado no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(cert, { status: 200 });
  }

  return NextResponse.json({ error: "Parámetro no válido" }, { status: 400 });
}
