const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: "*"});
const axios = require("axios");
require("dotenv").config();

admin.initializeApp();
const db = admin.firestore();

exports.askQuestion = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method === "OPTIONS") {
      // Handle preflight request
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      return res.status(204).send(""); // No Content
    }

    if (req.method !== "POST") {
      res.set("Access-Control-Allow-Origin", "*");
      return res.status(405).send("Method Not Allowed");
    }

    const userQuestion = req.body.question;
    if (!userQuestion) {
      res.set("Access-Control-Allow-Origin", "*");
      return res.status(400).json({error: "Question is required"});
    }

    try {
      // Create a structured message array for OpenAI API with system context
      const messages = [
        {
          role: "system",
          content: `You are a helpful assistant 
        that always categorizes answers into 
        one of the alchemical elements: 
                  earth, water, air, fire, or aether. 
                  Provide advice that corresponds to one of these elements 
                  and make sure to include a tag indicating the relevant element.`,
        },

        {
          role: "user",
          content: userQuestion,
        },
      ];

      // Send the question to OpenAI API with the alchemical framework context
      const openaiResponse = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4",
            messages: messages,
          },
          {
            headers: {
              "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
          },
      );

      const gptAnswer = openaiResponse.data.choices[0].message.content;

      // Extract the alchemical element tag from the answer (if included)
      const tagMatch = gptAnswer.match(/\[.*?\]/);
      const alchemyTag = tagMatch ? tagMatch[0] : "Uncategorized";

      // Save question, answer, and element tag to Firestore
      await db.collection("questions").add({
        question: userQuestion,
        answer: gptAnswer,
        tag: alchemyTag,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.set("Access-Control-Allow-Origin", "*");
      return res.status(200).json({answer: gptAnswer});
    } catch (error) {
      res.set("Access-Control-Allow-Origin", "*");
      console.error("Error interacting with OpenAI:", error);
      return res.status(500).json({error: "Internal Server Error"});
    }
  });
});

exports.savedAnswers = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      return res.status(204).send("");
    }

    if (req.method !== "GET") {
      res.set("Access-Control-Allow-Origin", "*");
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const snapshot = await db.collection("questions").get();
      const savedAnswers = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        savedAnswers.push({
          category: data.tag,
          answer: data.answer,
          question: data.question,
        });
      });

      res.set("Access-Control-Allow-Origin", "*");
      return res.status(200).json(savedAnswers);
    } catch (error) {
      res.set("Access-Control-Allow-Origin", "*");
      console.error("Error fetching saved answers:", error);
      return res.status(500).json({error: "Internal Server Error"});
    }
  });
});
