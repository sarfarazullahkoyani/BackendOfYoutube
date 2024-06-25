import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    // enables sending cookies along with cross-origin requests (if your frontend is on a different domain).
  })
);

app.use(
  express.json({
    limit: "1000kb ",
  })
);
// this the data we have took when user filled form
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
// this skims out the data in the url sent by users
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";
// routes declaration
app.use("/api/v1/users", userRouter);
// http://localhost:8000/api/v1/users/register
export { app };
