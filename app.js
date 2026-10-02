/**
 * RutaYa - Sistema de Selección de Asientos y Carga de Pasajeros
 * Basado en la interfaz de autobús de 2 pisos (Primer Piso & Planta Baja)
 */

// DEFINICIÓN DE BUTACAS SEGÚN EL DIAGRAMA DE LA IMAGEN
const SEATS_DATA = {
  upperDeck: [
    // Fila 1: 1, 2 | Pasillo | 3
    { id: 1, name: "1", type: "ejecutivo", price: 815, occupied: true },
    { id: 2, name: "2", type: "ejecutivo", price: 815, occupied: true },
    { id: 3, name: "3", type: "ejecutivo", price: 815, occupied: false }, // Rojo libre en la imagen

    // Fila 2: 4, 5 | Pasillo | vacío / escalera
    { id: 4, name: "4", type: "ejecutivo", price: 815, occupied: true },
    { id: 5, name: "5", type: "ejecutivo", price: 815, occupied: true },
    { id: null, type: "stairs" },

    // Fila 3: 6, 7 | Pasillo | 8
    { id: 6, name: "6", type: "ejecutivo", price: 815, occupied: true },
    { id: 7, name: "7", type: "ejecutivo", price: 815, occupied: true },
    { id: 8, name: "8", type: "ejecutivo", price: 815, occupied: true },

    // Fila 4: 9, 10 | Pasillo | 11
    { id: 9, name: "9", type: "ejecutivo", price: 815, occupied: true },
    { id: 10, name: "10", type: "ejecutivo", price: 815, occupied: true },
    { id: 11, name: "11", type: "ejecutivo", price: 815, occupied: true },

    // Fila 5: 12, 13 | Pasillo | 14
    { id: 12, name: "12", type: "promo", price: 945, occupied: false }, // Verde en la imagen
    { id: 13, name: "13", type: "ejecutivo", price: 815, occupied: true },
    { id: 14, name: "14", type: "ejecutivo", price: 815, occupied: true },

    // Fila 6: 15, 16 | Pasillo | 17
    { id: 15, name: "15", type: "promo", price: 945, occupied: false }, // Verde en la imagen
    { id: 16, name: "16", type: "promo", price: 945, occupied: false }, // Verde en la imagen
    { id: 17, name: "17", type: "ejecutivo", price: 815, occupied: true },

    // Fila 7: 18, 19 | Pasillo | 20
    { id: 18, name: "18", type: "ejecutivo", price: 815, occupied: true },
    { id: 19, name: "19", type: "ejecutivo", price: 815, occupied: true },
    { id: 20, name: "20", type: "ejecutivo", price: 815, occupied: true }
  ],

  lowerDeck: [
    // Fila 1: Escalera a la derecha
    { id: null, type: "toilet" },
    { id: null, type: "stairs_icon" },

    // Fila 2: 21, 22 | Pasillo | 23
    { id: 21, name: "21", type: "suite", price: 945, occupied: true },
    { id: 22, name: "22", type: "suite", price: 945, occupied: true },
    { id: 23, name: "23", type: "suite", price: 945, occupied: true },

    // Fila 3: 24, 25 | Pasillo | 26
    { id: 24, name: "24", type: "suite", price: 945, occupied: false },
    { id: 25, name: "25", type: "suite", price: 945, occupied: false },
    { id: 26, name: "26", type: "suite", price: 945, occupied: true }
  ]
};

// ESTADO DE SELECCIÓN
let selectedSeats = []; // [{ seatId, seatName, serviceType, price, passengerName, passengerDoc }]

