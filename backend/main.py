from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import uuid
from document_processor import extract_text_from_file
from ollama_handler import chat_with_document
from legal_handler import LegalHandler  # NEW IMPORT

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store documents in memory (for simple version)
documents = {}

# Create uploads directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize legal handler - NEW
legal_handler = LegalHandler(model_name="llama3.2")  # Use same model as your document chat

class ChatRequest(BaseModel):
    document_id: str
    question: str
    model: str = "llama3.2"  # Default model, change if you have a different one

# NEW: Legal chat request models
class LegalChatRequest(BaseModel):
    message: str

class LegalChatHistoryRequest(BaseModel):
    messages: list

@app.get("/")
async def root():
    return {"message": "DocChat API is running"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        # Generate unique document ID
        doc_id = str(uuid.uuid4())
        
        # Save file
        file_path = os.path.join(UPLOAD_DIR, f"{doc_id}_{file.filename}")
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Extract text from document
        text = extract_text_from_file(file_path, file.filename)
        
        if not text:
            raise HTTPException(status_code=400, detail="Could not extract text from file")
        
        # Store document info
        documents[doc_id] = {
            "id": doc_id,
            "filename": file.filename,
            "text": text,
            "file_path": file_path
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
async def chat(request: ChatRequest):
    try:
        # Check if document exists
        if request.document_id not in documents:
            raise HTTPException(status_code=404, detail="Document not found")
        
        document = documents[request.document_id]
        
        # Get response from Ollama
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

# NEW: Legal chat endpoint
@app.post("/api/legal/chat")
async def legal_chat(request: LegalChatRequest):
    """
    Legal advice chat endpoint - does not require document upload
    """
    try:
        if not request.message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Simple chat without history
        response = legal_handler.chat(request.message)
        
        return {
            "status": "success",
            "response": response,
            "disclaimer": "This is general legal information, not legal advice. Please consult with a licensed attorney for specific legal matters."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# NEW: Legal chat with history endpoint
@app.post("/api/legal/chat-history")
async def legal_chat_with_history(request: LegalChatHistoryRequest):
    """
    Legal chat with conversation history
    """
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
async def get_document(document_id: str):
    if document_id not in documents:
        raise HTTPException(status_code=404, detail="Document not found")
    
    doc = documents[document_id]
    return {
        "id": doc["id"],
        "filename": doc["filename"],
        "text_length": len(doc["text"]),
        "preview": doc["text"][:500] + "..." if len(doc["text"]) > 500 else doc["text"]
    }

@app.get("/models")
async def list_models():
    """List available Ollama models"""
    try:
        import ollama
        models = ollama.list()
        return {"models": [model['name'] for model in models['models']]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing models: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)