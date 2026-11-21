# MEDINOVA — Estación Clínica MAR Urgencias

Aplicación web de estación clínica hospitalaria diseñada para la gestión segura de la **Administración de Medicamentos (MAR)**, **Kárdex Express**, seguimiento de pacientes por boxes de urgencias, farmacovigilancia y trazabilidad de doble verificación mediante firmas digitales de turno.

---

## ¿Qué hace la aplicación?

MEDINOVA centraliza en una única estación de trabajo los flujos críticos de enfermería y medicina de urgencias:

### 1. Panel de Urgencias y Mapa de Boxes (`Boxes 01 - 12`)
- **Cuadro de mandos de pacientes**: Visualiza los pacientes ingresados, su nivel de prioridad (`Triage I` a `Triage IV`), signos vitales recientes, médico tratante y próxima medicación programada.
- **Búsqueda y filtrado rápido**: Filtra por nombre, documento de identidad, box asignado o nivel de triage.
- **Gestión completa de pacientes (CRUD)**: Permite ingresar nuevos pacientes, editar su ficha clínica o dar de alta/retirar de la guardia.
- **Mapa de Boxes 01–12**: Muestra en tiempo real qué boxes están ocupados, cuáles están disponibles y cuáles atienden casos críticos (`Triage I`).

### 2. Espacio Clínico del Paciente (MAR)
Al seleccionar un paciente, se habilita su estación clínica contextual con:
- **Barra de contexto del paciente y Banner de Alergias**: Mantiene visibles de forma permanente las alergias graves (por ejemplo, penicilinas o AINEs) y el nivel de riesgo antes de cualquier administración.
- **Resumen Clínico**: Consolida constantes vitales, antecedentes clave y bitácora de enfermería.
- **Antecedentes e Historia Clínica Cronológica**: Línea de tiempo filtrable por categoría (`urgencias`, `ram`, `quirurgico`, `cronico`, `farmacologico`) con creación, edición y eliminación de episodios clínicos.
- **Órdenes Médicas y Ficha Farmacológica**: Detalle técnico de cada fármaco prescrito (código ATC, vía de administración `IV/SC/VO/IM/Topical`, dilución, tiempo de infusión, lote, vencimiento, pasos de reconstitución/dilución y efectos adversos leves/severos).
- **Registro de Alergias y Reporte RAM**: Consulta de contraindicaciones absolutas y notificación directa de nuevas Reacciones Adversas a Medicamentos (RAM), que se incorporan automáticamente al historial del paciente.

### 3. Kárdex Express y Semáforo de Riesgo
- **Clasificación por Semáforo Farmacológico**: Clasifica cada orden médica en tres niveles de riesgo clínico:
  - **Rojo (`Alto Riesgo`)**: Insulina, heparinas/enoxaparina, cloruro de potasio concentrado, sulfato de magnesio IV, opioides mayores (morfina, fentanilo), drogas vasoactivas, etc.
  - **Amarillo (`Riesgo Moderado / Precaución`)**: Tramadol, AINEs, cefalosporinas, antibióticos de amplio espectro, diuréticos, corticoides.
  - **Verde (`Riesgo Habitual Bajo`)**: Paracetamol, omeprazol, loratadina, cristaloides e hidratación.
- **Administración y recálculo automático de dosis**: Al registrar una dosis administrada:
  1. Se calcula inmediatamente el próximo horario programado según el intervalo de frecuencia (`4h`, `6h`, `8h`, `12h`, `24h` o dosis única `STAT`).
  2. Se añade el evento al historial de administraciones del fármaco (`administrationHistory`).
  3. Se registra automáticamente un acta de verificación en el libro de firmas con el profesional activo en guardia.
- **Justificación de retrasos**: Flujo modal dedicado para documentar y autorizar dosis atrasadas.

### 4. Interacciones y Alertas Farmacológicas
- Panel de auditoría cruzada para revisar incompatibilidades físicas críticas (por ejemplo, Ceftriaxona con soluciones que contienen calcio), bloqueos por antecedentes anafilácticos y precauciones moderadas, con filtros por severidad y acceso a protocolos.

### 5. Firmas y Turnos de Guardia
- **Personal en turno (Doctores y Enfermeras)**: Alta, edición, cambio de estado (`Activo` / `Turno Entregado`), asignación de área y selección del profesional activo en sesión.
- **Libro de Firmas y Trazabilidad**: Registro de actas de doble chequeo de medicación, entrega de turno, control de estupefacientes y alertas críticas, con validación mediante PIN del co-firmante y código hash de respaldo.

---

## ¿Cómo se desarrolló técnicamente?