// ELEMENTOS DOM
const upperDeckGrid = document.getElementById('upperDeckGrid');
const lowerDeckGrid = document.getElementById('lowerDeckGrid');
const passengerListBody = document.getElementById('passengerListBody');
const emptySeatsRow = document.getElementById('emptySeatsRow');
const totalAmountDisplay = document.getElementById('totalAmountDisplay');
const btnProceedToPay = document.getElementById('btnProceedToPay');
const botGuidance = document.getElementById('botGuidance');
const paymentModal = document.getElementById('paymentModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const modalPaymentContent = document.getElementById('modalPaymentContent');

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
  renderUpperDeck();
  renderLowerDeck();
  updateTableAndTotal();

  btnProceedToPay.addEventListener('click', openPaymentModal);
  btnCloseModal.addEventListener('click', () => paymentModal.classList.remove('open'));
  
  // Cerrar modal al hacer clic afuera
  paymentModal.addEventListener('click', (e) => {
    if (e.target === paymentModal) paymentModal.classList.remove('open');
  });
});

// RENDER PRIMER PISO
function renderUpperDeck() {
  upperDeckGrid.innerHTML = '';
  const rows = [
    [SEATS_DATA.upperDeck[0], SEATS_DATA.upperDeck[1], SEATS_DATA.upperDeck[2]],
    [SEATS_DATA.upperDeck[3], SEATS_DATA.upperDeck[4], SEATS_DATA.upperDeck[5]],
    [SEATS_DATA.upperDeck[6], SEATS_DATA.upperDeck[7], SEATS_DATA.upperDeck[8]],
    [SEATS_DATA.upperDeck[9], SEATS_DATA.upperDeck[10], SEATS_DATA.upperDeck[11]],
    [SEATS_DATA.upperDeck[12], SEATS_DATA.upperDeck[13], SEATS_DATA.upperDeck[14]],
    [SEATS_DATA.upperDeck[15], SEATS_DATA.upperDeck[16], SEATS_DATA.upperDeck[17]],
    [SEATS_DATA.upperDeck[18], SEATS_DATA.upperDeck[19], SEATS_DATA.upperDeck[20]],
  ];

  rows.forEach(rowSeats => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'seat-row';

    // Left 2 seats
    const leftCol = document.createElement('div');
    leftCol.className = 'seat-column-left';
    leftCol.appendChild(createSeatElement(rowSeats[0], 'Piso 1'));
    leftCol.appendChild(createSeatElement(rowSeats[1], 'Piso 1'));

    // Aisle
    const aisle = document.createElement('div');
    aisle.className = 'seat-aisle';

    // Right seat or facility
    const rightCol = document.createElement('div');
    rightCol.className = 'seat-column-right';
    rightCol.appendChild(createSeatElement(rowSeats[2], 'Piso 1'));

    rowDiv.appendChild(leftCol);
    rowDiv.appendChild(aisle);
    rowDiv.appendChild(rightCol);

    upperDeckGrid.appendChild(rowDiv);
  });
}

// RENDER PLANTA BAJA
function renderLowerDeck() {
  lowerDeckGrid.innerHTML = '';

  // Fila escalera / WC
  const stairsRow = document.createElement('div');
  stairsRow.className = 'seat-row';
  stairsRow.innerHTML = `
    <div class="facility-cell" style="width: 82px;">WC 🚻</div>
    <div class="seat-aisle"></div>
    <div class="facility-cell">🪜</div>
  `;
  lowerDeckGrid.appendChild(stairsRow);

  // Filas de asientos suite
  const suiteRows = [
    [SEATS_DATA.lowerDeck[2], SEATS_DATA.lowerDeck[3], SEATS_DATA.lowerDeck[4]],
    [SEATS_DATA.lowerDeck[5], SEATS_DATA.lowerDeck[6], SEATS_DATA.lowerDeck[7]]
  ];

  suiteRows.forEach(rowSeats => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'seat-row';

    const leftCol = document.createElement('div');
    leftCol.className = 'seat-column-left';
    leftCol.appendChild(createSeatElement(rowSeats[0], 'Planta Baja'));
    leftCol.appendChild(createSeatElement(rowSeats[1], 'Planta Baja'));

    const aisle = document.createElement('div');
    aisle.className = 'seat-aisle';

    const rightCol = document.createElement('div');
    rightCol.className = 'seat-column-right';
    rightCol.appendChild(createSeatElement(rowSeats[2], 'Planta Baja'));

    rowDiv.appendChild(leftCol);
    rowDiv.appendChild(aisle);
    rowDiv.appendChild(rightCol);

    lowerDeckGrid.appendChild(rowDiv);
  });
}

