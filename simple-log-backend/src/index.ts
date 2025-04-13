import dotenv from "dotenv";
import app from "./app";
import heathRoute from "./routes/health";
import projectRoute from "./routes/project";
import trackerRouter from "./routes/tracker";
import cors from "cors";
dotenv.config();
const PORT = process.env.PORT || 3090;
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(heathRoute);
app.use(projectRoute);
app.use(trackerRouter);
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
