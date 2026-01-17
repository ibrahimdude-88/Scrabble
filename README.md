# 🎲 Scrabble - Contador de Puntos

Aplicación web profesional para contabilizar puntos de Scrabble en español de México con sincronización en la nube vía Firebase.

## 📋 Características

### ✨ Funcionalidades Principales

- **Tablero Visual Interactivo**: Tablero de 15x15 con todas las casillas especiales (Triple Palabra, Doble Palabra, Triple Letra, Doble Letra)
- **Sistema de Turnos Automático**: Gestión clara de turnos entre 2-4 jugadores
- **Cálculo Automático de Puntos**: Contabilización precisa con multiplicadores de casillas especiales
- **Fichas Blancas (Comodines)**: Soporte completo para fichas blancas con valor 0 y animación visual
- **Historial Detallado**: Registro de todas las jugadas con jugador, palabra, puntos y hora
- **Finalización de Partida**: Sistema completo de cierre con conteo de letras sobrantes
- **🔄 Cambiar Fichas**: Opción para cambiar fichas perdiendo el turno
- **⟲ Deshacer Movimientos**: Deshacer hasta las últimas 10 jugadas en caso de error
- **👥 Jugadores Guardados**: Sistema de memoria de jugadores anteriores con Firebase
- **☁️ Sincronización en la Nube**: Datos sincronizados entre dispositivos vía Firebase Realtime Database

### 🎯 Valores de Letras (Español México)

```
A=1  B=3  C=3  D=2  E=1  F=4  G=2  H=4  I=1  J=8
L=1  M=3  N=1  Ñ=8  O=1  P=3  Q=5  R=1  RR=8 S=1
T=1  U=1  V=4  X=8  Y=4  Z=10  Blanca=0
```

### 🎨 Casillas Especiales

- **Triple Palabra (TP)**: Multiplica x3 el valor total de la palabra (rojo)
- **Doble Palabra (DP)**: Multiplica x2 el valor total de la palabra (naranja)
- **Triple Letra (TL)**: Multiplica x3 el valor de la letra (azul)
- **Doble Letra (DL)**: Multiplica x2 el valor de la letra (cian)
- **Centro (★)**: Doble Palabra (primera jugada debe pasar por aquí) (amarillo)

## 🚀 Cómo Usar

### 1. Configuración Inicial

1. Abre `index.html` en tu navegador
2. **Jugadores Anteriores**: Si has jugado antes, verás una lista de jugadores guardados
   - Haz clic en un nombre para agregarlo automáticamente
3. Ingresa los nombres de los jugadores (mínimo 2, máximo 4)
4. Haz clic en "Iniciar Partida"

### 2. Durante el Juego

#### Insertar una Palabra

1. Haz clic en la casilla donde **comienza** tu palabra
2. Escribe la palabra completa en el modal
3. Selecciona la dirección (Horizontal → o Vertical ↓)
4. Haz clic en "Insertar"

#### Marcar Fichas Blancas (Comodines)

1. Después de insertar la palabra, las fichas aparecerán en **amarillo** (temporales)
2. Haz clic en cualquier ficha para alternarla entre:
   - **Amarillo**: Ficha normal (con puntos)
   - **Blanco brillante**: Ficha blanca/comodín (0 puntos) - con animación pulsante
3. Haz clic las veces necesarias hasta que esté correcta

#### Confirmar Jugada

1. Verifica que las fichas blancas estén marcadas correctamente
2. Revisa los puntos calculados automáticamente
3. Haz clic en "Confirmar Jugada"
4. El turno pasa automáticamente al siguiente jugador

#### Otras Acciones

- **Limpiar**: Borra todas las fichas temporales sin confirmar
- **⟲ Deshacer**: Deshace la última jugada confirmada (hasta 10 jugadas atrás)
- **🔄 Cambiar Fichas**: Cambia tus fichas pero pierdes el turno (se registra en el historial)
- **Pasar Turno**: Pasa el turno sin hacer jugada
- **Finalizar Partida**: Inicia el proceso de cierre

### 3. Finalizar Partida

