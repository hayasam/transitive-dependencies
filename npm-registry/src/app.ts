import * as express from 'express';
import { getPackage } from './package';
const cors = require('cors')

/**
 * Bootstrap the application framework
 */
export function createApp() {
  const app = express();

  app.use(express.json());
  const corsOptions = {
    origin: ['http://127.0.0.1:8080', 'http://localhost:8080'],
    credentials: true
}
app.use(cors(corsOptions))

  app.get('/package/:name/:version', getPackage);

  return app;
}
