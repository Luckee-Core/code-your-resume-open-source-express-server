"use client";

import React from "react";

export default function GeneratedSkillsPreview() {
  const experience = [
    {
      role: "Founder & Product Engineer",
      company: "TroutHouseTech",
      date: "Recent",
      bullets: [
        "Built AI automation and workflow tools for teams looking to reduce repetitive operational work, with practical delivery across Node.js backends, Next.js dashboards, and React Native mobile apps.",
        "Integrated OpenAI and Anthropic Claude APIs for chatbots, prompt engineering, embeddings, function calling, RAG systems, and real-time inference in prototype and production contexts.",
      ],
    },
    {
      role: "Mobile & Web Product Builder",
      company: "Selected product work",
      date: "Since 2022",
      bullets: [
        "Built and shipped 12+ React Native and Expo apps, including marketplace, social, field-service, training, and payment-enabled experiences across iOS and Android.",
        "Delivered features using Firebase, Supabase, Redux, React Navigation, Expo Router, Stripe, Twilio Video, MapBox, push notifications, CI pipelines, and automated testing patterns.",
      ],
    },
    {
      role: "Salesforce BA, Trainer & Developer",
      company: "Revature",
      date: "Earlier",
      bullets: [
        "Coordinated with large development groups as a Salesforce business analyst, trainer, and developer, producing measurable process improvements and clear delivery documentation.",
        "Applied certified Salesforce Admin and Apex Developer knowledge across custom objects, flows, automation, core platform features, and training curriculum; now a few years removed from active Salesforce development while retaining the foundation.",
      ],
    },
  ];

  const focusAreas = [
    {
      label: "AI and automation",
      items:
        "OpenAI, Anthropic Claude, chatbots, prompt engineering, fine-tuning, embeddings, function calling, RAG, real-time inference, workflow automation",
    },
    {
      label: "Web and mobile",
      items:
        "Next.js, React Native, Expo, Expo Router, React Navigation, Redux, TypeScript, JavaScript, Node.js",
    },
    {
      label: "Realtime and product APIs",
      items:
        "Firebase Realtime Database, Firestore, Firebase Auth, Supabase PostgreSQL/auth/realtime, Twilio Video, MapBox, Stripe",
    },
    {
      label: "Cloud, delivery, and CRM",
      items:
        "Vercel, AWS, GCP, CI/CD integration, Jest, ESLint, automated testing patterns, Salesforce Admin, Apex, flows, automation",
    },
  ];

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-100 p-4 font-sans text-slate-800">
      <article className="w-full max-w-[940px] rounded-sm border border-slate-200 bg-white px-9 py-7 shadow-sm ring-1 ring-slate-200/70">
        <header className="flex items-start justify-between gap-8 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Full-stack product engineer
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
              Matt Ruiz
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700">
              Founder of TroutHouseTech in Philly, building mobile, web, and AI automation
              products with a practical, operations-aware engineering style.
            </p>
          </div>
          <div className="min-w-[210px] text-right text-xs leading-relaxed text-slate-600">
            <p className="font-medium text-slate-800">Philadelphia, PA</p>
            <p>React Native / Next.js / Node.js</p>
            <p>AI automation and workflow tooling</p>
          </div>
        </header>

        <section className="mt-5">
          <h2 className="border-b border-slate-200 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Summary
          </h2>
          <ul className="mt-3 grid list-disc gap-x-8 gap-y-1 pl-4 text-sm leading-relaxed text-slate-700 sm:grid-cols-2">
            <li>
              Built production React Native, Expo, Next.js, and Node.js products across
              marketplaces, social apps, video training, field-service workflows, and dashboards.
            </li>
            <li>
              Delivered real-time video, maps, payments, auth, CI/testing, and LLM features with
              Twilio, MapBox, Stripe, Firebase, Supabase, OpenAI, and Anthropic Claude.
            </li>
            <li>
              Led TroutHouseTech automation work that turns repetitive operations into reliable,
              plain-language workflows for practical teams.
            </li>
            <li>
              Optimized for outcomes with a field-operations mindset shaped by early electrical
              and contracting experience before computer science.
            </li>
          </ul>
        </section>

        <section className="mt-5">
          <h2 className="border-b border-slate-200 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Experience
          </h2>
          <div className="mt-3 space-y-3">
            {experience.map((item) => (
              <div key={`${item.role}-${item.company}`} className="grid gap-3 sm:grid-cols-[220px_1fr]">
                <div>
                  <h3 className="text-sm font-semibold text-slate-950">{item.role}</h3>
                  <p className="text-xs leading-relaxed text-slate-600">{item.company}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.date}</p>
                </div>
                <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed text-slate-700">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <h2 className="border-b border-slate-200 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Technical Focus
          </h2>
          <div className="mt-3 grid gap-x-8 gap-y-2 text-sm leading-relaxed text-slate-700 sm:grid-cols-2">
            {focusAreas.map((area) => (
              <p key={area.label}>
                <span className="font-semibold text-slate-950">{area.label}: </span>
                {area.items}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <h2 className="border-b border-slate-200 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Education
          </h2>
          <div className="mt-3 grid gap-3 text-sm leading-relaxed text-slate-700 sm:grid-cols-[220px_1fr]">
            <div>
              <h3 className="font-semibold text-slate-950">West Chester University of Pennsylvania</h3>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">2018</p>
            </div>
            <p>
              B.S. Computer Science. Earlier apprentice experience in a family contracting
              business shaped an operations-aware approach to software: practical, field-tested,
              and focused on outcomes.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
