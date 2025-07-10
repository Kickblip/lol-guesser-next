"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { answerMap, splashartMap } from "@/utils/maps";

export default function GameWindow() {
  const [image, setImage] = useState("");
  const [answer, setAnswer] = useState<string[]>([]);
  const [randomKey, setRandomKey] = useState("");
  const [guess, setGuess] = useState("");
  const [pixelatedSrc, setPixelatedSrc] = useState("");
  const [pixelationFactor, setPixelationFactor] = useState(40);
  const [message, setMessage] = useState("");
  const [alreadyGuessed, setAlreadyGuessed] = useState<string[]>([]);
  const [remainingChamps, setRemainingChamps] = useState<string[]>([]);

  useEffect(() => {
    refreshImage();
  }, []);

  const pixelateImage = (url: string, sampleSize = 10): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("2D context not available"));
          return;
        }

        ctx.drawImage(img, 0, 0);

        const { width, height } = canvas;
        const imageData = ctx.getImageData(0, 0, width, height).data;
        for (let y = 0; y < height; y += sampleSize) {
          for (let x = 0; x < width; x += sampleSize) {
            const p = (x + y * width) * 4;
            const r = imageData[p];
            const g = imageData[p + 1];
            const b = imageData[p + 2];
            const a = imageData[p + 3] / 255;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
            ctx.fillRect(x, y, sampleSize, sampleSize);
          }
        }

        const pixelatedUrl = canvas.toDataURL("image/jpeg");
        resolve(pixelatedUrl);
      };

      img.onerror = reject;
      img.src = url;
    });
  };

  const refreshImage = async () => {
    setPixelationFactor(40);

    let keys = Object.keys(splashartMap);
    let rand = "";
    if (remainingChamps.length === 0) {
      setRemainingChamps(keys);
      rand = keys[Math.floor(Math.random() * keys.length)];
    } else {
      rand =
        remainingChamps[Math.floor(Math.random() * remainingChamps.length)];
    }

    setRandomKey(rand);

    setImage(splashartMap[rand]);
    setAnswer(answerMap[rand]);

    try {
      const url = `/champs/${splashartMap[rand]}`;
      const pixelated = await pixelateImage(url, pixelationFactor);
      setPixelatedSrc(pixelated);
    } catch (error) {
      console.error("Pixelation error:", error);
      setPixelatedSrc("");
    }
  };

  const handleGuess = async () => {
    const formattedGuess = guess
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .trim();

    if (answer.includes(formattedGuess)) {
      setMessage("✅ 🎉");
      setTimeout(() => setMessage(""), 500);
      setAlreadyGuessed((prev) => [...prev, randomKey]);
      refreshImage();
    } else {
      setMessage("❌ 😿");
      setTimeout(() => setMessage(""), 500);
      const newFactor = Math.max(5, pixelationFactor - 5);
      setPixelationFactor(newFactor);

      const pixelated = await pixelateImage(`/champs/${image}`, newFactor);
      setPixelatedSrc(pixelated);
    }

    setGuess("");
  };

  if (!image || !answer) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl mb-4">
        {alreadyGuessed.length}/{Object.keys(splashartMap).length}
      </h1>
      {pixelatedSrc && (
        // show pixelated when done
        <Image
          src={pixelatedSrc}
          alt="Guess league champ"
          className="rounded"
          width={700}
          height={700}
        />
      )}
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
        <button
          className="bg-orange-500 hover:bg-orange-700 transition duration-200 text-white p-2 rounded-r w-1/5"
          type="submit"
        >
          Guess
        </button>
      </form>

      <h1
        className={`text-5xl font-bold mt-8 ${
          message ? "text-black" : "text-white"
        }`}
      >
        {message || "."}
      </h1>
    </div>
  );
}
