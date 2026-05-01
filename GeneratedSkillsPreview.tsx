"use client";

import React from "react";

type Skill = {
  name: string;
  note: string;
  className: string;
  marker: string;
};

const coreSkills: Skill[] = [
  {
    name: "OpenAI",
    note:
      "Chatbots, prompt engineering, fine-tuning, embeddings, function calling, RAG, and real-time inference across Node.js, React Native, and Next.js.",
    className: "from-emerald-300 via-cyan-300 to-sky-400",
    marker: "AI",
  },
  {
    name: "Anthropic Claude",
    note:
      "Production Claude integrations for chatbots, prompts, embeddings, tool use, and RAG systems across Node.js, React Native, and Next.js apps.",
    className: "from-violet-300 via-fuchsia-300 to-rose-300",
    marker: "CL",
  },
  {
    name: "Next.js",
    note:
      "Full-stack dashboards and LLM-powered services since 2022 on Vercel, GCP, and AWS.",
    className: "from-zinc-100 via-white to-slate-300",
    marker: "NX",
  },
];

const mobileSkills: Skill[] = [
  {
    name: "React Native",
    note: "12+ shipped production apps with Expo, iOS/Android delivery, real-time backends, and mobile-first features.",
    className: "from-cyan-300 to-blue-400",
    marker: "RN",
  },
  {
    name: "Expo",
    note: "Managed workflow for rapid cross-platform iteration and simplified deployment over the last two years.",
    className: "from-slate-200 to-white",
    marker: "EX",
  },
  {
    name: "Expo Router",
    note: "File-based routing for cleaner React Native navigation and faster feature delivery.",
    className: "from-indigo-300 to-cyan-300",
    marker: "ER",
  },
  {
    name: "React Navigation",
    note: "Stack, tab, and drawer flows for production mobile applications.",
    className: "from-blue-300 to-violet-300",
    marker: "NAV",
  },
  {
    name: "Redux",
    note: "Heavy state-management usage for complex app state and side effects at scale.",
    className: "from-purple-300 to-fuchsia-300",
    marker: "RX",
  },
  {
    name: "TypeScript",
    note: "Type-safe React Native and Node.js apps across production frontend and backend services.",
    className: "from-sky-300 to-blue-500",
    marker: "TS",
  },
];

const platformSkills: Skill[] = [
  {
    name: "Supabase",
    note: "PostgreSQL-backed Firebase alternative for auth and real-time subscriptions in mobile apps.",
    className: "from-emerald-300 to-green-500",
    marker: "SB",
  },
  {
    name: "Firebase",
    note: "Realtime Database, Firestore, Auth, cloud functions, and real-time data sync.",
    className: "from-amber-200 to-orange-400",
    marker: "FB",
  },
  {
    name: "Twilio",
    note: "Video integration and real-time communication features.",
    className: "from-red-300 to-rose-500",
    marker: "TW",
  },
  {
    name: "MapBox",
    note: "Maps, geospatial interfaces, and location-based product features.",
    className: "from-lime-300 to-emerald-400",
    marker: "MAP",
  },
  {
    name: "CI/Testing",
    note: "Continuous integration and automated testing patterns for reliable releases.",
    className: "from-teal-200 to-cyan-400",
    marker: "CI",
  },
  {
    name: "Salesforce",
    note:
      "Certified Admin and Apex Developer with platform, custom object, flow, automation, and training workshop experience.",
    className: "from-sky-200 to-blue-400",
    marker: "SF",
  },
];

const cloudSkills = [
  { name: "AWS", detail: "Compute, storage, databases, and production backend workloads since 2022." },
  { name: "GCP", detail: "Hosting, deployment, compute, storage, and database services since 2022." },
  { name: "Vercel", detail: "Next.js hosting, edge functions, CI/CD, rapid scaling, and dashboard delivery." },
];

