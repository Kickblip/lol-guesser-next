import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.username || !body.time) {
    return NextResponse.json(
      { message: "Username or time is missing." },
      { status: 400 }
    );
  }

  const sql = neon(process.env.DATABASE_URL!);

  await sql`
    INSERT INTO leaderboard (username, time, created_at)
    VALUES (${body.username}, ${body.time}, NOW())
  `;

  return NextResponse.json(
    { message: "Score added successfully." },
    { status: 200 }
  );
}
