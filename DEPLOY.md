# 🚀 Guía de Deploy a GitHub (Sin Git en Terminal)

## ⚠️ Git no está instalado en tu sistema

Tienes dos opciones:

---

## 🎨 OPCIÓN 1: Usar GitHub Desktop (Recomendado - Más Fácil)

### Paso 1: Descargar GitHub Desktop

1. Ve a: https://desktop.github.com/
2. Descarga e instala GitHub Desktop
3. Abre GitHub Desktop
4. Inicia sesión con tu cuenta de GitHub

### Paso 2: Agregar tu proyecto

1. En GitHub Desktop, haz clic en "File" > "Add local repository"
2. Si no está inicializado, haz clic en "Create a repository"
3. Selecciona la carpeta: `d:\Antigravity\Scrabble`
4. Nombre: `scrabble-contador`
5. Descripción: "Contador de puntos para Scrabble en español de México"
6. Haz clic en "Create Repository"

### Paso 3: Hacer el primer commit

1. Verás todos los archivos en la lista de cambios
2. En el campo "Summary", escribe: `Initial commit: Scrabble v2.0 con Firebase`
3. Haz clic en "Commit to main"

### Paso 4: Publicar en GitHub

1. Haz clic en "Publish repository" en la parte superior
2. Asegúrate de que el nombre sea `scrabble-contador`
3. Desmarca "Keep this code private" para que sea público
4. Haz clic en "Publish Repository"

### Paso 5: Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub: https://github.com/TU_USUARIO/scrabble-contador
2. Haz clic en "Settings"
3. En el menú lateral, haz clic en "Pages"
4. En "Source", selecciona "Deploy from a branch"
5. En "Branch", selecciona "main" y la carpeta "/ (root)"
6. Haz clic en "Save"

### ✅ ¡Listo!

Tu sitio estará disponible en:
```
https://TU_USUARIO.github.io/scrabble-contador/
```

---

## 💻 OPCIÓN 2: Instalar Git

### Paso 1: Descargar Git

1. Ve a: https://git-scm.com/download/win
2. Descarga el instalador
3. Ejecuta el instalador (usa las opciones por defecto)
4. Reinicia tu terminal/PowerShell

### Paso 2: Verificar instalación

Abre una nueva terminal y ejecuta:
```bash
git --version
```

Deberías ver algo como: `git version 2.x.x`

### Paso 3: Configurar Git (primera vez)

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Paso 4: Seguir la guía original

Una vez instalado Git, sigue los pasos del archivo `DEPLOY.md`

---

## 🔄 Actualizar después de cambios (GitHub Desktop)

1. Abre GitHub Desktop
2. Verás los archivos modificados
3. Escribe un mensaje describiendo los cambios
4. Haz clic en "Commit to main"
5. Haz clic en "Push origin"

GitHub Pages se actualizará automáticamente.

---

## 🌐 Configurar Firebase para GitHub Pages

### Paso 1: Configurar dominios autorizados

1. Ve a Firebase Console: https://console.firebase.google.com/
2. Selecciona tu proyecto "ibrascrabble"
3. Ve a "Authentication" > "Settings" > "Authorized domains"
4. Haz clic en "Add domain"
5. Agrega: `TU_USUARIO.github.io`

### Paso 2: Configurar reglas de base de datos

1. En Firebase Console, ve a "Realtime Database"
2. Haz clic en la pestaña "Rules"
3. Usa estas reglas para desarrollo:

```json
{
  "rules": {
    "savedPlayers": {
      ".read": true,
      ".write": true
    }
  }
}
```

4. Haz clic en "Publish"

**⚠️ Importante**: Estas reglas permiten acceso completo. Para producción, deberías implementar reglas más seguras.

---

## 📱 Probar tu sitio

1. Espera 2-5 minutos después de hacer push
2. Abre: `https://TU_USUARIO.github.io/scrabble-contador/`
3. Si no funciona:
   - Limpia la caché del navegador (Ctrl + Shift + R)
   - Verifica en GitHub que el deploy terminó (pestaña "Actions")
   - Espera un poco más (puede tomar hasta 10 minutos la primera vez)

---

## 🎯 Resumen Rápido (GitHub Desktop)

1. ✅ Descargar e instalar GitHub Desktop
2. ✅ Crear repositorio desde la carpeta del proyecto
3. ✅ Hacer commit de todos los archivos
4. ✅ Publicar en GitHub
5. ✅ Habilitar GitHub Pages en Settings
6. ✅ Configurar Firebase
7. ✅ Visitar tu sitio web

---

## 🆘 ¿Necesitas ayuda?

- **GitHub Desktop**: https://docs.github.com/es/desktop
- **GitHub Pages**: https://pages.github.com/
- **Firebase**: https://firebase.google.com/docs

---

**¡Tu aplicación estará en línea en minutos!** 🎉
