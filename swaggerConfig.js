const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "NodeJS API",
    version: "1.0.0",
    description: "This is the API documentation for the Node application",
  },
  servers: [
    {
      url: "https://node-q31r.onrender.com",
      description: "Render server",
    },
  ],
  components: {
    // Define security schemes for authentication (e.g., Bearer JWT)
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    // Define reusable schema models (e.g., User schema)
    schemas: {
      User: {
        type: "object",
        required: ["username", "email", "password"],
        properties: {
          _id: {
            type: "string",
            description: "The unique identifier for the user",
          },
          username: {
            type: "string",
            description: "The username of the user",
          },
          email: {
            type: "string",
            description: "The email of the user",
          },
          firstName: {
            type: "string",
            description: "The first name of the user",
          },
          lastName: {
            type: "string",
            description: "The last name of the user",
          },
          profilePic: {
            type: "string",
            description: "The profile picture URL of the user",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Timestamp of when the user was created",
          },
        },
      },
      Item: {
        type: "object",
        required: ["name", "category", "quantity"],
        properties: {
          _id: {
            type: "string",
            description: "The unique identifier of the item",
          },
          name: {
            type: "string",
            description: "The name of the item",
          },
          description: {
            type: "string",
            description: "A description of the item",
          },
          quantity: {
            type: "number",
            description: "The quantity of the item in stock",
          },
          category: {
            type: "string",
            description: "The ID of the category this item belongs to",
          },
        },
      },
      Category: {
        type: "object",
        required: ["categoryName"],
        properties: {
          _id: {
            type: "string",
            description: "The unique identifier of the category",
          },
          categoryName: {
            type: "string",
            description: "The name of the category",
          },
        },
      },
    },
    // Define responses that can be reused
    responses: {
      UnauthorizedError: {
        description: "Unauthorized access",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Unauthorized",
                },
              },
            },
          },
        },
      },
      NotFoundError: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Resource not found",
                },
              },
            },
          },
        },
      },
      // Define other common responses like validation errors, etc.
    },
    // Define parameters that are reusable (like user ID)
    parameters: {
      userIdParam: {
        in: "path",
        name: "id",
        required: true,
        schema: {
          type: "string",
        },
        description: "The ID of the user",
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js", "./models/*.js"], // Include routes and models for API documentation
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
