import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
import requests
from http.server import BaseHTTPRequestHandler

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.Certificate({
        "type": "service_account",
        "project_id": os.getenv('FIREBASE_PROJECT_ID'),
        "private_key": os.getenv('FIREBASE_PRIVATE_KEY').replace("\\n", "\n"),
        "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
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

        try:
            openai_response = requests.post(
                'https://api.openai.com/v1/chat/completions',
                headers={
                    'Authorization': f'Bearer {os.getenv("OPENAI_API_KEY")}',
                    'Content-Type': 'application/json',
                },
                json={
                    "model": "gpt-4",
                    "messages": [{"role": "user", "content": user_question}],
                }
            )
            openai_response.raise_for_status()
            response_data = openai_response.json()
            gpt_answer = response_data['choices'][0]['message']['content']

            db.collection('questions').add({
                'question': user_question,
                'answer': gpt_answer,
                'timestamp': firestore.SERVER_TIMESTAMP
            })

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'answer': gpt_answer}).encode())

        except requests.exceptions.RequestException as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
