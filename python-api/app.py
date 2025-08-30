from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# ---------------- CORS ---------------- #
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- MongoDB Setup ---------------- #
client = MongoClient("mongodb://localhost:27017/")
db = client["test"]              # Use 'test' database
books_collection = db["books"]   # Use 'books' collection inside 'test'

# ---------------- Helper Functions ---------------- #
def build_book_corpus():
    books = list(books_collection.find({}))
    if not books:
        return [], [], []

    corpus = []
    book_ids = []

    for book in books:
        title = book.get("title", "")
        author = book.get("author", "")
        desc = book.get("desc", "")
        if not (title or author or desc):
            text = "unknown book"
        else:
            text = f"{title} {author} {desc}"

        corpus.append(text)
        book_ids.append(book["_id"])

    return corpus, book_ids, books

def compute_similarity_matrix():
    corpus, book_ids, books = build_book_corpus()
    if not corpus:
        return None, None, None

    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(corpus)
    similarity_matrix = cosine_similarity(tfidf_matrix)

    return similarity_matrix, book_ids, books

def recommend_books(book_id: str, top_n: int = 5):
    similarity_matrix, book_ids, books = compute_similarity_matrix()
    if similarity_matrix is None:
        return []

    try:
        book_obj_id = ObjectId(book_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid book ID format")

    if book_obj_id not in book_ids:
        raise HTTPException(status_code=404, detail="Book not found")

    idx = book_ids.index(book_obj_id)
    sim_scores = list(enumerate(similarity_matrix[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    recommendations = []
    for i, score in sim_scores[1: top_n + 1]:  # Skip same book
        b = books[i]
        recommendations.append({
            "book_id": str(b["_id"]),
            "title": b.get("title", "Unknown Title"),
            "author": b.get("author", "Unknown Author"),
            "url": b.get("url", "No URL available"),
            "description": b.get("desc", "No description available"),
            "similarity_score": round(float(score), 3)
        })

    # Fill with other books if not enough recommendations
    if len(recommendations) < top_n:
        for b in books:
            if str(b["_id"]) != book_id and all(str(b["_id"]) != r["book_id"] for r in recommendations):
                recommendations.append({
                    "book_id": str(b["_id"]),
                    "title": b.get("title", "Unknown Title"),
                    "author": b.get("author", "Unknown Author"),
                    "url": b.get("url", "No URL available"),
                    "description": b.get("desc", "No description available"),
                    "similarity_score": 0.0
                })
            if len(recommendations) >= top_n:
                break

    return recommendations

# ---------------- API Endpoints ---------------- #
@app.get("/")
def root():
    return {"message": "Book Recommendation API (test DB) is running!"}

@app.get("/recommend/{book_id}")
def recommend_endpoint(book_id: str, top_n: int = 5):
    recommendations = recommend_books(book_id, top_n)
    if not recommendations:
        return {"message": "No recommendations found for this book."}
    return recommendations