// CREAR ELEMENTO INDIVIDUAL DE BUTACA
function createSeatElement(seatData, deckName) {
  if (!seatData || !seatData.id) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'facility-cell';
    emptyCell.textContent = seatData && seatData.type === 'stairs' ? '🪜' : '';
    return emptyCell;
  }

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `seat-btn ${seatData.type}`;
  btn.id = `seat-btn-${seatData.id}`;
  btn.textContent = seatData.name;

  if (seatData.occupied) {
    btn.classList.add('occupied');
    btn.title = `Butaca #${seatData.name} - Ocupada`;
    btn.disabled = true;
  } else {
    const serviceName = getServiceTypeName(seatData.type);
    btn.title = `Butaca #${seatData.name} (${serviceName}) - $${seatData.price}.00 [${deckName}]`;
    btn.onclick = () => toggleSeatSelection(seatData, deckName);
  }

  return btn;
}

function getServiceTypeName(type) {
  switch (type) {
    case 'promo': return 'Promo Royal Suite';
    case 'suite': return 'Royal Suite';
    case 'ejecutivo':
    default: return 'Cama Ejecutivo';
  }
}

// SELECCIONAR / DESELECCIONAR BUTACA
function toggleSeatSelection(seat, deckName) {
  const existingIdx = selectedSeats.findIndex(s => s.seatId === seat.id);
  const btn = document.getElementById(`seat-btn-${seat.id}`);

  if (existingIdx >= 0) {
    // Deseleccionar
    selectedSeats.splice(existingIdx, 1);
    if (btn) btn.classList.remove('selected');
    botGuidance.textContent = `Has quitado la butaca #${seat.name}. Selecciona otra o procede con tu reserva.`;
  } else {
    // Seleccionar
    selectedSeats.push({
      seatId: seat.id,
      seatName: seat.name,
      serviceType: getServiceTypeName(seat.type),
      price: seat.price,
      deckName: deckName,
      passengerName: '',
      passengerDoc: ''
    });
    if (btn) btn.classList.add('selected');
    botGuidance.textContent = `✅ Butaca #${seat.name} (${getServiceTypeName(seat.type)} - $${seat.price}) agregada. Por favor, escribe el nombre y DNI del pasajero.`;
  }

  updateTableAndTotal();
}

// ACTUALIZAR TABLA DE PASAJEROS Y TOTAL
function updateTableAndTotal() {
  passengerListBody.innerHTML = '';

  if (selectedSeats.length === 0) {
    passengerListBody.appendChild(emptySeatsRow);
    totalAmountDisplay.textContent = '$0';
    btnProceedToPay.disabled = true;
    return;
  }

  btnProceedToPay.disabled = false;
  let total = 0;

  selectedSeats.forEach((item, index) => {
    total += item.price;
    const tr = document.createElement('tr');
    tr.id = `passenger-row-${index}`;

    const isVerified = item.reniecVerified ? 'reniec-verified' : '';

    tr.innerHTML = `
      <td style="text-align:center; font-weight:700; color:#c4161c;">${item.seatName}</td>
      <td>
        <div class="dni-input-wrapper">
          <input 
            type="text" 
            id="dni-input-${index}"
            maxlength="8" 
            inputmode="numeric"
            placeholder="8 dígitos" 
            value="${escapeHtml(item.passengerDoc)}"
            oninput="handleDniInput(${index}, this.value)"
            required
            style="letter-spacing: 0.5px; font-weight:600;"
          />
        </div>
        <div id="reniec-status-${index}">
          ${item.reniecVerified ? '<span class="reniec-badge">✓ RENIEC</span>' : ''}
        </div>
      </td>
      <td>
        <input 
          type="text" 
          id="name-input-${index}"
          class="${isVerified}"
          placeholder="Nombre y Apellido" 
          value="${escapeHtml(item.passengerName)}"
          onchange="updatePassengerData(${index}, 'passengerName', this.value)"
          required
        />
      </td>
      <td style="font-size: 0.76rem; color:#475569;">${item.serviceType}</td>
      <td style="text-align:center;">
        <button class="btn-del-seat" onclick="removeSeat(${item.seatId})" title="Eliminar butaca">🗑️</button>
      </td>
      <td style="font-weight:700; color:#1e293b; text-align:right;">$ ${item.price}</td>
    `;
    passengerListBody.appendChild(tr);
  });

  totalAmountDisplay.textContent = `$${total.toLocaleString('es-AR')}`;
}

