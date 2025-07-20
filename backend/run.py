#!/usr/bin/env python3
"""
Dream to Startup Generator Backend
Flask server with LangChain integration
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Check if OpenAI API key is set
if not os.getenv("OPENAI_API_KEY"):
    print("❌ Error: OPENAI_API_KEY environment variable is not set!")
    print("Please create a .env file with your OpenAI API key:")
    print("OPENAI_API_KEY=your_api_key_here")
    sys.exit(1)

# Import and run the Flask app
from app import app

if __name__ == '__main__':
    print("🚀 Starting Dream to Startup Generator Backend...")
    print("📍 API will be available at: http://localhost:5000")
    print("🔗 Health check: http://localhost:5000/health")
    print("📚 API Documentation:")
    print("   POST /analyze-dream - Analyze dream content")
    print("   POST /generate-startup - Generate startup idea")
    print("   POST /generate-business-model - Generate business model")
    print("   POST /generate-mockup - Generate app mockup")
    print()
    
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 