import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app: Express = express();

morgan.token("server-prefix", () => "\x1b[36mSERVER\x1b[0m");
// Custom format with server prefix
const logFormat =
  ":server-prefix :method :url :status :response-time ms - :res[content-length]";

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan(logFormat));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes will be added here
// app.use('/api/v1', routes);

export default app;
