import mongoose from "mongoose";
import { tagSchema } from "./models/tag";
import { noteSchema } from "./models/note";
import { logger } from "../utils/logger";

const MONGO_URL = "mongodb://localhost:27017/note-taking";

const connectMongoose = () => {
  mongoose.connect(MONGO_URL, {}, (err) => {
    if (err) {
      logger.error("Error while connecting to DB", err);
    }
  });
};

let db = mongoose.connection;

db.on("connecting", () => {
  logger.info("Trying to connect to MongoDB");
});

db.on("connected", function () {
  logger.info("Connected to MongoDB successfully");
});

db.once("open", function () {
  logger.info("MongoDB connection opened");
});

db.on("reconnected", function () {
  logger.warn("MongoDB reconnected");
});

db.on("disconnected", function () {
  logger.warn("MongoDB disconnected, retrying again in 5 seconds");
  setTimeout(connectMongoose, 5000);
});

connectMongoose();

const Tags = mongoose.model("tags", tagSchema);
const Notes = mongoose.model("notes", noteSchema);

export { Tags, Notes };