// MANEJO Y CONSULTA AUTOMÁTICA DE DNI A RENIEC
window.handleDniInput = function(index, rawValue) {
  const cleanDni = rawValue.replace(/\D/g, '').slice(0, 8);
  const inputEl = document.getElementById(`dni-input-${index}`);
  if (inputEl && inputEl.value !== cleanDni) {
    inputEl.value = cleanDni;
  }

  if (selectedSeats[index]) {
    selectedSeats[index].passengerDoc = cleanDni;
  }

  const statusContainer = document.getElementById(`reniec-status-${index}`);

  if (cleanDni.length === 8) {
    // Disparar consulta automática a RENIEC
    triggerReniecLookup(index, cleanDni);
  } else {
    // Si borra caracteres, quitar estado verificado
    if (selectedSeats[index]) {
      selectedSeats[index].reniecVerified = false;
    }
    if (statusContainer) {
      statusContainer.innerHTML = '';
    }
    const nameEl = document.getElementById(`name-input-${index}`);
    if (nameEl) {
      nameEl.classList.remove('reniec-verified');
    }
  }
};

// MOTOR DE CONSULTA RENIEC
async function triggerReniecLookup(index, dni) {
  const statusContainer = document.getElementById(`reniec-status-${index}`);
  const nameInput = document.getElementById(`name-input-${index}`);

  if (statusContainer) {
    statusContainer.innerHTML = `
      <div class="reniec-loading">
        <div class="spinner-small"></div>
        <span>Consultando RENIEC...</span>
      </div>
    `;
  }
  botGuidance.textContent = `🔍 Consultando base de datos RENIEC para el DNI: ${dni}...`;

  // Simular latencia de red realista (400ms)
  await new Promise(r => setTimeout(r, 400));

  let fullName = await fetchReniecFromApiOrDatabase(dni);

  if (selectedSeats[index]) {
    selectedSeats[index].passengerName = fullName;
    selectedSeats[index].reniecVerified = true;
  }

  if (nameInput) {
    nameInput.value = fullName;
    nameInput.classList.add('reniec-verified');
  }

  if (statusContainer) {
    statusContainer.innerHTML = `<span class="reniec-badge">✓ RENIEC Verificado</span>`;
  }

  botGuidance.innerHTML = `✅ <strong>RENIEC:</strong> Datos encontrados para DNI ${dni}: <strong>${fullName}</strong>.`;
}