### Stack Tecnológico
- **Frontend**: React 19 con TypeScript (`ES2022`, `jsx: react-jsx`).
- **Build & Dev Server**: Vite 8 (`@vitejs/plugin-react`) configurado en el puerto `3000` (`0.0.0.0`).
- **Estilos y Sistema de Diseño**: Tailwind CSS v4 (`@tailwindcss/vite`) utilizando tokens semánticos en `@theme` (`surface`, `primary`, `secondary`, `tertiary`, `error`, `outline`, espaciados y soporte completo para modo claro/oscuro mediante clase `.dark`).
- **Tipografía e Iconografía**: Fuente `Inter` con variantes numéricas tabulares (`tnum`, `zero`), `Material Symbols Outlined` y `lucide-react`.
- **Animaciones / Utilidades**: `motion` y sistema propio de notificaciones toast.

### Arquitectura del Código

```text
src/
├── App.tsx                       # Estado global de estación, enrutamiento por vistas y handlers CRUD
├── main.tsx                      # Punto de entrada React
├── index.css                     # Configuración Tailwind v4, tokens de color y modo oscuro
├── types/
│   └── clinical.ts               # Interfaces de dominio, semáforo de riesgo y cálculo de horarios MAR
├── services/
│   └── storage.ts                # Capa de persistencia local (localStorage) por entidad y paciente
├── data/
│   └── mockClinicalData.ts       # Datos clínicos iniciales (pacientes, fármacos, episodios, personal y firmas)
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx           # Navegación lateral (escritorio fijo + drawer móvil) y reloj de guardia
│   │   ├── Header.tsx            # Barra superior con turno activo, cambio de tema y reinicio de datos demo
│   │   └── BottomNavBar.tsx      # Barra inferior táctil para dispositivos móviles
│   ├── patient/
│   │   ├── PatientHeaderBar.tsx  # Cabecera clínica del paciente seleccionado
│   │   ├── AllergyBanner.tsx     # Alerta permanente de alergias críticas
│   │   └── PatientTabsNav.tsx    # Navegación por subsecciones clínicas del paciente
│   └── modals/                   # Modales CRUD y clínicos (Paciente, Fármaco, Antecedente, Personal,
│                                 # Firma Digital, Reporte RAM, Protocolo, Justificar Retraso, Confirmación, Toast)
└── views/
    ├── EmergencyDashboardView.tsx
    ├── ClinicalSummaryView.tsx
    ├── ClinicalTimelineView.tsx
    ├── KardexExpressView.tsx
    ├── MedicationsView.tsx
    ├── BoxesView.tsx
    ├── InteractionsView.tsx
    └── SignaturesView.tsx
```

### Decisiones Técnicas Destacadas
1. **Motor horario y clasificación de riesgo en TypeScript puro (`src/types/clinical.ts`)**:
   - Funciones puras (`extractIntervalHours`, `parseTimeToMinutes`, `formatMinutesToTime`, `calculateNextDoseTime`, `generateScheduleTimes`) que interpretan pautas clínicas en texto libre (`"Cada 8h"`, `"c/12h"`, `"STAT"`) y proyectan horarios de 24 horas en formato hospitalario `HH:mm`.
   - Clasificador automático `classifyDrugRisk()` y `getMedicationRiskColor()` para asignar el semáforo farmacológico cuando no existe una etiqueta manual previa.
2. **Persistencia desacoplada en cliente (`src/services/storage.ts`)**:
   - Toda la información operativa (pacientes, medicaciones por paciente, episodios clínicos, personal de turno, profesional activo y libro de firmas) se persiste en `localStorage` bajo claves versionadas (`medinova_patients_v1`, `medinova_meds_v2_<id>`, `medinova_episodes_v1_<id>`, `medinova_duty_staff_v1`, `medinova_signatures_v1`).
   - Al iniciar por primera vez o pulsar **Restablecer datos demo**, se cargan automáticamente los registros clínicos base desde `mockClinicalData.ts`.
   - La arquitectura de `storageService` permite sustituir fácilmente `localStorage` por una API REST o base de datos remota (por ejemplo, Cloud SQL o Firestore) sin reescribir las vistas.
3. **Diseño responsivo orientado a uso táctil (Apple HIG + Material 3 Tokens)**:
   - En escritorio utiliza un `Sidebar` lateral fijo de `256px` (`md:pl-64`); en pantallas móviles cambia a un drawer deslizable junto con una `BottomNavBar` ergonómica para operación con una mano.

---

## Instalación y Comandos

### Requisitos previos
- Node.js 22+ y `npm`.

### Ejecución local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo (puerto 3000)
npm run dev

# 3. Verificar tipos TypeScript
npm run lint

# 4. Compilar para producción
npm run build
```

> **Nota sobre variables de entorno**: El repositorio incluye `.env.example` con la variable `GEMINI_API_KEY=` declarada por la presencia de `@google/genai` en las dependencias del proyecto; la aplicación actual opera de forma autónoma en el navegador con persistencia en `localStorage`.
