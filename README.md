# FindMates

AI-powered student team formation platform for hackathons. Students can add profiles, analyze resumes, generate balanced teams, review chemistry, and monitor team insights.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: FastAPI
- Database: MongoDB
- Tracking: MLflow-ready service layer

## Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend defaults to:

```bash
MONGO_URL=mongodb://localhost:27017
DATABASE_NAME=hackathon_matcher
```

## Deployment

Recommended simple deployment:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

### Backend on Render

1. Create a MongoDB Atlas cluster.
2. Copy the Atlas connection string.
3. Create a Render Web Service from the `backend` folder.
4. Use:

```bash
Build command: pip install -r requirements.txt
Start command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

5. Add environment variables:

```bash
MONGO_URL=your_mongodb_atlas_connection_string
DATABASE_NAME=hackathon_matcher
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

### Frontend on Vercel

1. Import this GitHub repository into Vercel.
2. Set the root directory to `frontend`.
3. Add environment variable:

```bash
VITE_API_URL=https://your-render-api.onrender.com
```

4. Deploy.

## GitHub

After creating a GitHub repository:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```
