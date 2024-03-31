import { axiosInstance, setupTestUser, cleanupTestUser } from '../utils';
import {
  generateUniqueEmail,
  generateUniqueName,
} from '../helpers/dataGenerator';
import { email, username, password } from '../utils/data.json';
import { TestUserSetup } from 'utils/types';

describe('User Integration Tests', () => {
  let userDeleted: boolean = false; // Flag for hooks
  let setupInfo: TestUserSetup;
  const newEmail = generateUniqueEmail(email);
  const newUsername = generateUniqueName(username);

  beforeAll(async () => {
    setupInfo = await setupTestUser(newEmail, newUsername, password);
  });

  afterAll(async () => {
    if (!userDeleted) {
      await cleanupTestUser(setupInfo.userId, newEmail, password);
    }
  });

  it('should list all users for authenticated users', async () => {
    const response = await axiosInstance.get(
      `${process.env.BASE_URL_LOCAL}/users`,
    );

    expect(response.status).toBe(200);
  });

  it('should not list users for unauthenticated requests', async () => {
    // Temporarily remove the cookie jar to simulate an unauthenticated request
    const originalJar = axiosInstance.defaults.jar;
    axiosInstance.defaults.jar = undefined;

    await expect(
      axiosInstance.get(`${process.env.BASE_URL_LOCAL}/users`),
    ).rejects.toThrow();

    // Restore the original cookie jar
    axiosInstance.defaults.jar = originalJar;
  });

  it('should allow a user to delete their own account', async () => {
    const deleteResponse = await axiosInstance.delete(
      `${process.env.BASE_URL_LOCAL}/users/${setupInfo.userId}`,
    );
    expect(deleteResponse.status).toBe(200);
    userDeleted = true;
  });

  it("should not allow a user to delete another user's account", async () => {
    // Attempt to delete another user (assuming anotherUserId exists and is different)
    const anotherUserId = 'someOtherUserId';
    await expect(
      axiosInstance.delete(
        `${process.env.BASE_URL_LOCAL}/users/${anotherUserId}`,
      ),
    ).rejects.toThrow();
  });
});
