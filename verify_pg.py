
import psycopg2
PG_URL = "postgres://postgres:Zq0VhhQLn3NK6kVW8QCxL4kUOckidMBX8vh2LCyCUbsG90KEfCVhRML8IUaZU2dC@82.98.177.189:5460/postgres"
try:
    conn = psycopg2.connect(PG_URL)
    cur = conn.cursor()
    tables = ['LU_PRO', 'LU_ARA', 'PAISES', 'producto_imagen']
    for table in tables:
        cur.execute(f'SELECT COUNT(*) FROM "{table}"')
        print(f"Tabla {table}: {cur.fetchone()[0]} filas.")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
