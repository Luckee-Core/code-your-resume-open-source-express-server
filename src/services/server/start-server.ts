/**
 * Start Server
 * Initializes and starts the Express server
 */

import { Express } from 'express';

interface ServerConfig {
  port: number;
  environment: string;
  /** Listen address. Default `127.0.0.1` (not LAN-exposed). Use `0.0.0.0` for Docker / Railway. */
  host?: string;
}

export const startServer = (app: Express, config: ServerConfig): void => {
  const { port, environment } = config;
  const host = config.host?.trim() || process.env.HOST?.trim() || "127.0.0.1";

  app.listen(port, host, () => {
    console.log('');
    console.log('='.repeat(50));
    console.log(`🚀 Code Your Resume — Express Server`);
    console.log('='.repeat(50));
    console.log(`Environment: ${environment}`);
    console.log(`Bind: ${host}:${port}`);
    console.log(`URL: http://localhost:${port}`);
    console.log(`Health Check: http://localhost:${port}/api/health`);
    console.log(`CRM Data API: http://localhost:${port}/api/data`);
    console.log(`Technical Skills: http://localhost:${port}/api/technical-skills`);
    console.log(`Professional Background: http://localhost:${port}/api/professional-background`);
    console.log('='.repeat(50));
    console.log('');
  });
};
