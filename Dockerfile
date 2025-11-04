# Use an official Python image
FROM python:3.12-slim

# Set the working directory
WORKDIR /app

# Copy website files into the container
COPY . /app

# Expose the port (adjust if needed)
EXPOSE 80

# Run the HTTP server
CMD ["python", "-m", "http.server", "80"]
