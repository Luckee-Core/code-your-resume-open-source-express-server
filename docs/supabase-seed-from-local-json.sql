-- =============================================================================
-- Supabase seed from local JSON vault
-- Generated: 2026-05-28T15:51:46.557Z
-- CRM dir: /Users/matthewruiz/github/codeyourresume/code-your-resume-open-source-express-server/.data/crm
-- Job listing dir: /Users/matthewruiz/github/codeyourresume/code-your-resume-open-source-express-server/.data/job-listing
--
-- Prerequisite DDL (run first if tables are missing):
--   docs/crm-postgres-schema.sql
--   docs/supabase-image-graphics-schema.sql
--
-- Regenerate:
--   npx ts-node scripts/generate-supabase-seed-from-json.ts
--
-- Open-source test vault only:
--   CRM_DATA_DIR=../code-your-resume-open-source/.data/crm \
--   JOB_LISTING_DATA_DIR=../code-your-resume-open-source/.data/job-listing \
--   npx ts-node scripts/generate-supabase-seed-from-json.ts
-- =============================================================================

BEGIN;

-- companies (18 rows)
INSERT INTO companies (
  id, name, website, notes, website_urls,
  playwright_website_url_discovery_attempted, website_research_summary,
  website_research_completed_at, created_at, updated_at
)
VALUES
  (
    $seed$dd672430-54f1-43f6-a4ae-0ec8dc8a1903$seed$::uuid,
    $seed$Revature$seed$,
    $seed$https://revature.com/$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-05-07T19:42:41.259Z$seed$::timestamptz,
    $seed$2026-05-07T19:42:41.259Z$seed$::timestamptz
  ),
  (
    $seed$5b12d3d5-b8b7-4080-832e-06038a29cc85$seed$::uuid,
    $seed$g2i$seed$,
    $seed$https://www.g2i.co/$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$G2i is a video-based hiring platform that connects companies with contract and full-time engineers from a curated pool of over 8,000 qualified professionals. The platform serves companies looking to hire faster, offering access to engineers located in the US, Canada, Latin America, and Europe across specialties including JavaScript, Python, iOS, Android, AI, and data science.

The company differentiates itself through speed and transparency. G2i aims to move from initial interview to a developer's first pull request in seven days. The platform provides video-recorded technical interviews and detailed technical assessments upfront, allowing hiring managers to see exactly what the company sees before making decisions. All financial terms are pre-negotiated and transparent, eliminating haggling over rates.

G2i's matching process is customized to each client's needs. Companies specify location, price range, seniority level, and exact skill requirements, and G2i's AI-assisted technical team delivers profiles of engineers meeting at least 80% of those criteria. The platform includes a shared Slack channel for ongoing communication and typically delivers qualified profiles within three days.

The company reduces hiring risk through a seven-day free trial with every engineer. If performance doesn't meet expectations, clients pay nothing and G2i provides same-week backfill. Engineers can start as contractors and convert to full-time employees when appropriate, offering flexibility for changing business needs.

G2i handles administrative overhead including compliance, international payments, background checks, laptop logistics, and errors and omissions insurance. The platform also trains its engineer pool monthly on AI-based coding tools and provides AI-certified badges to engineers demonstrating proficiency with these technologies.$seed$,
    $seed$2026-05-08T19:40:16.276Z$seed$::timestamptz,
    $seed$2026-05-07T20:33:07.166Z$seed$::timestamptz,
    $seed$2026-05-08T19:40:16.276Z$seed$::timestamptz
  ),
  (
    $seed$5069bc33-4dee-44a4-b57c-14c78b1e5770$seed$::uuid,
    $seed$Turing$seed$,
    $seed$https://www.turing.com/$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-05-20T13:49:35.055Z$seed$::timestamptz,
    $seed$2026-05-20T13:49:35.055Z$seed$::timestamptz
  ),
  (
    $seed$f03e4087-6bab-4a2f-b7f3-236105ee59c9$seed$::uuid,
    $seed$Pepper$seed$,
    $seed$https://www.usepepper.com/$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-05-20T14:30:55.037Z$seed$::timestamptz,
    $seed$2026-05-20T14:30:55.037Z$seed$::timestamptz
  ),
  (
    $seed$18fc517f-681b-4bbe-85b4-4d379e85c923$seed$::uuid,
    $seed$Softrip$seed$,
    $seed$https://www.softrip.com/$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-05-20T14:45:11.996Z$seed$::timestamptz,
    $seed$2026-05-20T14:45:11.996Z$seed$::timestamptz
  ),
  (
    $seed$54245d36-aedc-4e72-8c0d-9309bd1ac79a$seed$::uuid,
    $seed$Genie Solution$seed$,
    $seed$https://www.genie-solution.com/$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-05-20T14:47:46.269Z$seed$::timestamptz,
    $seed$2026-05-20T14:47:46.269Z$seed$::timestamptz
  ),
  (
    $seed$28ce0ea7-f740-4648-8f3c-c2e69e94ba53$seed$::uuid,
    $seed$Kolo$seed$,
    $seed$https://hellokolo.com/$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-05-20T14:57:25.488Z$seed$::timestamptz,
    $seed$2026-05-20T14:57:25.488Z$seed$::timestamptz
  ),
  (
    $seed$64d59110-f4ef-48ee-bfcf-65e404f26486$seed$::uuid,
    $seed$Kaaj$seed$,
    $seed$https://kaaj.ai/$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-05-20T14:59:27.818Z$seed$::timestamptz,
    $seed$2026-05-20T14:59:27.818Z$seed$::timestamptz
  ),
  (
    $seed$dfba6075-31ae-4b96-ad3c-e3677765abf1$seed$::uuid,
    $seed$Simply Bread$seed$,
    $seed$https://www.simply-bread.co/$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-05-20T15:12:29.349Z$seed$::timestamptz,
    $seed$2026-05-20T15:12:29.349Z$seed$::timestamptz
  ),
  (
    $seed$c1f81373-fc0b-4ef5-be41-861554b6fd91$seed$::uuid,
    $seed$Skylined Dynamics$seed$,
    $seed$https://www.skylinedynamics.org/$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-05-20T15:16:22.084Z$seed$::timestamptz,
    $seed$2026-05-20T15:16:22.084Z$seed$::timestamptz
  ),
  (
    $seed$b50097ea-4fa2-4ebc-8e76-871a60abe684$seed$::uuid,
    $seed$LegalOS$seed$,
    $seed$https://www.legalos.ai$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-05-21T23:51:21.911Z$seed$::timestamptz,
    $seed$2026-05-21T23:51:31.143Z$seed$::timestamptz
  ),
  (
    $seed$8d08d006-fd79-4578-9a4c-0ff8002504b3$seed$::uuid,
    $seed$Stylitics$seed$,
    $seed$$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-05-27T19:59:51.587Z$seed$::timestamptz,
    $seed$2026-05-27T19:59:51.587Z$seed$::timestamptz
  ),
  (
    $seed$81a62bf3-4f43-4364-90aa-b1e9681e908f$seed$::uuid,
    $seed$Afresh$seed$,
    $seed$$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-05-27T20:16:05.298Z$seed$::timestamptz,
    $seed$2026-05-27T20:16:05.298Z$seed$::timestamptz
  ),
  (
    $seed$87fce2cf-715b-42f2-b70c-4834166d14de$seed$::uuid,
    $seed$Sekai$seed$,
    $seed$$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-05-27T22:21:22.353Z$seed$::timestamptz,
    $seed$2026-05-27T22:21:22.353Z$seed$::timestamptz
  ),
  (
    $seed$d617c4a7-cf2a-4d32-855b-1f382ba4224c$seed$::uuid,
    $seed$Air Labs$seed$,
    $seed$$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-05-27T22:33:00.229Z$seed$::timestamptz,
    $seed$2026-05-27T22:33:00.229Z$seed$::timestamptz
  ),
  (
    $seed$6d61093b-9581-45f9-80e3-f29ceedb8945$seed$::uuid,
    $seed$8090$seed$,
    $seed$$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-05-28T10:50:11.592Z$seed$::timestamptz,
    $seed$2026-05-28T10:50:11.592Z$seed$::timestamptz
  ),
  (
    $seed$8599c9f2-0c1d-47f8-8b69-efe2d3e3510a$seed$::uuid,
    $seed$Sudowrite$seed$,
    $seed$$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-05-28T11:02:06.968Z$seed$::timestamptz,
    $seed$2026-05-28T11:02:06.968Z$seed$::timestamptz
  ),
  (
    $seed$04e7494b-a9f2-495b-a89f-8dcdfa0b08c6$seed$::uuid,
    $seed$Kodex$seed$,
    $seed$$seed$,
    $seed$$seed$,
    $seed$[]$seed$::jsonb,
    false,
    $seed$$seed$,
    NULL,
    $seed$2026-05-28T15:49:07.221Z$seed$::timestamptz,
    $seed$2026-05-28T15:49:07.221Z$seed$::timestamptz
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  website = EXCLUDED.website,
  notes = EXCLUDED.notes,
  website_urls = EXCLUDED.website_urls,
  playwright_website_url_discovery_attempted = EXCLUDED.playwright_website_url_discovery_attempted,
  website_research_summary = EXCLUDED.website_research_summary,
  website_research_completed_at = EXCLUDED.website_research_completed_at,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at;

-- employees: (no rows in JSON)

-- image_graphics: (no job applications referencing graphics)

-- jobs (17 rows)
INSERT INTO jobs (
  id, company_id, title, url, status, description,
  listing_imported_at, latest_scrape_run_id, latest_ai_exchange_id,
  created_at, updated_at
)
VALUES
  (
    $seed$848b2f20-ceb0-42c2-beb9-486bb29f5b83$seed$::uuid,
    $seed$dd672430-54f1-43f6-a4ae-0ec8dc8a1903$seed$::uuid,
    $seed$Corporate Salesforce Trainer$seed$,
    $seed$$seed$,
    $seed$draft$seed$,
    $seed$$seed$,
    NULL,
    NULL,
    NULL,
    $seed$2026-05-07T19:43:04.944Z$seed$::timestamptz,
    $seed$2026-05-07T19:43:04.944Z$seed$::timestamptz
  ),
  (
    $seed$8a860607-3182-4bb1-90a5-782b6082098d$seed$::uuid,
    $seed$5b12d3d5-b8b7-4080-832e-06038a29cc85$seed$::uuid,
    $seed$Senior Engineer - AI Evaluator$seed$,
    $seed$https://jobs.ashbyhq.com/g2i/c07a8f96-dbcb-47f3-9d19-305b193d6d01$seed$,
    $seed$draft$seed$,
    $seed$G2i Inc. is seeking a Senior Engineer - AI Evaluator to join their team. This role involves evaluating and assessing AI systems and models, requiring deep technical expertise and experience with AI/ML technologies. The position is ideal for experienced engineers who want to contribute to advancing AI evaluation methodologies and practices.$seed$,
    $seed$2026-05-07T20:33:23.387Z$seed$::timestamptz,
    $seed$7e1c95fb-6b63-411d-b85f-1f7cfcd01cb2$seed$::uuid,
    $seed$abc57789-f4cc-4eb2-9ca1-24018563582a$seed$::uuid,
    $seed$2026-05-07T20:33:18.718Z$seed$::timestamptz,
    $seed$2026-05-07T20:33:23.388Z$seed$::timestamptz
  ),
  (
    $seed$ff66d118-38a1-442c-9f9f-053d5ed98169$seed$::uuid,
    $seed$f03e4087-6bab-4a2f-b7f3-236105ee59c9$seed$::uuid,
    $seed$Senior Full-Stack Engineer, Product$seed$,
    $seed$$seed$,
    $seed$draft$seed$,
    $seed$Join Pepper as a Senior Full-Stack Engineer to build Order Agent, an AI-powered product that transforms inbound orders from voicemails, texts, emails, photos, and PDFs into clean digital orders. You'll work on a small, senior team at a $1T food distribution software company backed by top-tier VCs (Lead Edge, ICONIQ, Greylock). This role spans agentic systems, voice and document AI, and core ordering experiences used by hundreds of foodservice wholesalers. You'll ship end-to-end features across web and mobile apps, own meaningful technical architecture, and work directly with customers to shape product direction.$seed$,
    $seed$2026-05-20T14:41:59.942Z$seed$::timestamptz,
    $seed$a1cd3f86-e43a-4ca3-ae90-67c83525663f$seed$::uuid,
    $seed$44bfece8-10b2-4ef8-b8e3-c00477bef5d4$seed$::uuid,
    $seed$2026-05-20T14:31:05.211Z$seed$::timestamptz,
    $seed$2026-05-20T14:42:05.777Z$seed$::timestamptz
  ),
  (
    $seed$cfa66a2c-ac2f-4b5b-9e9d-157fb3c89023$seed$::uuid,
    $seed$18fc517f-681b-4bbe-85b4-4d379e85c923$seed$::uuid,
    $seed$AI Engineer$seed$,
    $seed$$seed$,
    $seed$applied$seed$,
    $seed$$seed$,
    NULL,
    NULL,
    NULL,
    $seed$2026-05-20T14:45:21.884Z$seed$::timestamptz,
    $seed$2026-05-20T14:55:19.854Z$seed$::timestamptz
  ),
  (
    $seed$d28dc042-5167-4907-8ea2-e5309f68bb49$seed$::uuid,
    $seed$54245d36-aedc-4e72-8c0d-9309bd1ac79a$seed$::uuid,
    $seed$Full Stack Engineer (AI Products)$seed$,
    $seed$$seed$,
    $seed$applied$seed$,
    $seed$GenieSolutions is seeking a reliable Full Stack Engineer to build modern web applications and AI-powered solutions for international startup clients. This is a long-term remote position requiring strong independent work capabilities, proven freelance experience, and expertise in contemporary web and AI technologies. The role involves direct collaboration with clients across the US, UK, Australia, and Israel on SaaS platforms, AI integrations, automation systems, and custom business applications.$seed$,
    $seed$2026-05-20T14:48:19.183Z$seed$::timestamptz,
    $seed$7ffbbef4-3581-4be9-9659-edb8434d30a5$seed$::uuid,
    $seed$9e642486-d835-487e-9842-3ebb947acc21$seed$::uuid,
    $seed$2026-05-20T14:47:55.767Z$seed$::timestamptz,
    $seed$2026-05-20T14:55:11.095Z$seed$::timestamptz
  ),
  (
    $seed$0337f404-0e40-436f-98c6-0834825ad973$seed$::uuid,
    $seed$28ce0ea7-f740-4648-8f3c-c2e69e94ba53$seed$::uuid,
    $seed$Full-stack Software Engineer$seed$,
    $seed$https://hellokolo.com/careers/fullstack$seed$,
    $seed$applied$seed$,
    $seed$Join Kolo as a Full-stack Software Engineer in a remote role across US, CA, EU, UK, and LATAM. You'll own the complete development lifecycle from research pipeline to product surface, working across backend and frontend with a small, senior team. The role involves building APIs for data ingestion (like SEC filings) and refining user-facing reading experiences. Using TypeScript end-to-end, you'll move fast, keep things simple, and have high ownership of critical paths. This is an opportunity to ship complete features independently without dependencies on other team members.$seed$,
    $seed$2026-05-20T14:57:37.394Z$seed$::timestamptz,
    $seed$50c41397-5672-41e3-b0db-9d669c09dedc$seed$::uuid,
    $seed$cdb7cf06-0722-4d2d-9bb7-3dcabf52dc92$seed$::uuid,
    $seed$2026-05-20T14:57:33.106Z$seed$::timestamptz,
    $seed$2026-05-20T14:57:40.800Z$seed$::timestamptz
  ),
  (
    $seed$3d7d9105-c9ea-4b39-911f-1bc6410585d2$seed$::uuid,
    $seed$64d59110-f4ef-48ee-bfcf-65e404f26486$seed$::uuid,
    $seed$Founding Full Stack Engineer$seed$,
    $seed$$seed$,
    $seed$draft$seed$,
    $seed$Kaaj, an AI Fintech startup backed by Kindred Ventures and Better Tomorrow Ventures, is seeking a Founding Full Stack Engineer to join their remote US team. You'll develop AI agent management systems and customer-facing interfaces for a live product serving financial institutions. This role offers the opportunity to shape product architecture and culture at an early-stage startup with a founding team experienced from Uber, Cruise, and American Express.$seed$,
    $seed$2026-05-20T14:59:49.283Z$seed$::timestamptz,
    $seed$7bfe1dee-95b4-419a-93ea-4ef52115bd58$seed$::uuid,
    $seed$6b4b0844-f024-46bb-9932-edc396334ba6$seed$::uuid,
    $seed$2026-05-20T14:59:38.576Z$seed$::timestamptz,
    $seed$2026-05-20T14:59:52.692Z$seed$::timestamptz
  ),
  (
    $seed$94598e57-4eaa-49d0-86c5-2da7e7fa39cc$seed$::uuid,
    $seed$dfba6075-31ae-4b96-ad3c-e3677765abf1$seed$::uuid,
    $seed$Full-Stack Software Engineer$seed$,
    $seed$$seed$,
    $seed$applied$seed$,
    $seed$Simply Bread is seeking a Full-Stack Software Engineer to join their technology team and help build the future of micro-bakeries. You will architect and ship critical features across their software ecosystem, ensuring bakers have seamless tools to run their businesses. This role is fundamental to the technology team's success, requiring someone who can take complex problems and deliver high-quality solutions with total autonomy. Over the next 12 months, you'll be the engine behind product velocity, ensuring the app scales with demand for local bread.$seed$,
    $seed$2026-05-20T15:12:46.444Z$seed$::timestamptz,
    $seed$4478818e-474c-4228-bde2-a9f0a0c58182$seed$::uuid,
    $seed$cc6fb05b-76e7-4190-81bd-fe2ec8666fb3$seed$::uuid,
    $seed$2026-05-20T15:12:34.999Z$seed$::timestamptz,
    $seed$2026-05-20T15:15:29.621Z$seed$::timestamptz
  ),
  (
    $seed$a20fe89f-fcfe-4035-92ca-8d45bdeccccc$seed$::uuid,
    $seed$c1f81373-fc0b-4ef5-be41-861554b6fd91$seed$::uuid,
    $seed$Full-Stack Engineer$seed$,
    $seed$$seed$,
    $seed$applied$seed$,
    $seed$Skyline Dynamics Inc. is seeking a Full-Stack Engineer to design, build, and maintain practical software solutions for modern businesses. In this role, you'll work across the entire technology stack to develop web applications, internal tools, APIs, dashboards, and integrations that help clients improve operations, automate workflows, and manage data more effectively. You'll transform business requirements into clean, reliable, and scalable software while collaborating closely with product, design, and business stakeholders in a small, fast-moving team environment.$seed$,
    $seed$2026-05-20T15:16:38.839Z$seed$::timestamptz,
    $seed$e4f41afa-b3ff-4693-9491-a9f12681bfb6$seed$::uuid,
    $seed$f5791208-4ad7-4704-9b20-e5f115b3e0ea$seed$::uuid,
    $seed$2026-05-20T15:16:37.627Z$seed$::timestamptz,
    $seed$2026-05-20T15:19:11.937Z$seed$::timestamptz
  ),
  (
    $seed$4f699801-5a30-4516-b2a1-9a008d17e35d$seed$::uuid,
    $seed$b50097ea-4fa2-4ebc-8e76-871a60abe684$seed$::uuid,
    $seed$Founding Engineer$seed$,
    $seed$https://www.ycombinator.com/companies/legalos/jobs/XY5Ek7M-founding-engineer$seed$,
    $seed$draft$seed$,
    $seed$LegalOS is an AI-native immigration law firm building modern legal infrastructure for work visa processing. We're hiring a Founding Engineer to help build the core product and AI workflows that make LegalOS scalable. You'll work directly with the CTO and CEO to turn complex immigration workflows into intuitive, reliable software used by clients, attorneys, and internal operations. This is a high-ownership role combining product engineering, systems thinking, and AI workflow building to transform LegalOS from a services-assisted workflow into a scalable, self-serve platform.$seed$,
    $seed$2026-05-21T23:52:17.791Z$seed$::timestamptz,
    $seed$cfdd48f2-93c0-4e93-b682-43d7145354cd$seed$::uuid,
    $seed$731074e2-d00b-4e46-abaf-9946031adabe$seed$::uuid,
    $seed$2026-05-21T23:52:09.700Z$seed$::timestamptz,
    $seed$2026-05-21T23:52:17.792Z$seed$::timestamptz
  ),
  (
    $seed$942a0c88-16dd-4961-a7e5-2975be2bd501$seed$::uuid,
    $seed$8d08d006-fd79-4578-9a4c-0ff8002504b3$seed$::uuid,
    $seed$Senior AI Software Engineer$seed$,
    $seed$https://ats.rippling.com/styliticscareers/jobs/a9def449-efc0-43dc-81ce-b16ebc483392$seed$,
    $seed$applied$seed$,
    $seed$Join Stylitics AI Labs as a Senior AI Software Engineer to build production-ready AI systems for enterprise retailers and brands. This full-stack role combines software engineering expertise with AI/LLM knowledge to develop innovative solutions across visual outfitting, personalization, virtual try-on, and analytics. You'll work on 90-day sprint projects with high visibility, reporting directly to the CTO, and have the opportunity to influence next-generation AI system development. The role requires both front-end prototyping skills and back-end system architecture expertise to deliver solutions that scale across multiple clients.$seed$,
    $seed$2026-05-27T20:00:04.208Z$seed$::timestamptz,
    $seed$b8e6b90a-a87b-4136-8bec-e6089a6d1e45$seed$::uuid,
    $seed$27afc679-263c-4fd4-aa11-9153c92db817$seed$::uuid,
    $seed$2026-05-27T19:59:56.769Z$seed$::timestamptz,
    $seed$2026-05-27T20:15:10.756Z$seed$::timestamptz
  ),
  (
    $seed$5a283cac-0d6b-4125-bc33-20b61bd2eb09$seed$::uuid,
    $seed$81a62bf3-4f43-4364-90aa-b1e9681e908f$seed$::uuid,
    $seed$Senior Software Engineer, Frontend (React)$seed$,
    $seed$https://job-boards.greenhouse.io/afresh/jobs/6002919004$seed$,
    $seed$applied$seed$,
    $seed$Join Afresh's Ordering Pod as a Senior Software Engineer and React Expert to own the frontend architecture of the company's high-revenue, flagship AI ordering product. You will define the technical roadmap for next-generation web systems, build intuitive and highly performant interfaces, and help brick-and-mortar grocers reduce food waste. This role offers autonomy to tackle challenging engineering problems like rendering complex, real-time data at scale, while mentoring junior engineers and collaborating across multiple teams to deliver integrated solutions that serve enterprise grocery clients.$seed$,
    $seed$2026-05-27T20:16:18.393Z$seed$::timestamptz,
    $seed$d0aebc3f-534c-4cc6-9e31-c201b3b7bf49$seed$::uuid,
    $seed$8fd87bbd-49e5-4eff-8924-185a93bed429$seed$::uuid,
    $seed$2026-05-27T20:16:08.898Z$seed$::timestamptz,
    $seed$2026-05-27T20:52:39.733Z$seed$::timestamptz
  ),
  (
    $seed$7f547400-9654-4fca-b079-387748b08db9$seed$::uuid,
    $seed$87fce2cf-715b-42f2-b70c-4834166d14de$seed$::uuid,
    $seed$Technical Lead$seed$,
    $seed$https://jobs.ashbyhq.com/sekai/655d5942-2f0c-4ce6-83df-8e8184222672/application$seed$,
    $seed$draft$seed$,
    $seed$Sekai is seeking a Technical Lead to guide technical strategy, mentor engineering teams, and drive the development of innovative solutions. This role combines hands-on technical expertise with leadership responsibilities, requiring someone who can architect systems, make critical technical decisions, and foster a culture of technical excellence.$seed$,
    $seed$2026-05-27T22:21:35.928Z$seed$::timestamptz,
    $seed$b88f167a-0f74-4ab4-94ba-034ffd342464$seed$::uuid,
    $seed$6916fab8-ce07-47f8-a66c-3382ce70e4fe$seed$::uuid,
    $seed$2026-05-27T22:21:30.354Z$seed$::timestamptz,
    $seed$2026-05-27T22:21:35.929Z$seed$::timestamptz
  ),
  (
    $seed$022bbf7f-7fc5-42e7-9a3d-469a8715e047$seed$::uuid,
    $seed$d617c4a7-cf2a-4d32-855b-1f382ba4224c$seed$::uuid,
    $seed$Senior / Staff Frontend Engineer$seed$,
    $seed$https://jobs.gem.com/air-labs-inc-/am9icG9zdDpTnSGpwN_4q74bz3aPVAfj$seed$,
    $seed$draft$seed$,
    $seed$Air Labs is seeking an experienced Senior or Staff Frontend Engineer to build and own frontend experiences across their Creative Ops System platform. This is a remote, full-time role where you'll work closely with Product, Design, and fellow engineers to ship polished, high-performance UI that impacts how creative teams manage their work. You'll have real ownership over features from architecture through release, set high standards for code quality and performance, contribute to the design system, and mentor junior engineers in a fast-moving, high-trust environment.$seed$,
    $seed$2026-05-27T22:33:50.398Z$seed$::timestamptz,
    $seed$52c5a215-81cd-4e36-85b7-ff0beec1f8be$seed$::uuid,
    $seed$8f06a2f7-f46d-4351-a5bf-677022c66744$seed$::uuid,
    $seed$2026-05-27T22:33:23.643Z$seed$::timestamptz,
    $seed$2026-05-27T22:33:55.073Z$seed$::timestamptz
  ),
  (
    $seed$314e9fd0-028c-4d3e-ba38-60adf48a518b$seed$::uuid,
    $seed$6d61093b-9581-45f9-80e3-f29ceedb8945$seed$::uuid,
    $seed$Full-Stack Software Developer$seed$,
    $seed$https://www.8090.ai/careers?ashby_jid=0cd9781c-e158-4b0c-9979-04ead270933a$seed$,
    $seed$draft$seed$,
    $seed$8090 is seeking an exceptional full-stack software developer to join their team in building a Software Factory that delivers fully-managed, hosted software solutions. This is a customer-facing role requiring high technical competency, systems thinking, and the ability to design well-engineered solutions to ambiguous problems. The ideal candidate will have extensive full-stack web development experience with Python, TypeScript, React, and AWS, along with some combination of DevOps, data engineering, or ML/data science experience at scale. Engineers own the complete lifecycle of their software, from development through production support, and are expected to leverage AI tools to enhance their own practices and team productivity.$seed$,
    $seed$2026-05-28T10:50:41.972Z$seed$::timestamptz,
    $seed$cb251886-d280-438c-a1dd-ff4493dddf30$seed$::uuid,
    $seed$42e5c974-90d3-4ef0-b00e-f4b09d896ea2$seed$::uuid,
    $seed$2026-05-28T10:50:19.527Z$seed$::timestamptz,
    $seed$2026-05-28T10:50:47.568Z$seed$::timestamptz
  ),
  (
    $seed$4c27df7a-135e-4a60-8bca-64d2a3bf96b0$seed$::uuid,
    $seed$8599c9f2-0c1d-47f8-8b69-efe2d3e3510a$seed$::uuid,
    $seed$Senior Mobile Engineer$seed$,
    $seed$$seed$,
    $seed$draft$seed$,
    $seed$Join Sudowrite as a Senior Mobile Engineer to revolutionize mobile writing interfaces. This is a real ownership role where you'll shape the product and future of mobile at Sudowrite. You'll work on a sophisticated React Native app built with Expo that features a custom document editing system, real-time collaboration via Y.js, AI text streaming, and native Swift bindings for Smart Dictation. You'll balance technical excellence with product thinking, shipping features that make writing on mobile feel natural rather than compromised. This role combines hands-on engineering with user discovery, product strategy, and dogfooding to create the best writing app on the planet.$seed$,
    $seed$2026-05-28T11:02:21.455Z$seed$::timestamptz,
    $seed$eb404256-3fb5-4478-a2e1-f66a3e0ef971$seed$::uuid,
    $seed$6616a475-c59d-41fc-8b95-d6e968f19279$seed$::uuid,
    $seed$2026-05-28T11:02:17.861Z$seed$::timestamptz,
    $seed$2026-05-28T11:02:27.092Z$seed$::timestamptz
  ),
  (
    $seed$4fe4c4d7-3ca6-4744-b75b-72d6e351b924$seed$::uuid,
    $seed$04e7494b-a9f2-495b-a89f-8dcdfa0b08c6$seed$::uuid,
    $seed$Software Engineer — Integrations$seed$,
    $seed$https://jobs.ashbyhq.com/kodex/31e53827-080b-4266-945c-950005486081$seed$,
    $seed$draft$seed$,
    $seed$Kodex is seeking a Software Engineer specializing in Integrations to join their team. This role focuses on building and maintaining integration solutions that connect various systems and platforms, enabling seamless data flow and interoperability across the Kodex ecosystem.$seed$,
    $seed$2026-05-28T15:49:32.547Z$seed$::timestamptz,
    $seed$449094cf-200f-4c2c-8405-3ab0623dd7d4$seed$::uuid,
    $seed$8c45bea0-36e2-4627-9354-5b880af5ac44$seed$::uuid,
    $seed$2026-05-28T15:49:28.795Z$seed$::timestamptz,
    $seed$2026-05-28T15:49:32.548Z$seed$::timestamptz
  )
ON CONFLICT (id) DO UPDATE SET
  company_id = EXCLUDED.company_id,
  title = EXCLUDED.title,
  url = EXCLUDED.url,
  status = EXCLUDED.status,
  description = EXCLUDED.description,
  listing_imported_at = EXCLUDED.listing_imported_at,
  latest_scrape_run_id = EXCLUDED.latest_scrape_run_id,
  latest_ai_exchange_id = EXCLUDED.latest_ai_exchange_id,
  created_at = EXCLUDED.created_at,
  updated_at = EXCLUDED.updated_at;

-- job_listing_scrape_runs (17 rows)
INSERT INTO job_listing_scrape_runs (
  id, job_id, source_url, status, http_status, plain_text, error,
  started_at, completed_at
)
VALUES
  (
    $seed$7e1c95fb-6b63-411d-b85f-1f7cfcd01cb2$seed$::uuid,
    $seed$8a860607-3182-4bb1-90a5-782b6082098d$seed$::uuid,
    $seed$https://jobs.ashbyhq.com/g2i/c07a8f96-dbcb-47f3-9d19-305b193d6d01$seed$,
    $seed$completed$seed$,
    200,
    $seed$Senior Engineer - AI Evaluator @ G2i Inc.$seed$,
    $seed$$seed$,
    $seed$2026-05-07T20:33:18.720Z$seed$::timestamptz,
    $seed$2026-05-07T20:33:19.055Z$seed$::timestamptz
  ),
  (
    $seed$a1cd3f86-e43a-4ca3-ae90-67c83525663f$seed$::uuid,
    $seed$ff66d118-38a1-442c-9f9f-053d5ed98169$seed$::uuid,
    $seed$manual://pasted-description$seed$,
    $seed$completed$seed$,
    NULL,
    $seed$Who we are
Pepper is building the operating system for the $1T food distribution industry, a fundamental piece of the economy still largely run on paper, phone calls, and faxes.

Our web and mobile apps are live in the App Store and Google Play, used every day by foodservice wholesalers and the restaurants they serve. We run a stable, growing, revenue-generating business, and the scale of impact is real. Hundreds of millions of dollars of food flow every week through software that we built. When a restaurant in your neighborhood gets its delivery, there's a meaningful chance Pepper helped make that happen.

We just closed a $50M Series C in February 2026, and we're backed by Lead Edge, ICONIQ, and Greylock, the same firms behind Asana, Toast, Snowflake, Airbnb, Workday, Figma, and Discord. With a team of experienced people from Uber Eats, Google, Microsoft, WeWork, and more, we're building digital tools that power foodservice wholesalers, helping them grow faster and do more with less, and in the process transforming one of the largest, most fundamental industries in our society.

Since our Series B we've more than tripled customers and revenue and shipped Order Agent, Sales Hub, and Finance Hub. The surface area is enormous and the industry is wide open.

What you'll be doing
You'll be working on Order Agent, Pepper's AI product that turns inbound orders from voicemails, texts, emails, photos, and PDFs into clean digital orders inside the Pepper platform. It's one of the most active and highest-leverage surfaces in the company, and the work spans agentic systems, voice and document AI, and the core ordering experience our customers use every day.

Writing excellent code on a small, senior team where your decisions directly shape the product
Building the AI pipelines behind Order Agent: voice agents that take phone orders from restaurants, document and image understanding for emailed and texted orders, and agentic catalog and SKU matching against each customer's order history
Owning meaningful parts of the technical architecture and helping set the bar for code quality across the team
Shipping features end to end across our web and mobile apps, partnered closely with product, design, and ops
Spending real time with the order desks and sales reps who use Order Agent every day, and using what you learn to shape what we build next
How we work
We're a small team that organizes around vertical pods, with engineers, product, and design working closely together day to day. AI-assisted development is part of how we work, not a side experiment:

Engineers ship with Claude Code, Gemini, or whatever flavor of AI-assisted development works best for them, and we look for people who get real leverage from these tools
Small teams with broad ownership. Each engineer takes on more surface area than they typically would at a larger company
LLMs and agents run in production, handling image OCR, SKU matching, customer support triage, and order ingestion every day
Tight feedback loops, async-first communication, and a preference for shipping over ceremony
Must haves
5+ years building high-quality, scalable software at a fast-growing startup or tech company
Shipped working software in the last 12 months. Production code, a meaningful side project, or an AI-assisted prototype
Solid frontend development experience with React, React Native, or Next.js using TypeScript
Solid backend experience building production web services. We use Python, but we're open to people coming from Go, Java, Node, Ruby, or similar
Real experience with AI tools and technologies. This could be building agentic workflows, integrating LLMs into production products, or getting meaningful leverage out of AI-enhanced development tools like Claude Code
Ability to break down ambiguous business problems and ship working solutions quickly
Mobile app development experience is a plus
Why join us
This is a rare combination of ground-floor energy and ownership, with a real business underneath. The recent raise gives us the opportunity to keep building, and there's a lot of important work ahead.

The bet. Food distribution is a category that has been waiting decades for its software incumbent, and Pepper is on track to become the default. Our recent $50M Series C gives us years of runway, and the next chapter is about going from leading the category to defining it. The decisions you make in your first year will shape how we get there.
The work. You'll ship code that takes real phone orders, processes real money, and lands in front of distributors and restaurants within days. The path from your laptop to a customer is short, so you'll learn what works fast. Expect to be trusted with complex problems earlier than you would at most companies.
The team. The people you'll work alongside have shipped at scale and held high bars at companies you'd recognize. Code review, design critique, and product decisions all happen at a level that's hard to find at a similar-stage startup. Outside of that, we still find ways to have fun, and the team genuinely looks out for one another.
The upside. Meaningful early-stage equity. We're all owners, literally. As we grow, there's a fast path to senior scope and leadership opportunities, and you'll have first crack at them as they open up.$seed$,
    $seed$$seed$,
    $seed$2026-05-20T14:41:59.940Z$seed$::timestamptz,
    $seed$2026-05-20T14:41:59.942Z$seed$::timestamptz
  ),
  (
    $seed$7ffbbef4-3581-4be9-9659-edb8434d30a5$seed$::uuid,
    $seed$d28dc042-5167-4907-8ea2-e5309f68bb49$seed$::uuid,
    $seed$manual://pasted-description$seed$,
    $seed$completed$seed$,
    NULL,
    $seed$About Us

GenieSolutions is a fast-growing software development company building scalable web and AI-powered solutions for startups and businesses in the US, UK, Australia, and Israel.
We work on SaaS platforms, AI integrations, automation systems, and custom business applications.

What We’re Looking For
We’re looking for a reliable Full Stack Engineer who can build modern web applications and work independently in a remote environment.

Many of our projects involve direct collaboration with international startup clients. Because of that, we highly value candidates with experience on platforms like:
Upwork,
Freelancer
Engineers with strong freelance profiles usually have proven experience in:
client communication
remote collaboration
ownership and responsibility
delivering high-quality work consistently

Candidates with active Upwork/Freelancer profiles and strong client feedback will be prioritized.

Tech Stack
React / Next.js
Node.js
Python
TypeScript
OpenAI APIs
PostgreSQL
AWS

Requirements
4+ years of full-stack development experience
Experience building scalable web applications
Experience with AI integrations or automation tools
Good English communication skills
Ability to work independently and meet deadlines

Nice to Have
Upwork Top Rated / Top Rated Plus
Experience working with startups
SaaS or AI product experience
What We Offer
Long-term remote opportunity
Flexible work environment
International AI/startup projects
Competitive compensation
Growth-oriented team culture

To Apply

Please send:

Resume
GitHub profile,
Upwork/Freelancer profile links, Applications without them will not be reviewed.
Brief introduction about your recent projects$seed$,
    $seed$$seed$,
    $seed$2026-05-20T14:48:19.182Z$seed$::timestamptz,
    $seed$2026-05-20T14:48:19.183Z$seed$::timestamptz
  ),
  (
    $seed$50c41397-5672-41e3-b0db-9d669c09dedc$seed$::uuid,
    $seed$0337f404-0e40-436f-98c6-0834825ad973$seed$::uuid,
    $seed$https://hellokolo.com/careers/fullstack$seed$,
    $seed$completed$seed$,
    200,
    $seed$Full-stack Software Engineer — Kolo kolo Pricing Careers Access ← All roles Engineering · Full-time Full-stack Software Engineer Remote · US / CA / EU / UK / LATAM Own everything from the research pipeline to the product surface members read every week. You'll work across backend and frontend with a small, senior team. One week you're building an API that ingests SEC filings; the next you're refining the reading experience in the product. The stack is TypeScript end-to-end. We move fast and keep things simple. You should have strong opinions about what not to build, and the range to ship both sides of a feature without waiting on someone else. This is a high-ownership role. You will touch critical paths early and often. You probably ✓ 4+ years building production web applications full-stack ✓ Strong TypeScript; comfortable in React and a Node/Python backend ✓ Can design a clean API and a readable UI with equal confidence ✓ Bias toward simplicity — you've seen over-engineering and walked away from it ✓ Previously worked at an early stage startup ✓ Remote work experience Apply for Full-stack Software Engineer Two fields. We read every application ourselves. Email LinkedIn Resume (optional) Send application → kolo Pricing Careers$seed$,
    $seed$$seed$,
    $seed$2026-05-20T14:57:33.107Z$seed$::timestamptz,
    $seed$2026-05-20T14:57:33.279Z$seed$::timestamptz
  ),
  (
    $seed$7bfe1dee-95b4-419a-93ea-4ef52115bd58$seed$::uuid,
    $seed$3d7d9105-c9ea-4b39-911f-1bc6410585d2$seed$::uuid,
    $seed$manual://pasted-description$seed$,
    $seed$completed$seed$,
    NULL,
    $seed$Role Overview
Kaaj is an AI Fintech startup, headquartered in San Francisco. This position is open for remote work in US. Our vision is to help every business get quick access to affordable capital.

We help financial institutions turbocharge their lending processes by building AI agents that help them write more loans to small businesses. Our founding team brings over a decade of experience from Uber, Cruise, American Express, and other Silicon Valley startups. We are venture-backed by Kindred Ventures (investors behind Uber & Perplexity) and Better Tomorrow Ventures (investors behind Unit & Mercury). We are looking for a stellar Founding Full-Stack Engineer with a hunger to learn to join our team. Our product is live and we are rapidly growing with our early customers. We are looking for a stellar Founding Full-Stack Engineer with a hunger to learn to join our team.

The applicant could be located anywhere but willing to work in EST hours. Please apply here: https://kaaj.ai/careers/

⚡ Responsibilities:

Develop Python services, APIs, and webhook functionality to enable agent management, orchestration, benchmarking, and integrations with third parties
Own the architecture and development of customer’s interface with AI agents
Build internal tools to evaluate agents and enable automated judgment
Incorporate enterprise-grade security and reliability into our backend platform
Build integration and product infrastructure for LLMs for AI Agents
Build a cohesive product experience
📌 Requirements:

3+ years of experience
Expert knowledge of Python, React.js, microservices, and API design
Extensive experience writing production-level code
Comfortable working in a fast-paced early-stage startup environment
Strong communication and collaboration skills
Bonus points if you have prior experience in Fintech or AI
🔑 Benefits:

Competitive salary

Fast-paced learning environment
Opportunity to shape the product and culture of a fast-growing startup$seed$,
    $seed$$seed$,
    $seed$2026-05-20T14:59:49.282Z$seed$::timestamptz,
    $seed$2026-05-20T14:59:49.283Z$seed$::timestamptz
  ),
  (
    $seed$4478818e-474c-4228-bde2-a9f0a0c58182$seed$::uuid,
    $seed$94598e57-4eaa-49d0-86c5-2da7e7fa39cc$seed$::uuid,
    $seed$manual://pasted-description$seed$,
    $seed$completed$seed$,
    NULL,
    $seed$Full-Stack Software Engineer
About Simply Bread Co.
Simply Bread is building the future of micro-bakeries. The Simply Bread App is on track to become the “Airbnb for bakeries.” A platform where everyday bakers can build real businesses and customers can reliably buy fresh, local bread. With fresh bread and micro-baking surging across the U.S. and globally, Simply Bread is uniquely positioned to provide bakers and customers the tools they need to thrive.
We combine hardware and software to power this ecosystem and our app is the engine that will take us worldwide.

About The Team
You’ll join a diverse team of founders, software & hardware engineers, supply chain specialists, marketing experts, manufacturing operators, and other critical roles. You’ll collaborate with people across the company to help us deliver the highest standards for safety and quality while providing seemingly streamlined operational excellence at the lowest possible cost for our customers.

The Role
The Mission: This role is the fundamental building block of our technology team. You are here to build critical infrastructure, ship new features for our bakers, and harden the software systems that power our entire global operation.

The Impact: Over the next 12 months, you will be the engine behind our product velocity, ensuring our app scales as fast as the demand for local bread. You are an Individual Contributor who operates with total autonomy: someone who can take a complex problem and return with a high quality solution.

What You’ll Do
Core Responsibility: Architect and ship new features and systems across our entire software ecosystem, ensuring our bakers have the tools to run their businesses seamlessly.
Daily Execution: "Winning" means writing clean, high quality code, peer reviewing teammates’ work for consistency, and aggressively hunting down and fixing bugs that hinder the customer experience.
Systems & Documentation: Own the software lifecycle within our stack; you will document your logic and improve our internal systems to ensure our codebase remains scalable and maintainable as we grow.
Collaboration & Ownership: Partner directly with the Development and Product teams to translate vision into reality. You have 100% ownership over your features, from investigation and recommendation to final deployment.
Specific Outcome: Drive the evolution of our data and software ecosystem, moving beyond just "the app" to build the integrated tools that make Simply Bread a hardware and software powerhouse.
Qualifications
The Must Haves:

3–5 Years of Experience: You aren't a junior; you’ve been in the trenches and can ship without hand holding.
Full-Stack Generalist: Mastery of JavaScript/TypeScript is required. You must be comfortable working across the entire stack, not just the frontend.
Modern Frameworks: Proven experience with React, React Native, Vue, or similar.
AI Enhanced Workflow: A strong affinity for using AI tools to speed up your development and improve code quality.
The Startup Mindset: You possess a "hunger" to learn, a high degree of humility in taking feedback, and an obsessive ownership mentality. You solve problems rather than just "implementing" tasks.
Bonus Points:

AWS Mastery: Experience with AWS, AWS CDK, and DynamoDB (or other NoSQL).
Data Curiosity: SQL experience and an interest in providing data-driven solutions.
Mobile Depth: Experience with React Native.
Prior Startup Experience: You’ve worked in fast-paced, high-stakes environments where speed and quality are non-negotiable.**$seed$,
    $seed$$seed$,
    $seed$2026-05-20T15:12:46.442Z$seed$::timestamptz,
    $seed$2026-05-20T15:12:46.444Z$seed$::timestamptz
  ),
  (
    $seed$e4f41afa-b3ff-4693-9491-a9f12681bfb6$seed$::uuid,
    $seed$a20fe89f-fcfe-4035-92ca-8d45bdeccccc$seed$::uuid,
    $seed$manual://pasted-description$seed$,
    $seed$completed$seed$,
    NULL,
    $seed$Skyline Dynamics Inc. is looking for a Full-Stack Engineer to help design, build, and maintain practical software solutions for modern businesses.

In this role, you’ll work across the stack to develop web applications, internal tools, APIs, dashboards, and integrations that help clients improve operations, automate workflows, and manage data more effectively. You’ll be involved in turning business requirements into clean, reliable, and scalable software.

What you’ll do

Build and maintain full-stack web applications using modern frontend and backend technologies
Develop APIs, database models, dashboards, and internal business tools
Integrate third-party services, cloud platforms, and external data sources
Improve application performance, reliability, security, and maintainability
Work closely with product, design, and business stakeholders to understand requirements
Contribute to technical decisions, architecture, testing, and deployment workflows
What we’re looking for

Experience building production web applications
Strong JavaScript/TypeScript skills
Experience with React, Next.js, Node.js, Python, or similar technologies
Solid understanding of REST APIs, databases, authentication, and cloud deployment
Ability to write clean, maintainable code and communicate clearly in a remote environment
Comfortable working in a small, fast-moving team where ownership matters
Nice to have

Experience with PostgreSQL, AWS, Docker, CI/CD, or SaaS products
Experience building workflow automation, analytics dashboards, or internal platforms
Familiarity with AI-assisted tools, data integrations, or cloud-based business systems
About Skyline Dynamics
Skyline Dynamics Inc. builds scalable software solutions that help businesses streamline operations, improve data visibility, and modernize their digital infrastructure. We focus on practical engineering, clear communication, and reliable delivery.$seed$,
    $seed$$seed$,
    $seed$2026-05-20T15:16:38.838Z$seed$::timestamptz,
    $seed$2026-05-20T15:16:38.839Z$seed$::timestamptz
  ),
  (
    $seed$cfdd48f2-93c0-4e93-b682-43d7145354cd$seed$::uuid,
    $seed$4f699801-5a30-4516-b2a1-9a008d17e35d$seed$::uuid,
    $seed$https://www.ycombinator.com/companies/legalos/jobs/XY5Ek7M-founding-engineer$seed$,
    $seed$completed$seed$,
    200,
    $seed$Founding Engineer at LegalOS | Y Combinator Open menu About What Happens at YC? Apply YC Interview Guide FAQ People YC Blog Companies Startup Directory Founder Directory Launch YC Library Partners Resources Startup School Newsletter Requests for Startups For Investors Verify Founders Hacker News Bookface Safe Find a Co-Founder Startup Jobs Log in Apply LegalOS The AI-Native Immigration Law Firm Founding Engineer $175K - $240K • 0.75% - 2.25% • San Francisco, CA, US / Remote (San Francisco, CA, US; CA, US) Job type Full-time Role Engineering, Full stack Experience 3+ years Visa Will sponsor Skills PostgreSQL, TypeScript, Next.js, LLMs, Evals, AI Agents, pgvector Connect directly with founders of the best YC-funded startups. Apply to role › Matthew Asir Founder Matthew Asir Founder About the role About LegalOS LegalOS is building the AI-native immigration law firm for the world’s top talent and the companies that hire them. Today, high-stakes immigration cases — O-1s, EB-1s, L-1s, H-1Bs, and other employment-based visas — are still handled through slow, expensive, manual law firm workflows. Companies can pay $10K–$35K and wait weeks or months for a process that should be dramatically faster, more transparent, and more software-driven. LegalOS combines AI agents trained on decades of immigration case data with licensed attorney oversight to prepare USCIS-ready work visa petitions dramatically faster than traditional firms. We have deep founder-market fit. Matthew, our CEO, previously founded Legal Bullet, an immigration software company recognized by Forbes 30 Under 30. Matthew and Rachel, our COO, are siblings who grew up around immigration law through their father’s 40+ year immigration practice. Claire, our CTO, rounds out the founding team with engineering experience building AI and compliance systems at scale. This is a market we know firsthand: we have grown up around thousands of immigration cases, seen decades of attorney judgment up close, and understand the operational pain companies face when trying to hire and retain global talent. About the role We are hiring a Founding Engineer to help build the core product and AI workflows that make LegalOS scalable. You will work directly with Claire, our CTO, and Matthew, our CEO, to turn complex immigration workflows into intuitive, reliable software used by clients, attorneys, and our internal case operations team. You will own major product surfaces across our Next.js/TypeScript app, Supabase/Postgres backend, AI workflow orchestration, document generation system, and internal review tools . This is not a normal full-stack role. Your job is to help turn LegalOS from a services-assisted workflow into a scalable, self-serve immigration platform. The right person is part product engineer, part systems thinker, part AI workflow builder, and part founder. You should be excited to own the messy middle between “this workflow works manually” and “this is now a reliable product system that scales.” What you’ll do Build customer-facing case intake and evidence collection workflows Build AI-assisted document analysis, case drafting, evidence mapping, and follow-up question generation Build internal case operations tools for tracking active matters, missing documents, deadlines, and filing status Build attorney review dashboards that make AI-generated petitions easier to verify and improve Improve document generation, source attribution, versioning, and export workflows Create product experiences that make LegalOS increasingly self-serve for both clients and attorneys Build systems that improve case quality, reduce review time, and let us process more visas without scaling headcount linearly Work with the CTO and CEO to define technical strategy across system design, data modeling, service boundaries, and infrastructure choices What success looks like in your first 90 days In your first 30 days, you will learn the LegalOS product, case workflow, AI pipeline, and attorney review process. You will ship improvements to an existing product surface, understand where founder/operator/attorney time is being spent, and identify the highest-leverage automation opportunities. In your first 60 days, you will own and ship a meaningful product workflow end-to-end — for example, improving case intake, evidence mapping, attorney review, document generation, or AI follow-up question generation. In your first 90 days, you will have made LegalOS materially more scalable: reducing manual review time, improving case packet quality, or making a core workflow more self-serve for clients, attorneys, or internal operators. The goal is not to ramp slowly. The goal is for you to become one of the people who defines how LegalOS is built. What we’re looking for 3+ years building production web apps, or equivalent evidence of exceptional product engineering ability Excellent with TypeScript, React, and full-stack product development Strong frontend taste — your work makes other engineers want to copy it Comfortable working across frontend, backend, database, AI APIs, and internal tooling Strong judgment around system design, database architecture, and scaling product systems Experience with modern AI product patterns: agentic workflows, tool calling, streaming, structured outputs, evals, and AI workflow orchestration Familiarity with AI frameworks and infrastructure such as Vercel AI SDK, Mastra, MCP, workspaces/filesystems, and sandboxes for agents Able to take an ambiguous workflow and independently turn it into a shipped product Move fast, communicate clearly, and care about quality Excited by legal tech, immigration, and automating expert-services workflows Want to join early enough to have real product, technical, and cultural influence Bonus points Shipped AI/LLM products to production Experience with document-heavy workflows Experience in legal tech, fintech, healthcare, HR tech, compliance, or other regulated industries Early-stage startup background Major OSS contributions This is a high-ownership founding engineering role . You should be comfortable talking to users, attorneys, and operators; understanding messy workflows; and building the product systems that make them 10x better. If you want to help rebuild one of the most important legal infrastructure markets from first principles, we’d love to talk. About the interview Our process is designed to be fast, practical, and focused on how you think and build. 1. Intro call with Matthew, CEO, and Claire, CTO — 30 minutes We’ll discuss LegalOS, your background, what you’ve built, and what kind of role you’re looking for. 2. Technical/product conversation with Claire, CTO — 60 minutes We’ll go deep on your past projects, technical judgment, product instincts, and how you approach ambiguous engineering problems. 3. Paid 2–3 day work trial + founder working session We’ll give you a small, realistic product/engineering project based on a simplified LegalOS workflow. The goal is to see how you build, communicate, make tradeoffs, and turn ambiguity into product. 4. Final conversation with the founding team — 30 minutes We’ll discuss role scope, compensation, equity, working style, references, and mutual fit. About LegalOS LegalOS is the AI-native immigration law firm. We file work visas in 48 hours at a fraction of BigLaw’s price, with a 100% approval rate so far. Our AI agents handle 80% of the work: drafting petitions, compiling evidence, checking eligibility, and anticipating USCIS objections. Every case is reviewed and signed by licensed attorneys with 40+ years of immigration experience. We currently support O-1, H-1B, L-1A, L-1B, TN, EB-1A, EB-1C, and EB-2 NIW, with more visa categories coming soon. The U.S. processes 1M+ work visas every year, yet most immigration firms still run on fax machines, manual workflows, and 1990s software. LegalOS is building the modern law firm: faster, more affordable, and built from the ground up with AI. LegalOS Founded: 2024 Batch: W26 Team Size: 3 Status: Active Location: San Francisco Founders Matthew Asir Founder Matthew Asir Founder Rachel Asir Founder Rachel Asir Founder Claire Jutabha Founder Claire Jutabha Founder Footer Y Combinator Make something people want. Programs YC Program Startup School Work at a Startup Co-Founder Matching Resources Startup Directory Startup Library Investors Demo Day Safe Hacker News Launch YC YC Deals Company YC Blog Contact Press People Careers Privacy Policy Notice at Collection Security Terms of Use Twitter Twitter Facebook Facebook Instagram Instagram LinkedIn LinkedIn Youtube YouTube © 2026 Y Combinator$seed$,
    $seed$$seed$,
    $seed$2026-05-21T23:52:09.708Z$seed$::timestamptz,
    $seed$2026-05-21T23:52:10.147Z$seed$::timestamptz
  ),
  (
    $seed$b8e6b90a-a87b-4136-8bec-e6089a6d1e45$seed$::uuid,
    $seed$942a0c88-16dd-4961-a7e5-2975be2bd501$seed$::uuid,
    $seed$https://ats.rippling.com/styliticscareers/jobs/a9def449-efc0-43dc-81ce-b16ebc483392$seed$,
    $seed$completed$seed$,
    200,
    $seed$Senior AI Software Engineer Senior AI Software Engineer About Stylitics Stylitics is the leading visual outfitting and styling solution for the world’s top retailers and brands. Our clients include Nike, Macy’s, Revolve, Puma, Crate & Barrel, Bloomingdale’s, and dozens of others. Founded in 2011, Stylitics uses a powerful combination of algorithms, trend data, and stylist expertise to deliver millions of on-brand outfit recommendations daily across multiple channels such as e-commerce, email, advertising, stores, and social media. About 100 million shoppers use Stylitics content and technology on retail sites each month to find inspiration, discover new products and brands, and gain confidence in how to style their purchases. About Stylitics AI Labs™ Stylitics AI Labs™ is Stylitics' innovation division, launched in 2026 to work directly with senior leaders at enterprise retailers and brands on AI initiatives that sit outside traditional product roadmaps. We partner by invitation with a small number of retailers at a time, focusing on problems that require real domain expertise and that horizontal LLMs cannot solve on their own. AI Labs delivers production-ready systems in 90-day sprints, structured across three phases: Domain Discovery, Model Training & Tuning, and Production Deployment. Current production initiatives include Advanced Personalization, which applies attribute-level targeting across more than 26 shopper data points; Virtual Try-On, which uses computer vision and neural rendering to visualize products on diverse body types; and Analytics, which provides direct access to the Strata data layer for visibility into outfit performance, category affinity, and cross-brand purchase intent. About the Role We are looking for an experienced AI Software Engineer to join AI Labs and help shape the future of how Stylitics empowers AI models with the data, tools, and expertise they are missing out of the box. In this role, you'll combine your expertise in software engineering, product sensitivity, and prompt design to drive innovation in AI model-based applications across various retail use cases and multiple clients. This is a full-stack role. Front-end skills matter because so much of what Labs does is prototyping, you need to be able to stand up a UI that shows stakeholders what something can do. Back-end skills matter because we care about databases, application architecture, and building systems that scale across multiple clients. You'll work fairly independently while connecting with cross-functional teams to prototype, test, and deploy unique solutions. This is a hands-on individual contributor role reporting directly to the CTO, with high visibility and the opportunity to influence the way we build, monitor, and evaluate next-generation AI systems. If you're excited about exploring the frontiers of generative AI and making a direct impact through production-level contributions, we'd love to meet you. What You Will Do Write production-level code in TypeScript (with AI tools) Build full-stack prototypes, including front-end interfaces that demonstrate capability to stakeholders and clients Prompt engineering and testing with LLMs, including Claude, Gemini, and OpenAI models Context engineering to determine the right data to surface to LLMs and agents Agentic workflow design Help us build systems to easily monitor and test LLM performance Analyze large data sets Design and implement solutions for scale and maintainability across multiple clients Contribute as a thought leader to conversations around LLM usage, including challenging or proposing technical directions and identifying what to worry about (and what not to) early in a project Must-Have Qualifications Bachelor's Degree from an accredited college or university in Computer Science, Data Science, Statistics, or other related fields, or equivalent experience 7+ years of software development experience, including work within retail, e-commerce, or another applied AI/technology industry. Experience building AI or LLM-powered products is a bonus Confident communication (written and oral) skills and a demonstrated ability to work collaboratively with all levels of internal and external organizations. Strong asynchronous written communication is essential, Labs works across time zones and with small, distributed teams Strong problem-solving, attention to detail, organizational, and time management skills along with demonstrated strategic thinking abilities Working experience with modern prototyping stacks, specifically React, TypeScript, and SQL, sufficient to stand up a working UI backed by a real data model Experience with LLMs, testing, and prompt engineering, including work with Claude, Gemini, and OpenAI APIs Demonstrated affinity for and experience with agentic software engineering — either on the job or on your own time. We expect you to be enthusiastic about using AI coding tools in your day-to-day work Solid understanding of system design, scalability principles, use of APIs, and open-source packages Demonstrated ability to evaluate model performance using structured test cases and metrics Ability to operate independently with ambiguity in product definition Judgment to know when to trust an LLM's output and when to challenge it — a foundation of actual engineering knowledge and experience, not just the ability to look things up Nice-to-Have Qualifications Experience at a high-growth start-up and comfortable with the unknown Working experience with building test workflows for LLMs Familiarity with additional programming languages such as Java or Python for data processing or AI prototyping Salary When we find the right person, we try to put our best foot forward with an offer that excites you and is fair on our end. We consider the skills and experience you bring, what similar jobs pay, and make sure there's equal pay for equal work among those you'll be working with. The compensation amount for this role is targeted at $150,000 – $180,000 USD annually. The final offer also takes into account other factors of a total compensation package, including what is market-based on the region. Please note that the range is being shared in good faith and is subject to modification based on changing market and business conditions. Our Values Our values reflect what is important to us at Stylitics and serve as the foundation in which we do business. Each core value is best illustrated by actions and attitudes that each Stylitics team member practices. They define what working at Stylitics means and what our teams embody through their time here. We care deeply about delivering high quality work We work to be the best partners possible We get things done We believe the right team matters most We think like customers and act like owners We relish being pioneers Our Benefits & Perks Vision and dental insurance options that are fully covered by us Medical plan coverage, with options that start at no cost to you Competitive salary along with career planning for the future For this role, stock options in a company that is growing rapidly and successfully Commuter benefits program Company matched 401k plan to help plan for your future Generous paid time off policies Work events - both virtual and in person Access to ClassPass - a company paid benefit giving you access to numerous physical and mental well being needs Working with fun, hardworking, nice people who are committed to making a difference Join Us We strive to create a place where all feel safe, empowered, engaged, championed, and inspired. Equal Employment Opportunity has been and will continue to be, a fundamental principle at Stylitics where employment is based upon personal capabilities and qualifications without discrimination because of race, religion, color, gender, national origin, age, citizenship, ancestry, marital status, sexual orientation, gender identity and expression, pregnancy and related medical conditions, veteran status, genetic information, disability or any other reason prohibited by federal, state or local law. This applies to all policies and employment practices relating to recruitment and hiring, compensation, benefits, termination and all other terms and conditions of employment. Apply now R&D: Technology Remote (United States) Share on: Apply now Terms of service Privacy Cookies Powered by Rippling$seed$,
    $seed$$seed$,
    $seed$2026-05-27T19:59:56.770Z$seed$::timestamptz,
    $seed$2026-05-27T19:59:57.172Z$seed$::timestamptz
  ),
  (
    $seed$d0aebc3f-534c-4cc6-9e31-c201b3b7bf49$seed$::uuid,
    $seed$5a283cac-0d6b-4125-bc33-20b61bd2eb09$seed$::uuid,
    $seed$https://job-boards.greenhouse.io/afresh/jobs/6002919004$seed$,
    $seed$completed$seed$,
    200,
    $seed$Job Application for Senior Software Engineer, Frontend (React) at Afresh Back to jobs New Senior Software Engineer, Frontend (React) Remote - U.S. Apply Afresh, the AI platform for grocery, began by tackling the most complex problem in the industry: fresh, and has evolved into the core AI platform for grocers. By leveraging proprietary AI designed for high-volatility environments, we empower partners like Albertsons, Meijer, and Wakefern to drive smarter decisions across their entire enterprise. Following record-breaking 70% revenue growth in 2025, we have scaled to 6 enterprise-grade solutions, with solutions live in over 10% of the U.S. grocery market. Our platform now orchestrates billions of decisions from the store floor to the distribution center and prevented over 200 million pounds of food waste last year alone. If you're looking for a role where your work directly translates into massive scale and social good, and you want to be part of the team that defines how the world eats, there is no better time to join us. About the Role Join the Ordering Pod as a Senior Software Engineer and React Expert to own the frontend architecture of our high-revenue, flagship AI ordering product. This is a pivotal role where you will be empowered to define the technical roadmap for our next-generation web systems and tackle challenging engineering problems—like rendering complex, real-time data at scale—that directly enable our business expansion. By building intuitive, highly performant interfaces, you will directly help brick-and-mortar grocers reduce food waste and keep fresh food accessible to millions. What You’ll Do Own the standards for how we develop, test, and release code across our web platform. You'll lead collaboration across multiple teams, establishing practices that keep our systems secure and reliable while raising the bar for code quality and usability across the organization. Build and evolve Afresh's Corporate Hub—the web platform that gives corporate stakeholders visibility into store-level ordering performance and centralized control over replenishment configurations, display policies, and ordering strategy at scale. Partner with Product, Design, Account Management, Support, Operations and peer engineering teams to deliver integrated solutions that serve client needs. Contribute to the vision of the next generation Ordering product and its supporting systems. Step into a mentorship role to guide junior/mid-level engineers, foster technical growth, and conduct thoughtful, constructive code reviews. What makes you a great fit BS in Computer Science or equivalent experience 6+ years of software development experience with 4+ years dedicated to building complex, scalable frontends using React . Strong mastery of the modern React ecosystem, TypeScript , and GraphQL , alongside deep experience utilizing or building reusable UI component libraries and design systems . Proven ability to lead and drive complex technical initiatives through the entire development lifecycle—from conception to launch—with a high degree of autonomy. A desire to dive deep into complex systems, with a strong interest in mastering an intricate business domain and understanding technical dependencies outside the frontend layer. A dedicated team player who actively participates in agile ceremonies, swarms on blockers, and is ready to mentor and guide junior engineers to support the team’s growth. You have leveraged modern AI-powered tools to accelerate development and enhance your workflow. Desire to learn and master new technologies to meet the evolving needs of the platform. Nice to Have Experience working within an Agile/Scrum software delivery cycle. Experience with or a strong understanding of backend systems and API design We encourage all highly-qualified candidates to apply, even if they don’t meet every listed qualification. This position is not eligible for company sponsorship. Salary Band in U.S.: $156,060 - $231,140 About Afresh Founded in 2017, Afresh is using AI to tackle the #1 solution to curb climate change: reducing food waste. By building AI specifically for the intricacies of grocery—from the fresh perimeter to the center store—we help grocers minimize waste and maximize sales. Afresh sits at an incredible intersection of positive social impact, rocket ship financial growth, and cutting-edge technology. Our best-in-class AI research has been published in top journals, including ICML, and our investors include Al Gore’s Just Climate, former Whole Foods Market CEO Walter Robb, and Eric Schmidt's Innovation Endeavors. Grocery is the past, present, and future of our food system – the waste we create today will impact our planet for years to come. Join us as we continue to build a vibrant, diverse, and inclusive team that embodies our company’s values of proactivity, kindness, candor, and humility. Afresh provides equal employment opportunities (EEO) to all employees and applicants for employment without regard to race, color, religion, sex, national origin, age, disability, genetics, sexual orientation, gender identity/expression, marital status, pregnancy or related condition, or any other basis protected by law. Here at Afresh, many of our employees work remotely provided that they reside in one of the following states: AL, AR, CA, CO, FL, GA, IL, KY, MA, MI, MT, MO, NV, NJ, NY, NC, OR, PA, TX, WA, UT, VA, WI . Create a Job Alert Interested in building your career at Afresh? Get future opportunities sent straight to your email. Create alert Apply for this job * indicates a required field Autofill with MyGreenhouse First Name * Last Name * Email * Phone Country * Phone * Resume/CV * Attach Attach Dropbox Google Drive Enter manually Enter manually Accepted file types: pdf, doc, docx, txt, rtf Cover Letter Attach Attach Dropbox Google Drive Enter manually Enter manually Accepted file types: pdf, doc, docx, txt, rtf In which U.S. city & state do you currently reside? * Do you have unrestricted work authorization in the United States? (This may include, but is not limited to, U.S. citizens, permanent residents, temporary residents, asylees, refugees, conditional permanent residents) * Select... Will you now, or in the future, require immigration sponsorship for continued employment in the United States? * Select... Do you have 6+ years of software development experience with 4+ years dedicated to building complex, scalable frontends using React? * Select... This is a remote position open to candidates in the U.S. or Ontario, Canada. To be eligible, you must live in (or be willing to relocate to) one of the following states: AR, CA, CO, FL, GA, IL, KY, MA, MI, MT, MO, NV, NJ, NY, NC, OR, PA, TX, WA, or WI. Do you currently live in, or intend to move to, one of these locations if offered? * Select... As part of our hiring process, you will be asked to complete a background check once an offer of employment has been accepted. Are you willing to complete a background check? Select... Why Afresh? Tell us what makes you excited to join our team. * LinkedIn Profile GitHub / Website Link Voluntary Self-Identification For government reporting purposes, we ask candidates to respond to the below self-identification survey. Completion of the form is entirely voluntary. Whatever your decision, it will not be considered in the hiring process or thereafter. Any information that you do provide will be recorded and maintained in a confidential file. As set forth in Afresh’s Equal Employment Opportunity policy, we do not discriminate on the basis of any protected group status under any applicable law. Gender Select... Are you Hispanic/Latino? Select... Race & Ethnicity Definitions If you believe you belong to any of the categories of protected veterans listed below, please indicate by making the appropriate selection. As a government contractor subject to the Vietnam Era Veterans Readjustment Assistance Act (VEVRAA), we request this information in order to measure the effectiveness of the outreach and positive recruitment efforts we undertake pursuant to VEVRAA. Classification of protected categories is as follows: A "disabled veteran" is one of the following: a veteran of the U.S. military, ground, naval or air service who is entitled to compensation (or who but for the receipt of military retired pay would be entitled to compensation) under laws administered by the Secretary of Veterans Affairs; or a person who was discharged or released from active duty because of a service-connected disability. A "recently separated veteran" means any veteran during the three-year period beginning on the date of such veteran's discharge or release from active duty in the U.S. military, ground, naval, or air service. An "active duty wartime or campaign badge veteran" means a veteran who served on active duty in the U.S. military, ground, naval or air service during a war, or in a campaign or expedition for which a campaign badge has been authorized under the laws administered by the Department of Defense. An "Armed forces service medal veteran" means a veteran who, while serving on active duty in the U.S. military, ground, naval or air service, participated in a United States military operation for which an Armed Forces service medal was awarded pursuant to Executive Order 12985. Veteran Status Select... Voluntary Self-Identification of Disability Form CC-305 Page 1 of 1 OMB Control Number 1250-0005 Expires 04/30/2026 Why are you being asked to complete this form? We are a federal contractor or subcontractor. The law requires us to provide equal employment opportunity to qualified people with disabilities. We have a goal of having at least 7% of our workers as people with disabilities. The law says we must measure our progress towards this goal. To do this, we must ask applicants and employees if they have a disability or have ever had one. People can become disabled, so we need to ask this question at least every five years. Completing this form is voluntary, and we hope that you will choose to do so. Your answer is confidential. No one who makes hiring decisions will see it. Your decision to complete the form and your answer will not harm you in any way. If you want to learn more about the law or this form, visit the U.S. Department of Labor’s Office of Federal Contract Compliance Programs (OFCCP) website at www.dol.gov/ofccp . How do you know if you have a disability? A disability is a condition that substantially limits one or more of your “major life activities.” If you have or have ever had such a condition, you are a person with a disability. Disabilities include, but are not limited to: Alcohol or other substance use disorder (not currently using drugs illegally) Autoimmune disorder, for example, lupus, fibromyalgia, rheumatoid arthritis, HIV/AIDS Blind or low vision Cancer (past or present) Cardiovascular or heart disease Celiac disease Cerebral palsy Deaf or serious difficulty hearing Diabetes Disfigurement, for example, disfigurement caused by burns, wounds, accidents, or congenital disorders Epilepsy or other seizure disorder Gastrointestinal disorders, for example, Crohn's Disease, irritable bowel syndrome Intellectual or developmental disability Mental health conditions, for example, depression, bipolar disorder, anxiety disorder, schizophrenia, PTSD Missing limbs or partially missing limbs Mobility impairment, benefiting from the use of a wheelchair, scooter, walker, leg brace(s) and/or other supports Nervous system condition, for example, migraine headaches, Parkinson’s disease, multiple sclerosis (MS) Neurodivergence, for example, attention-deficit/hyperactivity disorder (ADHD), autism spectrum disorder, dyslexia, dyspraxia, other learning disabilities Partial or complete paralysis (any cause) Pulmonary or respiratory conditions, for example, tuberculosis, asthma, emphysema Short stature (dwarfism) Traumatic brain injury Disability Status Select... PUBLIC BURDEN STATEMENT: According to the Paperwork Reduction Act of 1995 no persons are required to respond to a collection of information unless such collection displays a valid OMB control number. This survey should take about 5 minutes to complete. Submit application Powered by Greenhouse$seed$,
    $seed$$seed$,
    $seed$2026-05-27T20:16:08.900Z$seed$::timestamptz,
    $seed$2026-05-27T20:16:09.247Z$seed$::timestamptz
  ),
  (
    $seed$b88f167a-0f74-4ab4-94ba-034ffd342464$seed$::uuid,
    $seed$7f547400-9654-4fca-b079-387748b08db9$seed$::uuid,
    $seed$https://jobs.ashbyhq.com/sekai/655d5942-2f0c-4ce6-83df-8e8184222672/application$seed$,
    $seed$completed$seed$,
    200,
    $seed$Technical Lead @ Sekai$seed$,
    $seed$$seed$,
    $seed$2026-05-27T22:21:30.356Z$seed$::timestamptz,
    $seed$2026-05-27T22:21:31.051Z$seed$::timestamptz
  ),
  (
    $seed$83bdf4f8-e39a-4afa-aa3c-20803d50eef1$seed$::uuid,
    $seed$022bbf7f-7fc5-42e7-9a3d-469a8715e047$seed$::uuid,
    $seed$https://jobs.gem.com/air-labs-inc-/am9icG9zdDpTnSGpwN_4q74bz3aPVAfj$seed$,
    $seed$completed$seed$,
    200,
    $seed$Air Labs, Inc. Careers$seed$,
    $seed$$seed$,
    $seed$2026-05-27T22:33:23.644Z$seed$::timestamptz,
    $seed$2026-05-27T22:33:23.900Z$seed$::timestamptz
  ),
  (
    $seed$52c5a215-81cd-4e36-85b7-ff0beec1f8be$seed$::uuid,
    $seed$022bbf7f-7fc5-42e7-9a3d-469a8715e047$seed$::uuid,
    $seed$manual://pasted-description$seed$,
    $seed$completed$seed$,
    NULL,
    $seed$Senior / Staff Frontend Engineer
United States (Remote)
Engineering
Remote
Full-time
Air is a Creative Ops System for creative teams. Our product automates the mindless tasks that creatives and marketers do every day to manage content and unlocks creativity through image recognition, automated versioning, and approval workflows. We launched in March 2021 and have raised +$70m from world-class venture capital groups including Avenir, Tiger Global, Headline Ventures, Lerer Hippeau, WndrCo, and Slack Ventures.

The Role

We're looking for an experienced Senior / Staff Frontend Engineer to build and own frontend experiences across Air's web platform. You'll work closely with Product, Design, and fellow engineers to ship polished, high-performance UI that directly impacts how creative teams manage their work. Whether you're architecting a new feature from scratch, raising the bar on component design, or improving core rendering performance — you'll have real ownership and real impact. If you love building exceptional user experiences, care deeply about craft, and thrive in fast-moving environments, this role is for you.

Core Responsibilities

Ship Exceptional Frontend Experiences
Partner with Product and Design to translate ambiguous requirements into well-scoped, elegant technical solutions.
Own the full frontend development lifecycle — from architecture and implementation to testing, release, and iteration.
Drive Frontend Excellence
Set and uphold high standards for code quality, component design, accessibility, and performance.
Participate in code reviews, tech-spec reviews, and on-call rotations.
Continuously improve engineering practices across our frontend codebase.
Build and Scale Our Design System
Contribute to and extend Air's component library, ensuring consistency and reusability across products.
Collaborate closely with Design and product engineers to maintain a shared design language at scale.
Operate with Speed and Clarity
Drive projects forward in a fast-moving, high-trust environment where requirements may be lightly defined.
Proactively create clarity, identify tradeoffs, and keep initiatives moving with a high degree of autonomy.
Mentor and Grow the Team
Help grow Air's engineering culture by mentoring junior and mid-level engineers.
Participate in interviewing and help shape hiring standards for the frontend discipline.

Requirements

Experience: 6+ years of professional frontend development experience in a fast-paced, high-growth environment — ideally in SaaS or consumer-grade web products.
Technical Skills: Deep expertise in React, TypeScript, and Next.js. Comfortable working across the modern frontend ecosystem and picking up new tooling quickly.
Design Sensibility: A strong eye for detail and a genuine care for user experience — you can speak the language of design and advocate for quality at the implementation level.
Entrepreneurial Drive: You like to work in public, own problems end-to-end, and move with intentional speed — so your best ideas ship fast and make a visible dent.
Drive to Raise the Bar: Everyone at Air says the hard thing, progresses every day, and builds genuine relationships while pushing themselves and those around them to be better.
Don't meet every requirement? Apply anyway. We know that research shows women and underrepresented candidates are less likely to apply for roles unless they meet every listed qualification. If you're excited about this role and think you could do great work here, we'd love to hear from you — even if your background doesn't check every box. We hire for potential, curiosity, and drive, not just credentials.

How We Work at Air

Act like a driver: Take initiative and ownership without waiting to be told.
Work in public: Share ideas openly, get feedback early, and collaborate across teams.
Play to win: Aim high and bring creativity, adaptability, and focus to your work.
Say the hard thing: Give and receive feedback with clarity and respect.
Disagree and commit: Debate honestly, then align quickly to move forward together.

Benefits
Why Air?
Growth and Impact: Join a rapidly scaling company with a mission to transform the creative ops space. Your work will have a direct, tangible impact on [our ARR growth].
Comprehensive Benefits: We offer competitive medical, dental, and vision insurance, along with dependent coverage. You’ll also enjoy a generous work-from-home stipend, professional development reimbursement, and unlimited vacation days.
Commitment to Diversity: We believe in the power of diverse perspectives and strive to create an inclusive culture that welcomes individuals from all backgrounds and experiences.
Competitive Compensation: The compensation range for this role is USD $161,000 - $253,000 (Senior Frontend Engineer) and $177,000 - $278,000 (Staff Frontend Engineer) base salary, commensurate with experience.

At Air, we’re committed to building a world-class team and helping every individual reach their full potential. If you're passionate about solving big problems and growing with an innovative company, we’d love to meet you!$seed$,
    $seed$$seed$,
    $seed$2026-05-27T22:33:50.397Z$seed$::timestamptz,
    $seed$2026-05-27T22:33:50.398Z$seed$::timestamptz
  ),
  (
    $seed$db85e744-e7d8-4b48-8597-e4a2b3754786$seed$::uuid,
    $seed$314e9fd0-028c-4d3e-ba38-60adf48a518b$seed$::uuid,
    $seed$https://www.8090.ai/careers?ashby_jid=0cd9781c-e158-4b0c-9979-04ead270933a$seed$,
    $seed$completed$seed$,
    200,
    $seed$Careers — 8090 Home Software Factory Enterprise Pricing Resources Get Started Loading open roles... Lean team, top-notch talent. At 8090, we’re working on cutting-edge technology solutions designed and engineered to precision. If you’re passionate about technology and want to work in a fast-paced, innovative environment, we’d love to have you join our team. If you don’t see a role that matches your skillset, email evidence of exceptional ability to hiring@8090.inc . Build with Software Factory Receive updates on new releases and get invitation to exclusive events. Sign Up Product Software Factory 8090 Enterprise Pricing Docs Company Careers Blog Contact Legal Terms of Service Privacy Policy © 2026 8090 Solutions Inc. All rights reserved.$seed$,
    $seed$$seed$,
    $seed$2026-05-28T10:50:19.529Z$seed$::timestamptz,
    $seed$2026-05-28T10:50:19.693Z$seed$::timestamptz
  ),
  (
    $seed$cb251886-d280-438c-a1dd-ff4493dddf30$seed$::uuid,
    $seed$314e9fd0-028c-4d3e-ba38-60adf48a518b$seed$::uuid,
    $seed$manual://pasted-description$seed$,
    $seed$completed$seed$,
    NULL,
    $seed$About 8090

The Software Industrial Complex has evolved into a bloated, expensive ecosystem that burdens enterprises with unnecessary complexity and inefficiency. Co-founded and led by Chamath Palihapitiya, we are building a Software Factory that delivers fully-managed and hosted software purpose-built for each customer.

About the Role

We seek an exceptional, full-stack software developer with high technical competency and intellectual curiosity to join our team. To succeed, you must enjoy thinking in systems and additionally possess some combination, but not all, of DevOps, data engineering, or ML/data science work experience at scale. Most engineering roles at 8090 are customer-facing, and you must have the soft skills to design and articulate well-engineered solutions to ambiguous problems.

Note: If it’s been more than 6 months since your last application, we’d love to invite you to apply again.

Location

This is an on-site role based in Redwood City, California or Toronto, Ontario, Canada.

Responsibilities

You will build customer solutions with Software Factory and help develop parts of our Software Factory itself. Our software engineers are responsible for the complete lifecycle of the software they create, including development, testing, operation, maintenance, and support. As a member of our technical staff, you must constantly challenge yourself on which software paradigms are evolving with advances in AI and how you can best leverage AI tools to improve your own practices and the team’s productivity. We call this building AI with AI.

Required Skills

• Expertise in and extensive professional experience with full-stack web development is a must – we use Python, Typescript, React, Data Structures, and AWS

• Owning problems end-to-end and are willing to pick up whatever knowledge you're missing fast to get the job done

• Ability to work effectively within a highly dynamic and intelligent team by maintaining the values that 8090 was founded on: engineering excellence, insatiable curiosity, a bias for action, ownership, agency, honesty, and radical candor

• Excellent verbal and written communication abilities to collaborate and convey ideas effectively internally and to customer stakeholders

What Sets a Candidate Apart

• Deep expertise in data engineering, ML engineering, or data science. Examples are integrating LLMs into products, fine-tuning models, creating evaluations, or hosting AI/ML infrastructure at scale

• Professional work experience in DevOps, security, and cloud infrastructure – We use GitHub Actions, Docker, and AWS CDK extensively Pay range and compensation package

We’d love to hear from you:

Tell us about the most exceptional product you’ve built. What made it stand out, and what were the biggest challenges you faced while building it?

Expected compensation (US-based employees): $150,000 - $1M annual salary + stock and/or stock option awards + benefits. We offer competitive pay and benefits. Compensation may vary depending on many individualized factors, including location, job-related knowledge, skills, and experience. Details of the compensation package, including benefits (medical, dental, vision, 401K, …), will be provided if and when a candidate receives an offer of employment.

Equal Opportunity Statement - 8090 is an Equal Opportunity employer. All qualified applicants will be considered for employment without regard to any factor, including veteran status and disability status, protected by applicable federal, state, or local laws.

Visa Information - We do not provide new work visa sponsorship.

This position is only open to candidates who are citizens, permanent residents or are transferring an existing H-1B, O-1, L-1, or TN Visa.$seed$,
    $seed$$seed$,
    $seed$2026-05-28T10:50:41.971Z$seed$::timestamptz,
    $seed$2026-05-28T10:50:41.972Z$seed$::timestamptz
  ),
  (
    $seed$eb404256-3fb5-4478-a2e1-f66a3e0ef971$seed$::uuid,
    $seed$4c27df7a-135e-4a60-8bca-64d2a3bf96b0$seed$::uuid,
    $seed$manual://pasted-description$seed$,
    $seed$completed$seed$,
    NULL,
    $seed$Hey, I’m James, one of the founders of Sudowrite.

And I’m angry that writing on mobile sucks.

We have literal supercomputers in our pockets, but mobile writing interfaces haven't improved in years (I'm looking at you, Apple and Google).

Improving how we write and edit on a phone is an important problem. As a parent, I have fewer uninterrupted blocks of time at a desk. Many times, the best ideas come when I'm out in the world.

Writers are begging for better mobile tools.

We launched our mobile app last year. Now over 20% of our users are active on phones. Some of our users are writing the entire first draft of their book with their thumbs.

But we’re far from solving this problem. We see a world where writing on a phone doesn’t feel like a compromise. It just feels like writing.

Do you love building new interfaces that make hard things easy? Do you know the joy (and pains) of creating a text editor from scratch? If so, let's chat. 🛟

The Actual Job Listing

This is a real ownership role.

You won’t just be implementing designs handed to you by committee. You’ll be helping shape the product and the future of mobile at Sudowrite.

Our mobile app is built in React Native via Expo for iOS and Android.

But this is not a basic app.

It has a custom document editing system built around a TipTap editor running inside a WebView, with a lightweight bridge between the native app and the editor.

It uses Y.js for collaboration, and it has multiple persistence and sync layers. There’s also Smart Dictation built with native Swift bindings, with intricate audio and transcription features. Oh, and lots of AI text streaming features, too.

Some days will look like this…

Improving performance to make the app feel smoother
Debugging an issue in the React Native ↔ TipTap bridge
Designing safer sync behavior for offline edits and reconnection
Fixing a platform-specific annoyance on iOS
Other days will look like this…

Dogfooding the app to write your own stories
Chatting with writers to discover their biggest pain points
Giving a demo to a beta group of users
Researching other mobile writing interfaces
What Success Looks Like

Week 1 - Y0u’ve learned the basics about the app and shipped your first PR.

Month 1 - You’ve shipped features, fixed bugs, and have mastered the architecture of the app, making it better than when you found it.

Month 3 - You independently own projects, come up with new ideas to make Sudowrite the best writing app on the planet, and implement them beginning-to-end.

About You

You’ve had 5+ years experience shipping mobile products. You’re deeply comfortable in React Native, but also familiar with iOS and Android.

Ideally you are also a writer of fiction and know the world of novel writing.

You use AI tools all the time. You routinely manage 8 coding agents across your codebase, and you know how get them to produce quality code.

You know Expo, including the parts people only learn once they’ve suffered a little: native modules, EAS builds, OTA updates, and release workflows.

You have strong product taste. You get annoyed when something feels clunky and overcomplicated.

You can move between code thinking and business thinking. You can say, “This persistence model is going to bite us later,” and “No one is going to use this feature, why are we building it?”

You love talking to users, and you don't hesitate hopping on Zoom call to do a discovery interview.

You can prototype features fast and validate them.

You’re kind, thoughtful, and you’re fun to be around.

You are based in the US.$seed$,
    $seed$$seed$,
    $seed$2026-05-28T11:02:21.453Z$seed$::timestamptz,
    $seed$2026-05-28T11:02:21.455Z$seed$::timestamptz
  ),
  (
    $seed$449094cf-200f-4c2c-8405-3ab0623dd7d4$seed$::uuid,
    $seed$4fe4c4d7-3ca6-4744-b75b-72d6e351b924$seed$::uuid,
    $seed$https://jobs.ashbyhq.com/kodex/31e53827-080b-4266-945c-950005486081$seed$,
    $seed$completed$seed$,
    200,
    $seed$Software Engineer — Integrations @ Kodex$seed$,
    $seed$$seed$,
    $seed$2026-05-28T15:49:28.796Z$seed$::timestamptz,
    $seed$2026-05-28T15:49:28.921Z$seed$::timestamptz
  )
ON CONFLICT (id) DO UPDATE SET
  job_id = EXCLUDED.job_id,
  source_url = EXCLUDED.source_url,
  status = EXCLUDED.status,
  http_status = EXCLUDED.http_status,
  plain_text = EXCLUDED.plain_text,
  error = EXCLUDED.error,
  started_at = EXCLUDED.started_at,
  completed_at = EXCLUDED.completed_at;

-- job_applications: (no rows in JSON)

COMMIT;
