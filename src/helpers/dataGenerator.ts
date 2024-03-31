import { NewProductPayload } from 'utils/types';
import { product } from '../utils/data.json';

export const generateUniqueEmail = (baseEmail: string) => {
  const timestamp = Date.now();
  const [username, domain] = baseEmail.split('@');
  return `${username}+${timestamp}@${domain}`;
};

export const generateUniqueName = (baseUsername: string) => {
  const timestamp = Date.now();
  return `${baseUsername}_${timestamp}`;
};

export const generateUniqueProduct = (): NewProductPayload => {
  const newProductName = generateUniqueName(product.name);

  const newProduct = {
    ...product, // Spread the properties of the original product object
    name: newProductName, // Overwrite the `name` property with the new name
  };

  return newProduct;
};
