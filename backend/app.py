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



if __name__ == '__main__':
    app.run(debug=True)
    

