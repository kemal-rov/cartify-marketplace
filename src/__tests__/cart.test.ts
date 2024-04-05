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
  deleteProduct,
  createCart,
  getCart,
  addItemToCart,
  updateQuantity,
  removeCartItem,
  clearUserCart,
} from '../utils';
import {
  ICart,
  ICartItem,
  IProduct,
  NewProductPayload,
  TestUserSetup,
} from 'utils/types';
import * as dotenv from 'dotenv';
import { userInfo } from 'os';
dotenv.config();

describe('Product Tests', () => {
  let setupInfo: TestUserSetup;
  let createdProduct: IProduct;
  const newEmail = generateUniqueEmail(email);
  const newUsername = generateUniqueName(username);
  const newProduct: NewProductPayload = generateUniqueProduct();
  let cartToDelete: ICart;
  let cartDeleted: boolean = false; // Flag for hooks
  let createdProductId: string;

  beforeAll(async () => {
    // Setting up a new user
    setupInfo = await setupTestUser(newEmail, newUsername, password);

    createdProduct = await createProduct(newProduct);
    createdProductId = createdProduct._id.toString();
    expect(createdProduct.name).toEqual(newProduct.name);
  });

  afterAll(async () => {
    // Cleanup created product
    if (createdProduct && createdProduct._id) {
      await deleteProduct(createdProductId);
    }

    if (!cartDeleted) {
      console.log(`cart to delete: `, cartToDelete);
      await deleteProduct(cartToDelete._id.toString());
    }

    // Cleanup test user
    await cleanupTestUser(setupInfo.userId, newEmail, password);
  });

  it('cart should not exist before user initiates it', async () => {
    await expect(getCart(setupInfo.userId)).rejects.toMatchObject({
      response: {
        status: 404,
        data: {
          message: 'Cart not found',
        },
      },
    });
  });

  it('should create a cart for user', async () => {
    const cart = await createCart(setupInfo.userId);

    if ('user' in cart) {
      expect(cart).toBeDefined();
      expect(cart.user).toEqual(setupInfo.userId);
    }
  });

  it('should not create a cart for user if it already exists', async () => {
    const duplicatedCart = await createCart(setupInfo.userId);

    if ('message' in duplicatedCart) {
      expect(duplicatedCart.message).toContain(
        'Cart already exists for this user',
      );
    }
  });

  it('should not be allowed to fetch other user cart', async () => {
    await expect(getCart('incorrectId')).rejects.toMatchObject({
      response: {
        status: 403,
        data: {
          message: 'Forbidden',
        },
      },
    });
  });

  it('should successfully fetch existing cart for user', async () => {
    const response = await getCart(setupInfo.userId);
    expect(response).toBeDefined();

    if ('message' in response) {
      fail(`Expected cart, received error message: ${response.message}`);
    }

    if ('cart' in response && 'items' in response) {
      expect(response.user).toEqual(setupInfo.userId);
      // Because cart is initially empty
      expect(response.items).toEqual([]);
    }
  });

  it('should add existing product to cart', async () => {
    const cartItemPayload = { productId: createdProductId, quantity: 1 };
    const cart = await addItemToCart(setupInfo.userId, cartItemPayload);

    expect(cart).toBeDefined();
    expect(cart.items.length).toBe(1);
    expect(cart.items[0].productId).toEqual(createdProductId);
    expect(cart.items[0].quantity).toEqual(1);
  });

  it('should update item quantity in cart', async () => {
    const newQuantity = 3;
    const cart = await updateQuantity(setupInfo.userId, createdProductId, {
      quantity: newQuantity,
    });
    expect(cart).toBeDefined();

    const item: ICartItem = cart.items[0];
    expect(item).toBeDefined();
    expect(item.quantity).toEqual(newQuantity);
  });

  it('should remove existing product from cart', async () => {
    // Make sure the product is already in cart
    const response = await getCart(setupInfo.userId);

    if ('message' in response) {
      fail(`Expected cart, received error message: ${response.message}`);
    }

    if ('items' in response) {
      // Check if the response is ICart
      const itemToRemove: ICartItem = response.items[0];
      expect(itemToRemove.productId).toEqual(createdProductId);

      // Proceed with removing the item
      console.log(await getCart(setupInfo.userId), createdProductId);
      const cart = await removeCartItem(setupInfo.userId, createdProductId);
      expect(cart).toBeDefined();
      expect(cart.items).not.toContainEqual(
        expect.objectContaining({ productId: createdProductId }),
      );
    } else {
      // If the response is MessageResponse, fail the test with the message
      fail(`Expected cart, received error message: ${response}`);
    }
  });

  it('should clear cart (remove it)', async () => {
    const clearCart = await clearUserCart(setupInfo.userId);
    expect(clearCart.message).toContain('Cart cleared successfully');

    cartDeleted = true;
  });
});
