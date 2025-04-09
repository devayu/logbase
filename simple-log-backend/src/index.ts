import dotenv from "dotenv";
import app from "./app";
import heathRoute from "./routes/health";
import projectRoute from "./routes/project";
import trackerRouter from "./routes/tracker";

dotenv.config();

const PORT = process.env.PORT || 3090;
app.use(heathRoute);
app.use(projectRoute);
app.use(trackerRouter);
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
