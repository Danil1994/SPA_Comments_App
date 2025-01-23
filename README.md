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
git clone https://github.com/Danil1994/SPA_Comments_App.git

# Navigate to the project folder if you are not here
cd comments_app
```

### 2. Backend Setup

#### Install Dependencies
```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

or use your IDE

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
You may test it on [http://127.0.0.1:8000/api/comments/](http://127.0.0.1:8000/api/comments/)

But you have no one comment yet. 

If you wish you may use next command to create fake data

```commandline
 python manage.py create_fake_data 10 5
```
This command create 10 main comments and random count of replies for each (between 0 and 5)
After it, you may visit [http://127.0.0.1:8000/api/comments/](http://127.0.0.1:8000/api/comments/) again and check app`s work 

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
2. The backend API is accessible at [http://127.0.0.1:8000/api/comments/](http://127.0.0.1:8000/api/comments/).
3. Add, view, and reply to comments in real-time.
4. Use CAPTCHA to secure form submissions.

---


## File Uploads

- **Supported Formats**:
  - **Images**: JPG, PNG, GIF
  - **Text Files**: `.txt` (Max size: 100KB)
- Files are validated on the backend and processed securely.

---


## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

Special thanks to the developers and contributors of Django, React, and Django Channels for their amazing tools and libraries.

