from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List, Optional
import logging

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI
llm = ChatOpenAI(
    model="gpt-4",
    temperature=0.9,
    api_key=os.getenv("OPENAI_API_KEY")
)

# Pydantic models for structured output
class Symbol(BaseModel):
    name: str = Field(description="The name of the symbol")
    meaning: str = Field(description="The symbolic meaning of this element")
    icon: str = Field(description="An emoji icon representing this symbol")

class Emotion(BaseModel):
    name: str = Field(description="The name of the emotion")
    intensity: float = Field(description="Intensity of the emotion (0.0 to 1.0)")
    color: str = Field(description="Hex color code for the emotion")

class DreamAnalysis(BaseModel):
    symbols: List[Symbol] = Field(description="List of symbolic elements found in the dream")
    emotions: List[Emotion] = Field(description="List of emotions detected in the dream")
    keywords: List[str] = Field(description="Key themes and keywords extracted from the dream")
    tone: str = Field(description="Overall tone and mood of the dream")
    themes: List[str] = Field(description="Recurring themes and patterns")

class StartupIdea(BaseModel):
    name: str = Field(description="Creative and memorable startup name")
    tagline: str = Field(description="Catchy one-liner describing the startup")
    description: str = Field(description="Detailed description of the startup concept")
    problem: str = Field(description="The problem this startup solves")
    solution: str = Field(description="How the startup solves the problem")
    targetMarket: str = Field(description="Target market and audience")
    businessModel: str = Field(description="Business model and revenue strategy")
    techStack: List[str] = Field(description="Recommended technology stack")
    monetization: str = Field(description="Monetization strategy")
    competitiveAdvantage: str = Field(description="Unique competitive advantage")

# Dream Analysis Prompt
DREAM_ANALYSIS_PROMPT = """
You are an expert dream analyst and psychologist. Analyze the following dream and provide a comprehensive breakdown that will be used to generate unique startup ideas.

Dream Content: {dream_content}
Mood: {mood}

Please analyze this dream and extract SPECIFIC, UNIQUE elements:

1. SYMBOLIC ELEMENTS:
- Identify specific objects, people, places, or actions from the dream
- Provide detailed meanings for each symbol
- Focus on symbols that could inspire business concepts
- Use specific emojis that represent each symbol

2. EMOTIONAL ANALYSIS:
- Identify the specific emotions felt during the dream
- Rate intensity (0.0 to 1.0) for each emotion
- Consider how emotions could relate to business opportunities
- Use appropriate colors for each emotion

3. KEYWORDS AND THEMES:
- Extract SPECIFIC words and phrases from the dream content
- Identify unique themes that could inspire business ideas
- Look for problems, desires, or opportunities mentioned
- Focus on actionable keywords that could become business concepts

4. OVERALL TONE:
- Describe the dream's atmosphere and mood
- Consider how the tone could influence business direction
- Identify the emotional journey or transformation

5. BUSINESS-RELEVANT ELEMENTS:
- Problems or challenges mentioned in the dream
- Desires, aspirations, or goals expressed
- Social interactions or community aspects
- Technology, innovation, or transformation elements
- Environmental, sustainability, or nature themes
- Communication, connection, or isolation themes
- Growth, change, or development patterns

IMPORTANT: Make this analysis SPECIFIC to this dream. Do not use generic interpretations. Extract unique elements that could inspire a one-of-a-kind startup idea. The keywords should be directly from the dream content, and the themes should reflect the dream's unique characteristics.

Focus on elements that could inspire innovative business ideas by looking for:
- Specific problems the dreamer is trying to solve
- Unique desires or aspirations expressed
- Social dynamics or community needs
- Technology or innovation opportunities
- Environmental or sustainability concerns
- Communication or connection challenges
- Personal growth or transformation themes

Provide a structured analysis that captures the dream's unique essence and could be used to generate a completely original startup concept.
"""

