import { email, username, password } from '../utils/data.json';
import {
  generateUniqueEmail,
  generateUniqueName,
  generateUniqueProduct,
} from '../helpers/dataGenerator';
import {
  setupTestUser,
  cleanupTestUser,
  createProduct,
  updateProduct,
  getProduct,
  deleteProduct,
} from '../utils';
import { IProduct, NewProductPayload, TestUserSetup } from 'utils/types';
import * as dotenv from 'dotenv';
dotenv.config();

describe('Product Tests', () => {
  let setupInfo: TestUserSetup;
  let createdProduct: IProduct;
  const newEmail = generateUniqueEmail(email);
  const newUsername = generateUniqueName(username);
  const newProduct: NewProductPayload = generateUniqueProduct();
  let productToDelete: IProduct;
  let productDeleted: boolean = false; // Flag for hooks

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

    if (!productDeleted) {
      await deleteProduct(productToDelete._id.toString());
    }

    // Cleanup test user
    await cleanupTestUser(setupInfo.userId, newEmail, password);
  });

  it('should create and retrieve a product correctly', async () => {
    const productData = generateUniqueProduct();
    const createdProduct = await createProduct(productData);

    // Fetch the product to verify its creation
    const fetchedProduct = await getProduct(createdProduct._id.toString());
    expect(fetchedProduct.name).toEqual(productData.name);
    expect(fetchedProduct.price).toEqual(productData.price);
  });

  it('should update a product correctly', async () => {
    const updateData = {
      ...createdProduct,
      name: 'Updated Product Name',
      price: 250,
    };
    await updateProduct(createdProduct._id.toString(), updateData);

    // Fetch the product to verify the update
    const updatedProduct = await getProduct(createdProduct._id.toString());
    expect(updatedProduct.name).toEqual(updateData.name);
    expect(updatedProduct.price).toEqual(updateData.price);
  });

  it('should delete a product correctly', async () => {
    productToDelete = await createProduct({
      ...newProduct,
      name: 'Product to Delete',
    });
    await deleteProduct(productToDelete._id.toString());

    // Attempt to fetch the product to verify it's been deleted
    await expect(getProduct(productToDelete._id.toString())).rejects.toThrow();

    // Set the flag to true
    productDeleted = true;
  });
});
// intentional error
