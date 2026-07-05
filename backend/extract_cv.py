import os
import fitz
import json
from google import genai
from google.genai import types
from pydantic import BaseModel
from typing import List, Optional

class Skill(BaseModel):
    name: str
    level: int
    category: str

class Experience(BaseModel):
    company: str
    role: str
    duration: str
    description: str
    display_order: int

class Project(BaseModel):
    title: str
    description: str
    technologies: str
    github_url: Optional[str]
    live_url: Optional[str]
    image_url: Optional[str]
    display_order: int

class Education(BaseModel):
    institution: str
    degree: str
    duration: str
    description: Optional[str]
    display_order: int

class Achievement(BaseModel):
    title: str
    description: str
    icon_name: Optional[str]
    date: Optional[str]
    display_order: int

class CVData(BaseModel):
    skills: List[Skill]
    experiences: List[Experience]
    projects: List[Project]
    education: List[Education]
    achievements: List[Achievement]


def extract_cv(pdf_path: str, output_path: str):
    # 1. Read PDF
    if not os.path.exists(pdf_path):
        print(f"Error: {pdf_path} not found.")
        return

    print("Reading PDF...")
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    
    # 2. Extract using Gemini API
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        # Load from .env if possible
        try:
            from dotenv import load_dotenv
            load_dotenv()
            api_key = os.environ.get("GEMINI_API_KEY")
        except ImportError:
            pass

    if not api_key:
        print("Error: GEMINI_API_KEY not found in environment. Please set it in .env file.")
        return

    print("Calling Gemini API for JSON extraction...")
    client = genai.Client(api_key=api_key)
    
    prompt = f"""
    You are an expert at extracting information from CVs.
    Please extract the relevant details from the following CV text and format it into JSON matching the schema precisely.
    For skills, assign a proficiency level from 0 to 100 based on standard categorization. 
    Categories for skills can be 'Frontend', 'Backend', 'Programming', 'Database', 'Tools', 'AI / ML'.
    For icons in achievements, use names like 'award', 'book-open', 'zap', 'trophy'.

    CV TEXT:
    {text}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=CVData,
        ),
    )

    if response.text:
        # 3. Save JSON
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(response.text)
        print(f"Success! JSON saved to {output_path}")
    else:
        print("Failed to generate content.")

if __name__ == "__main__":
    cv_pdf_path = r"c:\Portfolio\Archi Parmar Detailed CV.pdf"
    output_json = r"c:\Portfolio\backend\cv_data.json"
    extract_cv(cv_pdf_path, output_json)
