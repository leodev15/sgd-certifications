
import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { Certificate } from "@/lib/mock-data"

// ───────────────────────────────
// Funciones de acceso a la DB
// ───────────────────────────────
export async function saveCertificate(certificate: Certificate): Promise<Certificate> {
  const res = await query(
    `INSERT INTO certificates (user_id, exam_result_id, codigo, fecha_emision, estado, pdf_path)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      certificate.userId,
      certificate.examResultId,
      certificate.codigo,
      certificate.fechaEmision,
      certificate.estado,
      certificate.pdfPath || null,
    ]
  )
  return res.rows[0]
}

export async function getCertificates(): Promise<Certificate[]> {
  const res = await query("SELECT * FROM certificates ORDER BY fecha_emision DESC")
  return res.rows
}

export async function getCertificateByCode(codigo: string): Promise<Certificate | null> {
  const res = await query("SELECT * FROM certificates WHERE codigo = $1", [codigo]);

  return res.rows[0] || null
}

export async function getCertificateByDni(dni: string): Promise<Certificate | null> {
  const res = await query(
    `SELECT c.*
     FROM certificates c
     JOIN users u ON c.user_id = u.id
     WHERE u.dni = $1
     ORDER BY c.fecha_emision DESC
     LIMIT 1`,
    [dni]
  )
  return res.rows[0] || null
}

// ───────────────────────────────
// Endpoints
// ───────────────────────────────

// GET /api/certificates
// - ?code=ABC123 → busca por código
// - ?dni=12345678 → busca por DNI
// - sin query → devuelve todos
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")
    const dni = searchParams.get("dni")
    const userId = searchParams.get("userId")

    if (code) {
      const cert = await getCertificateByCode(code);

      if (!cert) {
        return NextResponse.json({ error: "Certificado no encontrado" }, { status: 404 })
      }
      return NextResponse.json(cert, { status: 200 })
    }

    if (dni) {
      const cert = await getCertificateByDni(dni)
      if (!cert) {
        return NextResponse.json({ error: "Certificado no encontrado" }, { status: 404 })
      }
      return NextResponse.json(cert, { status: 200 })
    }

    const certificates = await getCertificates()
    return NextResponse.json(certificates, { status: 200 })
  } catch (err) {
    console.error("❌ Error obteniendo certificados:", err)
    return NextResponse.json(
      { error: "Error interno al obtener certificados" },
      { status: 500 }
    )
  }
}

// POST /api/certificates
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, examResultId, codigo, fechaEmision, estado, pdfPath } = body

    if (!userId || !examResultId || !codigo || !fechaEmision || !estado) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      )
    }

    const newCert: Certificate = {
      id: Date.now().toString(), // temporal, puedes usar SERIAL en Postgres
      userId,
      examResultId,
      codigo,
      fechaEmision,
      estado,
      //pdfPath: pdfPath || null,
    }

    const savedCert = await saveCertificate(newCert)
    return NextResponse.json(savedCert, { status: 201 })
  } catch (err) {
    console.error("❌ Error guardando certificado:", err)
    return NextResponse.json(
      { error: "Error interno al guardar certificado" },
      { status: 500 }
    )
  }
}

