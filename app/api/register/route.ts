import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dni, nombres, apellidos, email, telefono, password } = body;

    // validar si ya existe usuario
    const existing = await query("SELECT * FROM users WHERE dni = $1", [dni]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "Ya existe un usuario con este DNI" },
        { status: 400 }
      );
    }

    // encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insertar usuario
    const res = await query(
      `INSERT INTO users (dni, nombres, apellidos, email, telefono, password, role, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, dni, nombres, apellidos, email, role, created_at`,
      [
        dni,
        nombres,
        apellidos,
        email,
        telefono,
        hashedPassword,
        "postulante",
        new Date(),
      ]
    );

    return NextResponse.json({ message: 'Usuario creado exitosamente', user: res.rows[0] }, { status: 201 });
  } catch (err: any) {
    console.error("Error al registrar usuario:", err);
    // Manejo de errores únicos (duplicados)
    if (err.code === "23505") {
      // 23505 = unique_violation en Postgres
      if (err.detail.includes("dni")) {
        return NextResponse.json(
          { error: "Ya existe un usuario registrado con este DNI" },
          { status: 400 }
        );
      }
      if (err.detail.includes("email")) {
        return NextResponse.json(
          { error: "Ya existe un usuario registrado con este Email" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }
}
