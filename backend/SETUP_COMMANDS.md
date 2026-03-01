# Django Setup Command Log

All commands below were run from `/Users/samkanu/Projects/Project Mars` unless noted.

1. Verify Homebrew Python
```bash
/opt/homebrew/bin/python3 --version
/opt/homebrew/bin/python3 -c "import sys; print(sys.executable)"
```
Purpose: confirm we are using Homebrew Python, not system Python.

2. Create virtual environment in backend
```bash
cd backend
python3 -m venv .venv
```
Purpose: isolate Django dependencies for backend.

3. Confirm venv interpreter details
```bash
.venv/bin/python -c "import sys; print(sys.executable); print(sys.version)"
```
Purpose: verify the venv Python binary and version.

4. Install Django and upgrade pip in the venv
```bash
.venv/bin/python -m pip install --upgrade pip django
```
Purpose: install framework dependencies for project bootstrap.
Installed: `django==6.0.2`, `pip==26.0.1`, `asgiref==3.11.1`, `sqlparse==0.5.5`.

5. Scaffold the Django project
```bash
.venv/bin/django-admin startproject project_mars .
```
Purpose: create `manage.py` and `project_mars/` settings package in `backend/`.

6. Run initial migrations
```bash
.venv/bin/python manage.py migrate
```
Purpose: create SQLite DB tables for built-in Django apps.

7. Validate Django project configuration
```bash
.venv/bin/python manage.py check
```
Purpose: ensure there are no system/config issues.
Result: `System check identified no issues (0 silenced).`

## Note on command attempts during setup
- An earlier `pip install` attempt failed before escalation due restricted network in sandbox.
- A backgrounded `runserver` smoke-check attempt was blocked by sandbox process restrictions.
- Normal local run command is:
```bash
cd backend
.venv/bin/python manage.py runserver 127.0.0.1:8000
```
