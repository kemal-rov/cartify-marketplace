import { email, username, password } from '../utils/data.json';
import { generateUniqueEmail, generateUniqueName, generateUniqueProduct } from '../helpers/dataGenerator';
import { setupTestUser, cleanupTestUser, createProduct, deleteProduct } from '../utils';
import { IProduct, NewProductPayload, TestUserSetup } from 'utils/types';
import * as dotenv from 'dotenv';
dotenv.config();

describe('Product Tests', () => {
  const url = process.env.BASE_URL_LOCAL;
  let setupInfo: TestUserSetup;
  let createdProduct: IProduct;
  const newEmail = generateUniqueEmail(email);
  const newUsername = generateUniqueName(username);
  const newProduct: NewProductPayload = generateUniqueProduct();

  beforeAll(async () => {
    // Setting up a new user
    setupInfo = await setupTestUser(newEmail, newUsername, password);

    createdProduct = await createProduct(newProduct);
    expect(createdProduct.name).toEqual(newProduct.name);
  });

  afterAll(async () => {
    // Cleanup created product
    if (createdProduct && createdProduct._id) {
      await deleteProduct(createdProduct._id.toString());
    }
    // Cleanup test user
    await cleanupTestUser(setupInfo.userId, newEmail, password);
  });

  it('just testing', async ()=> {
    console.log('yo yo')
    console.log(newProduct)
  })
});