# Project Mars Backend

## Run
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

## API Endpoints
- `GET /api/health`
- `GET /api/bootstrap`
- `GET|POST /api/spaces`
- `GET|POST /api/documents`
- `POST /api/sessions`
- `POST /api/sessions/{session_id}/complete`
- `POST /api/documents/{document_id}/blocks`
- `GET /api/insights?session_id={id}`
- `POST /api/insights/{insight_id}/events`

## Test
```bash
cd backend
source .venv/bin/activate
python manage.py test
```
