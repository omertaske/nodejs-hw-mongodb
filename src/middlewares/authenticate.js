import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { SessionCollection } from "../db/Session.js";

const ACCESS_SECRET = process.env.JWT_SECRET_ACCESS || "access_secret";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(createHttpError(401, "No token provided"));

  const token = authHeader.split(" ")[1];
  if (!token) return next(createHttpError(401, "Invalid token format"));

  try {
    const payload = jwt.verify(token, ACCESS_SECRET);

    // session bulunmalı (token iptal edilmemiş olmalı)
    const session = await SessionCollection.findOne({ accessToken: token, userId: payload.id });
    if (!session) return next(createHttpError(401, "Invalid or expired token"));

    if (new Date(session.accessTokenValidUntil) < new Date()) {
      return next(createHttpError(401, "Access token expired"));
    }

    // controller'ların beklediği format: req.user._id
    req.user = { _id: payload.id.toString() };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") return next(createHttpError(401, "Access token expired"));
    next(createHttpError(401, "Invalid or expired token"));
  }
};