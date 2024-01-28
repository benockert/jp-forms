const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");

const app = express();
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());
app.use(express.urlencoded()); // needed to handle form-data submissions

app.get("/events/:eventId", async function (req, res) {
  try {
    const eventId = req.params.eventId;
    if (!eventId) {
      res.status(404).json({ error: "Event not found" });
    } else {
      const params = {
        TableName: process.env.EVENTS_TABLE,
        Key: {
          event_id: eventId,
        },
      };

      const { Item } = await dynamoDbClient.send(new GetCommand(params));
      if (Item) {
        const { event_id: eventId, name, date } = Item;
        res.json({ eventId, name, date });
      } else {
        res
          .status(404)
          .json({ error: `Could not find event with id ${eventId}` });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive event information" });
  }
});

// https://requests.jaminproductions.com/api/v1/requests/BentleyGala2024
// https://requests.jaminproductions.com/BentleyGala2024
app.get("/requests/:eventId", async function (req, res) {
  try {
    const eventId = req.params.eventId;

    if (!eventId) {
      res.status(404).json({ error: "Event not found" });
    } else {
      const params = {
        TableName: process.env.REQUESTS_TABLE,
        Limit: 50,
        FilterExpression: "#n0 = :v0",
        ExpressionAttributeNames: {
          "#n0": "event_name",
          "#ap0": "artist_name",
          "#ap1": "requestor_name",
          "#ap2": "song_title",
        },
        ExpressionAttributeValues: { ":v0": eventId },
        Select: "SPECIFIC_ATTRIBUTES",
        ProjectionExpression: "#ap0,#ap1,#ap2",
      };

      console.log("Submitting Scan request: ", params);
      const { Items } = await dynamoDbClient.send(new ScanCommand(params));
      res.json(Items);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve requests" });
  }
});

app.post("/requests/:eventId", async function (req, res) {
  try {
    const eventId = req.params.eventId;
    const { songTitle, artistName, requestorName, eventName } = req.body;
    if (!eventId) {
      res.status(404).json({ error: "Event not found" });
    } else if (typeof songTitle !== "string") {
      res.status(400).json({ error: '"songTitle" must be a string' });
    } else if (typeof artistName !== "string") {
      res.status(400).json({ error: '"artistName" must be a string' });
    } else if (typeof requestorName !== "string") {
      res.status(400).json({ error: '"requestorName" must be a string' });
    } else {
      const params = {
        TableName: process.env.REQUESTS_TABLE,
        Item: {
          event_name: eventId,
          submission_timestamp: Date.now(),
          song_title: songTitle ?? "",
          artist_name: artistName ?? "",
          requestor_name: requestorName ?? "",
        },
      };

      console.log("Submitting Put request: ", params);
      await dynamoDbClient.send(new PutCommand(params));
      res.json({
        message: `Thank you for your request${
          requestorName == "" ? ":" : `, ${requestorName.split(" ")[0]}!`
        } ${songTitle} by ${artistName}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not submit song request" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Path not Found",
  });
});

module.exports.handler = serverless(app);
