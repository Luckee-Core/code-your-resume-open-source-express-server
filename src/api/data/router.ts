import { Router } from "express";
import { createCompanyApiRouter } from "./company/router";
import { createJobApiRouter } from "./job/router";
import { createJobResponsibilitiesApiRouter } from "./job-responsibilities/router";
import { createJobRequirementsApiRouter } from "./job-requirements/router";
import { createJobNiceToHavesApiRouter } from "./job-nice-to-haves/router";
import { createSkillsComponentRouter } from "./skills-component/router";
import { createCoverLetterRouter } from "./cover-letter/router";
import { createImageGraphicApiRouter } from "./image-graphic/router";
import { createCompanyInterestRouter } from "./company-interest/router";
import { createJobQuestionsRouter } from "./job-questions/router";
import { createJobQuestionAnswersRouter } from "./job-question-answers/router";
import { createThunkErrorsRouter } from "../../data/thunk-errors";
import { createUiErrorsRouter } from "../../data/ui-errors";
import { createApiErrorsRouter } from "../../data/api-errors";
import { createJobNewsletterSourcesRouter } from "./job-newsletter-sources/router";
import { createJobNewsletterIngestRunsRouter } from "./job-newsletter-ingest-runs/router";
import { createJobNewsletterIngestAiPromptsRouter } from "./job-newsletter-ingest-ai-prompts/router";
import { createJobNewsletterIngestAiCostsRouter } from "./job-newsletter-ingest-ai-costs/router";
import { createExchangeRegistryRouter } from "./exchange-registry/router";
import { createAiPromptsRouter } from "./ai-prompts/router";
import { createJobListingAiPromptsRouter } from "./job-listing-ai-prompts/router";
import { createLinkedInProfileRouter } from "./linkedin-profile/router";
import { createLinkedInEmploymentRouter } from "./linkedin-employment/router";
import { createLinkedInEducationRouter } from "./linkedin-education/router";
import { createLinkedInCertificationRouter } from "./linkedin-certification/router";

/**
 * Aggregates CRM action routes under `/api/data`.
 */
export const createApiDataRouter = (): Router => {
  const router = Router();
  router.use("/company", createCompanyApiRouter());
  router.use("/image-graphic", createImageGraphicApiRouter());
  router.use("/job", createJobApiRouter());
  router.use("/job-responsibilities", createJobResponsibilitiesApiRouter());
  router.use("/job-requirements", createJobRequirementsApiRouter());
  router.use("/job-nice-to-haves", createJobNiceToHavesApiRouter());
  router.use("/skills-component", createSkillsComponentRouter());
  router.use("/cover-letter", createCoverLetterRouter());
  router.use("/company-interest", createCompanyInterestRouter());
  router.use("/job-questions", createJobQuestionsRouter());
  router.use("/job-question-answers", createJobQuestionAnswersRouter());
  router.use("/thunk-errors", createThunkErrorsRouter());
  router.use("/ui-errors", createUiErrorsRouter());
  router.use("/api-errors", createApiErrorsRouter());
  router.use("/job-newsletter-sources", createJobNewsletterSourcesRouter());
  router.use("/job-newsletter-ingest-runs", createJobNewsletterIngestRunsRouter());
  router.use("/job-newsletter-ingest-ai-prompts", createJobNewsletterIngestAiPromptsRouter());
  router.use("/job-newsletter-ingest-ai-costs", createJobNewsletterIngestAiCostsRouter());
  router.use("/exchange-registry", createExchangeRegistryRouter());
  router.use("/ai-prompts", createAiPromptsRouter());
  router.use("/job-listing-ai-prompts", createJobListingAiPromptsRouter());
  router.use("/linkedin-profile", createLinkedInProfileRouter());
  router.use("/linkedin-employment", createLinkedInEmploymentRouter());
  router.use("/linkedin-education", createLinkedInEducationRouter());
  router.use("/linkedin-certification", createLinkedInCertificationRouter());
  return router;
};
