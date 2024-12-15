"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import champMap from "@/utils/champMap";

export default function GameWindow() {
  const [image, setImage] = useState("");
  const [answer, setAnswer] = useState("");
  const [guess, setGuess] = useState("");
  const [pixelatedSrc, setPixelatedSrc] = useState("");
  const [pixelationFactor, setPixelationFactor] = useState(40);

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

    const keys = Object.keys(champMap);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    setImage(randomKey);
    setAnswer(champMap[randomKey]);

    try {
      const url = `/champs/${randomKey}`;
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

    if (formattedGuess === answer) {
      // coorect guess
      refreshImage();
    } else {
      // wrong guess
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
    <div>
      {pixelatedSrc ? (
        // show pixelated when done
        <img
          src={pixelatedSrc}
          alt="Guess league champ"
          className="rounded"
          width={700}
          height={700}
        />
      ) : (
        // fallback to original
        <Image
          src={`/champs/${image}`}
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
          className="bg-blue-500 hover:bg-blue-700 transition duration-200 text-white p-2 rounded-r w-1/5"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
