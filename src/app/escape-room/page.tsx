'use client';

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStopwatch } from "@/app/_components/useStopwatch";

type Task = {
  id: string;
  title: string;
  description: string;
  placeholder: string;
  hint: string;
  check: (answer: string) => boolean;
  hotspot: { top: string; left: string };
};

const tasks: Task[] = [
  {
    id: "format",
    title: "START",
    description:
      "The plans on the desk are scrambled. Reformat this snippet so it logs a greeting cleanly:",
    placeholder: "const greeting='hello   world';console.log( greeting )",
    hint: "Normalise spacing, use consistent quotes, and call console.log with greeting only.",
    check: answer =>
      /const\s+greeting\s*=/.test(answer) &&
      /hello\s*,?\s*world/i.test(answer) &&
      /console\.log\(/.test(answer),
    hotspot: { top: "35%", left: "14%" },
  },
  {
    id: "numbers",
    title: "Keypad Puzzle",
    description:
      "The keypad requires a quick script that prints every number from 0 to 1000 inclusive.",
    placeholder: "// write a loop that prints 0 through 1000",
    hint: "Any loop is fine as long as console.log runs for each value 0 through 1000.",
    check: answer => {
      const loopOk = /for\s*\(/.test(answer) || /Array\.from/.test(answer);
      const touchesRange = /1000/.test(answer) || /1001/.test(answer);
      const logs = /console\.log\(/.test(answer);
      return loopOk && touchesRange && logs;
    },
    hotspot: { top: "48%", left: "53%" },
  },
  {
    id: "data",
    title: "EXIT",
    description:
      "The glowing EXIT panel needs export-ready data. Convert an array of records into CSV with header name,email.",
    placeholder: "// turn records into CSV",
    hint: "Map each record to `${name},${email}` and join with new lines. Include the header.",
    check: answer =>
      /map\(/.test(answer) &&
      /join\(\s*['"`](\\n|\n)['"`]\s*\)/.test(answer) &&
      /name/.test(answer) &&
      /email/.test(answer),
    hotspot: { top: "44%", left: "87%" },
  },
];

type ResultMessage = { variant: "success" | "error"; text: string };

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

const EscapeRoom: React.FC = () => {
  const { elapsedMs, start, pause, reset, setElapsed } = useStopwatch();
  const [mm, setMm] = useState("05");
  const [ss, setSs] = useState("00");
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<ResultMessage | null>(null);

  const openTask = tasks.find(t => t.id === openTaskId) ?? null;
  const solvedCount = useMemo(
    () => tasks.filter(task => completed[task.id]).length,
    [completed]
  );
  const allSolved = solvedCount === tasks.length;

  const handleSubmit = (task: Task) => {
    const value = answers[task.id] ?? "";
    if (task.check(value)) {
      setCompleted(prev => ({ ...prev, [task.id]: true }));
      setMessage({ variant: "success", text: `${task.title} unlocked!` });
      setOpenTaskId(null);
    } else {
      setMessage({
        variant: "error",
        text: "Not quite right yet. Tweak the code and try again.",
      });
    }
  };

  const handleSetTimer = () => {
    const mins = Math.max(0, parseInt(mm || "0", 10) || 0);
    const secs = Math.max(0, Math.min(59, parseInt(ss || "0", 10) || 0));
    setElapsed((mins * 60 + secs) * 1000);
  };

  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(() => setMessage(null), 4000);
    return () => window.clearTimeout(id);
  }, [message]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-20">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="texty text-3xl font-semibold tracking-tight">Escape Room</h1>
          <p className="text-neutral-950 dark:text-orange-300">
            Solve each coding puzzle to override the exit lock.
          </p>
        </div>

        <section
          aria-label="Timer controls"
          className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm text-neutral-950 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-100"
        >
          <span className="font-mono text-2xl">
            {formatTime(elapsedMs)}
          </span>
          <div className="flex flex-wrap gap-2">
            <button onClick={start}>Start</button>
            <button onClick={pause}>Pause</button>
            <button onClick={reset}>Reset</button>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-950 dark:text-gray-300">
            <label className="flex items-center gap-1">
              <span>Set:</span>
              <input
                type="number"
                min={0}
                value={mm}
                onChange={e => setMm(e.target.value)}
                className="w-14 rounded border border-gray-300 bg-white px-1 py-0.5 text-center dark:border-gray-600 dark:bg-gray-800"
                aria-label="Minutes"
              />
            </label>
            <span>:</span>
            <input
              type="number"
              min={0}
              max={59}
              value={ss}
              onChange={e => setSs(e.target.value)}
              className="w-14 rounded border border-gray-300 bg-white px-1 py-0.5 text-center dark:border-gray-600 dark:bg-gray-800"
              aria-label="Seconds"
            />
            <button onClick={handleSetTimer}>Apply</button>
          </div>
        </section>
      </header>

      <section
        aria-label="Escape room panorama"
        className="relative mb-6 overflow-hidden rounded-3xl border border-gray-200 bg-[#06111d] shadow-lg dark:border-gray-700 dark:bg-gray-900"
        style={{
          aspectRatio: "1152 / 768",
          backgroundImage: "url('/escape_room.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/35 via-transparent to-black/20 pointer-events-none" />
        <div className="relative z-10 h-full w-full">
          {tasks.map(task => (
            <button
              key={task.id}
              onClick={() => setOpenTaskId(task.id)}
              className={`absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-[#064458]/50 bg-[#032c3d] bg-none px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-[#06485f] dark:bg-[#032c3d]/95 dark:hover:bg-[#06485f]/90 ${
                completed[task.id]
                  ? "bg-green-600/90 hover:bg-green-600"
                  : ""
              }`}
              style={{ top: task.hotspot.top, left: task.hotspot.left }}
              aria-label={`Open ${task.title}`}
            >
              {completed[task.id] ? "Solved" : task.title}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-white/15 bg-white/90 p-4 text-black shadow-lg backdrop-blur-md dark:bg-[#032c3d]/90 dark:text-orange">
          <h2 className="text-lg font-semibold text-orange">
            Progress
          </h2>
          <p className="mt-1 text-sm text-orange dark:text-orange-200">
            {solvedCount} of {tasks.length} puzzles unlocked.
          </p>
          <ol className="mt-3 space-y-2 text-sm text-black dark:text-orange">
            {tasks.map(task => (
              <li key={task.id} className="flex items-center gap-2">
                <span
                  className={`inline-flex h-3 w-3 rounded-full ${
                    completed[task.id] ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  aria-hidden
                />
                <span className="mt-1 text-sm text-orange dark:text-orange-200">{task.title}</span>
              </li>
            ))}
          </ol>
        </article>

        <article className="rounded-xl border border-white/15 bg-white/90 p-4 text-black shadow-lg backdrop-blur-md dark:bg-[#032c3d]/90 dark:text-orange">
          <h2 className="text-lg font-semibold text-orange">
            Mission Briefing
          </h2>
          <p className="mt-2 text-sm text-black dark:text-orange-200">
            This control room responds only to working code. Interact with each hotspot in the room,
            deliver the requested snippet, and the exit door will unlock. You can set and control the
            timer above to match the challenge brief.
          </p>
          <p className="mt-2 text-sm text-black dark:text-orange-200">
            Need help? Use the hints inside each station. You can revisit solved puzzles at any time
            to review what you submitted.
          </p>
        </article>
      </section>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`mt-6 rounded-xl border border-orange/10 bg-[#021222]/80 p-4 text-sm text-orange shadow backdrop-blur-md ${
              message.variant === "success" ? "border-green-400/40" : "border-red-400/40"
            }`}
            role="status"
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {allSolved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-gray-800 shadow-sm dark:border-emerald-800/60 dark:bg-emerald-900/40 dark:text-emerald-100"
        >
          <h2 className="text-lg font-semibold">Door unlocked</h2>
          <p className="mt-1 text-sm">
            Excellent work. Your code satisfied every station and the escape hatch is open. Take a
            screenshot of your progress and stop the timer to record your run.
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {openTask && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="dialog"
            aria-labelledby={`${openTask.id}-title`}
          >
            <motion.div
              className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#021222]/95 p-6 text-white shadow-2xl backdrop-blur-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <header className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2
                    id={`${openTask.id}-title`}
                    className="text-lg font-semibold text-orange dark:text-orange"
                  >
                    {openTask.title}
                  </h2>
                  <p className="mt-1 text-sm text-orange dark:text-orange-200">
                    {openTask.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenTaskId(null)}
                  aria-label="Close task"
                  className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/80 hover:bg-white/10"
                >
                  Close
                </button>
              </header>

              <label className="block text-sm font-medium text-orange">
                Your snippet
                <textarea
                  className="mt-2 h-40 w-full rounded-lg border border-white/15 bg-[#010d19]/90 p-3 font-mono text-sm text-white shadow-inner focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  value={answers[openTask.id] ?? ""}
                  onChange={e =>
                    setAnswers(prev => ({
                      ...prev,
                      [openTask.id]: e.target.value,
                    }))
                  }
                  placeholder={openTask.placeholder}
                />
              </label>
              <p className="mt-2 text-sm text-orange-300">
                Hint: {openTask.hint}
              </p>

              <div className="mt-4 flex flex-wrap justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleSubmit(openTask)}
                  className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:from-amber-400 hover:to-orange-400"
                >
                  Submit Code
                </button>
                {completed[openTask.id] && (
                  <span className="text-sm font-semibold text-green-600 dark:text-green-300">
                    ✅ Solved
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default EscapeRoom;
