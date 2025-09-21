import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { UserCollection } from "../db/User.js";
import { SessionCollection } from "../db/Session.js";
import nodemailer from "nodemailer";

const ACCESS_SECRET = process.env.JWT_SECRET_ACCESS || "access_secret";
const REFRESH_SECRET = process.env.JWT_SECRET_REFRESH || "refresh_secret";
const RESET_SECRET = process.env.JWT_SECRET || "reset_secret";

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

  await SessionCollection.deleteMany({ userId: user._id });

  const accessToken = jwt.sign({ id: user._id }, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
  const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, { expiresIn: REFRESH_TTL });

  await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  return { accessToken, refreshToken };
};

export const refresh = async (oldRefreshToken) => {
  const session = await SessionCollection.findOne({ refreshToken: oldRefreshToken });
  if (!session) throw createHttpError(401, "Invalid refresh token");

  try {
    const payload = jwt.verify(oldRefreshToken, REFRESH_SECRET);

    await SessionCollection.deleteOne({ refreshToken: oldRefreshToken });

    const accessToken = jwt.sign({ id: payload.id }, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
    const refreshToken = jwt.sign({ id: payload.id }, REFRESH_SECRET, { expiresIn: REFRESH_TTL });

    await SessionCollection.create({
      userId: payload.id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    return { accessToken, refreshToken };
  } catch {
    throw createHttpError(401, "Invalid refresh token");
  }
};

export const logout = async (refreshToken) => {
  await SessionCollection.deleteOne({ refreshToken });
};

/* -------------------------
   Yeni: send reset email
   ------------------------- */
export const sendResetEmail = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) throw createHttpError(404, "User not found!");

  // 5 dakika geçerli token, payload içinde email
  const token = jwt.sign({ email: user.email }, RESET_SECRET, { expiresIn: "5m" });

  const appDomain = process.env.APP_DOMAIN || "http://localhost:3000";
  // link örnek: https://<frontend>/reset-password?token=<jwt>
  const resetLink = `${appDomain}/reset-password?token=${token}`;

  // transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: "Password reset",
    html: `
      <p>Merhaba,</p>
      <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıyı kullanın. Bağlantı 5 dakika boyunca geçerlidir.</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <hr />
      <p>Bu isteği siz yapmadıysanız bu e-postayı dikkate almayabilirsiniz.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Failed to send reset email:", err);
    throw createHttpError(500, "Failed to send the email, please try again later.");
  }
};


export const resetPassword = async (token, newPassword) => {
  try {
    const payload = jwt.verify(token, RESET_SECRET);
    const email = payload.email;
    if (!email) throw createHttpError(401, "Token is expired or invalid.");

    const user = await UserCollection.findOne({ email });
    if (!user) throw createHttpError(404, "User not found!");

    const hashed = await bcrypt.hash(newPassword, 10);
    await UserCollection.updateOne({ _id: user._id }, { $set: { password: hashed } });

    // bu kullanıcı için tüm session sil
    await SessionCollection.deleteMany({ userId: user._id });
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      throw createHttpError(401, "Token is expired or invalid.");
    }
    throw err;
  }
};
