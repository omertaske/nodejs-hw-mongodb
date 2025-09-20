import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { UserCollection } from "../db/User.js";
import { SessionCollection } from "../db/Session.js";

const ACCESS_SECRET = process.env.JWT_SECRET_ACCESS || "access_secret";
const REFRESH_SECRET = process.env.JWT_SECRET_REFRESH || "refresh_secret";

const ACCESS_TTL = "15m";
const REFRESH_TTL = "30d";

export const register = async (name, email, password) => {
  const existingUser = await UserCollection.findOne({ email });
  if (existingUser) throw createHttpError(409, "Email in use");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserCollection.create({ name, email, password: hashedPassword });

  return { id: user._id, name: user.name, email: user.email };
};

export const login = async (email, password) => {
  const user = await UserCollection.findOne({ email });
  if (!user) throw createHttpError(401, "Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createHttpError(401, "Invalid credentials");

  // delete existing session(s)
  await SessionCollection.deleteMany({ userId: user._id });

  const accessToken = jwt.sign({ id: user._id }, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
  const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: REFRESH_TTL });

  await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

export const refresh = async (oldRefreshToken) => {
  const session = await SessionCollection.findOne({ refreshToken: oldRefreshToken });
  if (!session) throw createHttpError(401, "Invalid refresh token");

  try {
    const payload = jwt.verify(oldRefreshToken, REFRESH_SECRET);
    // delete old session
    await SessionCollection.deleteOne({ refreshToken: oldRefreshToken });

    const accessToken = jwt.sign({ id: payload.id }, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
    const refreshToken = jwt.sign({ id: payload.id }, REFRESH_SECRET, { expiresIn: REFRESH_TTL });

    await SessionCollection.create({
      userId: payload.id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return { accessToken, refreshToken };
  } catch {
    throw createHttpError(401, "Invalid refresh token");
  }
};

export const logout = async (refreshToken) => {
  await SessionCollection.deleteOne({ refreshToken });
};
