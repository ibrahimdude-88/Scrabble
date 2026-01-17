# 📤 Guía Rápida: Subir Archivos Manualmente a GitHub

## ✅ Archivos que debes subir

Asegúrate de subir TODOS estos archivos:

```
✓ index.html
✓ styles.css
✓ app.js
✓ README.md
✓ .gitignore (opcional)
```

## 📋 Pasos para Subir Manualmente

### 1. Crear el Repositorio (si no lo has hecho)

1. Ve a https://github.com
2. Haz clic en "+" → "New repository"
3. Nombre: `scrabble-contador` (o el que prefieras)
4. Descripción: "Contador de puntos para Scrabble"
5. **Público** (importante para GitHub Pages gratis)
6. Haz clic en "Create repository"

### 2. Subir los Archivos

**Opción A: Arrastrar y Soltar**
1. En tu repositorio, haz clic en "uploading an existing file"
2. Arrastra los 4 archivos principales a la vez
3. Escribe un mensaje: "Initial commit: Scrabble v2.0"
4. Haz clic en "Commit changes"

**Opción B: Botón "Add file"**
1. Haz clic en "Add file" → "Upload files"
2. Selecciona todos los archivos
3. Escribe un mensaje: "Initial commit: Scrabble v2.0"
4. Haz clic en "Commit changes"

### 3. Habilitar GitHub Pages

1. En tu repositorio, ve a **Settings** (⚙️)
2. En el menú lateral, busca **Pages**
3. En "Source":
   - Branch: **main**
   - Folder: **/ (root)**
4. Haz clic en **Save**
5. Espera 2-5 minutos

### 4. Ver tu Sitio

Tu sitio estará en:
```
https://TU_USUARIO.github.io/scrabble-contador/
```

(Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub)

## 🔥 Configurar Firebase

### Paso 1: Agregar Dominio Autorizado

1. Ve a https://console.firebase.google.com/
2. Selecciona tu proyecto "ibrascrabble"
3. **Authentication** → **Settings** → **Authorized domains**
4. Haz clic en **Add domain**
5. Agrega: `TU_USUARIO.github.io`
6. Guarda

### Paso 2: Reglas de Base de Datos

1. En Firebase Console: **Realtime Database** → **Rules**
2. Usa estas reglas:

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

3. Haz clic en **Publish**

## 🔄 Actualizar el Sitio Después

Cuando hagas cambios:

1. Ve a tu repositorio en GitHub
2. Haz clic en el archivo que quieres actualizar
3. Haz clic en el ícono de lápiz (✏️ Edit)
4. Haz los cambios
5. Scroll abajo → "Commit changes"
6. Espera 2-5 minutos para que se actualice

**O** sube el archivo actualizado:
1. Haz clic en "Add file" → "Upload files"
2. Selecciona el archivo (se sobrescribirá)
3. Commit changes

## ⚠️ Problemas Comunes

### El sitio no carga
- ✅ Verifica que GitHub Pages esté habilitado en Settings
- ✅ Espera 5-10 minutos (la primera vez puede tardar)
- ✅ Limpia la caché del navegador (Ctrl + Shift + R)
- ✅ Verifica que los archivos estén en la raíz del repositorio

### Firebase no funciona
- ✅ Verifica que agregaste el dominio de GitHub Pages a Firebase
- ✅ Verifica que las reglas de la base de datos estén publicadas
- ✅ Abre la consola del navegador (F12) para ver errores

### Los jugadores guardados no aparecen
- ✅ Es normal la primera vez (no hay datos)
- ✅ Juega una partida y los nombres se guardarán
- ✅ En la siguiente partida aparecerán

## 📱 Probar el Sitio

1. Abre: `https://TU_USUARIO.github.io/scrabble-contador/`
2. Abre la consola del navegador (F12)
3. Busca errores en la pestaña "Console"
4. Si hay errores de Firebase, verifica la configuración

## ✅ Checklist Final

- [ ] Todos los archivos subidos (index.html, styles.css, app.js, README.md)
- [ ] GitHub Pages habilitado en Settings
- [ ] Dominio agregado a Firebase Authorized domains
- [ ] Reglas de Firebase publicadas
- [ ] Sitio accesible en la URL de GitHub Pages

---

**¡Tu aplicación estará en línea!** 🎉

URL: `https://TU_USUARIO.github.io/scrabble-contador/`
