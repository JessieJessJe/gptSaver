import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
import requests
from http.server import BaseHTTPRequestHandler
from dotenv import load_dotenv

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

        # Send the question to OpenAI API
        try:
            openai_response = requests.post(
                'https://api.openai.com/v1/chat/completions',
                headers={
                    'Authorization': f'Bearer {os.getenv("OPENAI_API_KEY")}',
                    'Content-Type': 'application/json',
                },
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": [{"role": "user", "content": user_question}],
                }
            )
            openai_response.raise_for_status()
            response_data = openai_response.json()
            gpt_answer = response_data['choices'][0]['message']['content']

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
        except requests.exceptions.RequestException as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())


