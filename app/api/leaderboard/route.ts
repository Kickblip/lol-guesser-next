import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!);

  try {
    const result =
      await sql`SELECT * FROM leaderboard ORDER BY time ASC LIMIT 10`;

    if (!result || result.length === 0) {
      console.warn("[leaderboard] no rows returned");
      return NextResponse.json({ leaderboard: [] }, { status: 400 });
    }

    return NextResponse.json({ leaderboard: result }, { status: 200 });
  } catch (error) {
    console.error("[leaderboard] DB error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
