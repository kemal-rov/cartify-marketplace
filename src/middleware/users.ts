import express from 'express';

export const verifyUserMatch = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const userIdFromPath = req.params.userId;
    const userId = (req as any).identity?._id.toString();

    if (!userId) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - user id is missing.' });
    } else if (userIdFromPath !== userId) {
      return res.status(403).json({
        message:
          'Forbidden - You do not have permission to access this resource.',
      });
    }

    next();
  } catch (error) {
    console.error(`Error clearing cart: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};
