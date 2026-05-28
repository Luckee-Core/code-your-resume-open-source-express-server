import { Router } from "express";
import { createCompanyApiRouter } from "./company/router";
import { createEmployeeApiRouter } from "./employee/router";
import { createJobApiRouter } from "./job/router";
import { createJobApplicationApiRouter } from "./job-application/router";
import { createEmploymentApiRouter } from "./employment/router";
import { createJobResponsibilitiesApiRouter } from "./job-responsibilities/router";
import { createJobRequirementsApiRouter } from "./job-requirements/router";
import { createJobNiceToHavesApiRouter } from "./job-nice-to-haves/router";
import { createSkillsComponentRouter } from "./skills-component/router";
import { createCoverLetterRouter } from "./cover-letter/router";
import { createImageGraphicApiRouter } from "./image-graphic/router";

/**
 * Aggregates CRM action routes under `/api/data`.
 */
export const createApiDataRouter = (): Router => {
  const router = Router();
  router.use("/company", createCompanyApiRouter());
  router.use("/image-graphic", createImageGraphicApiRouter());
  router.use("/employee", createEmployeeApiRouter());
  router.use("/job", createJobApiRouter());
  router.use("/job-application", createJobApplicationApiRouter());
  router.use("/employment", createEmploymentApiRouter());
  router.use("/job-responsibilities", createJobResponsibilitiesApiRouter());
  router.use("/job-requirements", createJobRequirementsApiRouter());
  router.use("/job-nice-to-haves", createJobNiceToHavesApiRouter());
  router.use("/skills-component", createSkillsComponentRouter());
  router.use("/cover-letter", createCoverLetterRouter());
  return router;
};
