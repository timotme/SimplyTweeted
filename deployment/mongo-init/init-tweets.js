db = db.getSiblingDB('simplyTweeted');

// Create tweets collection with schema validation
db.createCollection('tweets', {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["userId", "content", "scheduledDate", "community", "status", "createdAt"],
         properties: {
            userId: {
               bsonType: "string",
               description: "User ID who created the tweet - required"
            },
            content: {
               bsonType: "string",
               description: "Content of the tweet - required"
            },
            scheduledDate: {
               bsonType: "date",
               description: "Date when the tweet is scheduled to be posted - required"
            },
            community: {
               bsonType: "string",
               description: "Community the tweet belongs to - required"
            },
            status: {
               enum: ["scheduled", "posted", "failed"],
               description: "Status of the tweet - required"
            },
            createdAt: {
               bsonType: "date",
               description: "Timestamp when the tweet was created - required"
            },
            updatedAt: {
               bsonType: "date",
               description: "Timestamp when the tweet was last updated"
            }
         }
      }
   }
});

// Create accounts collection with schema validation
db.createCollection('accounts', {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["userId", "username", "provider", "providerAccountId", "access_token", "refresh_token", "expires_at", "expires_in", "token_type", "scope", "createdAt"],
         properties: {
            userId: {
               bsonType: "string",
               description: "User ID for the account - required"
            },
            username: {
               bsonType: "string",
               description: "Username of the account - required"
            },
            provider: {
               bsonType: "string",
               description: "OAuth provider - required"
            },
            providerAccountId: {
               bsonType: "string",
               description: "Provider account ID - required"
            },
            access_token: {
               bsonType: "string",
               description: "Access token - required"
            },
            refresh_token: {
               bsonType: "string",
               description: "Refresh token - required"
            },
            expires_at: {
               bsonType: "number",
               description: "Expiration timestamp - required"
            },
            expires_in: {
               bsonType: "number",
               description: "Token lifetime in seconds - required"
            },
            token_type: {
               bsonType: "string",
               description: "Type of token - required"
            },
            scope: {
               bsonType: "string",
               description: "OAuth scope - required"
            },
            createdAt: {
               bsonType: "date",
               description: "Timestamp when the account was created - required"
            },
            updatedAt: {
               bsonType: "date",
               description: "Timestamp when the account was last updated"
            }
         }
      }
   }
});

// Create indexes for efficient querying
db.tweets.createIndex({ "userId": 1 });
db.tweets.createIndex({ "scheduledDate": 1 });
db.tweets.createIndex({ "status": 1 });

// Create indexes for efficient querying on accounts
db.accounts.createIndex({ "userId": 1 });
db.accounts.createIndex({ "providerAccountId": 1 });