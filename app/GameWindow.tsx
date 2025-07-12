"use client";

import Image from "next/image";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { answerMap, splashartMap } from "@/utils/maps";
import GameOver from "./GameOver";
import Leaderboard from "./Leaderboard";
import Loading from "./Loading";

const LENGTH = 10;
const PIXELATION = 40;

function usePreloadImages(srcs: string[]) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      srcs.map(
        (src) =>
          new Promise<void>((res) => {
            const img = new window.Image();
            img.onload = img.onerror = () => res();
            img.decode?.().catch(() => {});
            img.src = src;
          })
      )
    ).then(() => !cancelled && setReady(true));

    return () => {
      cancelled = true;
    };
  }, [srcs]);

  return ready;
}

function pickUniqueKeys(count: number) {
  const keys = Object.keys(splashartMap);
  if (count > keys.length) throw new Error("Not enough splash art!");
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }
  return keys.slice(0, count);
}

export default function GameWindow() {
  const [gameKeys] = useState<string[]>(() => pickUniqueKeys(LENGTH));
  const imageUrls = gameKeys.map((k) => `/champs/${splashartMap[k]}`);

  const ready = usePreloadImages(imageUrls);

  const [index, setIndex] = useState(0); // which of the 10 are we on?
  const [pixelatedSrc, setPixelatedSrc] = useState("");
  const [pixelationFactor, setPixelationFactor] = useState(PIXELATION);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [penalty, setPenalty] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startRef = useRef<number | null>(null);

  const currentKey = gameKeys[index];
  const answer = answerMap[currentKey];

  useEffect(() => {
    if (!ready) return;
    pixelateAndSet(imageUrls[0], PIXELATION);
  }, [ready]);

  async function pixelateAndSet(url: string, factor: number) {
    const src = await pixelateImage(url, factor);
    setPixelatedSrc(src);
  }

  function pixelateImage(url: string, sampleSize = 10): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("2D context not available"));
        ctx.drawImage(img, 0, 0);

        for (let y = 0; y < img.height; y += sampleSize) {
          for (let x = 0; x < img.width; x += sampleSize) {
            const p = (x + y * img.width) * 4;
            const data = ctx.getImageData(x, y, 1, 1).data;
            ctx.fillStyle = `rgba(${data[0]},${data[1]},${data[2]},${
              data[3] / 255
            })`;
            ctx.fillRect(x, y, sampleSize, sampleSize);
          }
        }
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  async function handleGuess() {
    if (!timerRef.current) {
      const start = Date.now();
      startRef.current = start;
      timerRef.current = setInterval(() => setElapsed(Date.now() - start), 50);
    }

    const formatted = guess
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .trim();

    if (answer.includes(formatted)) {
      setMessage("✅ 🎉");
      setTimeout(() => setMessage(""), 500);

      if (index + 1 === LENGTH) {
        clearInterval(timerRef.current!);
        setGameOver(true);
      } else {
        setIndex((i) => i + 1);
        setPixelationFactor(PIXELATION);
        pixelateAndSet(imageUrls[index + 1], PIXELATION);
      }
    } else {
      setMessage("❌ 😿");
      setTimeout(() => setMessage(""), 500);
      const newFactor = Math.max(5, pixelationFactor - 5);
      setPenalty((p) => p + 5);
      setPixelationFactor(newFactor);
      pixelateAndSet(imageUrls[index], newFactor);
    }

    setGuess("");
  }

  if (!ready || !pixelatedSrc) return <Loading />;
  const totalMillis = elapsed + penalty * 1000;
  const mmss = new Date(totalMillis).toISOString().substring(14, 23);
  if (gameOver) return <GameOver mmss={mmss} time={totalMillis} />;

  return (
    <div className="flex flex-col items-center font-mono">
      <Head>
        {imageUrls.map((href) => (
          <link
            key={href}
            rel="preload"
            as="image"
            href={href}
            fetchPriority="high"
          />
        ))}
      </Head>

      <h1 className="text-2xl mb-4">
        {index}/{LENGTH}
        {" • "}
        {mmss}
      </h1>

      <Image
        src={pixelatedSrc}
        alt="Guess champion"
        className="rounded"
        width={700}
        height={700}
        priority
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
        <button
          className="bg-gray-800 hover:bg-gray-900 transition duration-200 text-white p-2 rounded-r w-1/5"
          type="submit"
        >
          Guess
        </button>
      </form>

      <h1
        className={`text-5xl font-bold my-8 ${
          message ? "text-black" : "text-white"
        }`}
      >
        {message || "."}
      </h1>
      <Leaderboard />
    </div>
  );
}
