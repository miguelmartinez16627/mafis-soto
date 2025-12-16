import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)

# Configuración de CORS para desarrollo y producción
allowed_origins = [
    "http://localhost:5173",  # Desarrollo local
    "https://*.onrender.com",  # Render frontend
]

# Si hay una URL de frontend específica en variables de entorno, agregarla
frontend_url = os.getenv('FRONTEND_URL')
if frontend_url:
    allowed_origins.append(frontend_url)

CORS(app, resources={r"/*": {"origins": allowed_origins}}, supports_credentials=True)

# Configuración de JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key-change-in-production')

# ---------- REGISTRO DE BLUEPRINTS ----------
from auth import bp as auth_bp
from activos import bp as activos_bp
from reportes import bp as reportes_bp
from usuarios import bp as usuarios_bp
from ordenes import bp as ordenes_bp

app.register_blueprint(auth_bp)
app.register_blueprint(activos_bp)
app.register_blueprint(reportes_bp)
app.register_blueprint(usuarios_bp)
app.register_blueprint(ordenes_bp)

if __name__ == '__main__':
    # Solo para desarrollo local
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))