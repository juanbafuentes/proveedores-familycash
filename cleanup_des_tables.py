
import psycopg2

PG_URL = "postgres://postgres:Zq0VhhQLn3NK6kVW8QCxL4kUOckidMBX8vh2LCyCUbsG90KEfCVhRML8IUaZU2dC@82.98.177.189:5460/postgres"

def cleanup():
    try:
        print("Conectando a PostgreSQL para limpieza de tablas DES...")
        conn = psycopg2.connect(PG_URL)
        conn.autocommit = True
        cur = conn.cursor()
        
        # Lista de tablas DES identificadas
        tablas_des = [
            'LU_PRO_DES',
            'LU_ARA_DES',
            'producto_imagen_des'
        ]
        
        for tabla in tablas_des:
            print(f"Eliminando tabla: {tabla}...")
            cur.execute(f'DROP TABLE IF EXISTS "{tabla}" CASCADE;')
            
        cur.close()
        conn.close()
        print("Limpieza completada con éxito. Solo quedan las tablas PROD.")
    except Exception as e:
        print(f"Error en la limpieza: {e}")

if __name__ == "__main__":
    cleanup()