# Startup Generation Prompt
STARTUP_GENERATION_PROMPT = """
You are an expert startup consultant and business strategist. Based on the dream analysis provided, generate a COMPLETELY UNIQUE startup idea that is DIRECTLY INSPIRED by the specific dream content, keywords, and themes.

Dream Analysis:
Symbols: {symbols}
Emotions: {emotions}
Keywords: {keywords}
Tone: {tone}
Themes: {themes}

CRITICAL REQUIREMENTS:
1. The startup idea MUST be directly inspired by the specific keywords and themes from this dream
2. Use the actual dream symbols and their meanings to create the business concept
3. Incorporate the emotional tone and intensity from the dream
4. Create a startup that addresses problems or opportunities suggested by the dream content
5. Make the startup name and concept unique to this specific dream analysis
6. Avoid generic business ideas - this must be tailored to the dream's unique elements

ANALYSIS INSTRUCTIONS:
- Look at the specific keywords: {keywords}
- Consider the dream's tone: {tone}
- Use the symbolic meanings: {symbols}
- Incorporate the emotional themes: {themes}
- Create a business that reflects the dream's unique characteristics

STARTUP IDEA REQUIREMENTS:
1. Name: Must be inspired by dream keywords or symbols
2. Tagline: Should reflect the dream's emotional tone and themes
3. Problem: Address a real issue suggested by the dream content
4. Solution: Use dream symbols or themes in the solution approach
5. Target Market: Based on the dream's social/emotional context
6. Business Model: Reflect the dream's themes of success/transformation
7. Technology: Use modern tech that aligns with dream symbols
8. Monetization: Strategy that fits the dream's themes
9. Competitive Advantage: Based on unique dream-inspired features

IMPORTANT: Each section must be highly specific and directly related to the dream analysis. Do not use generic business templates. This startup should feel like it was born from this specific dream's unique elements.

Guidelines for each section:

PROBLEM SECTION:
- Identify a specific problem that relates to the dream's themes and keywords
- Use the dream's emotional tone to describe the problem
- Reference specific dream symbols or situations
- Make it compelling and directly connected to the dream
- Should be 2-3 detailed paragraphs

SOLUTION SECTION:
- Explain how the solution incorporates dream symbols or themes
- Use the dream's keywords in describing the approach
- Describe features that reflect the dream's emotional journey
- Explain how the technology or method relates to dream elements
- Should be 2-3 detailed paragraphs

TARGET MARKET SECTION:
- Define audience based on the dream's social/emotional context
- Use dream themes to identify market characteristics
- Describe how the dream's tone relates to market needs
- Explain why this market connects to the dream's symbols
- Should be 2-3 detailed paragraphs

BUSINESS MODEL SECTION:
- Create revenue strategy that reflects dream themes of success
- Use dream symbols to inspire pricing or delivery models
- Include operational elements that mirror dream patterns
- Explain growth potential based on dream's transformative themes
- Should be 2-3 detailed paragraphs

Make the startup idea creative, innovative, and PRACTICALLY IMPLEMENTABLE. The name should be memorable and directly inspired by the dream. Each section should be comprehensive and SPECIFIC to this dream's unique elements.
"""

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Dream to Startup Generator API is running"})

@app.route('/analyze-dream', methods=['POST'])
def analyze_dream():
    """Analyze a dream and extract symbolic elements, emotions, and themes"""
    try:
        data = request.get_json()
        dream_content = data.get('content', '')
        mood = data.get('mood', 'neutral')
        
        if not dream_content:
            return jsonify({"error": "Dream content is required"}), 400
        
        logger.info(f"Analyzing dream with mood: {mood}")
        
        # Create prompt template
        prompt_template = ChatPromptTemplate.from_template(DREAM_ANALYSIS_PROMPT)
        
        # Create parser
        parser = PydanticOutputParser(pydantic_object=DreamAnalysis)
        
        # Format prompt
        prompt = prompt_template.format_messages(
            dream_content=dream_content,
            mood=mood
        )
        
        # Get response from OpenAI
        response = llm.invoke(prompt)
        
        # Parse the response
        analysis = parser.parse(response.content)
        
        # Convert to dict for JSON response
        result = {
            "symbols": [symbol.dict() for symbol in analysis.symbols],
            "emotions": [emotion.dict() for emotion in analysis.emotions],
            "keywords": analysis.keywords,
            "tone": analysis.tone,
            "themes": analysis.themes
        }
        
        logger.info("Dream analysis completed successfully")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error analyzing dream: {str(e)}")
        return jsonify({"error": "Failed to analyze dream", "details": str(e)}), 500

