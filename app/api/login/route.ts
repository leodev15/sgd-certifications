import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { dni, password } = await req.json();

    const res = await query("SELECT * FROM users WHERE dni = $1", [dni]);
    const user = res.rows[0];

    if (!user) {
      return NextResponse.json({ error: "Número de dni y/o Contraseña incorrecto." }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Número de dni y/o Contraseña incorrecto." }, { status: 401 });
    }

    // ✅ OJO: aquí luego puedes emitir JWT en vez de devolver user plano
    return NextResponse.json({
      user: {
        id: user.id,
        dni: user.dni,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error en login:", err);
    return NextResponse.json({ error: "Error en servidor" }, { status: 500 });
  }
}
