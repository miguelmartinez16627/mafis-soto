#importar flask

from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app) #permite que react llame sin bloqueos

"""conexion a la base de datos"""
def get_connection():
    return pymysql.connect(
        host='127.0.0.1', #servidor
        user='root',
        password='120606',
        database='activos',
        charset='utf8mb4',
        cursorclass= pymysql.cursors.DictCursor, #me permite hacer select
        
        #endpoint es  una url de tu api ejecuta una funcion y devuelve una respuesta
    )

"""--------------------------------------"""
@app.route('/activos')
def get_activos():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM activos")
        rows = cursor.fetchall()
    conn.close()
    return jsonify(rows)


@app.route('/activos', methods=['POST'] ) # es un decorador de flask que asocia la funcion crear activo con la url activo es decir: que esa funcion solo debe ejecutarse cuando se recibe una solicitud post 
def crear_activos(): #define la funcion de python que se ejecuta cuando se accede a la ruta 
    data = request.get_json()# recupera los datos es decir: el nuevo activo que el ciente envio en cuerpo de la solicitud 
    conn = get_connection()# establese la coneccion co la base de datos
    with conn.cursor() as cursor:# cera un cursor a partir de la coneccion, el cursor es el objeto que se utiliza para ejecutar comandos sql. el bloque with asegura que le cursor se cierre automaticamente despues  
        sql = 'INSERT INTO activos(nombreActivo, ubicacion, estado) VALUES (%s, %s, %s)'#define la consulta para insertar datos. el %S son placeholders(marcadores de posicion) que se remplazaran de forma segura con lo svalores de las variables 
        cursor.execute(sql, (data['nombreActivo'], data['ubicacion'], data['estado']))#ejecuta la consulta sql ya creada qu esta almacenada en sql, como loa valores se pasan como una tupla(array)el %s previene ataque de inyeccion de sql 
        conn.commit()#permite guardar los cambios de forma permanente en la base de datos 
    conn.close()#cierra la coneccion de la base de datos 
    return jsonify({'msg': 'creado'}), 201 #retorna un mensaje creado 

# quiero editar activos 
@app.route('/activos/<int:id>', methods=['PUT'])
def actualizar_activo(id):
    data= request.get_json()
    conn = get_connection()
    with conn.cursor() as cursor:
        sql = 'UPDATE activos SET nombreActivo=%s, ubicacion=%s, estado=%s WHERE id=%s'
        filas = cursor.execute(sql, (data['nombreActivo'], data['ubicacion'], data['estado'], id))
        conn.commit()
    conn.close()
    if filas == 0: 
        return jsonify({'msg': 'No encontrado'}), 404
    return jsonify({'msg': 'Actualizado'}), 200

# quiero eliminar activos
@app.route('/activos/<int:id>', methods=['DELETE'])
def eliminar_activo(id):
    conn = get_connection()
    with conn.cursor() as cursor:
        sql = 'DELETE FROM activos WHERE id=%s'
        filas = cursor.execute(sql, (id,))
        conn.commit()
    conn.close()
    if filas == 0:
        return jsonify({'msg': 'No encontrado'}), 404
    return jsonify({'msg': 'Eliminado'}), 200

# ---------- REPORTES DE FALLA ----------
# 1. Listar con JOIN al nombre del activo
@app.route('/reportes')
def get_reportes():
    conn = get_connection()
    with conn.cursor() as cursor:
        sql = """
            SELECT r.id, r.activo_id, a.nombreActivo, r.descripcion, r.prioridad, r.estado, r.fecha
            FROM reportes_falla r
            JOIN activos a ON a.id = r.activo_id
            ORDER BY r.fecha DESC
        """
        cursor.execute(sql)
        rows = cursor.fetchall()
    conn.close()
    return jsonify(rows)

# 2. Crear reporte (fecha se genera sola)
@app.route('/reportes', methods=['POST'])
def crear_reporte():
    data = request.get_json()
    conn = get_connection()
    with conn.cursor() as cursor:
        sql = "INSERT INTO reportes_falla (activo_id, descripcion, prioridad, estado) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (data['activo_id'], data['descripcion'], data['prioridad'], 'Reportado'))
        conn.commit()
    conn.close()
    return jsonify({'msg': 'Reporte creado'}), 201

