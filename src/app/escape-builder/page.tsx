"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Hotspot = {
  id: string;
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
  label: string;
  prompt: string;
  answers: string[];
  hint?: string;
  points?: number;
};

type SchemaV1 = {
  version: 1;
  theme: "amber" | "cyan" | "custom";
  timer: { initialMs: number; show: boolean };
  scoring: { pointsPerCorrect: number };
  scene: {
    name: string;
    backgroundUrl: string;
    hotspots: Hotspot[];
  };
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function EscapeBuilderPage() {
  const [backgroundUrl, setBackgroundUrl] = useState<string>(
    "/escape-room.svg"
  );
  const [hotspots, setHotspots] = useState<Hotspot[]>([
    {
      id: uid(),
      xPct: 40,
      yPct: 40,
      wPct: 12,
      hPct: 12,
      label: "Window",
      prompt: "Type the secret word",
      answers: ["foss"],
      hint: "It was on the poster",
      points: 10,
    },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(hotspots[0]?.id ?? null);
  const [timerMs, setTimerMs] = useState<number>(3 * 60 * 1000);
  const [pointsPerCorrect, setPointsPerCorrect] = useState<number>(10);
  const [preview, setPreview] = useState<boolean>(false);

  const selected = useMemo(
    () => hotspots.find((h) => h.id === selectedId) || null,
    [hotspots, selectedId]
  );

  const schema: SchemaV1 = useMemo(
    () => ({
      version: 1,
      theme: "amber",
      timer: { initialMs: timerMs, show: true },
      scoring: { pointsPerCorrect },
      scene: { name: "Scene 1", backgroundUrl, hotspots },
    }),
    [backgroundUrl, hotspots, pointsPerCorrect, timerMs]
  );

  const addHotspot = () => {
    const h: Hotspot = {
      id: uid(),
      xPct: 45,
      yPct: 45,
      wPct: 10,
      hPct: 10,
      label: "Hotspot",
      prompt: "Enter answer",
      answers: ["answer"],
      points: 10,
    };
    setHotspots((arr) => [...arr, h]);
    setSelectedId(h.id);
  };

  const removeSelected = () => {
    if (!selected) return;
    setHotspots((arr) => arr.filter((h) => h.id !== selected.id));
    setSelectedId(null);
  };

  const updateSelected = (patch: Partial<Hotspot>) => {
    if (!selected) return;
    setHotspots((arr) => arr.map((h) => (h.id === selected.id ? { ...h, ...patch } : h)));
  };

  return (
    <main className="pb-24">
      <section className="p-6 mx-auto w-full max-w-6xl pt-20">
        <header className="mb-4">
          <h1 className="texty text-3xl font-semibold tracking-tight">Escape Room Builder</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Place hotspots on an image, add prompts and answers, preview the scene,
            and export a single playable HTML file.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* canvas */}
          <section className="md:col-span-2 card p-3">
            <div className="mb-3 flex items-center gap-2">
              <label className="text-sm">Background URL</label>
              <input
                type="text"
                className="w-full"
                value={backgroundUrl}
                onChange={(e) => setBackgroundUrl(e.target.value)}
                placeholder="https://..."
              />
              <button onClick={() => setPreview((p) => !p)}>
                {preview ? "Exit Preview" : "Preview"}
              </button>
            </div>

            {preview ? (
              <Runtime schema={schema} />
            ) : (
              <HotspotEditor
                backgroundUrl={backgroundUrl}
                hotspots={hotspots}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onChange={setHotspots}
              />
            )}
          </section>

          {/* sidebar */}
          <section className="card p-4">
            <h2 className="text-lg font-semibold mb-2">Hotspots</h2>
            <div className="mb-3 flex gap-2">
              <button onClick={addHotspot}>Add Hotspot</button>
              <button onClick={removeSelected} disabled={!selectedId}>
                Remove Selected
              </button>
            </div>
            <ul className="mb-4 max-h-40 overflow-auto border rounded">
              {hotspots.map((h) => (
                <li key={h.id}>
                  <button
                    className={`w-full text-left px-3 py-2 ${
                      selectedId === h.id ? "bg-amber-100/70 dark:bg-amber-900/30" : ""
                    }`}
                    onClick={() => setSelectedId(h.id)}
                  >
                    {h.label}
                  </button>
                </li>
              ))}
            </ul>

            {selected ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm">Label</label>
                  <input
                    type="text"
                    className="w-full"
                    value={selected.label}
                    onChange={(e) => updateSelected({ label: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm">Prompt</label>
                  <textarea
                    className="w-full"
                    rows={3}
                    value={selected.prompt}
                    onChange={(e) => updateSelected({ prompt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm">Answers (comma separated)</label>
                  <input
                    type="text"
                    className="w-full"
                    value={selected.answers.join(", ")}
                    onChange={(e) =>
                      updateSelected({
                        answers: e.target.value
                          .split(",")
                          .map((s) => s.trim().toLowerCase())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm">Hint (optional)</label>
                  <input
                    type="text"
                    className="w-full"
                    value={selected.hint ?? ""}
                    onChange={(e) => updateSelected({ hint: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm">Points</label>
                  <input
                    type="number"
                    className="w-28"
                    value={selected.points ?? 10}
                    onChange={(e) => updateSelected({ points: Number(e.target.value) || 0 })}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">Select a hotspot to edit</p>
            )}

            <hr className="my-4" />
            <div className="space-y-3">
              <div>
                <label className="text-sm">Timer (mm:ss)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="w-16 text-center"
                    value={Math.floor(timerMs / 60000)}
                    min={0}
                    onChange={(e) =>
                      setTimerMs((prev) => (Number(e.target.value) || 0) * 60000 + (prev % 60000))
                    }
                  />
                  <span>:</span>
                  <input
                    type="number"
                    className="w-16 text-center"
                    value={Math.floor((timerMs % 60000) / 1000)}
                    min={0}
                    max={59}
                    onChange={(e) =>
                      setTimerMs((prev) =>
                        Math.floor(prev / 60000) * 60000 + Math.min(59, Number(e.target.value) || 0) * 1000
                      )
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-sm">Points per correct</label>
                <input
                  type="number"
                  className="w-28"
                  value={pointsPerCorrect}
                  onChange={(e) => setPointsPerCorrect(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <hr className="my-4" />
            <ExportActions schema={schema} />
          </section>
        </div>
      </section>
    </main>
  );
}

function HotspotEditor(props: {
  backgroundUrl: string;
  hotspots: Hotspot[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (hotspots: Hotspot[]) => void;
}) {
  const { backgroundUrl, hotspots, selectedId, onSelect, onChange } = props;
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ id: string; mode: "move" | "resize"; dx: number; dy: number } | null>(null);

  const getRect = () => wrapRef.current?.getBoundingClientRect();

  const onMouseDown = (
    e: React.MouseEvent,
    id: string,
    mode: "move" | "resize" = "move"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(id);
    const rect = getRect();
    if (!rect) return;
    const target = e.currentTarget as HTMLElement;
    const box = target.getBoundingClientRect();
    dragRef.current = {
      id,
      mode,
      dx: e.clientX - box.left,
      dy: e.clientY - box.top,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const { id, mode, dx, dy } = dragRef.current;
    const rect = getRect();
    if (!rect) return;
    onChange(
      hotspots.map((h) => {
        if (h.id !== id) return h;
        const leftPx = e.clientX - rect.left - dx;
        const topPx = e.clientY - rect.top - dy;
        const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
        if (mode === "move") {
          const xPct = clamp((leftPx / rect.width) * 100, 0, 100 - h.wPct);
          const yPct = clamp((topPx / rect.height) * 100, 0, 100 - h.hPct);
          return { ...h, xPct, yPct };
        } else {
          const wPx = clamp(e.clientX - rect.left - (h.xPct / 100) * rect.width, rect.width * 0.04, rect.width);
          const hPx = clamp(e.clientY - rect.top - (h.yPct / 100) * rect.height, rect.height * 0.04, rect.height);
          return { ...h, wPct: (wPx / rect.width) * 100, hPct: (hPx / rect.height) * 100 };
        }
      })
    );
  };

  const onMouseUp = () => {
    dragRef.current = null;
  };

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden rounded border"
      style={{ paddingTop: "56.25%" }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <img
        src={backgroundUrl}
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      {hotspots.map((h) => (
        <div
          key={h.id}
          className={`absolute border-2 rounded bg-amber-200/40 backdrop-blur-sm ${
            selectedId === h.id ? "border-amber-600" : "border-amber-300"
          }`}
          style={{
            left: `${h.xPct}%`,
            top: `${h.yPct}%`,
            width: `${h.wPct}%`,
            height: `${h.hPct}%`,
            cursor: "move",
          }}
          onMouseDown={(e) => onMouseDown(e, h.id, "move")}
          role="button"
          aria-label={`Hotspot ${h.label}`}
        >
          <div className="absolute left-1 top-1 text-[11px] font-medium text-amber-900">
            {h.label}
          </div>
          <div
            className="absolute right-0 bottom-0 h-3 w-3 bg-amber-600"
            style={{ cursor: "nwse-resize" }}
            onMouseDown={(e) => onMouseDown(e, h.id, "resize")}
          />
        </div>
      ))}
    </div>
  );
}

function ExportActions({ schema }: { schema: SchemaV1 }) {
  const json = useMemo(() => JSON.stringify(schema, null, 2), [schema]);

  const html = useMemo(() => buildStandaloneHTML(schema), [schema]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard");
    } catch {}
  };

  const saveOutput = async () => {
    try {
      const res = await fetch("/api/outputs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: `EscapeBuilder ${new Date().toISOString()}`, html }),
      });
      if (!res.ok) {
        alert(`Save failed: ${res.status}`);
        return;
      }
      const created = await res.json();
      alert(`Saved ✓ (id: ${created.id})`);
    } catch (e) {
      alert("Save failed");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => copy(json)}>Copy JSON</button>
        <button onClick={() => copy(html)}>Copy HTML</button>
        <button onClick={saveOutput}>Save Output</button>
      </div>
      <details>
        <summary className="cursor-pointer select-none">Preview JSON</summary>
        <pre className="mt-2 max-h-48 overflow-auto text-xs border rounded p-2 bg-white dark:bg-gray-900" aria-label="Schema JSON">
{json}
        </pre>
      </details>
      <details>
        <summary className="cursor-pointer select-none">Preview HTML</summary>
        <textarea className="mt-2 w-full h-40 text-xs border rounded p-2 font-mono" readOnly value={html} />
      </details>
    </div>
  );
}

function Runtime({ schema }: { schema: SchemaV1 }) {
  const { backgroundUrl, hotspots } = schema.scene;
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [msLeft, setMsLeft] = useState(schema.timer.initialMs);

  useEffect(() => {
    setMsLeft(schema.timer.initialMs);
    const id = window.setInterval(() => setMsLeft((m) => Math.max(0, m - 1000)), 1000);
    return () => window.clearInterval(id);
  }, [schema.timer.initialMs]);

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const trySubmit = () => {
    const hp = hotspots.find((h) => h.id === openId);
    if (!hp) return;
    const ok = hp.answers.map((a) => a.toLowerCase().trim()).includes(answer.toLowerCase().trim());
    if (ok) {
      setSolved((m) => ({ ...m, [hp.id]: true }));
      setScore((s) => s + (hp.points ?? schema.scoring.pointsPerCorrect));
      setOpenId(null);
      setAnswer("");
    } else {
      alert("Not quite. Try again.");
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded border" style={{ paddingTop: "56.25%" }}>
      <img src={backgroundUrl} alt="Background" className="absolute inset-0 h-full w-full object-cover" />
      {hotspots.map((h) => (
        <button
          key={h.id}
          className={`absolute rounded border-2 bg-amber-300/30 hover:bg-amber-300/50 ${
            solved[h.id] ? "border-green-600" : "border-amber-600"
          }`}
          style={{ left: `${h.xPct}%`, top: `${h.yPct}%`, width: `${h.wPct}%`, height: `${h.hPct}%` }}
          onClick={() => setOpenId(h.id)}
          aria-label={`Hotspot ${h.label}`}
        />
      ))}

      <div className="absolute left-2 top-2 rounded bg-white/80 px-2 py-1 text-sm shadow dark:bg-gray-900/70">
        <span className="mr-3">Timer: {fmt(msLeft)}</span>
        <span>Score: {score}</span>
      </div>

      {openId && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded border bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-white">
            <header className="mb-2">
              <h3 className="text-lg font-semibold">{hotspots.find((h) => h.id === openId)?.label}</h3>
            </header>
            <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
              {hotspots.find((h) => h.id === openId)?.prompt}
            </p>
            {hotspots.find((h) => h.id === openId)?.hint && (
              <p className="mb-2 text-xs text-amber-700 dark:text-amber-300">
                Hint: {hotspots.find((h) => h.id === openId)?.hint}
              </p>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="w-full"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && trySubmit()}
                placeholder="Your answer"
              />
              <button onClick={trySubmit}>Submit</button>
              <button onClick={() => setOpenId(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function buildStandaloneHTML(schema: SchemaV1) {
  const data = JSON.stringify(schema);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Escape Runtime</title>
    <style>
      html, body { height: 100%; margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; }
      .wrap { position: relative; width: min(100%, 960px); margin: 0 auto; }
      .stage { position: relative; width: 100%; padding-top: 56.25%; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 24px rgba(0,0,0,.06); }
      .bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      .hp { position: absolute; border: 2px solid #b45309; background: rgba(245, 158, 11, .25); border-radius: 6px; }
      .topbar { position: absolute; left: 8px; top: 8px; background: rgba(255,255,255,.85); border: 1px solid rgba(0,0,0,.08); border-radius: 8px; padding: 4px 8px; box-shadow: 0 4px 12px rgba(0,0,0,.08); font-size: 14px; }
      .modal { position: fixed; inset: 0; background: rgba(0,0,0,.55); display: none; align-items: center; justify-content: center; padding: 16px; }
      .modal.on { display: flex; }
      .card { width: 100%; max-width: 480px; background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 14px; box-shadow: 0 18px 36px rgba(0,0,0,.2); }
      .row { display: flex; gap: 8px; align-items: center; }
      .row input { flex: 1; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; }
      .row button { background: linear-gradient(180deg, #d97706, #b45309); color:#fff; border:0; padding:10px 14px; border-radius:10px; box-shadow: 0 6px 16px rgba(217,119,6,.25); }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div id="stage" class="stage">
        <img id="bg" class="bg" alt="Background" />
        <div id="topbar" class="topbar"></div>
      </div>
    </div>
    <div id="modal" class="modal" role="dialog" aria-modal="true" aria-labelledby="mh"></div>
    <script>
      const schema = ${data};
      const st = document.getElementById('stage');
      const bg = document.getElementById('bg');
      const modal = document.getElementById('modal');
      const topbar = document.getElementById('topbar');
      let score = 0; let ms = schema.timer.initialMs; let solved = {};
      function fmt(ms){const s=Math.floor(ms/1000);const mm=String(Math.floor(s/60)).padStart(2,'0');const ss=String(s%60).padStart(2,'0');return mm+':'+ss}
      function tick(){ ms=Math.max(0,ms-1000); topbar.textContent = 'Timer: '+fmt(ms)+'  •  Score: '+score }
      setInterval(tick,1000); tick();
      bg.src = schema.scene.backgroundUrl;
      schema.scene.hotspots.forEach(h=>{
        const b=document.createElement('button');
        b.className='hp';
        b.style.left=h.xPct+'%'; b.style.top=h.yPct+'%';
        b.style.width=h.wPct+'%'; b.style.height=h.hPct+'%';
        b.title=h.label;
        b.onclick=()=>openModal(h);
        st.appendChild(b);
      });
      function openModal(h){
        modal.classList.add('on');
        const box=document.createElement('div');
        box.className='card';
        box.innerHTML='<h3 id="mh" style="margin:4px 0 8px 0">'+h.label+'</h3>'+
          '<p style="margin:0 0 10px 0">'+h.prompt+'</p>'+
          (h.hint?'<p style="margin:0 0 8px 0; color:#92400e; font-size:12px">Hint: '+h.hint+'</p>':'')+
          '<div class="row"><input id="ans" type="text" placeholder="Your answer"/><button id="ok">Submit</button><button id="cl">Close</button></div>';
        modal.innerHTML=''; modal.appendChild(box);
        document.getElementById('ok').onclick=()=>{
          const v=(document.getElementById('ans').value||'').trim().toLowerCase();
          if((h.answers||[]).map(a=>a.toLowerCase()).includes(v)){
            solved[h.id]=true; score+= (h.points || schema.scoring.pointsPerCorrect || 0); closeModal();
          } else { alert('Not quite. Try again.'); }
        };
        document.getElementById('cl').onclick=closeModal;
      }
      function closeModal(){ modal.classList.remove('on'); modal.innerHTML=''; }
    </script>
  </body>
  </html>`;
}