// BASE DE DATOS Y GENERADOR DETERMINÍSTICO RENIEC
async function fetchReniecFromApiOrDatabase(dni) {
  // Lista de DNIs peruanos de prueba predeterminados
  const DNI_DATABASE = {
    "72819203": "QUISPE MAMANI CARLOS ALBERTO",
    "45829104": "FLORES CONDORI MARIA ELENA",
    "10293847": "RODRIGUEZ SANCHEZ LUIS FERNANDO",
    "71829304": "GARCIA ROJAS ROSA ISABEL",
    "40506070": "CHAVEZ RAMOS JORGE LUIS",
    "09876543": "MENDOZA HUAMAN ANA LUCIA",
    "73948201": "TORRES LOPEZ MIGUEL ANGEL",
    "75849302": "CASTILLO VEGA DIANA CAROLINA",
    "48392019": "GONZALES PEREZ VICTOR MANUEL"
  };

  if (DNI_DATABASE[dni]) {
    return DNI_DATABASE[dni];
  }

  // Generador algorítmico realista para cualquier DNI de 8 dígitos
  const nombres = [
    "CARLOS ALBERTO", "MARIA ELENA", "LUIS FERNANDO", "ROSA ISABEL",
    "JORGE LUIS", "ANA LUCIA", "JUAN DIEGO", "CARMEN ROSA",
    "MIGUEL ANGEL", "PATRICIA SOFIA", "VICTOR MANUEL", "CLAUDIA FIORELLA",
    "CHRISTIAN OMAR", "ANDREA MILAGROS", "CESAR AUGUSTO", "ESTEFANIA PAOLA"
  ];

  const apellidosPat = [
    "QUISPE", "FLORES", "RODRIGUEZ", "SANCHEZ", "GARCIA", "ROJAS",
    "DIAZ", "TORRES", "LOPEZ", "GONZALES", "PEREZ", "MAMANI",
    "CHAVEZ", "RAMOS", "CASTILLO", "MENDOZA", "HUAMAN", "ESPINOZA"
  ];

  const apellidosMat = [
    "ALARCON", "GUTIERREZ", "ROMERO", "VARGAS", "SILVA", "MEDINA",
    "VEGA", "MORALES", "PAREDES", "SALAZAR", "CASTRO", "CRUZ",
    "ORTIZ", "NAVARRO", "SOTO", "HERRERA", "PALACIOS", "CORDOVA"
  ];

  // Generación determinística basada en el número de DNI
  const num = parseInt(dni, 10);
  const apePat = apellidosPat[num % apellidosPat.length];
  const apeMat = apellidosMat[(num * 7) % apellidosMat.length];
  const nom = nombres[(num * 13) % nombres.length];

  return `${apePat} ${apeMat} ${nom}`;
}

// ACTUALIZAR DATOS EN MEMORIA
window.updatePassengerData = function(index, field, value) {
  if (selectedSeats[index]) {
    selectedSeats[index][field] = value.trim();
  }
};

window.removeSeat = function(seatId) {
  const seat = SEATS_DATA.upperDeck.concat(SEATS_DATA.lowerDeck).find(s => s && s.id === seatId);
  if (seat) {
    toggleSeatSelection(seat, '');
  }
};

