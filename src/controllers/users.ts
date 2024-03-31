import express from 'express';
import { getUsers, deleteUserById, getUserById } from '../db/users';

export const getAllUsers = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.error(`There was an issue getting all users: ${error.message}`);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);

    return res.status(200).json(deletedUser).end();
  } catch (error) {
    console.error(
      `Something went wrong with deleting a user: ${error.message}`,
    );
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      console.error('No username found.');
      return res.sendStatus(400);
    }

    const user = await getUserById(id);
    user.username = username;

    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.error(`Something went wrong updating the user: ${error.message}`);
    return res.sendStatus(400);
  }
};
