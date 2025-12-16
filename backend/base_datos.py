import os
import pymysql
import psycopg2
from urllib.parse import urlparse

def get_db_connection():
    """
    Obtiene conexión a la base de datos.
    Soporta PostgreSQL (producción) y MySQL (desarrollo).
    """
    database_url = os.getenv('DATABASE_URL')
    
    if database_url:
        # Producción: usar DATABASE_URL (PostgreSQL en Render)
        url = urlparse(database_url)
        
        # Render usa postgres://, pero psycopg2 necesita postgresql://
        if url.scheme == 'postgres':
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        
        try:
            conn = psycopg2.connect(database_url)
            return conn
        except Exception as e:
            print(f"Error conectando a PostgreSQL: {e}")
            raise
    else:
        # Desarrollo: usar MySQL local
        try:
            conn = pymysql.connect(
                host=os.getenv('DB_HOST', 'localhost'),
                user=os.getenv('DB_USER', 'root'),
                password=os.getenv('DB_PASSWORD', ''),
                database=os.getenv('DB_NAME', 'mafis_soto'),
                cursorclass=pymysql.cursors.DictCursor
            )
            return conn
        except Exception as e:
            print(f"Error conectando a MySQL: {e}")
            raise

def execute_query(query, params=None, fetch=True):
    """
    Ejecuta una query y retorna los resultados.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(query, params or ())
        
        if fetch:
            result = cursor.fetchall()
        else:
            conn.commit()
            result = cursor.rowcount
        
        return result
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()
