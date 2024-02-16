import express from 'express';
import { 
    getAllProducts, 
    getProductById, 
    getProductsByCategory, 
    productExistsByName,
    createProduct } from '../db/products'


export const getProducts = async (req: express.Request, res: express.Response) => {
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
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getProductDetails = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;

    try {
        const product = await getProductById(id);

        if (!product) {
            console.error('Product not found');
            return res.sendStatus(404);
        }

        return res.status(200).json(product).end();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const addProduct = async (req: express.Request, res: express.Response) => {
    const { name, description, price, stock, categories, images } = req.body;

    if (!name || !description || typeof price !== 'number' || typeof stock !== 'number') {
        console.error('Name, description is missing or price, stock is not a number')
        return res.status(400).json({ message: "Missing or invalid fields" });
    }

    try {
        // Check if the product already exists
        const exists = await productExistsByName(name);
        if (exists) {
            return res.status(409).json({ message: "Product already exists" });
        }

        // Create the new product if it doesn't exist
        const newProduct = await createProduct({ name, description, price, stock, categories, images });

        return res.status(201).json(newProduct);
    } catch (error) {
        console.error(`Failed to add product: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};