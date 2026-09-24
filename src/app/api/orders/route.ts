import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "Fitur pesanan telah dinonaktifkan." },
    { status: 410 },
  );
}

export async function GET() {
  return NextResponse.json(
    { message: "Fitur pesanan telah dinonaktifkan." },
    { status: 410 },
  );
}
