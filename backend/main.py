from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import uuid
from document_processor import extract_text_from_file
from ollama_handler import chat_with_document
from legal_handler import LegalHandler
from auth import (
    UserSignUp, UserSignIn, sign_up_user, sign_in_user, 
    get_current_user, verify_token
)

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store documents in memory (for simple version)
documents = {}

# Create uploads directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize legal handler
legal_handler = LegalHandler(model_name="llama3.2")

class ChatRequest(BaseModel):
    document_id: str
    question: str
    model: str = "llama3.2"

class LegalChatRequest(BaseModel):
    message: str

class LegalChatHistoryRequest(BaseModel):
    messages: list

# ============= AUTHENTICATION ENDPOINTS =============

@app.post("/api/auth/signup")
async def signup(user_data: UserSignUp):
    """Register a new user"""
    return sign_up_user(user_data)

@app.post("/api/auth/signin")
async def signin(user_data: UserSignIn):
    """Sign in an existing user"""
    return sign_in_user(user_data)

@app.get("/api/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return current_user

# ============= EXISTING ENDPOINTS (Now Protected) =============

@app.get("/")
async def root():
    return {"message": "DocChat API is running"}

@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    try:
        doc_id = str(uuid.uuid4())
        file_path = os.path.join(UPLOAD_DIR, f"{doc_id}_{file.filename}")
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        text = extract_text_from_file(file_path, file.filename)
        
        if not text:
            raise HTTPException(status_code=400, detail="Could not extract text from file")
        
        documents[doc_id] = {
            "id": doc_id,
            "filename": file.filename,
            "text": text,
            "file_path": file_path,
            "user_email": current_user["email"]
        }
        
        return {
            "document_id": doc_id,
            "filename": file.filename,
            "text_length": len(text),
            "message": "Document uploaded successfully"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")

@app.post("/chat")
async def chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        if request.document_id not in documents:
            raise HTTPException(status_code=404, detail="Document not found")
        
        document = documents[request.document_id]
        
        # Check if user owns the document
        if document.get("user_email") != current_user["email"]:
            raise HTTPException(status_code=403, detail="Access denied")
        
        response = chat_with_document(
            document_text=document["text"],
            question=request.question,
            model=request.model
        )
        
        return {
            "response": response,
            "document_id": request.document_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

@app.post("/api/legal/chat")
async def legal_chat(
    request: LegalChatRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        if not request.message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        response = legal_handler.chat(request.message)
        
        return {
            "status": "success",
            "response": response,
            "disclaimer": "This is general legal information, not legal advice. Please consult with a licensed attorney for specific legal matters."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/legal/chat-history")
async def legal_chat_with_history(
    request: LegalChatHistoryRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        if not request.messages:
            raise HTTPException(status_code=400, detail="Messages are required")
        
        response = legal_handler.chat_with_history(request.messages)
        
        return {
            "status": "success",
            "response": response,
            "disclaimer": "This is general legal information, not legal advice. Please consult with a licensed attorney for specific legal matters."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/document/{document_id}")
async def get_document(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):
    if document_id not in documents:
        raise HTTPException(status_code=404, detail="Document not found")
    
    doc = documents[document_id]
    
    # Check if user owns the document
    if doc.get("user_email") != current_user["email"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return {
        "id": doc["id"],
        "filename": doc["filename"],
        "text_length": len(doc["text"]),
        "preview": doc["text"][:500] + "..." if len(doc["text"]) > 500 else doc["text"]
    }

@app.get("/models")
async def list_models():
    try:
        import ollama
        models = ollama.list()
        return {"models": [model['name'] for model in models['models']]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing models: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)