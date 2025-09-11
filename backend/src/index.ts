import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import recipeRoutes from "./routes/recipes";
import userRoutes from "./routes/user";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/auth";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/user", userRoutes);

app.use(authMiddleware);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
