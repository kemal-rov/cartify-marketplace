# Cartify Marketplace

Cartify Marketplace is a safety-driven e-commerce platform.

It is engineered with: 
- **Typescript** for robust back-end development, 
- **Node.js** for server-side operations, 
- **Express.js** for efficient API hosting and 
- **MongoDB** as a noSQL solution for secure data storage.

Designed with security and scalability in mind, Cartify Marketplace utilizes environment variables for data safety, best practices in directory structure, type safety with TypeScript, and encryption techniques to protect user data.

## Features

- **Secure Authentication:** Utilizes salted passwords and encryption with the crypto package for enhanced security.
- **RESTful API Design:** Offers a clean and intuitive API for user management, including registration, login, and user profile operations.
- **Environment Variable Integration:** Ensures sensitive configuration is managed securely outside of the codebase, either in Github environment variables, or locally in `.env`.
- **Structured Directory Setup:** Adopts best practices for project organization to enhance maintainability.
- **Comprehensive Controllers and Routing:** Includes middleware in `src/middleware` for authentication (isAuthenticated) and authorization (isOwner), ensuring secure access to resources.
- **Utility Helpers:** Facilitates common tasks such as generating random bytes for tokens and password encryption in `src/helpers`.

## Getting Started

### Prerequisites
- **Node.js** (version 18.x or above recommended)
- **MongoDB** (version 4.x or above recommended)
- **Postman** for API testing

> **Warning**: To obtain the necessary `.env` variables for setting up this project, please contact the project maintainer `kemal-rov` directly.


### Installation 
Navigate to your projects folder and clone this project with SSH key:

```
cd /path/to/your/projects
git clone git@github.com:kemal-rov/cartify-marketplace.git
```

From project root folder, use the node package manager [npm](https://nodejs.org/en/download) to install project dependencies.

```bash
npm install
```

### MongoDB Setup and Limitation

While Cartify Marketplace is built using MongoDB for its database needs, due to security and privacy considerations, the project's MongoDB cluster details are not shared publicly. This means that to run and use Cartify Marketplace locally or in your own deployment, **you will need to set up your own MongoDB instance.**

#### Setting Up Your Own MongoDB Database

1. **_Create a MongoDB Cluster:_** If you don't already have a MongoDB database, you can create one for free at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/). Follow the instructions to set up a new cluster.

2. **_Configure Database Access:_** Ensure that your MongoDB cluster is accessible from your development or deployment environment by configuring the network access settings.

3. **_Create a Database User:_** For security purposes, create a dedicated database user for your application with the necessary permissions.

4. **_Update Your .env File:_** Once you have your MongoDB cluster set up, update the .env file in your Cartify Marketplace project with your MongoDB connection string. The relevant .env variable is typically named something like MONGO_URL. For example:

```typescript
// constants.ts

export const MONGO_URL = `mongodb+srv://${yourClusterName}:${process.env.YOUR_SECRET_KEY}@cartify ...`
```

### Running the Application

To start the server, run:


```bash
npm start
```

This will launch the Cartify Marketplace backend on the specified port, ready to accept requests.

### Testing

> to be added

> **Important warning:** For the application to connect to your MongoDB database correctly, you must provide your own MongoDB URI in the .env file and use it in your constants as shown above. Failure to do so will result in database connection errors. If you need assistance with setting up your MongoDB cluster or configuring your project, feel free to reach out to the project maintainer.

## API Documentation

Postman collection is provided to help you get started with the API quickly. You can [download the Postman collection here](./postman/Cartify.postman_collection.json).

To use this collection:
1. Download [Postman](https://www.postman.com/downloads/).
2. Import the collection by clicking on "Import" > "File" > "Upload Files" and select the downloaded collection file.
3. Start exploring the API!

## Features Overview

Cartify Marketplace offers a wide range of features designed to enhance the e-commerce experience for both users and administrators. Below are the highlights of product management and cart functionalities.

### Products

- **Product Creation:** Allows administrators to add new products to the marketplace.
- **Product Updates:** Admins can update existing product details to keep the catalog up-to-date.
- **Product Deletion:** Products can be removed from the marketplace when they are no longer available.
- **Product Browsing:** Users can browse through the catalog of products, filtering by categories, price ranges, and more.

#### Product API Endpoints

- POST `/products`: Create a new product.
- GET `/products`: Retrieve a list of products.
- GET `/products?category=${categoryName}`: Retrieve a list of products of a particular category.
- GET `/products/:productId`: Get detailed information about a specific product.
- PATCH `/products/:productId`: Update an existing product.
- DELETE `/products/:productId`: Remove a product from the marketplace.


### Cart

- **Add Items to Cart:** Users can add products to their shopping cart, specifying the desired quantity.
- **Update Item Quantities:** Users can adjust the quantity of items in their cart, allowing for flexibility before checkout.
- **Remove Items from Cart:** Specific items can be removed from the cart, providing users control over their potential purchases.
- **Clear Cart:** Users have the option to clear their cart, effectively removing all items in preparation for a new shopping session.
- **View Cart:** Users can view the current contents of their cart, including item details and quantities.


#### Cart API Endpoints

- POST `/users/:userId/cart/items`: Add an item to the cart.
- PATCH `/users/:userId/cart/items/:productId`: Update the quantity of an existing cart item.
- DELETE `/users/:userId/cart/items/:productId`: Remove an item from the cart.
- DELETE `/users/:userId/cart`: Clear the cart of all items.
- GET `/users/:userId/cart`: Retrieve the contents of the cart.

### Orders

The Orders feature allows users to process their shopping carts into finalized purchases, providing options for tracking and managing orders post-creation.

- **Create Order:** Converts the contents of a user's cart into an order, initializing the purchase process.
- **View Order Details:** Users can access detailed information about their orders, including items purchased, quantities, and status.
- **Order Cancellation:** Provides the option for users to cancel an order before it is shipped.
- **Order Updates:** Allows admins to update the status of an order, such as marking it as shipped.
#### Order API endpoints

- POST `/orders/create`: Create a new order object for the particular user.
- GET `/orders/:orderId`: Get order based on orderId.
- GET `/orders`: Get all orders for authenticated user.
- PATCH `/orders/:orderId/cancel`: Update the status of an order to "cancelled".
- PATCH `/orders/:orderId/cancel`: Update the status of an order to "shipped".

### Payments

The Payments feature facilitates secure financial transactions within the Cartify Marketplace, offering users a streamlined process for completing purchases and administrators a method to manage these transactions.

- ***Process Payment:** Enables users to securely pay for their orders, supporting various payment methods for convenience.
- **View Payment Details:** Allows both users and administrators to retrieve detailed information about individual payment transactions.

#### Payment API Endpoints
- POST `/payments`: Initiates a payment process for an order. This endpoint typically requires details such as order ID, payment method, and transaction amount.
- GET `/payments/:paymentId`: Retrieves detailed information about a specific payment transaction by its ID.

#### Implementation Notes

- **Security and Authentication:** Both product and cart functionalities implement strict authentication and authorization checks to ensure secure access to sensitive operations.
- **Scalability:** Designed with scalability in mind, the marketplace supports a growing catalog of products and user base without compromising performance.
- **User Experience:** The seamless integration between product browsing and cart management offers users a fluid and intuitive shopping experience.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

All rights reserved.