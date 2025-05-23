import dotenv from "dotenv";
import app from "./app";
import healthRouter from "./routes/health.route";
import projectRouter from "./routes/project.route";
import trackerRouter from "./routes/tracker.route";
import cors from "cors";
dotenv.config();
const PORT = process.env.PORT || 3090;

app.use(
  cors({
    origin: ["http://localhost:3000", process.env.BACKEND_URL!!],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

app.use(healthRouter);
app.use(projectRouter);
app.use(trackerRouter);
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
