# Secure File Sharing Web App

This is a simple secure file sharing web app built using Python Django and React JS. It allows users to upload and share files with other users.

## Installation

Follow these steps to set up the app locally:

### 1. Clone the repository:

```bash
git clone https://github.com/vaibhavmoradiya/secure-file-sharing-web-app.git
```

### 3. Install dependencies for the backend:

- Navigate to the backend directory and install Python dependencies:

```bash
cd backend
pip install -r requirements.txt
```

### 4. Install dependencies for the frontend:

- Navigate to the frontend directory and install npm dependencies:

```bash
cd frontend
npm install
```

### 5. Start the backend:

- Run the Django development server:

```bash
cd backend
python manage.py migrate  # Run migrations
python manage.py runserver
```

The backend will be available at `http://localhost:8000`.

### 6. Start the frontend:

- Run the React development server:

```bash
cd frontend
npm start
```

The frontend will be available at `http://localhost:3000`.

## Usage

1. **Open the app in your browser**: 
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`

2. **User Registration**:
   - Users can create an account by entering their details.

3. **Login**:
   - Users can log in with their credentials.

4. **Upload a file**:
   - Select a file from your computer and click the "Upload" button to share it with other users.

5. **Share a file**:
   - Click the "Share" button next to a file to share it with other users.

## API Documentation

- **POST /register/** - Register a new user with a username, email, and password.
- **POST /login/** - Log in with a username and password. 
- **GET /files/** - Retrieve all files uploaded by the user.
- **POST /files/** - Upload a file to the server.
- **POST /shares/** - Share a file with another user.

## Docker Setup

To run the app using Docker, you can use the following steps:

1. Build and start the containers:

```bash
docker-compose up --build
```

2. Access the frontend at `http://localhost:3000` and the backend at `http://localhost:8000`.

### Docker Compose Configuration:

The Docker Compose configuration sets up both the backend (Django) and frontend (React) applications as separate services.

## Contributing

Please follow these steps to contribute:

1. Fork the repository: [Fork the repo](https://github.com/vaibhavmoradiya/secure-file-sharing-web-app/fork)
2. Clone the repository:

```bash
git clone https://github.com/vaibhavmoradiya/secure-file-sharing-web-app.git
```

3. Create a new branch:

```bash
git checkout -b my-branch
```

4. Make your changes: Add, commit, and push your changes.
5. Submit a pull request
