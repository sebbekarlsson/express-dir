import { RequestHandler } from "express";

export const get: RequestHandler = async (_req, res) => {
  res.json({ message: 'hello world' });
}
