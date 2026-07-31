import urllib.request
import json
import sys

url = "https://teotek.com.mx/api/install.php"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})

print("Verificando conexion con Neubox...")
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print("\n--- Respuesta del servidor ---")
        print(html.encode('ascii', 'ignore').decode('ascii'))
        if "correctamente" in html.lower() or "instalador dogood" in html.lower():
            print("\n[EXITO] La base de datos se conecto e instalo correctamente.")
        else:
            print("\n[AVISO] Respuesta recibida pero revisa el contenido.")
except urllib.error.HTTPError as e:
    body = e.read().decode('utf-8', errors='ignore')
    print(f"\n[ERROR HTTP {e.code}]:")
    print(body.encode('ascii', 'ignore').decode('ascii'))
except Exception as e:
    print(f"\n[ERROR]: {e}")
