"use client";

import React from "react";

type SkillCard = {
  name: string;
  label: string;
  description: string;
  className: string;
};

type SkillPill = {
  name: string;
  detail: string;
  className: string;
};

const flagshipSkills: SkillCard[] = [
  {
    name: "OpenAI",
    label: "LLM systems",
    description:
      "Chatbots, prompt engineering, fine-tuning, embeddings, function calling, RAG, and real-time inference across Node.js, React Native, and Next.js.",
    className: "border-emerald-300/40 bg-emerald-400/15 text-emerald-50",
  },
  {
    name: "Anthropic Claude",
    label: "Production AI",
    description:
      "Claude API integrations for chat, prompts, embeddings, tools, and RAG in production Node.js, React Native, and Next.js applications.",
    className: "border-violet-300/40 bg-violet-400/15 text-violet-50",
  },
  {
    name: "Next.js",
    label: "Full-stack dashboards",
    description:
      "Full-stack applications since 2022 with LLM features, real-time backends, Vercel, GCP, AWS, and production service delivery.",
    className: "border-sky-300/40 bg-sky-400/15 text-sky-50",
  },
  {
    name: "React Native",
    label: "12+ shipped apps",
    description:
      "Cross-platform iOS and Android delivery with Expo, real-time backends, mobile-first features, and scaled production workflows.",
    className: "border-fuchsia-300/40 bg-fuchsia-400/15 text-fuchsia-50",
  },
];

const ecosystemSkills: SkillPill[] = [
  {
    name: "Expo",
    detail: "Managed workflow",
    className: "bg-fuchsia-400/20 text-fuchsia-50 ring-fuchsia-300/30",
  },
  {
    name: "Expo Router",
    detail: "File-based mobile routing",
    className: "bg-pink-400/20 text-pink-50 ring-pink-300/30",
  },
  {
    name: "React Navigation",
    detail: "Stack, tab, drawer flows",
    className: "bg-rose-400/20 text-rose-50 ring-rose-300/30",
  },
  {
    name: "Redux",
    detail: "Complex app state",
    className: "bg-purple-400/20 text-purple-50 ring-purple-300/30",
  },
  {
    name: "TypeScript",
    detail: "Typed mobile and backend",
    className: "bg-blue-400/20 text-blue-50 ring-blue-300/30",
  },
  {
    name: "Supabase",
    detail: "Postgres, auth, realtime",
    className: "bg-emerald-400/20 text-emerald-50 ring-emerald-300/30",
  },
  {
    name: "Firebase",
    detail: "Auth, Firestore, functions",
    className: "bg-amber-400/20 text-amber-50 ring-amber-300/30",
  },
  {
    name: "Twilio",
    detail: "Video and realtime comms",
    className: "bg-red-400/20 text-red-50 ring-red-300/30",
  },
  {
    name: "MapBox",
    detail: "Maps and location UX",
    className: "bg-cyan-400/20 text-cyan-50 ring-cyan-300/30",
  },
  {
    name: "CI/Testing",
    detail: "Automation patterns",
    className: "bg-lime-400/20 text-lime-50 ring-lime-300/30",
  },
];

const platformSkills = [
  "Vercel edge + CI/CD",
  "AWS compute, storage, databases",
  "GCP hosting and services",
  "Salesforce Admin + Apex",
];

export default function GeneratedSkillsPreview() {
  return (
    <section className="relative h-[540px] w-[960px] overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(56,189,248,0.28),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(168,85,247,0.24),transparent_30%),radial-gradient(circle_at_58%_90%,rgba(16,185,129,0.22),transparent_32%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(15,23,42,0.96),rgba(15,23,42,0.72)_48%,rgba(2,6,23,0.98))]" />
      <div className="absolute left-10 top-8 h-32 w-32 rounded-full border border-cyan-300/20 bg-cyan-300/10 blur-xl" />
      <div className="absolute bottom-6 right-10 h-40 w-40 rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 blur-2xl" />

      <div className="relative z-10 grid h-full grid-cols-[1.02fr_0.98fr] gap-5 p-8">
        <div className="flex flex-col">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/40 bg-cyan-300/15 text-lg font-black shadow-2xl shadow-cyan-500/20">
              AI
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.42em] text-cyan-200">
                Technical Skills Map
              </p>
              <h1 className="mt-1 text-4xl font-black tracking-tight text-white">
                Real-time AI product builder
              </h1>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-3">
            {flagshipSkills.map((skill) => (
              <article
                key={skill.name}
                className={`group relative overflow-hidden rounded-3xl border p-4 shadow-2xl backdrop-blur ${skill.className}`}
              >
                <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />
                <div className="relative">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-xl font-black tracking-tight">
                      {skill.name}
                    </h2>
                    <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
                      {skill.label}
                    </span>
                  </div>
                  <p className="text-sm leading-5 text-white/78">
                    {skill.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="grid grid-rows-[auto_1fr_auto] gap-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-fuchsia-200">
                  Mobile + realtime stack
                </p>
                <p className="mt-1 text-2xl font-black tracking-tight">
                  Production-ready patterns
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/15 px-3 py-2 text-right">
                <p className="text-2xl font-black text-emerald-100">12+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100/70">
                  Apps shipped
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 p-5 shadow-2xl backdrop-blur">
            <div className="absolute inset-x-6 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-200/30 to-transparent" />
            <div className="absolute inset-y-6 left-1/2 w-px bg-gradient-to-b from-transparent via-fuchsia-200/25 to-transparent" />
            <div className="relative grid grid-cols-2 gap-3">
              {ecosystemSkills.map((skill) => (
                <div
                  key={skill.name}
                  className={`rounded-2xl px-3 py-2.5 ring-1 backdrop-blur ${skill.className}`}
                >
                  <p className="text-sm font-black">{skill.name}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-white/62">
                    {skill.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {platformSkills.map((skill) => (
              <div
                key={skill}
                className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-3 text-center text-[11px] font-bold leading-4 text-white/78 shadow-lg backdrop-blur"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-emerald-300" />
    </section>
  );
}