@app.route('/generate-startup', methods=['POST'])
def generate_startup():
    """Generate a startup idea based on dream analysis"""
    try:
        data = request.get_json()
        
        # Extract analysis data
        symbols = data.get('symbols', [])
        emotions = data.get('emotions', [])
        keywords = data.get('keywords', [])
        tone = data.get('tone', '')
        themes = data.get('themes', [])
        
        if not symbols and not emotions and not keywords:
            return jsonify({"error": "Dream analysis data is required"}), 400
        
        logger.info("Generating startup idea from dream analysis")
        
        # Create prompt template
        prompt_template = ChatPromptTemplate.from_template(STARTUP_GENERATION_PROMPT)
        
        # Create parser
        parser = PydanticOutputParser(pydantic_object=StartupIdea)
        
        # Format prompt
        prompt = prompt_template.format_messages(
            symbols=json.dumps(symbols, indent=2),
            emotions=json.dumps(emotions, indent=2),
            keywords=json.dumps(keywords, indent=2),
            tone=tone,
            themes=json.dumps(themes, indent=2)
        )
        
        # Add specific instruction to ensure uniqueness
        additional_instruction = f"""
        CRITICAL: This startup idea must be COMPLETELY UNIQUE and directly inspired by the dream analysis above. 
        Use the specific keywords: {keywords}
        Use the dream's tone: {tone}
        Use the symbolic meanings: {symbols}
        Use the emotional themes: {themes}
        
        Do NOT generate a generic business idea. This must be a one-of-a-kind concept that could only come from this specific dream analysis.
        """
        
        # Combine the prompt with additional instruction
        final_prompt = prompt + [{"role": "user", "content": additional_instruction}]
        
        # Get response from OpenAI
        response = llm.invoke(final_prompt)
        
        # Parse the response
        startup = parser.parse(response.content)
        
        # Convert to dict for JSON response
        result = startup.dict()
        
        logger.info("Startup generation completed successfully")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error generating startup: {str(e)}")
        return jsonify({"error": "Failed to generate startup idea", "details": str(e)}), 500

@app.route('/generate-business-model', methods=['POST'])
def generate_business_model():
    """Generate a business model canvas based on startup idea"""
    try:
        data = request.get_json()
        startup_idea = data.get('startupIdea', {})
        
        if not startup_idea:
            return jsonify({"error": "Startup idea is required"}), 400
        
        logger.info("Generating business model canvas")
        
        # Business model generation prompt
        business_model_prompt = f"""
        Based on the following startup idea, create a comprehensive business model canvas:
        
        Startup: {startup_idea.get('name', '')}
        Description: {startup_idea.get('description', '')}
        Problem: {startup_idea.get('problem', '')}
        Solution: {startup_idea.get('solution', '')}
        Target Market: {startup_idea.get('targetMarket', '')}
        
        Please provide a business model canvas with the following sections:
        1. Key Partners
        2. Key Activities
        3. Key Resources
        4. Value Propositions
        5. Customer Relationships
        6. Channels
        7. Customer Segments
        8. Cost Structure
        9. Revenue Streams
        
        Return as JSON format.
        """
        
        response = llm.invoke(business_model_prompt)
        
        # Try to parse JSON from response
        try:
            business_model = json.loads(response.content)
        except:
            # If JSON parsing fails, create a structured response
            business_model = {
                "keyPartners": ["AI Technology Providers", "Business Consultants"],
                "keyActivities": ["Product Development", "Market Research"],
                "keyResources": ["Technology Platform", "Expert Team"],
                "valuePropositions": ["Innovative Solution", "Cost Effective"],
                "customerRelationships": ["Personal Support", "Community"],
                "channels": ["Web Platform", "Mobile App"],
                "customerSegments": ["Entrepreneurs", "Small Businesses"],
                "costStructure": ["Development", "Marketing", "Operations"],
                "revenueStreams": ["Subscription", "Consulting", "Licensing"]
            }
        
        logger.info("Business model generation completed successfully")
        return jsonify(business_model)
        
    except Exception as e:
        logger.error(f"Error generating business model: {str(e)}")
        return jsonify({"error": "Failed to generate business model", "details": str(e)}), 500

