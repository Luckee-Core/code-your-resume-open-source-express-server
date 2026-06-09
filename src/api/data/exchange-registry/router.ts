import { Router } from 'express';
import { handleExchangeRegistryList } from './list';

/**
 * Exchange registry list routes (reads enabled rows from exchange_table_registry).
 */
export const createExchangeRegistryRouter = (): Router => {
  const router = Router();
  router.get('/list', handleExchangeRegistryList);
  return router;
};
