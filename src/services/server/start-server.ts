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

const resolveListenHost = (configHost?: string): string => {
  const explicit = configHost?.trim() || process.env.HOST?.trim();
  if (explicit) {
    return explicit;
  }
  // Railway/Docker must listen on all interfaces; 127.0.0.1 causes 502 from the edge proxy.
  if (
    process.env.NODE_ENV === "production" ||
    process.env.RAILWAY_ENVIRONMENT ||
    process.env.RAILWAY_SERVICE_ID
  ) {
    return "0.0.0.0";
  }
  return "127.0.0.1";
};

export const startServer = (app: Express, config: ServerConfig): void => {
  const { port, environment } = config;
  const host = resolveListenHost(config.host);

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
