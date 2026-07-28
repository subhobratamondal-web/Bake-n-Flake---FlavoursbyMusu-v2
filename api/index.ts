import app from '../server.js';

export default function handler(req: any, res: any) {
  // If request URL is generic /api/index, try to resolve real intended path from headers
  const invokePath = req.headers['x-invoke-path'] || req.headers['x-forwarded-uri'] || req.url;
  if (invokePath && invokePath !== '/api/index') {
    req.url = invokePath;
  }
  return app(req, res);
}
