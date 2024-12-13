"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function GameWindow() {
  const [image, setImage] = useState("");
  const [answer, setAnswer] = useState("");
  const [guess, setGuess] = useState("");

  useEffect(() => {
    refreshImage();
  }, []);

  const refreshImage = () => {
    fetch("/api/random-image", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        setImage(data.url);
        setAnswer(data.answer);
      });
  };

  const handleGuess = () => {
    const formattedGuess = guess
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .trim();

    if (formattedGuess === answer) {
      console.log("Correct!");
      refreshImage();
    } else {
      console.log("Incorrect!");
    }
    setGuess("");
  };

  if (!image || !answer) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Image
        src={`/champs/${image}`}
        alt="Guess league champ"
        className="rounded"
        width={700}
        height={700}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGuess();
        }}
        className="flex w-full mt-4"
      >
        <input
          type="text"
          placeholder="Guess champion name"
          className="w-full px-2 border rounded-l"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />
        <button className="bg-blue-500 hover:bg-blue-700 transition duration-200 text-white p-2 rounded-r w-1/5">
          Submit
        </button>
      </form>
    </div>
  );
}
