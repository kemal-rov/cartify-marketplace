import express from 'express';
import { getUserByEmail, createUser } from '../db/users';
import { random, authentication } from '../helpers';
import { IExtendedRequest, UserAuthentication } from 'utils/types';

export const login = async (req: IExtendedRequest, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.error('Email and/or password invaild.');
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      `+authentication.salt +authentication.password`,
    );

    if (!user) {
      console.error('There is no user with that email.');
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password != expectedHash) {
      return res.sendStatus(403);
    }

    const salt = random();

    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString(),
    );

    await user.save();

    res.cookie('AUTH_TOKEN', user.authentication.sessionToken, {
      domain: 'localhost',
      path: '/',
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.error(`There was an error with the user logging in: ${error}`);
    return res.sendStatus(400);
  }
};

export const logout = async (req: express.Request, res: express.Response) => {
  try {
    const user = (req as IExtendedRequest).identity;

    user.authentication.sessionToken = ''; // Invalidate token
    await user.save();

    // set expires to Unix epoch
    res.cookie('AUTH_TOKEN', '', {
      expires: new Date(0),
      domain: 'localhost',
      path: '/',
    });

    return res.status(200).json({
      user: user.username,
      message: 'Logout successful',
      timestamp: new Date(),
    });
  } catch (error) {
    console.error(`There was an error logging out: ${error}`);
    return res
      .status(500)
      .json({ message: 'A server error occurred during logout.' });
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      console.error('One of the mandatory fields is missing!');
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      console.error(
        'There already is an existing user with this email address!',
      );
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.error(`Something went wrong with registration: ${error}`);
    return res.sendStatus(400);
  }
};
