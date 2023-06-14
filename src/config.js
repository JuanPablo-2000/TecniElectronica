import { config } from "dotenv";
config();

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/tecnidb";
export const PORT = process.env.PORT || 4000;
export const SECRET = "yoursecretkey";