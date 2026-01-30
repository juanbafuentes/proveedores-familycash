
import psycopg2
import re
import sys

# Postgres connection URL
PG_URL = "postgres://postgres:Zq0VhhQLn3NK6kVW8QCxL4kUOckidMBX8vh2LCyCUbsG90KEfCVhRML8IUaZU2dC@82.98.177.189:5460/postgres"
SQL_FILE = r"c:\testes\proveedores-familycash\src\main\resources\database.sql"

def migrate():
    try:
        print(f"Conectando a PostgreSQL...")
        conn = psycopg2.connect(PG_URL)
        conn.autocommit = True
        cur = conn.cursor()
        
        print(f"Leyendo y limpiando {SQL_FILE}...")
        with open(SQL_FILE, 'r', encoding='latin1') as f:
            content = f.read()
            
        # 1. Global Pre-cleaning
        # Comments
        content = re.sub(r'^--.*$', '', content, flags=re.MULTILINE)
        content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
        
        # MySQL escaping
        content = content.replace("\\'", "''")
        content = content.replace('`', '"')
        
        # MySQL headers
        content = re.sub(r'^(SET|START TRANSACTION|COMMIT|LOCK|UNLOCK).*?;', '', content, flags=re.IGNORECASE | re.MULTILINE)
        
        # 2. Split into statements
        # Using a more careful split: semicolon ONLY if followed by newline or end of string
        statements = re.split(r';\s*$', content, flags=re.MULTILINE)
        
        print(f"Analizando {len(statements)} sentencias...")
        
        success = 0
        errors = 0
        
        for i, stmt in enumerate(statements):
            sql = stmt.strip()
            if not sql:
                continue
            
            # Post-split cleaning per statement
            # Type fixed
            sql = re.sub(r'\bint\(\d+\)', 'integer', sql, flags=re.IGNORECASE)
            sql = re.sub(r'\bbigint\(\d+\)', 'bigint', sql, flags=re.IGNORECASE)
            sql = re.sub(r'\bvarchar\(\d+\)', 'text', sql, flags=re.IGNORECASE)
            sql = re.sub(r'\bchar\(\d+\)', 'text', sql, flags=re.IGNORECASE)
            sql = re.sub(r'\bdecimal\(\d+,\d+\)', 'numeric', sql, flags=re.IGNORECASE)
            sql = re.sub(r'\bdecimal\(\d+\)', 'numeric', sql, flags=re.IGNORECASE)
            sql = re.sub(r'\btinyint\(1\)', 'smallint', sql, flags=re.IGNORECASE)
            sql = re.sub(r'\bblob\b', 'bytea', sql, flags=re.IGNORECASE)
            
            # Constraint/Option fixed
            sql = re.sub(r'ENGINE=InnoDB.*', '', sql, flags=re.IGNORECASE)
            sql = re.sub(r'DEFAULT CHARSET=\w+', '', sql, flags=re.IGNORECASE)
            sql = re.sub(r'CHARACTER SET \w+', '', sql, flags=re.IGNORECASE)
            sql = re.sub(r'COLLATE \w+', '', sql, flags=re.IGNORECASE)
            
            # AUTO_INCREMENT -> SERIAL
            if "AUTO_INCREMENT" in sql.upper():
                sql = re.sub(r'(\b\w+\b)\s+(?:integer|bigint)\s+NOT\s+NULL\s+AUTO_INCREMENT', r'\1 SERIAL', sql, flags=re.IGNORECASE)
                sql = sql.replace("AUTO_INCREMENT", "")
            
            # Handle INDEXES (MySQL KEY)
            # Skip ALTER TABLE ADD KEY, handle ADD PRIMARY KEY
            if "ALTER TABLE" in sql.upper() and ("MODIFY" in sql.upper() or "ADD KEY" in sql.upper()):
                # Try to keep ADD PRIMARY KEY but skip ADD KEY
                if "ADD PRIMARY KEY" in sql.upper() and "ADD KEY" not in sql.upper():
                    pass # Keep it
                else:
                    continue # Skip it
            
            # Final check
            if not re.search(r'^(CREATE|INSERT|ALTER|DROP)', sql.strip(), re.I):
                continue

            # DROP table if CREATE table
            if i < 20: # Limit to base setup
                if "CREATE TABLE" in sql.upper():
                    match = re.search(r'CREATE TABLE "(.*?)"', sql)
                    if match:
                        name = match.group(1)
                        try:
                            cur.execute(f'DROP TABLE IF EXISTS "{name}" CASCADE;')
                        except: pass
            
            try:
                cur.execute(sql)
                success += 1
                if success % 5 == 0:
                    print(f"Éxito: {success}. Errores: {errors}.")
            except Exception as e:
                errors += 1
                if errors <= 5:
                    print(f"Fallo grave en sentencia {i}: {e}")
                    print(f"SQL: {sql[:200]}...")
                pass
                
        cur.close()
        conn.close()
        print(f"FINALIZADO. Éxito: {success}, Errores detectados: {errors}")
        
    except Exception as e:
        print(f"ERROR CRÍTICO: {e}")

if __name__ == "__main__":
    migrate()
