"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import useStopwatch from "@/app/_components/useStopwatch";

type Source = "boss" | "family" | "agile" | "system";
type TaskKey = "alt" | "validation" | "login" | "database";
type TaskStatus = "pending" | "urgent" | "fixed" | "court";

type Task = {
  key: TaskKey;
  label: string;
  lawOnFail?: string;
  firstAt?: number; // ms epoch when first appeared
  urgentAt?: number;
  courtAt?: number;
  status: TaskStatus;
};

type FeedItem = { ts: number; source: Source; text: string };

const HUMAN_SOURCES: Source[] = ["boss", "family", "agile"];

// 2 minutes escalation window in ms
const TWO_MIN = 2 * 60 * 1000;

export default function CourtRoom() {
  const { elapsedMs, start, pause, reset, setElapsed } = useStopwatch();
  const [mm, setMm] = useState("00");
  const [ss, setSs] = useState("00");

  // Background decorative layer
  // Tasks
  const [tasks, setTasks] = useState<Record<TaskKey, Task>>({
    alt: { key: "alt", label: "Fix alt in img1", lawOnFail: "Disability Act", status: "pending" },
    validation: { key: "validation", label: "Fix input validation", lawOnFail: "Laws of Tort", status: "pending" },
    login: { key: "login", label: "Fix user login", status: "pending" },
    database: { key: "database", label: "Secure the database", lawOnFail: "Laws of Tort", status: "pending" },
  });

  const [feed, setFeed] = useState<FeedItem[]>([]);
  const generatorTimeout = useRef<number | null>(null);
  const escalateInterval = useRef<number | null>(null);

  const logEvent = async (type: string, payload: any = {}) => {
    try {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload }),
      });
    } catch {}
  };

  const pushFeed = (source: Source, text: string) => {
    setFeed((f) => [{ ts: Date.now(), source, text }, ...f].slice(0, 200));
    logEvent("court_feed", { source, text });
  };

  const scheduleNextMessage = () => {
    const ms = 20000 + Math.floor(Math.random() * 10000); // 20–30s
    if (typeof window !== "undefined") {
      generatorTimeout.current = window.setTimeout(() => {
        const source = HUMAN_SOURCES[Math.floor(Math.random() * HUMAN_SOURCES.length)];
        const pool: Array<{ text: string; task?: TaskKey }> = [
          { text: "Are you done with sprint 1?", task: undefined },
          { text: "Can you pick up the kids after work?", task: undefined },
          { text: "Change title colour to Red", task: undefined },
          { text: "Fix alt in img1", task: "alt" },
          { text: "Fix input validation", task: "validation" },
          { text: "Fix user login", task: "login" },
          { text: "Fix secure database", task: "database" },
        ];
        const item = pool[Math.floor(Math.random() * pool.length)];

        if (item.task) {
          setTasks((prev) => {
            const t = prev[item.task!];
            // if already fixed or in court, still add reminder but don’t change timestamps
            if (!t.firstAt && t.status !== "fixed") {
              t.firstAt = Date.now();
            }
            return { ...prev, [item.task!]: { ...t } };
          });
        }

        pushFeed(source, item.text);
        scheduleNextMessage();
      }, ms);
    }
  };

  // Kick off initial messages and scheduling
  useEffect(() => {
    pushFeed("boss", "Welcome to the sprint – stay focused.");
    pushFeed("family", "Dinner at 7? Don’t be late.");
    pushFeed("agile", "Standup in 15 minutes – be ready.");
    // Mark initial appearance for key compliance tasks
    setTasks((prev) => ({
      ...prev,
      alt: { ...prev.alt, firstAt: Date.now() },
      validation: { ...prev.validation, firstAt: Date.now() },
    }));
    scheduleNextMessage();
    return () => {
      if (generatorTimeout.current) window.clearTimeout(generatorTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escalation checks
  useEffect(() => {
    const tick = () => {
      setTasks((prev) => {
        const now = Date.now();
        const next = { ...prev };
        (Object.keys(prev) as TaskKey[]).forEach((k) => {
          const t = next[k];
          if (t.status === "fixed" || t.status === "court") return;
          if (!t.firstAt) return;
          const dt = now - t.firstAt;
          // After 2 minutes -> urgent
          if (dt >= TWO_MIN && !t.urgentAt) {
            t.urgentAt = now;
            t.status = "urgent";
            pushFeed("agile", `URGENT: ${t.label}`);
            logEvent("court_urgent", { task: t.key });
          }
          // After 4 minutes -> court if still not fixed
          if (dt >= 2 * TWO_MIN && t.status !== "fixed") {
            t.courtAt = now;
            t.status = "court";
            const law = t.lawOnFail
              ? ` – fined for breaking ${t.lawOnFail}.`
              : k === "login"
              ? " – declared bankruptcy (no one can use your app)."
              : k === "database"
              ? " – hacked; breaking Laws of Tort."
              : ".";
            pushFeed("system", `COURT: You ignored "${t.label}"${law}`);
            logEvent("court_court", { task: t.key, law: t.lawOnFail || null });
          }
        });
        return next;
      });
    };
    if (typeof window !== "undefined") {
      escalateInterval.current = window.setInterval(tick, 5000);
    }
    return () => {
      if (escalateInterval.current) window.clearInterval(escalateInterval.current);
    };
  }, []);

  const anyCourt = useMemo(() => Object.values(tasks).some((t) => t.status === "court"), [tasks]);

  const handleFix = (k: TaskKey) => {
    setTasks((prev) => {
      const t = prev[k];
      if (t.status === "fixed") return prev;
      const updated: Task = { ...t, status: "fixed" };
      pushFeed("system", `Resolved: ${t.label}`);
      logEvent("court_fix", { task: t.key });
      return { ...prev, [k]: updated };
    });
  };

  const handleManualSet = () => {
    const m = Math.max(0, parseInt(mm || "0", 10) || 0);
    const s = Math.max(0, Math.min(59, parseInt(ss || "0", 10) || 0));
    const ms = (m * 60 + s) * 1000;
    setElapsed(ms);
    logEvent("court_timer_set", { ms });
  };

  return (
    <main className="relative pb-24">
      {/* Background */}
      <section aria-label="Backdrop" className="absolute inset-x-0 top-0 -z-10 h-64">
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/court-room-bg.svg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.25,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent dark:from-indigo-950/40" />
      </section>

      <section className="p-6 mx-auto w-full max-w-6xl pt-20">
        <header className="mb-3">
          <h1 className="texty text-3xl font-semibold tracking-tight">Court Room</h1>
          <p className="text-gray-600 dark:text-gray-400">Fix issues before they escalate to court.</p>
        </header>

        {/* Timer */}
        <section aria-label="Timer" className="my-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 bg-white/70 dark:bg-slate-900/50">
            <strong className="text-gray-700 dark:text-gray-200">Timer:</strong>
            <span aria-live="polite" aria-atomic="true" className="font-mono tabular-nums text-gray-900 dark:text-gray-100">
              {formatMMSS(elapsedMs)}
            </span>
          </span>
          <div className="inline-flex gap-2 ml-1">
            <button onClick={() => { start(); logEvent("court_timer", { action: "start" }); }}>Start</button>
            <button onClick={() => { pause(); logEvent("court_timer", { action: "pause" }); }}>Pause</button>
            <button onClick={() => { reset(); logEvent("court_timer", { action: "reset" }); }}>Reset</button>
          </div>
          <div className="inline-flex items-center gap-2 ml-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Set (mm:ss):</label>
            <input aria-label="Minutes" className="w-14 text-center font-mono" type="number" min={0} value={mm} onChange={(e) => setMm(e.target.value)} />
            <span className="opacity-60">:</span>
            <input aria-label="Seconds" className="w-14 text-center font-mono" type="number" min={0} max={59} value={ss} onChange={(e) => setSs(e.target.value)} />
            <button onClick={handleManualSet}>Set</button>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tasks panel */}
          <section className="card p-5 md:col-span-2" aria-label="Tasks">
            <h2 className="text-lg font-semibold mb-1">Stages</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Fix the issues below before they become urgent.</p>
            <ul className="space-y-3">
              {(Object.keys(tasks) as TaskKey[]).map((k) => {
                const t = tasks[k];
                return (
                  <li key={k} className="flex items-center justify-between rounded-md border p-3 bg-gray-50 dark:bg-slate-900/40">
                    <div>
                      <div className="font-medium">
                        {t.label}
                        {t.status === "urgent" && <span className="ml-2 rounded bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200 px-2 py-0.5 text-xs">URGENT</span>}
                        {t.status === "court" && <span className="ml-2 rounded bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 text-xs">COURT</span>}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {t.status === "fixed" ? "Resolved" : t.status === "urgent" ? "Escalated" : "Pending"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleFix(k)} disabled={t.status === "fixed" || t.status === "court"}>
                        {t.status === "fixed" ? "Fixed" : "Fix Now"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Feed panel */}
          <section className="card p-5" aria-label="Messages">
            <h2 className="text-lg font-semibold mb-1">Messages</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Boss, family and agile will ping every 20–30s.</p>
            <ul className="space-y-2 max-h-80 overflow-auto pr-1">
              {feed.map((m, i) => (
                <li key={i} className="rounded border p-2 bg-white/70 dark:bg-slate-900/40">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                    {new Date(m.ts).toLocaleTimeString()} – {m.source}
                  </div>
                  <div className="text-sm">{m.text}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      {/* Court overlay */}
      {anyCourt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl border bg-white p-6 text-gray-900 shadow-2xl dark:border-gray-700 dark:bg-gray-900 dark:text-white">
            <div className="flex items-center gap-3 mb-2">
              <img src="/gavel.svg" alt="gavel" className="h-8 w-8" />
              <h3 className="text-xl font-semibold">Court Summons</h3>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              One or more issues escalated to court due to inaction. Resolve tasks promptly to avoid fines and penalties.
            </p>
            <ul className="space-y-1 text-sm">
              {(Object.values(tasks).filter((t) => t.status === "court") as Task[]).map((t) => (
                <li key={t.key}>
                  – {t.label}{" "}
                  {t.lawOnFail
                    ? `(breaking ${t.lawOnFail})`
                    : t.key === "login"
                    ? "(declared bankruptcy)"
                    : t.key === "database"
                    ? "(hacked; laws of tort)"
                    : ""}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button onClick={() => window.location.reload()}>Reset Scenario</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function formatMMSS(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}
