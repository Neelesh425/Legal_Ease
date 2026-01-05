import ollama

def chat_with_document(document_text: str, question: str, model: str = "llama3.2") -> str:
    """
    Send question with document context to Ollama and get response
    """
    try:
        # Create prompt with document context
        prompt = f"""You are a helpful assistant that answers questions about documents.

Document content:
{document_text}

Question: {question}

Please provide a clear and concise answer based on the document content above."""

        # Call Ollama
        response = ollama.chat(
            model=model,
            messages=[
                {
                    'role': 'user',
                    'content': prompt
                }
            ]
        )
        
        return response['message']['content']
    
    except Exception as e:
        raise Exception(f"Error communicating with Ollama: {str(e)}")

def get_available_models():
    """Get list of available Ollama models"""
    try:
        models = ollama.list()
        return [model['name'] for model in models['models']]
    except Exception as e:
        raise Exception(f"Error getting models: {str(e)}")