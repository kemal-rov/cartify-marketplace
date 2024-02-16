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

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

All rights reserved.