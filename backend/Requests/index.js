const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");
const express = require("express");
const serverless = require("serverless-http");
var request = require("request");

const app = express();
const client = new DynamoDBClient();
const dynamoDbClient = DynamoDBDocumentClient.from(client);

const errorMessage = "Error submitting form ";

app.use(express.json());
app.use(express.urlencoded()); // needed to handle form-data submissions

app.use((req, res, next) => {
  console.log("New request at time:", Date.now(), "to path", req.path);
  console.log("Request body:", req.body);

  // call so continues to routes
  next();
});

app.get("/events/:eventId", async function (req, res) {
  try {
    const eventId = req.params.eventId;
    if (!eventId) {
      res.status(404).json({
        result: "error",
        message: "Event not found",
      });
    } else {
      const params = {
        TableName: process.env.EVENTS_TABLE,
        Key: {
          event_id: eventId.toLowerCase(),
        },
      };

      const { Item } = await dynamoDbClient.send(new GetCommand(params));
      if (Item) {
        const {
          event_id: eventId,
          name,
          date,
          request_limit: requestLimit,
        } = Item;
        res.json({ eventId, name, date, requestLimit });
      } else {
        res.status(404).json({
          result: "error",
          message: `Could not find event with id ${eventId}`,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      result: "error",
      message: "Could not retreive event information",
    });
  }
});

app.get("/requests/:eventId", async function (req, res) {
  try {
    const eventId = req.params.eventId;

    if (!eventId) {
      res.status(404).json({
        result: "error",
        message: "Event not found",
      });
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
        ExpressionAttributeValues: { ":v0": eventId.toLowerCase() },
        Select: "SPECIFIC_ATTRIBUTES",
        ProjectionExpression: "#ap0,#ap1,#ap2",
      };

      console.log("Submitting Scan request:", params);
      const { Items } = await dynamoDbClient.send(new ScanCommand(params));
      res.json(Items);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      result: "error",
      message: "Could not retrieve requests",
    });
  }
});

app.post("/requests/:eventId", async function (req, res) {
  try {
    const eventId = req.params.eventId;
    const { songTitle, artistName, requestorName, requestNotes } = req.body;
    if (!eventId) {
      res.status(404).json({
        result: "error",
        message: "Event not found",
      });
    } else if (typeof songTitle !== "string") {
      res.status(400).json({
        result: "error",
        message: errorMessage + "(field: song title)",
      });
    } else if (typeof artistName !== "string") {
      res.status(400).json({
        result: "error",
        message: errorMessage + "(field: artist name)",
      });
    } else if (typeof requestorName !== "string") {
      res.status(400).json({
        result: "error",
        message: errorMessage + "(field: your name)",
      });
    } else if (typeof requestNotes !== "string") {
      res.status(400).json({
        result: "error",
        message: errorMessage + "(field: notes)",
      });
    } else {
      const params = {
        TableName: process.env.REQUESTS_TABLE,
        Item: {
          event_name: eventId.toLowerCase(),
          submission_timestamp: Date.now(),
          song_title: songTitle ?? "",
          artist_name: artistName ?? "",
          requestor_name: requestorName ?? "",
          notes: requestNotes ?? "",
        },
      };

      // =========================================
      // add to spotify
      // todo: remove in favor of frontend sending
      try {
        request.post(
          {
            headers: { "content-type": "application/json" },
            url: `https://t5cm4v4fol.execute-api.us-west-2.amazonaws.com/spotify/${eventId}/add_to_playlist`,
            body: {
              songTitle: songTitle,
              artistName: artistName,
            },
            json: true,
          },
          (error, response, body) => {
            console.log(
              "TEMPORARY PLAYLIST SUBMISSION RESPONSE: (status)",
              response?.statusCode,
              "| message:",
              body?.message
            );
          }
        );
      } catch (error) {
        console.log("ERROR UPLOADING REQUEST TO PLAYLIST");
      }
      // =========================================

      console.log("Submitting Put request:", params);
      await dynamoDbClient.send(new PutCommand(params));
      res.status(200).json({
        result: "success",
        message: `Thank you for your request${
          requestorName == "" ? "!" : `, ${requestorName.split(" ")[0]}!`
        }`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      result: "error",
      message: "Could not submit song request",
    });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    result: "error",
    message: "Path not found",
  });
});

module.exports.handler = serverless(app);
