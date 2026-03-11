"use client";

import { Button, Slider } from "@heroui/react";
import Image from "next/image";
import { useState } from "react";

const PLAN_THRESHOLDS = [
  { name: "Free Plan", credits: 50 },
  { name: "Starter Plan", credits: 150 },
  { name: "Plus Plan", credits: 400 },
  { name: "Pro Plan", credits: 1500 },
  { name: "Agency Plan", credits: 3500 },
];

function getRecommendedPlan(credits: number) {
  return (
    PLAN_THRESHOLDS.find((p) => credits <= p.credits)?.name ?? "Agency Plan"
  );
}

export default function UsageCalculatorSection() {
  const [businesses, setBusinesses] = useState(500);
  const [datapoints, setDatapoints] = useState(5);
  const [result, setResult] = useState<number | null>(null);

  const recommended = result !== null ? getRecommendedPlan(result) : null;

  function handleCalculate() {
    setResult(businesses * datapoints);
  }

  return (
    <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Left — sliders */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Usage Calculation</h2>

        <div className="mt-6 flex flex-col gap-6">
          {/* Slider 1 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">How many business you are gonna reach out per month?</span>
            <div className="flex items-center gap-3">
              <Slider
                minValue={10}
                maxValue={10000}
                step={10}
                value={businesses}
                onChange={(v) => setBusinesses(v as number)}
                classNames={{
                  base: "flex-1",
                  filler: "bg-gradient-to-r from-purple-600 to-pink-400",
                  thumb: "bg-pink-400 border-2 border-pink-400 shadow-none",
                  track: "bg-gray-200",
                }}
              />
              <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-[1.5px]">
                <input
                  type="number"
                  min={10}
                  max={10000}
                  value={businesses}
                  onChange={(e) => setBusinesses(Number(e.target.value))}
                  className="w-20 rounded-lg bg-white px-2 py-1 text-right text-sm text-gray-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Slider 2 */}
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-600">How many data point you are looking for per 1 business?</span>
            <div className="flex items-center gap-3">
              <Slider
                minValue={1}
                maxValue={50}
                step={1}
                value={datapoints}
                onChange={(v) => setDatapoints(v as number)}
                classNames={{
                  base: "flex-1",
                  filler: "bg-gradient-to-r from-purple-600 to-pink-400",
                  thumb: "bg-pink-400 border-2 border-pink-400 shadow-none",
                  track: "bg-gray-200",
                }}
              />
              <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-[1.5px]">
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={datapoints}
                  onChange={(e) => setDatapoints(Number(e.target.value))}
                  className="w-20 rounded-lg bg-white px-2 py-1 text-right text-sm text-gray-800 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            radius="md"
            onPress={handleCalculate}
            className="font-semibold bg-gradient-to-r from-primary to-secondary text-white"
          >
            Calculate
          </Button>
        </div>
      </div>

      {/* Right — result card */}
      <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-br from-primary to-secondary p-8 text-white">
        {/* Logo */}
        <Image
          src="/images/footer/logo.svg"
          alt="Salespoint"
          width={130}
          height={32}
        />

        {/* Credits result */}
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm font-semibold ">You need</p>
          <p className="text-7xl font-bold tracking-tight">
            {result !== null ? result.toLocaleString() : "—"}
          </p>
          <p className="text-sm font-semibold ">monthly credit</p>
        </div>

        {/* Recommendation */}
        <div className="flex w-full items-center justify-center gap-3">
          {recommended && (
            <>
              <span className="text-sm font-semibold ">We Recommend</span>
              <span className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-purple-600">
                {recommended}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
