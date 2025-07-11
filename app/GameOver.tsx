"use client";

import { useState } from "react";

export default function GameOver({
  mmss,
  seconds,
}: {
  mmss: string;
  seconds: number;
}) {
  const [username, setUsername] = useState("");

  const submitRecord = async () => {
    if (!username.trim()) return;

    try {
      const res = await fetch("/api/add-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          score: seconds,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-2xl w-full font-mono">
      <p className="text-2xl">
        Score
        <span className="bg-gray-800 text-white ml-3 px-3 py-1 rounded">
          {mmss}
        </span>
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitRecord();
        }}
        className="flex w-full mt-8"
      >
        <input
          type="text"
          placeholder="Enter a name for your record"
          className="w-full px-2 border rounded-l"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="bg-gray-800 hover:bg-gray-900 transition duration-200 text-white px-4 py-2 rounded-r"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
