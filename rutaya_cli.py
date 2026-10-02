#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
RutaYa - Asistente Virtual para venta y cotización de pasajes de autobús
Versión CLI (Línea de comandos) con Máquina de Estados
"""

import sys
import random
import re

# Constantes de servicios
SERVICES = [
    {"id": 1, "name": "Económico", "time": "08:30 AM", "price": 45.0, "details": "Asiento semi-cama (140°), A/C"},
    {"id": 2, "name": "Ejecutivo", "time": "02:15 PM", "price": 70.0, "details": "Asiento cama (160°), snack, WiFi y USB"},
    {"id": 3, "name": "VIP / Cama Suite", "time": "09:45 PM", "price": 95.0, "details": "Asiento 180° piso 1, cena caliente"}
]

class RutaYaBot:
    def __init__(self):
        self.origin = ""
        self.destination = ""
        self.travel_date = ""
        self.is_round_trip = False
        self.return_date = ""
        self.selected_service = None
        self.passengers = []  # Lista de dicts: {'name': ..., 'id': ..., 'seat': ...}

    def print_bot(self, message):
        print(f"\n[🚌 RutaYa]: {message}")

    def get_input(self, prompt="Tu respuesta: "):
        try:
            return input(f"\n👤 {prompt}").strip()
        except (KeyboardInterrupt, EOFError):
            print("\n\nOperación cancelada por el usuario. ¡Hasta pronto!")
            sys.exit(0)

    def run(self):
        self.step_1_welcome_route()
        self.step_2_schedules_preferences()
        self.step_3_passenger_data()
        self.step_4_summary_confirmation()
        self.step_5_payment_simulation()

    # --- PASO 1: BIENVENIDA Y RUTA ---
    def step_1_welcome_route(self):
        print("=" * 60)
        print("       BIENVENIDO A RUTAYA - VIAJES INTERPROVINCIALES        ")
        print("=" * 60)
        self.print_bot("¡Hola! Te doy la bienvenida a RutaYa, tu asistente virtual para la compra de pasajes de autobús interprovincial. 🚌✨")
        
        # Validar Origen y Destino
        while True:
            self.print_bot("¿Desde qué ciudad partes (Origen)?")
            self.origin = self.get_input("Origen: ").title()
            if not self.origin:
                continue

            self.print_bot(f"Perfecto, sales de {self.origin}. ¿Hacia qué ciudad te diriges (Destino)?")
            self.destination = self.get_input("Destino: ").title()
            
            if not self.destination:
                continue

            if self.origin.lower() == self.destination.lower():
                self.print_bot(f"⚠️ El origen y el destino no pueden ser iguales ({self.origin}). Por favor, indica una ruta válida.")
                continue
            break

        # Fecha de viaje
        self.print_bot(f"Ruta fijada: {self.origin} ➔ {self.destination}.")
        self.print_bot("¿En qué fecha deseas viajar? (Ej. 15 de Octubre / Este viernes):")
        self.travel_date = self.get_input("Fecha de ida: ")

        self.print_bot("¿El viaje es solo de ida o ida y vuelta? (1: Solo ida / 2: Ida y vuelta):")
        round_choice = self.get_input("Opción [1 o 2]: ")
        if "2" in round_choice or "vuelta" in round_choice.lower():
            self.is_round_trip = True
            self.print_bot("¿Cuál sería tu fecha estimada de retorno?:")
            self.return_date = self.get_input("Fecha de retorno: ")

    # --- PASO 2: HORARIOS Y PREFERENCIAS ---
    def step_2_schedules_preferences(self):
        self.print_bot(f"Para tu viaje de {self.origin} a {self.destination} el {self.travel_date}, contamos con 3 opciones:")
        print("\n" + "-" * 60)
        for s in SERVICES:
            print(f" [{s['id']}] {s['name']} | Salida: {s['time']} | Precio: S/ {s['price']:.2f}")
            print(f"     Comodidades: {s['details']}")
        print("-" * 60)

        # Selección de servicio
        while True:
            choice = self.get_input("Elige tu servicio [1, 2 o 3]: ")
            match = next((s for s in SERVICES if str(s["id"]) == choice or s["name"].lower() in choice.lower()), None)
            if match:
                self.selected_service = match
                break
            self.print_bot("Por favor ingresa una opción válida (1, 2 o 3).")

        # Cantidad de pasajeros
        while True:
            qty_input = self.get_input("¿Cuántos pasajeros viajarán?: ")
            try:
                count = int(re.search(r'\d+', qty_input).group())
                if 1 <= count <= 10:
                    self.passenger_count = count
                    break
                else:
                    self.print_bot("Por favor indica entre 1 y 10 pasajeros.")
            except (ValueError, AttributeError):
                self.print_bot("Por favor escribe un número válido de pasajeros (ej. 1, 2, 3).")

    # --- PASO 3: DATOS DE LOS PASAJEROS ---
    def step_3_passenger_data(self):
        self.passengers = []
        self.print_bot(f"A continuación, necesitaremos los datos obligatorios para la emisión del boleto ({self.passenger_count} pasajero(s)).")

        for i in range(1, self.passenger_count + 1):
            label = f"Pasajero {i}" if self.passenger_count > 1 else "Pasajero"
            print(f"\n--- Datos del {label} ---")
            
            # DNI / Documento con consulta a RENIEC
            while True:
                doc = self.get_input(f"DNI (8 dígitos) ({label}): ")
                clean_dni = re.sub(r'\D', '', doc)
                if len(clean_dni) == 8:
                    doc = clean_dni
                    print("  🔍 Consultando base de datos RENIEC...")
                    suggested_name = self.lookup_reniec(clean_dni)
                    print(f"  ✅ RENIEC Verificado: {suggested_name}")
                    confirm_name = self.get_input(f"Presiona [Enter] para confirmar '{suggested_name}' o escribe otro nombre: ")
                    name = confirm_name.strip().title() if confirm_name.strip() else suggested_name
                    break
                elif len(doc) >= 4:
                    name = self.get_input(f"Nombre y apellido completo ({label}): ").title()
                    break
                else:
                    self.print_bot("Por favor ingresa un documento válido.")

            # Asiento
            self.print_bot("Preferencia de asiento:")
            print(" [1] Ventana (Piso 2)")
            print(" [2] Pasillo (Piso 2)")
            print(" [3] Ventana (Piso 1)")
            print(" [4] Pasillo (Piso 1)")
            seat_choice = self.get_input("Elige asiento [1-4 o escribe tu preferencia]: ")
            seat_map = {
                "1": "Ventana (Piso 2)",
                "2": "Pasillo (Piso 2)",
                "3": "Ventana (Piso 1)",
                "4": "Pasillo (Piso 1)"
            }
            assigned_pref = seat_map.get(seat_choice, seat_choice if seat_choice else "Ventana (Piso 2)")
            assigned_number = random.randint(1, 44)
            full_seat = f"{assigned_pref} - Asiento #{assigned_number}"

            self.passengers.append({
                "name": name,
                "id": doc,
                "seat": full_seat
            })

    # --- PASO 4: CONFIRMACIÓN Y RESUMEN ---
    def step_4_summary_confirmation(self):
        while True:
            total_price = self.selected_service["price"] * len(self.passengers)
            print("\n" + "=" * 60)
            print("             RESUMEN DE COTIZACIÓN - RUTAYA               ")
            print("=" * 60)
            print(f" • Ruta:            {self.origin} ➔ {self.destination}")
            print(f" • Fecha de viaje:  {self.travel_date} ({self.selected_service['time']})")
            if self.is_round_trip:
                print(f" • Fecha retorno:   {self.return_date}")
            print(f" • Tipo de servicio: {self.selected_service['name']}")
            print(f" • Cantidad:        {len(self.passengers)} pasaje(s)")
            print("-" * 60)
            for idx, p in enumerate(self.passengers, 1):
                print(f"   Pasajero {idx}: {p['name']} | Doc: {p['id']}")
                print(f"   Ubicación:   {p['seat']}")
            print("-" * 60)
            print(f" • Precio Unitario: S/ {self.selected_service['price']:.2f}")
            print(f" • TOTAL A PAGAR:   S/ {total_price:.2f}")
            print("=" * 60)

            self.print_bot("¿Todos los datos son correctos para proceder al pago? (S/N):")
            confirm = self.get_input("Confirmar [S/N]: ").lower()

            if confirm in ["s", "si", "sí", "y", "yes"]:
                break
            else:
                self.print_bot("¿Qué dato deseas modificar? [1: Fecha / 2: Servicio / 3: Reiniciar todo]:")
                edit_opt = self.get_input("Opción: ")
                if edit_opt == "1":
                    self.travel_date = self.get_input("Nueva fecha de viaje: ")
                elif edit_opt == "2":
                    self.step_2_schedules_preferences()
                else:
                    self.print_bot("Reiniciando cotización...")
                    self.step_1_welcome_route()
                    self.step_2_schedules_preferences()
                    self.step_3_passenger_data()

    # --- PASO 5: SIMULACIÓN DE PAGO Y CIERRE ---
    def step_5_payment_simulation(self):
        self.print_bot("Por favor, selecciona tu método de pago simulado:")
        print(" [1] Tarjeta de Crédito / Débito (Visa, Mastercard)")
        print(" [2] Yape / Plin / Billetera digital")
        print(" [3] Transferencia Bancaria")

        methods = {
            "1": "Tarjeta de Crédito / Débito",
            "2": "Yape / Plin",
            "3": "Transferencia Bancaria"
        }
        pay_opt = self.get_input("Método de pago [1-3]: ")
        payment_method = methods.get(pay_opt, "Billetera digital (Yape/Plin)")

        booking_code = f"#RY-{random.randint(10000, 99999)}"
        total_price = self.selected_service["price"] * len(self.passengers)

        print("\n" + "*" * 60)
        print("         🎉 ¡RESERVA Y PAGO CONFIRMADOS CON ÉXITO!        ")
        print("*" * 60)
        print(f" • Código de Reserva: {booking_code}")
        print(f" • Método de Pago:    {payment_method} (Simulado)")
        print(f" • Monto Pagado:      S/ {total_price:.2f}")
        print(f" • Estado:            EMITIDO Y VALIDADO")
        print("*" * 60)

        self.print_bot("📌 INSTRUCCIONES PARA EL ABORDAJE:")
        print(" 1. Presentarse en el terminal de salida con al menos 30 minutos de anticipación.")
        print(" 2. Es indispensable portar tu documento de identidad físico (DNI o Pasaporte) para el check-in.")
        print(f" 3. Muestra tu código de reserva {booking_code} al momento de subir al bus.")
        print("\n¡Muchas gracias por viajar con RutaYa! ¡Buen viaje! 🚌🌟\n")

    def lookup_reniec(self, dni):
        db = {
            "72819203": "QUISPE MAMANI CARLOS ALBERTO",
            "45829104": "FLORES CONDORI MARIA ELENA",
            "10293847": "RODRIGUEZ SANCHEZ LUIS FERNANDO",
            "71829304": "GARCIA ROJAS ROSA ISABEL",
            "40506070": "CHAVEZ RAMOS JORGE LUIS",
            "09876543": "MENDOZA HUAMAN ANA LUCIA",
            "73948201": "TORRES LOPEZ MIGUEL ANGEL",
            "75849302": "CASTILLO VEGA DIANA CAROLINA",
            "48392019": "GONZALES PEREZ VICTOR MANUEL"
        }
        if dni in db:
            return db[dni]

        nombres = ["CARLOS ALBERTO", "MARIA ELENA", "LUIS FERNANDO", "ROSA ISABEL", "JORGE LUIS", "ANA LUCIA", "JUAN DIEGO", "CARMEN ROSA"]
        pat = ["QUISPE", "FLORES", "RODRIGUEZ", "SANCHEZ", "GARCIA", "ROJAS", "DIAZ", "TORRES", "LOPEZ", "GONZALES", "PEREZ"]
        mat = ["ALARCON", "GUTIERREZ", "ROMERO", "VARGAS", "SILVA", "MEDINA", "VEGA", "MORALES", "PAREDES", "CASTRO"]
        num = int(dni)
        return f"{pat[num % len(pat)]} {mat[(num * 7) % len(mat)]} {nombres[(num * 13) % len(nombres)]}"

if __name__ == "__main__":
    bot = RutaYaBot()
    bot.run()
