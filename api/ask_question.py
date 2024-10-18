import asyncio
import aiohttp

async def fetch_openai_response(question):
    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        'Authorization': f'Bearer {os.getenv("OPENAI_API_KEY")}',
        'Content-Type': 'application/json',
    }
    payload = {
        "model": "gpt-4",
        "messages": [{"role": "user", "content": question}],
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=headers, json=payload) as response:
            response_data = await response.json()
            return response_data['choices'][0]['message']['content']

# Example use in the handler
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
from http.server import BaseHTTPRequestHandler
from dotenv import load_dotenv
import asyncio

# Load environment variables from .env file (for local development)
load_dotenv()

# Firebase initialization
if not firebase_admin._apps:
    cred = credentials.Certificate({
        "type": os.getenv('FIREBASE_TYPE'),
        "project_id": os.getenv('FIREBASE_PROJECT_ID'),
        "private_key": os.getenv('FIREBASE_PRIVATE_KEY').replace("\\n", "\n"),
        "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
        "private_key_id": os.getenv('FIREBASE_PRIVATE_KEY_ID'),
        "token_uri": os.getenv('FIREBASE_TOKEN_URI'),
        "auth_provider_x509_cert_url": os.getenv('FIREBASE_AUTH_PROVIDER_X509_CERT_URL'),
        "client_x509_cert_url": os.getenv('FIREBASE_CLIENT_X509_CERT_URL')
    })
    firebase_admin.initialize_app(cred)

db = firestore.client()

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        request_json = json.loads(post_data)

        user_question = request_json.get('question', '')
        if not user_question:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'{"error": "Question is required"}')
            return

        # Run the async function to get the answer
        try:
            loop = asyncio.get_event_loop()
            gpt_answer = loop.run_until_complete(fetch_openai_response(user_question))

            # Save question and answer to Firestore
            db.collection('questions').add({
                'question': user_question,
                'answer': gpt_answer,
                'timestamp': firestore.SERVER_TIMESTAMP
            })

            # Send response back to the client
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'answer': gpt_answer}).encode())

        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
