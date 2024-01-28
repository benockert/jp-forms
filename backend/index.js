const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const REQUESTS_TABLE = process.env.REQUESTS_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());
app.use(express.urlencoded()); // needed to handle form-data submissions

app.get("/requests", async function (req, res) {
  const params = {
    TableName: REQUESTS_TABLE,
    Limit: 50,
    FilterExpression: "#n0 = :v0",
    ExpressionAttributeNames: {
      "#n0": "event_name",
      "#ap0": "artist_name",
      "#ap1": "requestor_name",
      "#ap2": "song_title",
    },
    ExpressionAttributeValues: { ":v0": process.env.EVENT_NAME },
    Select: "SPECIFIC_ATTRIBUTES",
    ProjectionExpression: "#ap0,#ap1,#ap2",
  };

  try {
    console.log("Submitting Scan request: ", params);
    const { Items } = await dynamoDbClient.send(new ScanCommand(params));
    res.json(Items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive requests" });
  }
});

app.post("/requests", async function (req, res) {
  const body = req.body;
  console.log({ body });

  const { songTitle, artistName, requestorName } = req.body;
  if (typeof songTitle !== "string") {
    res.status(400).json({ error: '"songTitle" must be a string' });
  } else if (typeof artistName !== "string") {
    res.status(400).json({ error: '"artistName" must be a string' });
  } else if (typeof requestorName !== "string") {
    res.status(400).json({ error: '"requestorName" must be a string' });
  } else {
    const params = {
      TableName: REQUESTS_TABLE,
      Item: {
        event_name: process.env.EVENT_NAME,
        submission_timestamp: Date.now(),
        song_title: songTitle ?? "",
        artist_name: artistName ?? "",
        requestor_name: requestorName ?? "",
      },
    };

    try {
      console.log("Submitting Put request: ", params);
      await dynamoDbClient.send(new PutCommand(params));
      res.json({
        message: `Thank you for your submission${
          requestorName == "" ? ":" : `, ${requestorName}:`
        } ${songTitle} by ${artistName}`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Could not submit request" });
    }
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
