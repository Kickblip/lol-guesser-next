"use client";

import { useState, useEffect } from "react";
import Loading from "./Loading";

type Row = {
  id: number;
  username: string;
  time: number;
  created_at: Date;
};

export default function Leaderboard() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await fetch("/api/leaderboard", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();
        setRows((data.leaderboard as Row[]) || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 font-semibold border-b pb-1">
        <span>#</span>
        <span>Player</span>
        <span>Time</span>
        <span>Date</span>
      </div>

      {rows.map((r, i) => (
        <div
          key={r.id}
          className="grid grid-cols-4 py-1 border-b last:border-none text-sm"
        >
          <span>{i + 1}</span>
          <span>{r.username}</span>
          <span>{new Date(r.time * 1000).toISOString().substring(14, 19)}</span>
          <span>{new Date(r.created_at).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  );
}
