import express from "express";
import mongoose, { MongooseError } from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT);

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/user", wishlistRoutes);

mongoose
  .connect(
    process.env.DB_URL as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions
  )
  .then(() => console.log("Mongoose connected successfully!"))
  .catch((err: MongooseError) =>
    console.log("Could not connect mongoose: ", err)
  );

app.listen(PORT, "0.0.0.0", () => {
  console.log(`App started on http://0.0.0.0:${PORT}`);
});
