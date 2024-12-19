# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the backend code into the container
COPY ./backend /app

# Set environment variables for Django settings
ENV PYTHONUNBUFFERED 1

# Install dependencies from requirements.txt
RUN pip install --upgrade pip
RUN pip install -r /app/requirements.txt

# Expose port 8000 for Django
EXPOSE 8000

# Run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]