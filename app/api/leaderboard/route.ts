import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);

  const result =
    await sql`SELECT * FROM leaderboard ORDER BY time ASC LIMIT 10`;

  if (!result || result.length === 0) {
    return NextResponse.json({ leaderboard: [] }, { status: 400 });
  }

  return NextResponse.json({ leaderboard: result }, { status: 200 });
}
