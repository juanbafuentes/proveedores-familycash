
import psycopg2
PG_URL = "postgres://postgres:Zq0VhhQLn3NK6kVW8QCxL4kUOckidMBX8vh2LCyCUbsG90KEfCVhRML8IUaZU2dC@82.98.177.189:5460/postgres"
try:
    conn = psycopg2.connect(PG_URL)
    conn.autocommit = True
    cur = conn.cursor()
    
    # Create _DES versions of main tables
    mappings = {
        'LU_PRO': 'LU_PRO_DES',
        'LU_ARA': 'LU_ARA_DES',
        'producto_imagen': 'producto_imagen_des'
    }
    
    for src, dst in mappings.items():
        print(f"Creando tabla {dst} como copia de {src}...")
        cur.execute(f'DROP TABLE IF EXISTS "{dst}" CASCADE;')
        cur.execute(f'CREATE TABLE "{dst}" (LIKE "{src}" INCLUDING ALL);')
        cur.execute(f'INSERT INTO "{dst}" SELECT * FROM "{src}";')
        
    cur.close()
    conn.close()
    print("Tablas de desarrollo (_DES) creadas con éxito.")
except Exception as e:
    print(f"Error: {e}")
