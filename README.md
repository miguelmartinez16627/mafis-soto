# Documentación Técnica - Sistema de Gestión de Mantenimiento de Activos (MAFIS)

**Versión:** 1.0.0
**Fecha:** 15 de Diciembre de 2025

## 1. Introducción
MAFIS es un sistema web diseñado para facilitar la gestión de activos fijos, reportes de fallas y órdenes de trabajo dentro del Servicio Nacional de Aprendizaje (SENA). El sistema permite a los administradores gestionar el inventario, a los técnicos atender órdenes de trabajo y a los solicitantes reportar incidencias.

## 2. Arquitectura del Sistema
El proyecto sigue una arquitectura cliente-servidor desacoplada (SPA):

- **Frontend:** Construido con **React (Vite)**. Maneja la interfaz de usuario, navegación y consumo de la API REST.
- **Backend:** Desarrollado en **Python (Flask)**. Expone una API RESTful para la lógica de negocio y persistencia de datos.
- **Base de Datos:** **MySQL**. Almacena la información relacional de usuarios, activos, reportes y órdenes.

### Tecnología Stack
*   **Lenguaje Servidor:** Python 3.x
*   **Framework Web:** Flask
*   **Base de Datos:** MySQL
*   **Driver DB:** PyMySQL
*   **Autenticación:** JSON Web Tokens (PyJWT)
*   **Lenguaje Cliente:** JavaScript (ES6+)
*   **Librería UI:** React 18
*   **Empaquetador:** Vite
*   **Estilos:** CSS3 nativo + Bootstrap (parcial)

## 3. Modelo de Datos (Esquema BD)
A continuación se describe el esquema relacional inferido de la base de datos `activos`:

### Tablas Principales

#### `usuarios`
Almacena las credenciales y roles de los usuarios del sistema.
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INT (PK) | Identificador único |
| `nombre` | VARCHAR | Nombre completo del usuario |
| `email` | VARCHAR | Correo electrónico (Unique) |
| `password_hash`| VARCHAR | Hash SHA-256 de la contraseña + salt |
| `rol` | ENUM | 'administrador', 'tecnico', 'solicitante' |
| `fecha_registro`| DATETIME | Timestamp de creación |

#### `activos`
Inventario físico de la organización.
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INT (PK) | Identificador único |
| `nombreActivo` | VARCHAR | Nombre descriptivo del bien |
| `ubicacion` | VARCHAR | Lugar físico donde se encuentra |
| `estado` | ENUM | 'Activo', 'Inactivo' |

#### `reportes_falla`
Incidencias reportadas sobre un activo específico.
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INT (PK) | Identificador único |
| `activo_id` | INT (FK) | Referencia a la tabla `activos` |
| `descripcion` | TEXT | Descripción detallada de la falla |
| `prioridad` | ENUM | 'Baja', 'Media', 'Alta' |
| `estado` | ENUM | 'Reportado', 'En proceso', 'Completado' |
| `fecha` | DATETIME | Fecha del reporte |

#### `ordenes_trabajo`
Asignación de un reporte a un técnico para su resolución.
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INT (PK) | Identificador único |
| `reporte_id` | INT (FK) | Referencia a `reportes_falla` |
| `usuario_id` | INT (FK) | ID del técnico asignado (`usuarios`) |
| `descripcion` | TEXT | Instrucciones o notas de la orden |
| `estado` | ENUM | 'Asignada', 'En proceso', 'Completada' |
| `fecha_creacion`| DATETIME | Fecha de asignación |

## 4. Descripción de la API REST
El backend expone endpoints bajo el prefijo `/api`.

### Autenticación (`auth.py`)
*   `POST /api/login`: Recibe `{email, password}`. Retorna Token JWT.
*   `POST /api/register`: Registra nuevos usuarios.

### Usuarios (`usuarios.py`)
*   `GET /api/usuarios`: Lista todos los usuarios.
*   `POST /api/usuarios`: Crea un usuario.
*   `PUT /api/usuarios/<id>`: Actualiza datos y/o contraseña.
*   `DELETE /api/usuarios/<id>`: Elimina usuario (si no tiene órdenes).

### Activos (`activos.py`)
*   `GET /api/activos`: Lista inventario.
*   `POST /api/activos`: Crea activo.
*   `PUT /api/activos/<id>`: Edita activo.
*   `DELETE /api/activos/<id>`: Elimina activo.

### Reportes (`reportes.py`)
*   `GET /api/reportes`: Lista fallas reportadas.
*   `GET /api/reportes/sin-orden`: Lista reportes pendientes de asignación.
*   `POST /api/reportes`: Crea reporte.
*   `PUT /api/reportes/<id>`: Actualiza reporte.
*   `DELETE /api/reportes/<id>`: Elimina reporte.

### Órdenes (`ordenes.py`)
*   `GET /api/ordenes`: Lista órdenes de trabajo con detalles (JOINs).
*   `POST /api/ordenes`: Asigna un reporte a un técnico.
*   `PUT /api/ordenes/<id>/estado`: Cambia estado (`Asignada` -> `En proceso` -> `Completada`).
*   `DELETE /api/ordenes/<id>`: Elimina orden.

## 5. Estructura del Proyecto

```
/mafis-soto-main
├── backend/                  # código fuente Servidor
│   ├── app.py                # Punto de entrada Flask y configuración CORS
│   ├── auth.py               # Lógica de autenticación y JWT
│   ├── activos.py            # Endpoints de gestión de activos
│   ├── ordenes.py            # Endpoints de órdenes de trabajo
│   ├── reportes.py           # Endpoints de reportes de falla
│   ├── usuarios.py           # Endpoints de gestión de usuarios
│   ├── requirements.txt      # Dependencias Python
│   └── venv/                 # Entorno virtual
│
├── src/                      # Código fuente Cliente
│   ├── componentes/          # Componentes React
│   │   ├── Activos.jsx       # Gestión de invenario
│   │   ├── Dashboard.jsx     # Panel principal y navegación
│   │   ├── Login.jsx         # Login y Recuperación
│   │   ├── Dashboard.css     # Estilos del panel
│   │   ├── Login.css         # Estilos del login
│   │   ├── Ordenes.jsx       # Gestión de órdenes
│   │   ├── Reportes.jsx      # Gestión de reportes
│   │   └── Usuarios.jsx      # Gestión de usuarios
│   ├── App.jsx               # Enrutador principal
│   └── main.jsx              # Entry point React
│
└── package.json              # Dependencias Node.js
```

## 6. Instalación y Despliegue Local

### Requisitos Previos
*   Python 3.8+
*   Node.js 16+
*   MySQL Server corriendo en `localhost` puerto 3306.

### Pasos Backend
1.  Navegar a `backend/`.
2.  Crear entorno virtual: `python -m venv venv`.
3.  Activar entorno: `venv\Scripts\activate`.
4.  Instalar dependencias: `pip install -r requirements.txt`.
5.  Configurar base de datos en `auth.py` y demás archivos (user: `root`, pass: `120606`).
6.  Ejecutar: `python app.py`.

### Pasos Frontend
1.  Navegar a la raíz del proyecto.
2.  Instalar dependencias: `npm install`.
3.  Ejecutar servidor de desarrollo: `npm run dev`.
4.  Acceder a `http://localhost:5173`.
