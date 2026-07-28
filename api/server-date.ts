import app from '../server.js';

export default function handler(req: any, res: any) {
  req.url = '/api/server-date';
  return app(req, res);
}
