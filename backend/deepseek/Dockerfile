# Dockerfile
FROM python:3.11-slim

# Set a non-root user if needed, or use root (for simplicity here)
WORKDIR /app

# Install required system dependencies (if any)
# For example, numpy is required by torch; we can skip since pip will handle it

# Copy application files
COPY app.py .

# Install Python dependencies
RUN pip install --no-cache-dir fastapi uvicorn transformers torch accelerate --index-url https://pypi.org/simple

# Expose port 8000 for the API
EXPOSE 8000

# Default command to run the FastAPI app with Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
