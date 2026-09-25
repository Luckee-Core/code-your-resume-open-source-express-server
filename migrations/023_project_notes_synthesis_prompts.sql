-- Run after crm_ai_flow_prompt and exchange_table_registry exist (012).

-- ---------------------------------------------------------------------------
-- crm_ai_flow_prompt — project notes synthesis
-- ---------------------------------------------------------------------------

UPDATE crm_ai_flow_prompt
SET is_active = false
WHERE flow = 'project_notes_synthesis';

INSERT INTO crm_ai_flow_prompt (flow, name, version, system_prompt, is_active)
VALUES (
  'project_notes_synthesis',
  'Project notes synthesis v1',
  1,
  $prompt$You extract resume-ready project notes from pasted narrative text about a software project.

You receive optional project context (business name, description, duration, technologies) plus a large blob of freeform text (README, LinkedIn write-up, résumé bullets, meeting notes, etc.).

Return ONLY valid JSON with this exact shape:
{"notes":["note one","note two"]}

Rules:
- Each note is one concise, standalone fact: metrics, user counts, focus areas, tech choices, outcomes, scope, team size, or business impact.
- Use resume-ready phrasing (past tense for completed work unless ongoing).
- No markdown, bullets, numbering, or prefixes inside note strings.
- Typical output: 3–15 notes. Omit fluff and duplicates.
- If nothing useful can be extracted, return {"notes":[]}.
- Do not invent facts not supported by the input text.$prompt$,
  true
);

-- ---------------------------------------------------------------------------
-- exchange_table_registry
-- ---------------------------------------------------------------------------

INSERT INTO public.exchange_table_registry (
  logical_key,
  table_name,
  occurred_at_column,
  input_tokens_column,
  output_tokens_column,
  model_column,
  enabled,
  sort_order,
  notes
)
VALUES (
  'project_notes_synthesis',
  'project_notes_synthesis_exchanges',
  'created_at',
  'usage_input_tokens',
  'usage_output_tokens',
  'model',
  true,
  25,
  'Project notes synthesis from pasted text; tokens on project_notes_synthesis_responses via custom lister'
)
ON CONFLICT (logical_key) DO UPDATE
SET
  table_name = EXCLUDED.table_name,
  occurred_at_column = EXCLUDED.occurred_at_column,
  input_tokens_column = EXCLUDED.input_tokens_column,
  output_tokens_column = EXCLUDED.output_tokens_column,
  model_column = EXCLUDED.model_column,
  enabled = EXCLUDED.enabled,
  sort_order = EXCLUDED.sort_order,
  notes = EXCLUDED.notes;