function SkillBadge({ skill, compact = false }: { skill: Skill; compact?: boolean }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] p-3 shadow-[0_18px_45px_rgba(8,13,35,0.35)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.11]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${skill.className} text-[11px] font-black tracking-tight text-slate-950 shadow-lg shadow-black/20`}>
          {skill.marker}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold tracking-tight text-white">{skill.name}</h3>
          <p className={`${compact ? "line-clamp-2 text-[10px]" : "text-[11px]"} mt-1 leading-snug text-slate-300`}>
            {skill.note}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function GeneratedSkillsPreview() {
  return (
    <main className="relative h-[540px] w-[960px] overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.28),transparent_29%),radial-gradient(circle_at_72%_16%,rgba(168,85,247,0.22),transparent_28%),radial-gradient(circle_at_58%_86%,rgba(16,185,129,0.18),transparent_34%),linear-gradient(135deg,#020617_0%,#111827_48%,#03111f_100%)]" />
      <div className="absolute left-[-90px] top-[-120px] h-80 w-80 rounded-full border border-cyan-300/20" />
      <div className="absolute bottom-[-150px] right-[-80px] h-96 w-96 rounded-full border border-fuchsia-300/20" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:34px_34px]" />

      <section className="relative z-10 grid h-full grid-cols-[1.04fr_0.96fr] gap-5 p-6">
        <div className="flex min-h-0 flex-col gap-4">
          <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
            <div className="absolute right-6 top-5 flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-300" />
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-cyan-200/90">
              Technical skill constellation
            </p>
            <h1 className="mt-2 max-w-[500px] text-4xl font-black leading-[0.95] tracking-[-0.05em] text-white">
              AI-native product engineering across web, mobile, cloud, and real-time systems.
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {["LLM apps", "Production mobile", "Realtime backends", "Cloud delivery", "Typed systems"].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1 text-[11px] font-semibold text-slate-200">
                  {item}
                </span>
              ))}
            </div>
          </header>

          <div className="grid grid-cols-3 gap-3">
            {coreSkills.map((skill) => (
              <SkillBadge key={skill.name} skill={skill} />
            ))}
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[0.9fr_1.1fr] gap-3">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-4 shadow-xl shadow-black/30">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/15 blur-2xl" />
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200">Mobile stack</p>
              <div className="mt-3 space-y-2">
                {mobileSkills.slice(0, 4).map((skill) => (
                  <div key={skill.name} className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-2.5 py-2">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${skill.className} text-[9px] font-black text-slate-950`}>
                      {skill.marker}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">{skill.name}</p>
                      <p className="line-clamp-1 text-[10px] text-slate-400">{skill.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-4 shadow-xl shadow-black/30 backdrop-blur-md">
              <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-emerald-400/15 blur-2xl" />
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-200">Cloud delivery</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {cloudSkills.map((skill) => (
                  <div key={skill.name} className="rounded-2xl border border-white/10 bg-slate-950/45 p-3">
                    <p className="text-lg font-black tracking-tight text-white">{skill.name}</p>
                    <p className="mt-1 line-clamp-4 text-[10px] leading-snug text-slate-400">{skill.detail}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {mobileSkills.slice(4).map((skill) => (
                  <SkillBadge key={skill.name} skill={skill} compact />
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="relative min-h-0 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/65 p-5 shadow-2xl shadow-fuchsia-950/30 backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_72%_76%,rgba(244,114,182,0.14),transparent_28%)]" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-fuchsia-200">Integration map</p>
                <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-white">Signals, services, and launch systems</h2>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.08] px-3 py-2 text-right">
                <p className="text-2xl font-black leading-none text-white">18</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">skills</p>
              </div>
            </div>

            <div className="relative mt-4 h-44 rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-4">
              <svg className="absolute inset-0 h-full w-full text-cyan-200/30" viewBox="0 0 400 176" aria-hidden="true">
                <path d="M56 90 C116 28, 188 30, 236 88 S326 142, 356 58" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 7" />
                <path d="M52 128 C116 154, 170 102, 224 118 S310 150, 360 108" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 8" />
                <path d="M78 48 C134 92, 178 74, 212 48 S302 28, 340 88" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 8" />
              </svg>
              <div className="absolute left-6 top-5 rounded-2xl border border-cyan-200/30 bg-cyan-300/15 px-3 py-2 shadow-lg shadow-cyan-950/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-cyan-100">Realtime</p>
                <p className="mt-0.5 text-xs text-slate-300">Twilio Video + live data</p>
              </div>
              <div className="absolute right-8 top-8 rounded-2xl border border-fuchsia-200/30 bg-fuchsia-300/15 px-3 py-2 shadow-lg shadow-fuchsia-950/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-fuchsia-100">AI layer</p>
                <p className="mt-0.5 text-xs text-slate-300">RAG, tools, embeddings</p>
              </div>
              <div className="absolute bottom-6 left-24 rounded-2xl border border-emerald-200/30 bg-emerald-300/15 px-3 py-2 shadow-lg shadow-emerald-950/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Location</p>
                <p className="mt-0.5 text-xs text-slate-300">MapBox experiences</p>
              </div>
              <div className="absolute bottom-7 right-12 rounded-2xl border border-amber-200/30 bg-amber-300/15 px-3 py-2 shadow-lg shadow-amber-950/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-100">Quality</p>
                <p className="mt-0.5 text-xs text-slate-300">CI and automated tests</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {platformSkills.map((skill) => (
                <SkillBadge key={skill.name} skill={skill} compact />
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
