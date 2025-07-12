import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, time } = body;

  if (!username || !time) {
    return NextResponse.json(
      { message: "Username or time is missing." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("leaderboard")
    .insert([{ username, time, created_at: new Date() }]);

  if (error) {
    console.error("[leaderboard] DB error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Score added successfully." },
    { status: 200 }
  );
}
