import { NextResponse } from "next/server"

const ADMIN_USER = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Validate credentials
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "Credenciais inválidas" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}
