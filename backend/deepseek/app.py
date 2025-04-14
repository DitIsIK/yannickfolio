import os
import uvicorn
import torch
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM

# Pin a revision to prevent repeated downloads on each run
PINNED_REVISION = "main"  # You can set this to a commit, tag, or branch that’s known to work

# Your model mapping (priority order is as written)
MODEL_MAP = {
    "deepseek-chat": "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B",  # Best choice for quality conversation
    "falcon-chat": "tiiuae/falcon-rw-1b",                          # Efficient and adapted for dialogue
    "dialo-small": "microsoft/DialoGPT-small",                      # Lightweight dialogue-specific model
    "distilgpt2": "distilgpt2",                                       # Distilled GPT-2 for quick text generation
    # "blenderbot-90M": "facebook/blenderbot-90M",                    # Conversational model with human-like responses
    # "gpt-neo-125M": "EleutherAI/gpt-neo-125M",                        # Ultra-lightweight transformer for conversation
    # "dialo-medium": "microsoft/DialoGPT-medium",                    # Medium-sized dialogue model for richer context
    # "gpt4all-j": "nomic-ai/gpt4all-j",                                # GPT4All variant tailored for chat
    # "opt-125m": "facebook/opt-125m",                                  # OPT model with a small footprint
    # "chatglm-6b-int8": "THUDM/chatglm-6b-int8"                      # Quantized ChatGLM for optimized inference
}

class PromptRequest(BaseModel):
    prompt: str

class CompletionResponse(BaseModel):
    answer: str

app = FastAPI()

# Global dictionary to store loaded models.
# Each entry will be a dict with 'tokenizer' and 'model'.
loaded_models = {}

# Determine if GPU acceleration is enabled.
use_gpu = os.getenv("GPU_ACCELERATION", "false").lower() == "true"

@app.on_event("startup")
async def preload_models():
    global loaded_models
    print("Preloading all models...")
    for model_key, model_id in MODEL_MAP.items():
        try:
            print(f"Loading model {model_key}: {model_id} ...")
            # Load the tokenizer first (this caches the files to disk)
            tokenizer = AutoTokenizer.from_pretrained(
                model_id,
                trust_remote_code=True,
                revision=PINNED_REVISION
            )
            # Load the model to the appropriate device.
            if use_gpu and torch.cuda.is_available():
                model = AutoModelForCausalLM.from_pretrained(
                    model_id,
                    trust_remote_code=True,
                    revision=PINNED_REVISION,
                    device_map="auto"
                )
            else:
                model = AutoModelForCausalLM.from_pretrained(
                    model_id,
                    trust_remote_code=True,
                    revision=PINNED_REVISION,
                    device_map={"": "cpu"}
                )
                model.to("cpu")
            loaded_models[model_key] = {"tokenizer": tokenizer, "model": model}
            print(f"Successfully loaded model '{model_key}'.")
        except Exception as e:
            print(f"Error loading model '{model_key}': {e}")
    
    if not loaded_models:
        print("No models were loaded successfully! Exiting application.")
        os._exit(1)  # Force exit if no models could be loaded

@app.get("/")
@app.get("/api")
async def api_info():
    return {"message": "This is Kartavya's DeepSeek Server using a lightweight model."}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/completion", response_model=CompletionResponse)
async def generate_completion(
    request: PromptRequest,
    model_name: str = Query(
        None,
        description="Optional model key from MODEL_MAP. If not provided, MODEL_NAME env variable is used."
    )
):
    # Determine which model to use:
    # Priority: model_name query parameter > environment variable > default priority (first loaded)
    chosen_model_key = model_name or os.getenv("MODEL_NAME", "deepseek-chat")
    if chosen_model_key not in loaded_models:
        print(f"Requested model '{chosen_model_key}' is not loaded. Falling back to the first available model.")
        chosen_model_key = list(loaded_models.keys())[0]
    model_struct = loaded_models[chosen_model_key]
    tokenizer = model_struct["tokenizer"]
    model = model_struct["model"]
    
    prompt = request.prompt
    print(f"Received prompt: {prompt} using model: {chosen_model_key}")
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")
    try:
        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
        outputs = model.generate(**inputs, max_new_tokens=500)
        text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        print(f"Generated response: {text}")
        return {"answer": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Start the Uvicorn server on port 8001.
    uvicorn.run("app:app", host="127.0.0.1", port=8001, reload=False)
