import express from 'express';
import mongoose from 'mongoose';
import { get, merge } from 'lodash';
import { getUserBySessionToken } from '../db/users';

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id') as mongoose.Types.ObjectId | undefined;

    if (!currentUserId) {
      return res.sendStatus(403);
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.error(`Something went wrong with checking owner: ${error}`);
    return res.sendStatus(400);
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const sessionToken =
      req.cookies.AUTH_TOKEN || req.headers.authorization?.split(' ')[1];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    next();
  } catch (error) {
    console.error(`Error checking user authentication: ${error}`);
    return res.sendStatus(400);
  }
};
