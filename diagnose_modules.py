import sys
import os
import requests
import json

# Configuración interna de Docker
BASE_URL = "http://localhost:10000" 
USERNAME = "trebolsoft"
PASSWORD = "Porquesi2025" # Tu contraseña actual

def diagnose():
    print("\n🩺 DIAGNÓSTICO DE MÓDULOS Y CONEXIONES (Desde el servidor)")
    print("=" * 60)

    # 1. Verificar conexión básica
    print("\n📡 1. Verificando API Base...")
    try:
        r = requests.get(f"{BASE_URL}/health")
        if r.status_code == 200:
            print("   ✅ API Online y respondiendo (Healthcheck OK)")
        else:
            print(f"   ❌ API responde con error: {r.status_code}")
            return
    except Exception as e:
        print(f"   ❌ No se puede conectar a {BASE_URL}")
        print(f"      Error: {e}")
        print("      Asegúrate de ejecutar esto DENTRO del contenedor api")
        return

    # 2. Login
    print("\n🔐 2. Verificando Autenticación...")
    try:
        auth_resp = requests.post(f"{BASE_URL}/api/v1/auth/token", data={
            "username": USERNAME,
            "password": PASSWORD
        })
        
        if auth_resp.status_code != 200:
            print(f"   ❌ Login falló para '{USERNAME}': {auth_resp.status_code}")
            print(f"      Respuesta: {auth_resp.text}")
            return
            
        token = auth_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("   ✅ Login exitoso. Token generado.")
        
    except Exception as e:
        print(f"   ❌ Error en login: {e}")
        return

    # 3. Verificar Permisos
    print("\n👤 3. Verificando Rol y Permisos...")
    try:
        resp = requests.get(f"{BASE_URL}/api/v1/users/me", headers=headers)
        if resp.status_code == 200:
            me = resp.json()
            print(f"   Usuario: {me.get('username')}")
            print(f"   Rol: {me.get('role')}")
            print(f"   Superusuario: {me.get('is_superuser', False)}")
            
            if not me.get('is_superuser', False) and me.get('role') != 'admin':
                print("   ⚠️ ADVERTENCIA: Este usuario no es admin ni superusuario.")
        else:
            print(f"   ❌ Error obteniendo perfil: {resp.status_code}")
            print(f"      Respuesta: {resp.text}")
    except Exception as e:
        print(f"   ❌ Error obteniendo perfil: {e}")

    # 4. Verificar Módulos Específicos
    print("\n📦 4. Verificando Módulos (Endpoints)...")
    
    endpoints = [
        ("Total Clientes", "/api/v1/clients/"),
        ("Pendientes (Créditos)", "/api/v1/credits/"),
        ("Cobranzas Hoy (Transacciones)", "/api/v1/transactions/"),
        ("Reportes (Stats)", "/api/v1/stats/")
    ]
    
    for name, path in endpoints:
        url = f"{BASE_URL}{path}"
        print(f"   👉 Probando {name} ({path})...", end=" ")
        try:
            r = requests.get(url, headers=headers)
            if r.status_code == 200:
                data = r.json()
                count = len(data) if isinstance(data, list) else "OK"
                print(f"✅ FUNCIONA. Datos: {count}")
            elif r.status_code == 404:
                print("❌ NO EXISTE (404) - Ruta no configurada en backend")
            elif r.status_code == 403:
                print("⛔ PROHIBIDO (403) - Falta de permisos")
            else:
                print(f"⚠️ Error {r.status_code}")
        except Exception as e:
            print(f"❌ Error conexión: {e}")

    print("\n" + "="*60)

if __name__ == "__main__":
    diagnose()