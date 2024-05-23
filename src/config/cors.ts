import { CorsOptions } from "cors";
import e from "express";

export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    const whiteList = [process.env.FRONTEND_URL];

    if (whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