1. Haz clic en "Finalizar Partida"
2. Ingresa las letras sobrantes de cada jugador (ej: "ABC")
3. Haz clic en "Calcular Ganador"

**Cálculo Final:**
- Cada jugador pierde puntos = valor de sus letras sobrantes
- El ganador recibe TODOS los puntos de las letras sobrantes de los demás
- Se muestra la tabla final con el ganador destacado

## 📊 Interfaz

### Panel de Jugadores (Izquierda)
- Nombre de cada jugador
- Puntuación actual
- Indicador de turno activo (borde verde)
- Estadísticas generales

### Tablero Central
- Visualización del tablero 15x15
- Fichas permanentes (color madera)
- Fichas temporales (amarillo pulsante)
- Fichas blancas (blanco brillante con animación)
- Casillas especiales con colores distintivos

### Historial (Derecha)
- Todas las jugadas en orden inverso
- Jugador, palabra, puntos y hora
- Indicadores especiales:
  - 🔄 para cambios de fichas
  - Palabras normales para jugadas
- Scroll automático

## 🎮 Controles

| Acción | Método |
|--------|--------|
| Insertar palabra | Clic en casilla vacía |
| Alternar ficha blanca | Clic en ficha temporal |
| Confirmar jugada | Botón "Confirmar Jugada" |
| Limpiar fichas | Botón "Limpiar" |
| Deshacer jugada | Botón "⟲ Deshacer" |
| Cambiar fichas | Botón "🔄 Cambiar Fichas" |
| Pasar turno | Botón "Pasar Turno" |
| Finalizar partida | Botón "Finalizar Partida" |

## 💡 Consejos

1. **Fichas Blancas**: Recuerda marcarlas ANTES de confirmar la jugada - brillan con animación blanca
2. **Validación**: La app valida que no haya conflictos con fichas existentes
3. **Historial**: Usa el historial para verificar jugadas anteriores
4. **Deshacer**: Puedes deshacer hasta las últimas 10 jugadas si cometiste un error
5. **Cambiar Fichas**: Útil cuando no puedes formar palabras, pero pierdes el turno
6. **Jugadores Guardados**: Los nombres se guardan automáticamente para futuras partidas
7. **Puntos**: Los puntos se calculan automáticamente con todos los multiplicadores

## 🔧 Tecnologías

- HTML5
- CSS3 (Variables CSS, Grid, Flexbox, Animaciones)
- JavaScript Vanilla (ES6+, Async/Await)
- Firebase Realtime Database (Sincronización en la nube)
- Sin dependencias externas adicionales

## ☁️ Firebase

La aplicación utiliza Firebase Realtime Database para:
- Guardar jugadores anteriores
- Sincronizar datos entre dispositivos
- Backup automático en la nube
- Fallback a localStorage si Firebase no está disponible

## 📱 Compatibilidad

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Responsive (móvil y tablet)
- ✅ Funciona offline con localStorage como backup

## 🎨 Características de Diseño

- **Dark Theme**: Interfaz oscura profesional
- **Animaciones Suaves**: Transiciones y efectos visuales
- **Fichas Blancas Animadas**: Pulsación luminosa para fácil identificación
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Accesibilidad**: Colores contrastantes y fuentes legibles
- **Feedback Visual**: Indicadores claros de estado y acciones

## 🆕 Novedades v2.0

- ✅ Integración con Firebase para sincronización en la nube
- ✅ Sistema de jugadores guardados con memoria persistente
- ✅ Función de deshacer movimientos (hasta 10 jugadas)
- ✅ Opción de cambiar fichas perdiendo el turno
- ✅ Mejora visual de fichas blancas con animación
- ✅ Historial mejorado con tipos de acción
- ✅ Validación mejorada de palabras y conflictos

## 📝 Notas

- La aplicación funciona completamente offline con localStorage como backup
- Los datos se sincronizan automáticamente cuando hay conexión a internet
- Firebase proporciona persistencia en la nube
- Para una nueva partida, usa el botón "Nueva Partida" en el header

---

**Desarrollado para jugadores de Scrabble en español de México** 🇲🇽
**Versión 2.0 con Firebase** ☁️
