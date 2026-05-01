"use client";

import React from "react";

const platformSkills = [
  "Next.js: built and deployed full-stack applications and dashboards since 2022, including LLM-powered features, real-time backends, and production services on Vercel, GCP, and AWS.",
  "React Native: built and shipped 12+ production apps since 2022 with Expo, cross-platform iOS/Android delivery, real-time backends, and mobile-first feature development.",
  "TypeScript: built type-safe React Native and Node.js applications across multiple production apps and backend services.",
  "Expo: used the managed workflow for rapid iteration, cross-platform development, faster shipping, and simplified deployment over the last two years.",
  "Expo Router: used file-based routing and navigation in React Native applications for faster development and cleaner code organization.",
  "React Navigation: implemented stack, tab, drawer, and related navigation flows in React Native apps.",
  "Redux: heavy usage for state management across multiple React Native applications, including complex app state and side effects at scale.",
];

const aiSkills = [
  "OpenAI: integrated APIs for chatbots, prompt engineering, fine-tuning, embeddings, function calling, and RAG systems; built prototypes and production systems with real-time inference across Node.js backends, React Native mobile, and Next.js dashboards.",
  "Anthropic Claude: integrated APIs for chatbots, prompt engineering, embeddings, function calling, and RAG systems; deployed production real-time inference across Node.js, React Native, and Next.js applications.",
];

const backendSkills = [
  "Supabase: used as a PostgreSQL-backed alternative to Firebase for React Native apps, including real-time subscriptions and authentication.",
  "Firebase: integrated Realtime Database, Firestore, Auth, and cloud functions for real-time data sync, authentication, and React Native backends.",
  "AWS: deployed applications and backend services since 2022 using compute, storage, and database offerings for production workloads.",
  "GCP: used for hosting and deployment of backend services and full-stack applications since 2022, including compute, storage, and database services.",
  "Vercel: deployed Next.js applications since 2022 with managed hosting, edge functions, CI/CD integration, rapid iteration, and scaling.",
  "CI/Testing: continuous integration and automated testing patterns.",
];

const additionalSkills = [
  "Twilio: video integration and real-time communication.",
  "MapBox: maps and location-based features.",
  "Salesforce: Certified Salesforce Admin and Apex Developer with experience in core platform features, custom objects, flows, automation, and corporate training workshops and curriculum; currently a few years removed from active development while retaining strong foundational knowledge.",
];

function SkillList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5 text-[11px] leading-snug text-slate-700 sm:text-xs">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-[0.35rem] h-1 w-1 shrink-0 rounded-full bg-slate-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function GeneratedSkillsPreview() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-6 font-sans text-slate-900">
      <article className="w-full max-w-4xl bg-white px-8 py-7 shadow-sm ring-1 ring-slate-200 sm:px-10">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Technical Skills
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Applied Engineering Capabilities
            </h1>
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Resume Skills Preview
          </p>
        </header>

        <section className="mt-5">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Summary
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Full-stack and mobile engineer focused on production React Native,
            Next.js, Node.js, real-time backends, and applied AI systems. Recent
            work spans LLM integrations, mobile delivery, cloud deployment,
            typed application development, and backend services across Vercel,
            AWS, GCP, Firebase, and Supabase.
          </p>
        </section>

        <section className="mt-5 border-t border-slate-200 pt-4">
          <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Areas of Expertise
          </h2>

          <div className="mt-3 grid gap-x-7 gap-y-4 lg:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                Platforms and Applications
              </h3>
              <SkillList items={platformSkills} />
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                AI and Language Models
              </h3>
              <SkillList items={aiSkills} />
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                Backend, Cloud, and Delivery
              </h3>
              <SkillList items={backendSkills} />
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                Integrations and Platforms
              </h3>
              <SkillList items={additionalSkills} />
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
