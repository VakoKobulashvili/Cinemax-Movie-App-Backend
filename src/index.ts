import express from "express";
import mongoose, { MongooseError } from "mongoose";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);

mongoose
  .connect("mongodb://localhost:27017/cinemax-authentication", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => console.log("Mongoose connected successfully!"))
  .catch((err: MongooseError) =>
    console.log("Could not connect mongoose: ", err)
  );

app.listen(PORT, () => {
  console.log("App started!");
});
