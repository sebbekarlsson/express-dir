import { RequestHandler } from "express";

export const get: RequestHandler = (req, res) => {
  return res.json(req.params);
}
