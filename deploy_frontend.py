
import os
from ftplib import FTP
import shutil

# Configuración
FTP_HOST = "proveedores.familycash.es"
FTP_USER = "proveedoresfamilycash"
FTP_PASS = "MFores24$"
FTP_PORT = 21
LOCAL_DIST = r"c:\testes\proveedores-familycash\frontend\dist"
REMOTE_DIR = "/www/"

def upload_folder(ftp, local_path, remote_path):
    # Entrar en la carpeta remota o crearla
    try:
        ftp.cwd(remote_path)
    except:
        ftp.mkd(remote_path)
        ftp.cwd(remote_path)
    
    for item in os.listdir(local_path):
        local_item = os.path.join(local_path, item)
        if os.path.isfile(local_item):
            print(f"Subiendo archivo: {item}...")
            with open(local_item, "rb") as f:
                ftp.storbinary(f"STOR {item}", f)
        elif os.path.isdir(local_item):
            print(f"Entrando en carpeta: {item}...")
            upload_folder(ftp, local_item, item)
            ftp.cwd("..")

def deploy():
    try:
        print(f"Conectando a {FTP_HOST}...")
        ftp = FTP()
        ftp.connect(FTP_HOST, FTP_PORT)
        ftp.login(FTP_USER, FTP_PASS)
        
        print(f"Desplegando en {REMOTE_DIR}...")
        upload_folder(ftp, LOCAL_DIST, REMOTE_DIR)
        
        ftp.quit()
        print("Despliegue de frontend completado con éxito.")
    except Exception as e:
        print(f"Error en el despliegue: {e}")

if __name__ == "__main__":
    deploy()
