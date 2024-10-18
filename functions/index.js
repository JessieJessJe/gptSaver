const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
require('dotenv').config();

admin.initializeApp();
const db = admin.firestore();

exports.askQuestion = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const userQuestion = req.body.question;
  if (!userQuestion) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: userQuestion }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const gptAnswer = openaiResponse.data.choices[0].message.content;

    await db.collection('questions').add({
      question: userQuestion,
      answer: gptAnswer,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ answer: gptAnswer });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
