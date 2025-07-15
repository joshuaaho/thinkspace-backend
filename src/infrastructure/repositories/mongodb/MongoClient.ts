import { MongoClient } from "mongodb";
import dotenv from "dotenv";

import { DomainEvents } from "@domain/events/DomainEvents";
import EntityId from "@domain/core/EntityId";

dotenv.config({ path: `.env.${process.env.APP_ENV}` });

const connectionString = process.env.MONGODB_URI || "mongodb://localhost:27017";

const client = await new MongoClient(connectionString).connect();

const db = client.db("thinkspace");

const messageCollection = await db.createCollection("messages");

const commentCollection = await db.createCollection("comments", {
  changeStreamPreAndPostImages: { enabled: true },
});

const postCollection = await db.createCollection("posts", {
  changeStreamPreAndPostImages: { enabled: true },
});

const messageChangeStream = messageCollection.watch([
  {
    $project: {
      "fullDocument.id": 1,
      operationType: 1,
    },
  },
]);

const commentChangeStream = commentCollection.watch([], {
  fullDocument: "updateLookup",
  fullDocumentBeforeChange: "required",
});
const postChangeStream = postCollection.watch([], {
  fullDocument: "updateLookup",
  fullDocumentBeforeChange: "required",
});
const dispatchEventsCallback = (id: string) => {
  const aggregateId = EntityId.create(id);

  DomainEvents.dispatchEventsForAggregate(aggregateId);
};
messageChangeStream.on("change", (change: any) => {
  switch (change.operationType) {
    case "insert":
      dispatchEventsCallback(change.fullDocument.id);
      break;
  }
});

commentChangeStream.on("change", (change: any) => {
  switch (change.operationType) {
    case "insert":
      dispatchEventsCallback(change.fullDocument.id);
      break;
    case "delete":
      dispatchEventsCallback(change.fullDocumentBeforeChange.id);
      break;
    case "replace":
      dispatchEventsCallback(change.fullDocument.id);
      break;
  }
});

postChangeStream.on("change", (change: any) => {
  switch (change.operationType) {
    case "insert":
      dispatchEventsCallback(change.fullDocument.id);
      break;
    case "delete":
      dispatchEventsCallback(change.fullDocumentBeforeChange.id);
      break;
    case "replace":
      dispatchEventsCallback(change.fullDocument.id);
      break;
  }
});

export default db;
