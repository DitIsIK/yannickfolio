# Use an official Python runtime as the base image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy only the requirements.txt first to leverage Docker layer caching
COPY requirements.txt .

# Install the Python dependencies from requirements.txt
RUN pip install -r requirements.txt

# Now copy the rest of your application files
COPY . .

# Expose the port that the app runs on
EXPOSE 8000

# Define the default command to run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
