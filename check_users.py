
import mysql.connector

try:
    conn = mysql.connector.connect(
        host="vl23791.dinaserver.com",
        user="adminFamilyCash",
        password="MFores24$",
        database="proveedores_familycash"
    )
    cursor = conn.cursor()
    # Query LU_PRO or LU_PRO_DES
    print("Consulta a LU_PRO:")
    cursor.execute("SELECT id_pro, ql_pro_nif, pro_passwd FROM LU_PRO LIMIT 3")
    for row in cursor.fetchall():
        print(f"ID: {row[0]}, NIF: {row[1]}, Pass: {row[2]}")
        
    print("\nConsulta a LU_PRO_DES:")
    cursor.execute("SELECT id_pro, ql_pro_nif, pro_passwd FROM LU_PRO_DES LIMIT 3")
    for row in cursor.fetchall():
        print(f"ID: {row[0]}, NIF: {row[1]}, Pass: {row[2]}")
        
    conn.close()
except Exception as e:
    print(f"Error: {e}")
