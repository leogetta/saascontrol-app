# SaaSControl - Plateforme de Gouvernance SaaS pour PME

## Installation

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Database
```bash
psql -U saascontrol -d saascontrol -f database/schema.sql
```

## Compte demo
Email: demo@saascontrol.fr
Password: admin123