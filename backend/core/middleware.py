from django.http import HttpResponse


class DevCorsMiddleware:
    """Lightweight CORS middleware for local frontend-backend development."""

    def __init__(self, get_response):
        self.get_response = get_response
        self.allowed_origins = {
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        }

    def __call__(self, request):
        if request.method == "OPTIONS":
            response = HttpResponse(status=204)
        else:
            response = self.get_response(request)

        origin = request.headers.get("Origin")
        if origin in self.allowed_origins:
            response["Access-Control-Allow-Origin"] = origin
            response["Vary"] = "Origin"

        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
