import * as authService from "../services/auth.js";
import createHttpError from "http-errors";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);
    res.status(201).json({ status: 201, message: "Successfully registered a user!", data: { user } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authService.login(email, password);

    // refresh token'ı httpOnly cookie'de sakla
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ status: 200, message: "Successfully logged in an user!", data: { accessToken } });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw createHttpError(401, "No refresh token provided");

    const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ status: 200, message: "Successfully refreshed a session!", data: { accessToken } });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) await authService.logout(refreshToken);
    res.clearCookie("refreshToken");
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.sendResetEmail(email);
    res.status(200).json({ status: 200, message: "Reset password email has been successfully sent.", data: {} });
  } catch (err) {
    next(err);
  }
};


export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    res.status(200).json({ status: 200, message: "Password has been successfully reset.", data: {} });
  } catch (err) {
    next(err);
  }
};