import express from 'express';
import { IExtendedRequest } from 'utils/types';

export const verifyUserMatch = async (
  req: IExtendedRequest,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const userIdFromPath = req.params.userId;
    const userId = req.identity?._id.toString();

    if (!userId) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - user id is missing.' });
    } else if (userIdFromPath !== userId) {
      return res.status(403).json({
        message: 'Forbidden',
      });
    }

    next();
  } catch (error) {
    console.error(`Error clearing cart: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};