@app.route('/generate-mockup', methods=['POST'])
def generate_mockup():
    """Generate app mockup description (placeholder for DALL-E integration)"""
    try:
        data = request.get_json()
        startup_idea = data.get('startupIdea', {})
        
        if not startup_idea:
            return jsonify({"error": "Startup idea is required"}), 400
        
        logger.info("Generating app mockup description")
        
        # Mockup generation prompt
        mockup_prompt = f"""
        Based on the startup idea, describe what the app interface should look like:
        
        Startup: {startup_idea.get('name', '')}
        Description: {startup_idea.get('description', '')}
        Target Market: {startup_idea.get('targetMarket', '')}
        
        Describe the main screens and UI elements for this app.
        """
        
        response = llm.invoke(mockup_prompt)
        
        # Create mockup response
        mockup = {
            "id": "mockup-1",
            "imageUrl": "https://via.placeholder.com/400x800/667eea/ffffff?text=App+Mockup",
            "description": response.content,
            "createdAt": "2024-01-01T00:00:00Z"
        }
        
        logger.info("Mockup generation completed successfully")
        return jsonify(mockup)
        
    except Exception as e:
        logger.error(f"Error generating mockup: {str(e)}")
        return jsonify({"error": "Failed to generate mockup", "details": str(e)}), 500

@app.route('/regenerate-section', methods=['POST'])
def regenerate_section():
    """Regenerate a specific section of a startup idea"""
    try:
        data = request.get_json()
        startup_idea = data.get('startupIdea', {})
        section = data.get('section', '')
        
        if not startup_idea or not section:
            return jsonify({"error": "Startup idea and section are required"}), 400
        
        logger.info(f"Regenerating section: {section}")
        
        # Section-specific prompts
        section_prompts = {
            'problem': f"""
            Based on the following startup idea, regenerate the PROBLEM section with detailed, specific content:
            
            Startup Name: {startup_idea.get('name', '')}
            Tagline: {startup_idea.get('tagline', '')}
            Description: {startup_idea.get('description', '')}
            
            Create a comprehensive problem statement that:
            - Identifies a specific, real-world problem this startup solves
            - Describes pain points and challenges faced by the target audience
            - Includes relevant statistics or market data
            - Makes it compelling and relatable
            - Is 2-3 detailed paragraphs
            
            Focus on making this problem statement unique to this specific startup idea.
            """,
            
            'solution': f"""
            Based on the following startup idea, regenerate the SOLUTION section with detailed, specific content:
            
            Startup Name: {startup_idea.get('name', '')}
            Tagline: {startup_idea.get('tagline', '')}
            Description: {startup_idea.get('description', '')}
            Problem: {startup_idea.get('problem', '')}
            
            Create a comprehensive solution description that:
            - Explains exactly how this startup solves the identified problem
            - Describes the unique approach and methodology
            - Includes key features and capabilities
            - Explains the technology or innovation behind it
            - Is 2-3 detailed paragraphs
            
            Focus on making this solution unique to this specific startup idea.
            """,
            
            'targetMarket': f"""
            Based on the following startup idea, regenerate the TARGET MARKET section with detailed, specific content:
            
            Startup Name: {startup_idea.get('name', '')}
            Tagline: {startup_idea.get('tagline', '')}
            Description: {startup_idea.get('description', '')}
            Problem: {startup_idea.get('problem', '')}
            Solution: {startup_idea.get('solution', '')}
            
            Create a comprehensive target market description that:
            - Defines the specific target audience in detail
            - Includes demographics, psychographics, and behavioral patterns
            - Describes market size and potential
            - Explains why this market is ideal for the solution
            - Is 2-3 detailed paragraphs
            
            Focus on making this market analysis unique to this specific startup idea.
            """,
            
            'businessModel': f"""
            Based on the following startup idea, regenerate the BUSINESS MODEL section with detailed, specific content:
            
            Startup Name: {startup_idea.get('name', '')}
            Tagline: {startup_idea.get('tagline', '')}
            Description: {startup_idea.get('description', '')}
            Problem: {startup_idea.get('problem', '')}
            Solution: {startup_idea.get('solution', '')}
            Target Market: {startup_idea.get('targetMarket', '')}
            
            Create a comprehensive business model description that:
            - Explains the revenue generation strategy in detail
            - Describes pricing models and monetization approaches
            - Includes cost structure and operational model
            - Explains scalability and growth potential
            - Is 2-3 detailed paragraphs
            
            Focus on making this business model unique to this specific startup idea.
            """
        }
        
        if section not in section_prompts:
            return jsonify({"error": f"Invalid section: {section}"}), 400
        
        # Get the appropriate prompt
        prompt = section_prompts[section]
        
        # Get response from OpenAI
        response = llm.invoke(prompt)
        
        # Extract the generated content
        generated_content = response.content.strip()
        
        # Return the regenerated section
        result = {
            section: generated_content
        }
        
        logger.info(f"Section {section} regenerated successfully")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error regenerating section: {str(e)}")
        return jsonify({"error": "Failed to regenerate section", "details": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 