import os
from openai import OpenAI, AsyncOpenAI
import json

# Initialize clients (Try to handle both or prioritize one based on env vars)
# For this demo, we'll try to use Groq if available, else OpenAI, else a Mock.

async def analyze_stock_data(symbol: str, stock_data: dict) -> str:
    groq_api_key = os.getenv("GROQ_API_KEY")
    openai_api_key = os.getenv("OPENAI_API_KEY")
    
    prompt = f"""
    You are a financial analyst. Analyze the following stock data for {symbol}:
    
    Data: {json.dumps(stock_data, default=str)}
    
    Provide a concise summary, key strengths, potential risks, and a short-term outlook.
    Format the output in Markdown.
    """

    if groq_api_key:
        try:
            client = AsyncOpenAI(
                base_url="https://api.groq.com/openai/v1",
                api_key=groq_api_key
            )
            chat_completion = await client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a helpful financial assistant."},
                    {"role": "user", "content": prompt}
                ],
                model="llama3-8b-8192", # Example model for Groq
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Groq Error: {e}")
            pass # Fallback

    if openai_api_key:
        try:
            client = AsyncOpenAI(api_key=openai_api_key)
            completion = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                     {"role": "system", "content": "You are a helpful financial assistant."},
                    {"role": "user", "content": prompt}
                ]
            )
            return completion.choices[0].message.content
        except Exception as e:
             print(f"OpenAI Error: {e}")
             pass

    # Mock response if no keys or errors
    return f"""
    ### Analysis for {symbol} (Mock Generated)
    
    **Note: API Keys for OpenAI or Groq were not found or failed.**
    
    **Overview:**
    {symbol} is showing standard market activity based on the provided data.
    
    **Key Strengths:**
    - Consistent trading volume.
    - Market presence in its sector.
    
    **Risks:**
    - General market volatility.
    - Sector-specific headwinds.
    
    **Outlook:**
    Neutral to Positive in the short term. Please provide a valid API Key to get real AI analysis.
    """
