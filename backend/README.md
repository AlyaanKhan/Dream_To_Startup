# 🌙 Dream to Startup Generator

Flask backend with LangChain integration for analyzing dreams and generating startup ideas using OpenAI GPT-4.

## 🚀 Features

- **Dream Analysis**: Extract symbols, emotions, keywords, and themes from dreams
- **Startup Generation**: Create comprehensive startup ideas based on dream analysis
- **Business Model Canvas**: Generate business model components
- **App Mockup Generation**: Create app interface descriptions
- **Structured Output**: Pydantic models for consistent API responses

## 🛠️ Tech Stack

- **Framework**: Flask 2.3.3
- **AI/ML**: LangChain + OpenAI GPT-4
- **Validation**: Pydantic
- **CORS**: Flask-CORS
- **Environment**: python-dotenv

## 📦 Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   OPENAI_API_KEY=your-openai-api-key-here
   FLASK_ENV=development
   FLASK_DEBUG=1
   ```

6. **Run the server**
   ```bash
   python run.py
   ```

The API will be available at `http://localhost:5000`

## 📚 API Endpoints

### Health Check
```
GET /health
```
Returns server status and health information.

### Dream Analysis
```
POST /analyze-dream
```
Analyzes dream content and extracts symbolic elements, emotions, and themes.

**Request Body:**
```json
{
  "content": "I was flying over a city made of light...",
  "mood": "excited"
}
```

**Response:**
```json
{
  "symbols": [
    {
      "name": "Flying",
      "meaning": "Freedom and liberation from constraints",
      "icon": "🦅"
    }
  ],
  "emotions": [
    {
      "name": "Excitement",
      "intensity": 0.8,
      "color": "#e53e3e"
    }
  ],
  "keywords": ["freedom", "innovation", "light"],
  "tone": "Optimistic and forward-looking",
  "themes": ["Liberation", "Innovation"]
}
```

### Startup Generation
```
POST /generate-startup
```
Generates a comprehensive startup idea based on dream analysis.

**Request Body:**
```json
{
  "symbols": [...],
  "emotions": [...],
  "keywords": [...],
  "tone": "...",
  "themes": [...]
}
```

**Response:**
```json
{
  "name": "DreamBridge",
  "tagline": "Connecting dreams to reality",
  "description": "A revolutionary platform...",
  "problem": "Many people have innovative ideas...",
  "solution": "An AI-powered platform...",
  "targetMarket": "Entrepreneurs and creative professionals",
  "businessModel": "Freemium SaaS model",
  "techStack": ["React", "Node.js", "OpenAI API"],
  "monetization": "Subscription tiers",
  "competitiveAdvantage": "Unique dream-to-business algorithm"
}
```

### Business Model Generation
```
POST /generate-business-model
```
Generates a business model canvas based on startup idea.

**Request Body:**
```json
{
  "startupIdea": {
    "name": "DreamBridge",
    "description": "...",
    "problem": "...",
    "solution": "...",
    "targetMarket": "..."
  }
}
```

### App Mockup Generation
```
POST /generate-mockup
```
Generates app interface description (placeholder for DALL-E integration).

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `FLASK_ENV` | Flask environment | No |
| `FLASK_DEBUG` | Enable debug mode | No |
| `PORT` | Server port (default: 5000) | No |

### LangChain Configuration

The backend uses:
- **Model**: GPT-4
- **Temperature**: 0.7 (creative but focused)
- **Output Parsing**: Pydantic models for structured responses

## 🧪 Testing

Test the API endpoints using curl or Postman:

```bash
# Health check
curl http://localhost:5000/health

# Dream analysis
curl -X POST http://localhost:5000/analyze-dream \
  -H "Content-Type: application/json" \
  -d '{"content": "I dreamed of flying over a city of light", "mood": "excited"}'
```

## 🚀 Deployment

### Local Development
```bash
python run.py
```

### Production
```bash
# Set production environment
export FLASK_ENV=production
export FLASK_DEBUG=0

# Run with gunicorn (install first: pip install gunicorn)
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🔍 Logging

The application logs:
- API requests and responses
- Error details
- Processing times
- OpenAI API interactions

Logs are written to stdout and can be redirected to files in production.

## 🤝 Integration with Frontend

The backend is designed to work seamlessly with the React frontend:

1. **CORS enabled** for cross-origin requests
2. **JSON responses** matching frontend TypeScript interfaces
3. **Error handling** with consistent error format
4. **Health checks** for monitoring

## 🔮 Future Enhancements

- **DALL-E Integration**: Generate actual app mockup images
- **Whisper API**: Voice-to-text for dream input
- **Database Integration**: Store dreams and startup ideas
- **User Authentication**: User accounts and dream history
- **Rate Limiting**: API usage limits
- **Caching**: Redis for improved performance

## 📄 License

This project is licensed under the MIT License. 