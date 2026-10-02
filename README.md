# 🚌 RutaYa - Asistente Virtual de Pasajes de Autobús

Este proyecto implementa el flujo conversacional completo de **RutaYa**, el asistente virtual especializado en cotización y reserva de pasajes de autobús interprovincial.

---

## 📁 Archivos del Proyecto

La solución ha sido desarrollada en la carpeta:
`C:\Users\MEDICINA\.gemini\antigravity\scratch\rutaya_bot`

1. **`index.html`** y **`app.js`**:
   - **Aplicación Web interactiva**: Interfaz de chat moderna y responsiva estilo WhatsApp / travel app.
   - Cuenta con botones de respuesta rápida (chips), tarjetas interactivas de horarios/servicios y emisión visual del boleto.
   - **No requiere instalación**: Puedes abrir el archivo `index.html` directamente con doble clic en cualquier navegador web.

2. **`rutaya_cli.py`**:
   - **Versión de terminal en Python**: Script interactivo para ejecutar por consola con máquina de estados finita.

---

## 🚀 ¿Cómo Ejecutarlo?

### Opción 1: Interfaz Web (Recomendada)
- Simplemente haz doble clic en el archivo [`index.html`](file:///C:/Users/MEDICINA/.gemini/antigravity/scratch/rutaya_bot/index.html) para abrirlo en tu navegador favorito (Chrome, Edge, Firefox).
- O si prefieres un servidor local:
  ```bash
  cd C:\Users\MEDICINA\.gemini\antigravity\scratch\rutaya_bot
  python -m http.server 8000
  ```
  Luego abre `http://localhost:8000` en tu navegador.

### Opción 2: Script por Consola (Python)
- Abre tu terminal o PowerShell y ejecuta:
  ```bash
  cd C:\Users\MEDICINA\.gemini\antigravity\scratch\rutaya_bot
  python rutaya_cli.py
  ```

---

## 📋 Flujo de Conversación Implementado

* **Paso 1: Bienvenida y Ruta**:
  * Saludo amigable de bienvenida.
  * Solicitud de origen y destino (con validación para evitar origen y destino idénticos).
  * Solicitud de fecha de viaje (ida o ida y vuelta).
* **Paso 2: Horarios y Preferencias**:
  * Presenta 3 opciones de servicio simuladas:
    1. *Económico* (S/ 45.00)
    2. *Ejecutivo* (S/ 70.00)
    3. *VIP / Cama Suite* (S/ 95.00)
  * Solicitud de cantidad de pasajeros.
* **Paso 3: Datos de los Pasajeros**:
  * Nombre completo por cada pasajero.
  * Documento de identidad (DNI / Pasaporte).
  * Preferencia de asiento (Ventana/Pasillo en piso 1 o piso 2).
* **Paso 4: Confirmación y Resumen**:
  * Desglose completo de la cotización con precio unitario y total a pagar.
  * Confirmación de datos o posibilidad de corrección.
* **Paso 5: Simulación de Pago y Cierre**:
  * Selección de método de pago (Tarjeta, Yape/Plin, Transferencia).
  * Generación de código de reserva aleatorio (ej. `#RY-84920`).
  * Instrucciones para el abordaje (30 minutos antes con documento físico).
