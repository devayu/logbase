import { Request, Response } from "express";

export const getHealth = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
