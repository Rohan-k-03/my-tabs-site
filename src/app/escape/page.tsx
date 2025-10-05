"use client";

import React, { useMemo, useState } from "react";
import useStopwatch from "../_components/useStopwatch";

function formatMMSS(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function EscapePage() {
  const { elapsedMs, start, pause, reset, setElapsed } = useStopwatch();
  const [mm, setMm] = useState<string>("00");
  const [ss, setSs] = useState<string>("00");

  const handleManualSet = () => {
    const m = Math.max(0, parseInt(mm || "0", 10) || 0);
    const s = Math.max(0, Math.min(59, parseInt(ss || "0", 10) || 0));
    setElapsed((m * 60 + s) * 1000);
  };

  // Stage 1: FormatFix
  const rawSnippet = "Const myVAR =   5 ;\nconsole . log ( myVAR )";
  const fixedSnippet = "const myVar = 5;\nconsole.log(myVar)";
  const [formatFixed, setFormatFixed] = useState<string | null>(null);

  // Stage 2: PrintNumbers
  const [nInput, setNInput] = useState<string>("1000");
  const [numbersOut, setNumbersOut] = useState<string | null>(null);

  // Stage 3: CSV -> JSON
  const [csvIn, setCsvIn] = useState<string>(
    [
      "name,age",
      "Ada,36",
      "Linus,54",
    ].join("\n")
  );
  const [jsonOut, setJsonOut] = useState<string | null>(null);

  const [debugDone, setDebugDone] = useState(false);

  const hasAnyOutput = useMemo(
    () => Boolean(formatFixed || numbersOut || jsonOut || debugDone),
    [formatFixed, numbersOut, jsonOut, debugDone]
  );

  const handleFix = () => setFormatFixed(fixedSnippet);
  const logEvent = async (type: string, payload: any = {}) => {
    try {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload }),
      });
    } catch {}
  };
  
  const handleFixAndLog = () => {
    setFormatFixed(fixedSnippet);
    logEvent("escape_format_fix", {});
  };

  const handleRunNumbers = () => {
    const n = Number.parseInt(nInput, 10);
    const limit = Number.isFinite(n) && n >= 0 ? n : 1000;
    const arr: string[] = [];
    for (let i = 0; i <= limit; i++) arr.push(String(i));
    const out = arr.join(" ");
    setNumbersOut(out);
    logEvent("escape_numbers", { n: limit });
  };

  const handleCsvToJson = () => {
    try {
      const lines = csvIn.split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) {
        setJsonOut(JSON.stringify([], null, 2));
        return;
      }
      const headers = lines[0].split(",").map((h) => h.trim());
      const rows = lines.slice(1).map((line) => line.split(",").map((v) => v.trim()));
      const data = rows.map((vals) => {
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
          obj[h] = vals[i] ?? "";
        });
        return obj;
      });
      const out = JSON.stringify(data, null, 2);
      setJsonOut(out);
      logEvent("escape_csv_to_json", { rows: data.length });
    } catch (e) {
      setJsonOut("[]");
    }
  };

  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const handleSave = async () => {
    // Client-side stage logging
    const tstamp = new Date().toISOString();
    console.log(`[Stage] Save clicked at ${tstamp}`);

    const parts: string[] = [];
    if (formatFixed) {
      parts.push(`<section><h3>FormatFix</h3><pre>${escapeHtml(formatFixed)}</pre></section>`);
    }
    if (debugDone) {
      parts.push(`<section><h3>DebugHunt</h3><p>Bug fixed ✓</p></section>`);
    }
    if (numbersOut) {
      parts.push(`<section><h3>PrintNumbers</h3><pre>${escapeHtml(numbersOut)}</pre></section>`);
    }
    if (jsonOut) {
      parts.push(`<section><h3>CSV→JSON</h3><pre>${escapeHtml(jsonOut)}</pre></section>`);
    }
    const html = parts.join("\n");

    try {
      const res = await fetch("/api/outputs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: `EscapeRun ${tstamp}`, html }),
      });
      if (!res.ok) {
        const text = await res.text();
        setSaveMsg(`Save failed (${res.status}): ${text}`);
        return;
      }
      const created = await res.json();
      setSaveMsg(`Saved ✓ (id: ${created.id})`);
      logEvent("escape_save", { id: created.id });
    } catch (e: any) {
      setSaveMsg(`Save failed: ${e?.message ?? "unknown error"}`);
    }
  };

  function escapeHtml(s: string) {
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  return (
    <main className="pb-24">
      <section aria-label="Backdrop" className="absolute inset-0 -z-10 h-64">
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/escape-room.svg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.22,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent dark:from-indigo-950/40" />
      </section>

      <section className="p-6 mx-auto w-full max-w-6xl pt-20">
        <header className="mb-3">
          <h1 className="texty text-3xl font-semibold tracking-tight">Escape Room</h1>
          <p className="text-gray-600 dark:text-gray-400">Progress through the stages to prepare your outputs.</p>
        </header>

        <section aria-label="Timer" className="my-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 bg-white/70 dark:bg-slate-900/50">
            <strong className="text-gray-700 dark:text-gray-200">Timer:</strong>
            <span aria-live="polite" aria-atomic="true" className="font-mono tabular-nums text-gray-900 dark:text-gray-100">
              {formatMMSS(elapsedMs)}
            </span>
          </span>
          <div className="inline-flex gap-2 ml-1">
            <button onClick={start}>Start</button>
            <button onClick={pause}>Pause</button>
            <button onClick={reset}>Reset</button>
          </div>
          <div className="inline-flex items-center gap-2 ml-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Set (mm:ss):</label>
            <input
              aria-label="Minutes"
              className="w-14 text-center font-mono"
              type="number"
              min={0}
              value={mm}
              onChange={(e) => setMm(e.target.value)}
            />
            <span className="opacity-60">:</span>
            <input
              aria-label="Seconds"
              className="w-14 text-center font-mono"
              type="number"
              min={0}
              max={59}
              value={ss}
              onChange={(e) => setSs(e.target.value)}
            />
            <button onClick={handleManualSet}>Set</button>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="card p-5" aria-label="Stage 1: FormatFix">
            <h2 className="text-lg font-semibold mb-1">Stage 1: FormatFix</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Fix formatting issues in a snippet.</p>
            <div>
              <h3 className="font-medium mb-1">Original</h3>
              <pre className="rounded-md border p-3 bg-gray-50 dark:bg-slate-900/50 text-sm">
{rawSnippet}
              </pre>
            </div>
            <div className="mt-3 flex items-center gap-3">
            <button onClick={handleFixAndLog}>Fix</button>
            </div>
            {formatFixed && (
              <div className="mt-3">
                <h3 className="font-medium mb-1">Fixed</h3>
                <pre className="rounded-md border p-3 bg-gray-50 dark:bg-slate-900/50 text-sm">
{formatFixed}
                </pre>
              </div>
            )}
          </section>

          <section className="card p-5" aria-label="Stage 2: Debug Click">
            <h2 className="text-lg font-semibold mb-1">Stage 2: Debug Hunt</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Click the bug to enable debug mode.</p>
            <DebugHunt done={debugDone} onDone={() => setDebugDone(true)} />
          </section>

          <section className="card p-5" aria-label="Stage 3: PrintNumbers">
            <h2 className="text-lg font-semibold mb-1">Stage 3: PrintNumbers</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Enter a number n and render 0..n (default 1000).</p>
            <label className="inline-flex items-center gap-2">
              <span>n:</span>
              <input
                type="number"
                inputMode="numeric"
                value={nInput}
                onChange={(e) => setNInput(e.target.value)}
                min={0}
                className="w-32"
              />
            </label>
            <div className="mt-3">
              <button onClick={handleRunNumbers}>Run</button>
            </div>
            {numbersOut && (
              <div className="mt-3">
                <h3 className="font-medium mb-1">Output</h3>
                <pre className="rounded-md border p-3 bg-gray-50 dark:bg-slate-900/50 text-sm whitespace-pre-wrap break-words">
{numbersOut}
                </pre>
              </div>
            )}
          </section>

          <section className="card p-5 md:col-span-2" aria-label="Stage 4: CSV to JSON">
            <h2 className="text-lg font-semibold mb-1">Stage 4: CSV → JSON</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Paste CSV (header + 2 rows) and convert to JSON.</p>
            <div>
              <label htmlFor="csvIn" className="text-sm font-medium">CSV Input</label>
              <textarea
                id="csvIn"
                value={csvIn}
                onChange={(e) => setCsvIn(e.target.value)}
                rows={6}
                className="w-full font-mono"
              />
            </div>
            <div className="mt-3">
              <button onClick={handleCsvToJson}>Convert</button>
            </div>
            {jsonOut && (
              <div className="mt-3">
                <h3 className="font-medium mb-1">JSON</h3>
                <pre className="rounded-md border p-3 bg-gray-50 dark:bg-slate-900/50 text-sm">
{jsonOut}
                </pre>
              </div>
            )}
          </section>
        </div>

        <section className="mt-6">
          <button onClick={handleSave} disabled={!hasAnyOutput}>
            Save Output
          </button>
          {saveMsg && (
            <p role="status" aria-live="polite" className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {saveMsg}
            </p>
          )}
        </section>
      </section>
    </main>
  );
}

function DebugHunt({ done, onDone }: { done: boolean; onDone: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-md border">
      <img
        src="/escape-room.svg"
        alt="Escape room scene"
        className="block w-full h-48 object-cover opacity-90"
      />
      <button
        aria-label="Fix the bug"
        title={done ? "Bug fixed" : "Click the bug"}
        onClick={onDone}
        className={`absolute right-6 bottom-4 rounded-full border bg-white/80 p-2 shadow hover:scale-105 transition ${done ? "ring-2 ring-green-500" : ""}`}
      >
        <img src="/bug.svg" alt="bug icon" className="h-6 w-6" />
      </button>
      <div className="absolute left-4 bottom-4 text-sm">
        {done ? (
          <span className="inline-flex items-center gap-1 rounded bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 px-2 py-1">
            ✓ Debug mode enabled
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200 px-2 py-1">
            Find and click the bug
          </span>
        )}
      </div>
    </div>
  );
}
