"use client";

import React from "react";

export default function GeneratedSkillsPreview() {
  const summary = [
    "Built and shipped React Native, Expo, and Next.js products with TypeScript, Node.js backends, real-time data, payments, maps, video, and production deployment workflows.",
    "Delivered AI-enabled workflows using OpenAI and Anthropic Claude APIs for chatbots, prompt engineering, embeddings, function calling, fine-tuning, and RAG-style systems.",
    "Led practical product builds across marketplaces, social apps, training tools, field-service workflows, and automation projects with an operations-aware engineering style.",
    "Scaled delivery patterns with CI/testing, Vercel, AWS, GCP, Firebase, Supabase, Redux, React Navigation, Expo Router, Twilio video, MapBox, and Salesforce platform experience.",
  ];

  const experience = [
    {
      role: "Founder & Hands-on Engineer",
      organization: "TroutHouseTech",
      period: "Recent",
      bullets: [
        "Help teams reduce repetitive work through AI automation, workflow tooling, and practical engineering across Node.js, React Native, and Next.js applications.",
        "Integrated OpenAI and Anthropic Claude APIs into prototypes and production systems, including real-time inference, chatbots, embeddings, function calling, and RAG workflows.",
      ],
    },
    {
      role: "Product Engineer",
      organization: "Independent product and client work",
      period: "Recent",
      bullets: [
        "Built and shipped 12+ React Native and Expo apps since 2022, using TypeScript, Redux, React Navigation, Expo Router, Firebase, Supabase, Stripe, MapBox, and push-enabled real-time backends.",
        "Delivered products across TeenPros, BoxBets, Swizzy Golf, Women Heart Sister Match, painter/DIY marketplaces, and field-service workflows involving leads, quotes, scheduling, rentals, payments, chat, groups, and notifications.",
      ],
    },
    {
      role: "Salesforce BA / Trainer / Developer",
      organization: "Revature",
      period: "Earlier",
      bullets: [
        "Coordinated with large development groups, delivered Salesforce training workshops and curriculum, and contributed measurable process improvements.",
        "Applied Salesforce Admin and Apex Developer knowledge across core platform features, custom objects, flows, automation, and business analysis work.",
      ],
    },
  ];

  const technicalFocus = [
    {
      label: "AI and automation",
      value:
        "OpenAI, Anthropic Claude, chatbots, prompt engineering, fine-tuning, embeddings, function calling, RAG systems, real-time inference, n8n-style workflow automation.",
    },
    {
      label: "Mobile and web",
      value:
        "React Native, Expo, Expo Router, React Navigation, Redux, Next.js, React, TypeScript, JavaScript, Node.js, dashboards, full-stack services.",
    },
    {
      label: "Backends and data",
      value:
        "Firebase Realtime Database, Firestore, Firebase Auth, Cloud Functions, Supabase PostgreSQL, real-time subscriptions, authentication, CI/testing patterns.",
    },
    {
      label: "Integrations and platforms",
      value:
        "Twilio video, MapBox, Stripe, Salesforce Admin/Apex/flows, Vercel, AWS, GCP, managed hosting, edge functions, CI/CD deployment.",
    },
  ];

  return (
    <React.Fragment>
      <main className="min-h-screen w-full bg-slate-100 px-4 py-4 font-sans text-slate-800">
        <section className="mx-auto flex h-[calc(100vh-2rem)] max-h-[690px] min-h-[640px] w-full max-w-5xl flex-col overflow-hidden rounded-sm border border-slate-200 bg-white px-9 py-7 shadow-sm">
          <header className="border-b border-slate-200 pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Full-stack product engineer
            </p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                  Matt Ruiz
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Founder, TroutHouseTech | Philadelphia, PA | Practical AI automation, mobile, web, and workflow tooling
                </p>
              </div>
              <p className="max-w-xs text-right text-xs leading-relaxed text-slate-500">
                B.S. Computer Science, West Chester University of Pennsylvania
              </p>
            </div>
          </header>

          <div className="grid flex-1 grid-cols-[1.35fr_0.9fr] gap-7 pt-5">
            <div className="space-y-5">
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Summary
                </h2>
                <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-slate-700">
                  {summary.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Experience
                </h2>
                <div className="mt-2 space-y-4">
                  {experience.map((entry) => (
                    <article key={`${entry.role}-${entry.organization}`}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="text-sm font-semibold text-slate-950">
                          {entry.role} | {entry.organization}
                        </h3>
                        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                          {entry.period}
                        </p>
                      </div>
                      <ul className="mt-1.5 space-y-1 text-sm leading-relaxed text-slate-700">
                        {entry.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-2">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Technical Focus
                </h2>
                <div className="mt-2 space-y-3 text-sm leading-relaxed text-slate-700">
                  {technicalFocus.map((group) => (
                    <p key={group.label}>
                      <span className="font-semibold text-slate-950">{group.label}:</span>{" "}
                      {group.value}
                    </p>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Education
                </h2>
                <div className="mt-2 text-sm leading-relaxed text-slate-700">
                  <p className="font-semibold text-slate-950">
                    West Chester University of Pennsylvania
                  </p>
                  <p>B.S. Computer Science, 2018</p>
                </div>
              </section>

              <section>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Delivery Notes
                </h2>
                <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-slate-700">
                  <li className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                    <span>
                      Approach shaped by early electrical and field operations work in a family contracting business: diagnose before prescribing, keep systems usable, and optimize for outcomes.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                    <span>
                      Salesforce foundation remains strong across admin, Apex, custom objects, flows, automation, and training, with current focus on AI, mobile, web, and workflow automation delivery.
                    </span>
                  </li>
                </ul>
              </section>
            </aside>
          </div>
        </section>
      </main>
    </React.Fragment>
  );
}
