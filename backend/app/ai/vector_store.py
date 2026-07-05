import os
import json
import math
import re
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import models

# Define index filepath
INDEX_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vector_index.json")

class VectorStore:
    def __init__(self):
        self.documents: List[Dict[str, Any]] = []
        self.vocabulary: Dict[str, int] = {}
        self.idf: Dict[str, float] = {}
        self.load()

    def clean_text(self, text: str) -> str:
        """Helper to lowercase, remove punctuation, and tokenize text."""
        if not text:
            return ""
        text = text.lower()
        # Keep alphanumeric words
        words = re.findall(r"\b\w+\b", text)
        return " ".join(words)

    def compute_tf(self, text: str) -> Dict[str, float]:
        """Compute Term Frequency for a single document."""
        words = self.clean_text(text).split()
        if not words:
            return {}
        tf = {}
        for word in words:
            tf[word] = tf.get(word, 0) + 1
        # Normalize TF
        length = len(words)
        return {word: count / length for word, count in tf.items()}

    def build_vocabulary(self):
        """Build vocabulary and compute IDF values across all documents."""
        vocab = set()
        doc_count = len(self.documents)
        if doc_count == 0:
            return

        # Get all words
        word_doc_counts = {}
        for doc in self.documents:
            doc_words = set(self.clean_text(doc["content"]).split())
            vocab.update(doc_words)
            for word in doc_words:
                word_doc_counts[word] = word_doc_counts.get(word, 0) + 1

        self.vocabulary = {word: idx for idx, word in enumerate(sorted(vocab))}
        
        # IDF calculation: log(Total Docs / Docs containing word) + 1
        self.idf = {}
        for word, count in word_doc_counts.items():
            self.idf[word] = math.log(doc_count / count) + 1.0

    def compute_tfidf_vector(self, text: str) -> List[float]:
        """Compute normalized TF-IDF vector matching global vocabulary."""
        tf = self.compute_tf(text)
        vector = [0.0] * len(self.vocabulary)
        
        for word, tf_val in tf.items():
            if word in self.vocabulary:
                idx = self.vocabulary[word]
                vector[idx] = tf_val * self.idf.get(word, 1.0)
                
        # L2 Normalize the vector
        sq_sum = sum(v * v for v in vector)
        if sq_sum > 0:
            norm = math.sqrt(sq_sum)
            vector = [v / norm for v in vector]
            
        return vector

    def add_document(self, content: str, metadata: Dict[str, Any]):
        """Append document block to store."""
        self.documents.append({
            "content": content,
            "metadata": metadata
        })

    def rebuild_index(self, db: Session):
        """Clear database documents, extract current DB entities, and index them."""
        self.documents = []

        # 1. Projects
        projects = db.query(models.Project).all()
        for p in projects:
            content = f"Project Title: {p.title}. Description: {p.description}. Tech Stack: {', '.join(p.tech_stack or [])}. Key Features: {', '.join(p.features or [])}."
            self.add_document(content, {"type": "project", "title": p.title, "id": p.id})

        # 2. Skills
        skills = db.query(models.Skill).all()
        for s in skills:
            if s.is_active:
                content = f"Technical Skill: {s.name}. Category: {s.category}. Proficiency Level: {s.level}%."
                self.add_document(content, {"type": "skill", "name": s.name, "category": s.category})

        # 3. Experience
        experiences = db.query(models.Experience).all()
        for e in experiences:
            content = f"Work Experience. Company: {e.company}. Job Role: {e.role}. Duration: {e.duration}. Work Details: {e.description}."
            self.add_document(content, {"type": "experience", "company": e.company, "role": e.role})

        # 4. Education
        edu_entries = db.query(models.Education).all()
        for edu in edu_entries:
            content = f"Education Details. Institution: {edu.institution}. Degree Program: {edu.degree}. Study Duration: {edu.duration}. Achievements/Description: {edu.description}."
            self.add_document(content, {"type": "education", "institution": edu.institution, "degree": edu.degree})

        # 5. Certifications
        certs = db.query(models.Certification).all()
        for c in certs:
            content = f"Professional Certification. Title: {c.title}. Issuing Organization: {c.issuer}. Completion Date: {c.date}."
            self.add_document(content, {"type": "certification", "title": c.title, "issuer": c.issuer})

        # 6. Achievements
        achievements = db.query(models.Achievement).all()
        for a in achievements:
            content = f"Achievement: {a.title}. Details: {a.description}. Date/Year: {a.date}."
            self.add_document(content, {"type": "achievement", "title": a.title})

        # 7. Technical Events
        events = db.query(models.TechnicalEvent).all()
        for ev in events:
            content = f"Technical Event: {ev.title}. Date: {ev.date}. Organizer: {ev.organizer}. Role: {ev.role}. Outcome/Details: {ev.outcome}."
            self.add_document(content, {"type": "event", "title": ev.title, "role": ev.role})

        # 8. Research Papers
        papers = db.query(models.ResearchPaper).all()
        for pap in papers:
            content = f"Research Paper Publication. Title: {pap.title}. Published in: {pap.journal}. Publication Date: {pap.publication_date}. Abstract: {pap.description}. DOI: {pap.doi}."
            self.add_document(content, {"type": "research", "title": pap.title, "journal": pap.journal})

        # 9. Site Settings (About Me Narrative)
        headline = db.query(models.SiteSetting).filter(models.SiteSetting.key == "headline").first()
        about = db.query(models.SiteSetting).filter(models.SiteSetting.key == "about_description").first()
        about_content = f"About Archi Parmar. Headline: {headline.value if headline else ''}. Professional Biography: {about.value if about else ''}."
        self.add_document(about_content, {"type": "about"})

        # Build TF-IDF vectors
        self.build_vocabulary()
        self.save()

    def search(self, query: str, limit: int = 4) -> List[Dict[str, Any]]:
        """Calculate cosine similarity matches for queries."""
        if not self.documents or not self.vocabulary:
            return []

        query_vector = self.compute_tfidf_vector(query)
        results = []

        # If vector is empty (no overlapping words), return fallback match
        if sum(query_vector) == 0:
            # Word matching regex fallback
            query_words = set(self.clean_text(query).split())
            for doc in self.documents:
                doc_words = set(self.clean_text(doc["content"]).split())
                intersect = len(query_words.intersection(doc_words))
                if intersect > 0:
                    results.append((intersect, doc))
            results.sort(key=lambda x: x[0], reverse=True)
            matched = [r[1] for r in results[:limit]]
        else:
            for doc in self.documents:
                doc_vector = self.compute_tfidf_vector(doc["content"])
                # Cosine similarity (dot product since vectors are normalized)
                similarity = sum(qv * dv for qv, dv in zip(query_vector, doc_vector))
                if similarity > 0.05:
                    results.append((similarity, doc))
            # Sort by similarity score descending
            results.sort(key=lambda x: x[0], reverse=True)
            matched = [r[1] for r in results[:limit]]

        # Fallback: if no documents matched, return the 'about' context and first few entities
        if not matched:
            about_doc = next((doc for doc in self.documents if doc["metadata"].get("type") == "about"), None)
            if about_doc:
                matched.append(about_doc)
            # Add general projects/skills
            for doc in self.documents:
                if len(matched) >= limit:
                    break
                if doc not in matched:
                    matched.append(doc)

        return matched

    def save(self):
        """Persist structured vocabulary and documents index to disk."""
        data = {
            "documents": self.documents,
            "vocabulary": self.vocabulary,
            "idf": self.idf
        }
        try:
            with open(INDEX_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"Vector Index saved successfully to: {INDEX_FILE}")
        except Exception as e:
            print(f"Error saving vector index: {e}")

    def load(self):
        """Restore indexed documents from file."""
        if not os.path.exists(INDEX_FILE):
            print("No vector index found on disk. Initializing empty index.")
            return
        try:
            with open(INDEX_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
            self.documents = data.get("documents", [])
            self.vocabulary = data.get("vocabulary", {})
            self.idf = data.get("idf", {})
            print(f"Vector Index restored successfully from: {INDEX_FILE} ({len(self.documents)} documents)")
        except Exception as e:
            print(f"Error loading vector index: {e}")

# Global singleton
vector_store = VectorStore()