# 3. Editar reporte
@app.route('/reportes/<int:id>', methods=['PUT'])
def actualizar_reporte(id):
    data = request.get_json()
    conn = get_connection()
    with conn.cursor() as cursor:
        sql = "UPDATE reportes_falla SET activo_id=%s, descripcion=%s, prioridad=%s, estado=%s WHERE id=%s"
        filas = cursor.execute(sql, (data['activo_id'], data['descripcion'], data['prioridad'], data['estado'], id))
        conn.commit()
    conn.close()
    if filas == 0:
        return jsonify({'error': 'Not found'}), 404
    return jsonify({'msg': 'Actualizado'})

# 4. Eliminar reporte (solo si no tiene órdenes asociadas)
@app.route('/reportes/<int:id>', methods=['DELETE'])
def borrar_reporte(id):
    conn = get_connection()
    with conn.cursor() as cursor:
        # Verificar si hay órdenes asociadas (preparado para futuro)
        cursor.execute("SELECT COUNT(*) AS total FROM ordenes_trabajo WHERE reporte_id = %s", (id,))
        count = cursor.fetchone()['total']
        if count > 0:
            conn.close()
            return jsonify({'error': 'No se puede eliminar: tiene órdenes asociadas'}), 409

        filas = cursor.execute("DELETE FROM reportes_falla WHERE id=%s", (id,))
        conn.commit()
    conn.close()
    if filas == 0:
        return jsonify({'error': 'Not found'}), 404
    return jsonify({'msg': 'Borrado'})

# 5. Preflight para evitar bloqueo CORS
@app.route('/reportes/<int:id>', methods=['OPTIONS'])
def options_reporte(id):
    return '', 200

# ---------- USUARIOS ----------
# 1. Listar
@app.route('/usuarios')
def get_usuarios():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT id, nombre, email, rol, fecha_registro FROM usuarios ORDER BY id DESC")
        rows = cursor.fetchall()
    conn.close()
    return jsonify(rows)

# 2. Crear (password en texto plano por ahora, más adelante hash)
@app.route('/usuarios', methods=['POST'])
def crear_usuario():
    data = request.get_json()
    conn = get_connection()
    with conn.cursor() as cursor:
        sql = "INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (data['nombre'], data['email'], data['password'], data['rol']))
        conn.commit()
    conn.close()
    return jsonify({'msg': 'Usuario creado'}), 201

# 2.1 Preflight general para usuarios
@app.route('/usuarios', methods=['OPTIONS'])
def options_usuarios_general():
    return '', 200

# 3. Editar
@app.route('/usuarios/<int:id>', methods=['PUT'])
def actualizar_usuario(id):
    data = request.get_json()
    conn = get_connection()
    with conn.cursor() as cursor:
        sql = "UPDATE usuarios SET nombre=%s, email=%s, password_hash=%s, rol=%s WHERE id=%s"
        filas = cursor.execute(sql, (data['nombre'], data['email'], data['password'], data['rol'], id))
        conn.commit()
    conn.close()
    if filas == 0:
        return jsonify({'error': 'Not found'}), 404
    return jsonify({'msg': 'Actualizado'})

# 4. Eliminar (solo si no tiene órdenes asociadas)
@app.route('/usuarios/<int:id>', methods=['DELETE'])
def borrar_usuario(id):
    conn = get_connection()
    with conn.cursor() as cursor:
        # Verificar si tiene órdenes asociadas (preparado para futuro)
        cursor.execute("SELECT COUNT(*) AS total FROM ordenes_trabajo WHERE usuario_id = %s", (id,))
        count = cursor.fetchone()['total']
        if count > 0:
            conn.close()
            return jsonify({'error': 'No se puede eliminar: tiene órdenes asociadas'}), 409

        filas = cursor.execute("DELETE FROM usuarios WHERE id=%s", (id,))
        conn.commit()
    conn.close()
    if filas == 0:
        return jsonify({'error': 'Not found'}), 404
    return jsonify({'msg': 'Borrado'})

# 4.1 Preflight para borrado de usuarios
@app.route('/usuarios/<int:id>', methods=['OPTIONS'])
def options_borrar_usuario(id):
    return '', 200


if __name__ == '__main__':
    app.run(debug=True)

    