// MODAL DE PAGO (PASO 3)
function openPaymentModal() {
  // Validar campos
  for (let s of selectedSeats) {
    if (!s.passengerName || !s.passengerDoc) {
      alert(`Por favor completa el Nombre y DNI del pasajero en la butaca #${s.seatName}.`);
      botGuidance.textContent = `⚠️ Faltan datos para la butaca #${s.seatName}. Ingresa el nombre y documento para continuar.`;
      return;
    }
  }

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  modalPaymentContent.innerHTML = `
    <div style="margin-bottom: 16px;">
      <h4 style="font-size: 1.1rem; color: #1e293b; margin-bottom: 6px;">Detalle de la Reserva</h4>
      <p style="font-size: 0.88rem; color: #475569;">
        <strong>Ruta:</strong> Mendoza (Terminal) ➔ Retiro, Buenos Aires<br>
        <strong>Salida:</strong> Jueves 23 Octubre, 19:30 hs (CATA Internacional / RutaYa)
      </p>
    </div>

    <div style="background:#f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
      <table style="width:100%; font-size:0.85rem; border-collapse:collapse;">
        <thead>
          <tr style="border-bottom:1px solid #cbd5e1; text-align:left; color:#64748b;">
            <th style="padding:4px;">Butaca</th>
            <th style="padding:4px;">Pasajero</th>
            <th style="padding:4px;">Documento</th>
            <th style="padding:4px; text-align:right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${selectedSeats.map(s => `
            <tr style="border-bottom: 1px dotted #e2e8f0;">
              <td style="padding:6px 4px; font-weight:700; color:#c4161c;">#${s.seatName} (${s.deckName})</td>
              <td style="padding:6px 4px;">${s.passengerName}</td>
              <td style="padding:6px 4px;">${s.passengerDoc}</td>
              <td style="padding:6px 4px; text-align:right; font-weight:700;">$ ${s.price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="display:flex; justify-content:space-between; margin-top:10px; padding-top:10px; border-top: 1.5px solid #cbd5e1; font-size:1.15rem; font-weight:900; color:#c4161c;">
        <span>Total a Pagar:</span>
        <span>$ ${total.toLocaleString('es-AR')} ARS</span>
      </div>
    </div>

    <div style="margin-bottom: 20px;">
      <label style="font-size: 0.88rem; font-weight: 700; display:block; margin-bottom: 8px;">Selecciona tu Medio de Pago Simulado:</label>
      <select id="paymentMethodSelect" style="width:100%; padding:10px; border-radius:6px; border:1px solid #cbd5e1; font-size:0.9rem;">
        <option value="Tarjeta de Crédito / Débito (Visa / Mastercard)">💳 Tarjeta de Crédito / Débito</option>
        <option value="Mercado Pago / Billetera Virtual">📱 Mercado Pago / Billetera Virtual</option>
        <option value="Transferencia Bancaria Inmediata">🏦 Transferencia Bancaria</option>
      </select>
    </div>

    <button onclick="confirmBookingSimulation()" style="width:100%; background:#c4161c; color:white; border:none; padding:12px; border-radius:6px; font-size:1.05rem; font-weight:700; cursor:pointer;">
      Confirmar y Emitir Boleto
    </button>
  `;

  paymentModal.classList.add('open');
}

window.confirmBookingSimulation = function() {
  const method = document.getElementById('paymentMethodSelect').value;
  const bookingCode = '#RY-' + Math.floor(10000 + Math.random() * 90000);
  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  // Cambiar el Stepper a Paso 3
  document.getElementById('tabStep2').classList.remove('active');
  document.getElementById('tabStep3').classList.add('active');

  modalPaymentContent.innerHTML = `
    <div style="text-align:center; padding: 10px 0;">
      <div style="font-size: 3rem; margin-bottom: 8px;">🎉</div>
      <h3 style="color:#16a34a; font-size:1.4rem; margin-bottom: 4px;">¡Reserva Emitida con Éxito!</h3>
      <p style="color:#64748b; font-size:0.88rem;">Tu boleto electrónico ha sido generado correctamente.</p>

      <div style="display:inline-block; background:#fef3c7; color:#92400e; font-size:1.2rem; font-weight:900; padding:8px 18px; border-radius:8px; margin: 16px 0; border: 1.5px dashed #f59e0b;">
        Código: ${bookingCode}
      </div>

      <div style="text-align:left; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:14px; margin-bottom:16px; font-size:0.88rem; color:#166534;">
        <p><strong>Método de pago:</strong> ${method}</p>
        <p><strong>Total abonado:</strong> $ ${total.toLocaleString('es-AR')} ARS</p>
        <p><strong>Cantidad de pasajeros:</strong> ${selectedSeats.length}</p>
        <p><strong>Butacas asignadas:</strong> ${selectedSeats.map(s => '#' + s.seatName).join(', ')}</p>
      </div>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; font-size:0.82rem; color:#334155; text-align:left; line-height:1.4;">
        📌 <strong>Importante para abordar:</strong><br>
        • Presentarse 30 minutos antes en la plataforma de Mendoza (Terminal).<br>
        • Mostrar este código y el documento físico (${selectedSeats.map(s => s.passengerDoc).join(', ')}) al subir al bus.<br>
        • Franquicia de equipaje: hasta 20 kg en bodega.
      </div>

      <button onclick="location.reload()" style="margin-top:20px; background:#1e293b; color:white; border:none; padding:10px 20px; border-radius:6px; font-weight:700; cursor:pointer;">
        🔄 Realizar otra reserva
      </button>
    </div>
  `;

  botGuidance.textContent = `🎉 ¡Felicitaciones! Tu reserva ${bookingCode} ha sido confirmada con éxito. Recuerda presentarte 30 min antes con documento físico.`;
};

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
