# 🧹 Cómo Limpiar Jugadores No Deseados

## Problema

Aparecen jugadores que no deberían estar (solo deberías tener a Irasema y Conrado).

## ✅ Soluciones

### Opción 1: Limpiar desde Firebase Console (Recomendado)

1. **Abre Firebase Console**:
   - Ve a: https://console.firebase.google.com/
   - Selecciona tu proyecto "ibrascrabble"

2. **Ve a Realtime Database**:
   - En el menú lateral, haz clic en "Realtime Database"
   - Verás la estructura de datos

3. **Limpia los jugadores guardados**:
   - Busca el nodo `savedPlayers`
   - Haz clic en él
   - Verás una lista de nombres
   - Elimina los que no quieras (haz clic en la X)
   - Deja solo: `Irasema` y `Conrado`

4. **Limpia las estadísticas** (opcional):
   - Busca el nodo `playerStats`
   - Elimina las estadísticas de jugadores no deseados
   - O elimina todo el nodo para empezar de cero

### Opción 2: Limpiar desde la Aplicación

1. **Abre tu aplicación** en el navegador

2. **Abre la Consola del Navegador** (F12)

3. **Ejecuta este código** para limpiar jugadores guardados:

```javascript
// Ver jugadores actuales
const fb = window.firebaseDB;
const playersRef = fb.ref(fb.database, 'savedPlayers');
fb.get(playersRef).then(snapshot => {
    console.log('Jugadores actuales:', snapshot.val());
});

// Establecer solo Irasema y Conrado
const newPlayers = ['Irasema', 'Conrado'];
fb.set(playersRef, newPlayers).then(() => {
    console.log('Jugadores actualizados');
    location.reload();
});
```

4. **Para limpiar estadísticas**:

```javascript
// Ver estadísticas actuales
const statsRef = fb.ref(fb.database, 'playerStats');
fb.get(statsRef).then(snapshot => {
    console.log('Estadísticas actuales:', snapshot.val());
});

// Limpiar todas las estadísticas
fb.set(statsRef, {}).then(() => {
    console.log('Estadísticas limpiadas');
    location.reload();
});
```

### Opción 3: Usar el Botón "Limpiar Estadísticas"

1. **En la pantalla de configuración** de la app
2. Haz clic en **"Limpiar Estadísticas"**
3. Esto eliminará TODAS las estadísticas
4. Los jugadores guardados permanecerán

---

## 🎯 Mantener Solo Irasema y Conrado

### Paso a Paso Completo:

1. **Firebase Console** → **Realtime Database**

2. **Estructura que deberías ver**:
```
ibrascrabble
  ├── savedPlayers
  │   ├── 0: "Irasema"
  │   └── 1: "Conrado"
  └── playerStats
      ├── Irasema: {...}
      └── Conrado: {...}
```

3. **Elimina cualquier otro nombre** que aparezca

4. **Guarda los cambios** (Firebase guarda automáticamente)

5. **Refresca tu aplicación** (Ctrl + Shift + R)

---

## 🔒 Prevenir Jugadores No Deseados

Para evitar que se agreguen jugadores no deseados en el futuro:

### Opción A: Reglas de Firebase

1. Ve a **Realtime Database** → **Rules**

2. Cambia las reglas a:

```json
{
  "rules": {
    "savedPlayers": {
      ".read": true,
      ".write": true,
      ".validate": "newData.isString() && (newData.val() == 'Irasema' || newData.val() == 'Conrado')"
    },
    "playerStats": {
      ".read": true,
      ".write": true
    }
  }
}
```

**Nota**: Esto solo permitirá agregar a Irasema o Conrado.

### Opción B: Validación en el Código

Puedes modificar el código para que solo acepte ciertos nombres, pero esto requeriría cambios en `app.js`.

---

## 📝 Comandos Rápidos para la Consola

### Ver datos actuales:
```javascript
// Jugadores
firebase.database().ref('savedPlayers').once('value').then(s => console.log(s.val()));

// Estadísticas
firebase.database().ref('playerStats').once('value').then(s => console.log(s.val()));
```

### Limpiar todo:
```javascript
// Solo dejar Irasema y Conrado
firebase.database().ref('savedPlayers').set(['Irasema', 'Conrado']);

// Limpiar estadísticas
firebase.database().ref('playerStats').set({});
```

---

## ✅ Verificación

Después de limpiar, verifica:

1. **Abre la aplicación**
2. **Recarga** (Ctrl + Shift + R)
3. **Verifica** que solo aparezcan Irasema y Conrado
4. **Si aparece el ranking**, solo deberían estar ellos dos

---

## 🆘 Si Siguen Apareciendo

Si después de limpiar siguen apareciendo jugadores no deseados:

1. **Limpia localStorage**:
   - F12 → Application → Local Storage
   - Elimina `scrabble_saved_players`
   - Elimina `scrabble_player_stats`

2. **Limpia caché del navegador**:
   - Ctrl + Shift + Delete
   - Selecciona "Caché" y "Cookies"
   - Limpia

3. **Refresca la página**:
   - Ctrl + Shift + R

---

**Recomendación**: Usa la Opción 1 (Firebase Console) ya que es la más directa y segura.
