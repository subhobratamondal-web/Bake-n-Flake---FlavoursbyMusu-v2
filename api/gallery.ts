import app from '../server.js';

export default function handler(req: any, res: any) {
  req.url = '/api/gallery';
  return app(req, res);
}
