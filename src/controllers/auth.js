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
    // set refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: "lax" });
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
    res.cookie("refreshToken", newRefreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: "lax" });
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
