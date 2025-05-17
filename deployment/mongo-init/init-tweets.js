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

// Create indexes for efficient querying
db.tweets.createIndex({ "userId": 1 });
db.tweets.createIndex({ "scheduledDate": 1 });
db.tweets.createIndex({ "status": 1 });