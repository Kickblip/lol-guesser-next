"use client";

import { useState } from "react";
import Loading from "./Loading";

export default function GameOver({
  mmss,
  time,
}: {
  mmss: string;
  time: number;
}) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recordSubmitted, setRecordSubmitted] = useState(false);

  const submitRecord = async () => {
    if (!username.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/add-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          time,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      setRecordSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Failed to submit record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (recordSubmitted) {
    return (
      <div className="flex flex-col items-center max-w-2xl w-full font-mono">
        <h1 className="text-2xl">Record Submitted!</h1>
        <button
          className="mt-4 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded"
          onClick={() => window.location.reload()}
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center max-w-2xl w-full font-mono">
      <p className="text-2xl">
        Score
        <span className="bg-gray-800 text-white ml-3 px-3 py-1 rounded">
          {mmss}
        </span>
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await submitRecord();
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
      <p className="text-red-500">{error}</p>
    </div>
  );
}
