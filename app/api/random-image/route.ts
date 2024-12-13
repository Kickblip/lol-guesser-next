import { NextResponse } from "next/server";
import champKey from "@/utils/champKey";

export async function POST(request: Request) {
  const keys = Object.keys(champKey);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];

  return NextResponse.json(
    {
      url: randomKey,
      answer: champKey[randomKey],
    },
    { status: 200 }
  );
}
