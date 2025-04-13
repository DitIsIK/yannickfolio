import os
import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM

# Pin to a valid revision—for example, using the "main" branch if that’s available.
PINNED_REVISION = "main"  # Adjust this to a valid revision from the model page

MODEL_MAP = {
    "deepseek-chat": "deepseek-ai/DeepSeek-V2-Chat",
    "deepseek-llm":  "deepseek-ai/DeepSeek-LLM-7b-base",
    "deepseek-coder": "deepseek-ai/DeepSeek-Coder-V2-Base"
}

class PromptRequest(BaseModel):
    prompt: str

class CompletionResponse(BaseModel):
    answer: str

app = FastAPI()

@app.get("/api")
async def api_info():
    return {"message": "This is Kartavya's DeepSeek Server"}

model_key = os.getenv("MODEL_NAME", "deepseek-chat")
model_id = MODEL_MAP.get(model_key, model_key)

tokenizer = AutoTokenizer.from_pretrained(
    model_id,
    trust_remote_code=True,
    revision=PINNED_REVISION
)

use_gpu = os.getenv("GPU_ACCELERATION", "false").lower() == "true"
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

@app.post("/completion", response_model=CompletionResponse)
async def generate_completion(request: PromptRequest):
    prompt = request.prompt
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")
    try:
        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
        outputs = model.generate(**inputs, max_new_tokens=150)
        text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return {"answer": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
