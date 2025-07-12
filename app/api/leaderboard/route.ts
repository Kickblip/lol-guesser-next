export const revalidate = 0;

import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("time", { ascending: true })
    .limit(10);

  if (error) {
    console.error("[leaderboard] DB error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }

  if (!data?.length) {
    console.warn("[leaderboard] no rows returned");
    return NextResponse.json({ leaderboard: [] }, { status: 400 });
  }

  return NextResponse.json({ leaderboard: data }, { status: 200 });
}
