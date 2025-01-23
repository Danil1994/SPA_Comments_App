# Comments App

**Comments App** is an SPA web application for creating and managing comments. It includes a 
Django backend (`main_app`) and a React frontend (`react_comment`). 

---

## Features

- **Comment Management**: Add, view, and reply to comments.
- **CAPTCHA Validation**: Secure form submission 
- with `django-simple-captcha`.
- **File Uploads**: Attach images and text files to comments.
- **HTML Tags in Comments**: Limited support for safe HTML tags (`<a>`, `<code>`, `<i>`, `<strong>`).

---

## Prerequisites

- **Python**: 3.9
- **Node.js**: 20.11
- **Django**: Installed via `requirements.txt`
- **React**: Dependencies managed via `package-lock.json`

---

## Installation

### 1. Clone the Repository
```bash
# Clone the repository
git clone <repository_url>

# Navigate to the project folder
cd comments_app
```

### 2. Backend Setup

#### Install Dependencies
```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the `comments_app` directory with the following content:
```
SECRET_KEY=your_django_secret_key
```

#### Apply Migrations
```bash
# Apply Django migrations
python manage.py migrate
```

#### Create a Superuser (Optional)
```bash
# Create a superuser for the admin panel
python manage.py createsuperuser
```

#### Run the Development Server
```bash
# Start the Django development server
python manage.py runserver
```
You may test it on http://127.0.0.1:8000/api/comments/(http://127.0.0.1:8000/api/comments/)

---

### 3. Frontend Setup

#### Install Dependencies
```bash
# Navigate to the React application folder
cd react_comment

# Install Node.js dependencies
npm install
```

#### Start the Development Server
```bash
# Start the React development server
npm start
```
By default, the React application will run on [http://localhost:3000](http://localhost:3000).

---

## Usage

1. Open [http://localhost:3000](http://localhost:3000) to access the frontend application.
2. The backend API is accessible at [http://127.0.0.1:8000](http://127.0.0.1:8000).
3. Add, view, and reply to comments in real-time.
4. Use CAPTCHA to secure form submissions.

---


## File Uploads

- **Supported Formats**:
  - **Images**: JPG, PNG, GIF
  - **Text Files**: `.txt` (Max size: 100KB)
- Files are validated on the backend and processed securely.

---

## Deployment

For deployment, ensure that the following steps are completed:
1. Configure a production-ready database (e.g., PostgreSQL).
2. Set `DEBUG=False` in Django settings and configure `ALLOWED_HOSTS`.
3. Build the React application using:
   ```bash
   npm run build
   ```
   Serve the built files with a web server like Nginx.

---

## Troubleshooting

### Common Issues

1. **CAPTCHA Validation Fails**:
   - Ensure the CAPTCHA API is accessible at `/captcha/`.
   - Verify the `SECRET_KEY` in the `.env` file.

2. **Static Files Not Loading in Production**:
   - Run `python manage.py collectstatic`.
   - Ensure the static files directory is correctly configured in your web server.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

Special thanks to the developers and contributors of Django, React, and Django Channels for their amazing tools and libraries.

