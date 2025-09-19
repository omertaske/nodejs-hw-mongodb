import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserCollection } from "../db/User.js";
import { SessionCollection } from "../db/Session.js";

const ACCESS_SECRET = process.env.JWT_SECRET_ACCESS || "access_secret";
const REFRESH_SECRET = process.env.JWT_SECRET_REFRESH || "refresh_secret";

export const register = async (name, email, password) => {
  const existingUser = await UserCollection.findOne({ email });
  if (existingUser) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserCollection.create({ name, email, password: hashedPassword });

  return { id: user._id, name: user.name, email: user.email };
};

export const login = async (email, password) => {
  const user = await UserCollection.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = jwt.sign({ id: user._id }, ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: "7d" });

  await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

export const refresh = async (refreshToken) => {
  const session = await SessionCollection.findOne({ refreshToken });
  if (!session) throw new Error("Invalid refresh token");

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    const newAccessToken = jwt.sign({ id: payload.id }, ACCESS_SECRET, { expiresIn: "15m" });

    session.accessToken = newAccessToken;
    session.accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    await session.save();

    return { accessToken: newAccessToken };
  } catch {
    throw new Error("Invalid refresh token");
  }
};

export const logout = async (refreshToken) => {
  await SessionCollection.deleteOne({ refreshToken });
};
