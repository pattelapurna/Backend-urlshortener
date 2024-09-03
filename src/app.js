import express from "express";
import routes from "./routes/index.js";
import morgan from "morgan";
import cors from 'cors';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import zlib from 'zlib';
import helmet from "helmet";
import logRequestSize from './middlewares/logRequestSize.js'
import limiter from "./utils/rateLimit.js";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(compression({
  filter: (req, res) => {

    if (req.url.startsWith('/public/')) {
      return false;
    }

    if (req.headers['x-no-compression']) {
      return false;
    }

    return compression.filter(req, res);
  },
  level: zlib.constants.Z_BEST_COMPRESSION,
  threshold: 1024,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + "/public"));
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(limiter);
app.use(logRequestSize)

app.use("/api/v1/", routes);

app.get("/", (_req, res) => {
  res.send("Let's build it ..");
});

app.all('*', (_req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

export default app;
