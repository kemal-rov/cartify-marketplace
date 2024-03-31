import express from 'express';
import { getUserBySessionToken } from '../db/users';
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  productExistsByName,
  createProduct,
  updateProductById,
  deleteProductById,
} from '../db/products';

export const getProducts = async (
  req: express.Request,
  res: express.Response,
) => {
  const { category } = req.query;

  try {
    let products;
    if (typeof category === 'string' && category.trim()) {
      products = await getProductsByCategory(category.trim());
    } else {
      products = await getAllProducts();
    }

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    return res.status(200).json(products).end();
  } catch (error) {
    console.error(`Failed to retrieve products: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductDetails = async (
  req: express.Request,
  res: express.Response,
) => {
  const { id } = req.params;

  try {
    const product = await getProductById(id);

    if (!product) {
      console.error('Product not found');
      return res.sendStatus(404);
    }

    return res.status(200).json(product).end();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const addProduct = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const sessionToken = req.cookies.AUTH_TOKEN;

    if (!sessionToken) {
      return res.status(403).json({ message: 'Session token is required' });
    }

    const user = await getUserBySessionToken(sessionToken);

    if (!user) {
      return res.status(403).json({ message: 'Invalid session token' });
    }

    const { name, description, price, stock, categories, images } = req.body;

    if (
      !name ||
      !description ||
      typeof price !== 'number' ||
      typeof stock !== 'number'
    ) {
      console.error(
        'Name, description is missing or price, stock is not a number',
      );
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    const exists = await productExistsByName(name);
    if (exists) {
      return res.status(409).json({ message: 'Product already exists' });
    }

    const newProduct = await createProduct({
      name,
      description,
      price,
      stock,
      categories,
      images,
      created_by: user._id,
    });

    return res.status(201).json(newProduct).end();
  } catch (error) {
    console.error(`Failed to add product: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProduct = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const sessionToken = req.cookies.AUTH_TOKEN;

    if (!sessionToken) {
      return res.status(403).json({ message: 'Session token is required' });
    }

    const user = await getUserBySessionToken(sessionToken);

    if (!user) {
      return res.status(403).json({ message: 'Invalid session token' });
    }

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.created_by.equals(user._id)) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to update this product' });
    }

    const { name, description, price, stock, categories, images } = req.body;

    const updatedProduct = await updateProductById(id, {
      name,
      description,
      price,
      stock,
      categories,
      images,
    });

    return res.status(200).json(updatedProduct).end();
  } catch (error) {
    console.error(`Something went wrong updating product: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProduct = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { id } = req.params;
    const sessionToken = req.cookies.AUTH_TOKEN;

    if (!sessionToken) {
      return res.status(403).json({ message: 'Session token is required' });
    }

    const user = await getUserBySessionToken(sessionToken);

    if (!user) {
      return res.status(403).json({ message: 'Invalid session token' });
    }

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.created_by.equals(user._id)) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to delete this product' });
    }

    await deleteProductById(id);

    return res.status(204).send().end();
  } catch (error) {
    console.error(`Something went wrong deleting product: ${error.message}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
