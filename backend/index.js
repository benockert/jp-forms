const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  BatchGetCommand,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const REQUESTS_TABLE = process.env.REQUESTS_TABLE;
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

app.use(express.json());

app.get("/requests", async function (req, res) {
  const params = {
    RequestItems: {
      [REQUESTS_TABLE]: {
        Keys: [
          {
            event_name: process.env.EVENT_NAME,
          },
        ],
        ProjectionExpression: "song_name, artist_name, requestor_name",
      },
    },
  };

  try {
    console.log("Submitting BatchGet request: ", params);
    const {
      Responses: { [REQUESTS_TABLE]: Items },
    } = await dynamoDbClient.send(new BatchGetCommand(params));

    // var destructuredItemArray = Items.map((item) => {
    //   const {
    //     song_name: { S: song },
    //   } = item;
    //   const {
    //     artist_name: { S: artist },
    //   } = item;
    //   const {
    //     requestor_name: { S: requestedBy },
    //   } = item;
    //   console.log({ song, artist, requestedBy });
    //   return { song, artist, requestedBy };
    // });

    res.json(Items);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive requests" });
  }
});

app.post("/requests", async function (req, res) {
  const { songName, artistName, requestorName } = req.body;
  if (typeof songName !== "string") {
    res.status(400).json({ error: '"songName" must be a string' });
  } else if (typeof artistName !== "string") {
    res.status(400).json({ error: '"artistName" must be a string' });
  } else if (typeof requestorName !== "string") {
    res.status(400).json({ error: '"requestorName" must be a string' });
  }

  const params = {
    TableName: REQUESTS_TABLE,
    Item: {
      event_name: process.env.EVENT_NAME,
      song_name: songName ?? "",
      artist_name: artistName ?? "",
      requestor_name: requestorName ?? "",
      submission_timestamp: Date.now(),
    },
  };

  try {
    console.log("Submitting Put request: ", params);
    await dynamoDbClient.send(new PutCommand(params));
    res.json({
      message: `Thank you for your submission${
        requestorName == "" ? ":" : `, ${requestorName}:`
      } ${songName} by ${artistName}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not submit request" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
