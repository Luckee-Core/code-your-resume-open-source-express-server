import { Router } from 'express';
import * as handlers from './routes';

/**
 * User Background Studio API — profiles, versions, and coach chat.
 * Mount at /api/user-background-studio in the Express app.
 */
export const createUserBackgroundStudioRouter = (): Router => {
  const router = Router();

  router.get('/writer-settings', handlers.getWriterSettingsHandler);
  router.patch('/writer-settings', handlers.patchWriterSettingsHandler);
  router.get('/profiles', handlers.listProfilesHandler);
  router.post('/profiles', handlers.createProfileHandler);
  router.get('/profiles/:profileId', handlers.getProfileHandler);
  router.patch('/profiles/:profileId', handlers.patchProfileHandler);
  router.post('/profiles/:profileId/messages', handlers.postMessageHandler);
  router.post(
    '/profiles/:profileId/segment-suggestions/:suggestionId/accept',
    handlers.acceptSegmentSuggestionHandler,
  );
  router.patch(
    '/profiles/:profileId/versions/:versionNumber/label',
    handlers.patchVersionLabelHandler,
  );
  router.post('/profiles/:profileId/versions/duplicate', handlers.duplicateVersionHandler);
  router.post('/profiles/:profileId/versions/blank', handlers.postBlankVersionHandler);
  router.delete('/profiles/:profileId/versions/:versionNumber', handlers.deleteVersionHandler);

  return router;
};
