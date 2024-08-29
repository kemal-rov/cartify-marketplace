import { axiosInstance, setupTestUser, cleanupTestUser } from "../utils";
import { generateUniqueEmail, generateUniqueName } from "helpers/dataGenerator";
import { email, username, password } from '../utils/data.json';
import { TestUserSetup } from "utils/types";
import { PaymentMethod } from "utils/enums";

describe('Payment Tests', () => {
    let setupInfo: TestUserSetup;
    let paymentId: string;
    let userDeleted: boolean = false;

    const newEmail = generateUniqueEmail(email);
    const newUsername = generateUniqueName(username);

    beforeAll(async () => {
        setupInfo = await setupTestUser(newEmail, newUsername, password)
    });

    afterAll(async () => {
        if (!userDeleted) {
            await cleanupTestUser(setupInfo.userId, newEmail, password);
        }
    });

    it('should create a payment for test user', async () => {
        const paymentData = {
            orderId: 'testId',
            amount: 100,
            currency: 'USD',
            PaymentMethod: 'credit_card',
        };

        const response = await axiosInstance.post(
            `${process.env.BASE_URL_LOCAL}/payments/create`,
            paymentData,
        );

        expect(response.status).toBe(201);
        paymentId = response.data.paymentId;
    });
})