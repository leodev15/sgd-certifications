// Mock database structure and initial data for SGD Evaluation System

export interface User {
  id: string
  dni: string
  nombres: string
  apellidos: string
  email: string
  telefono: string
  password: string
  role: "postulante" | "verificador" | "admin"
  createdAt: string
  created_at?: string // for compatibility with snake_case from DB
}

export interface Question {
  id: string
  pregunta: string
  opciones: string[]
  respuestaCorrecta: number
  categoria: string
}

export interface ExamResult {
  id: string
  userId: string
  score: number
  totalQuestions: number
  passed: boolean
  completedAt: string
  certificateCode: string
}

export interface Certificate {
  id: string
  userId: string
  examResultId: string
  codigo: string
  fechaEmision: string
  estado: "activo" | "revocado",
  pdfPath?: string
  fecha_emision?: string // for compatibility with snake_case from DB
  user_id?: string // for compatibility with snake_case from DB
}



/*export interface Questions {
  id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: "A" | "B" | "C" | "D"
  active: boolean
  created_at: string
}*/

export interface Exams {
  id: number
  user_id: number
  score: number
  total_questions: number
  passed: boolean
  started_at: string
  completed_at?: string
  answers: Record<number, string>
}

// Initial mock data
export const mockUsers: User[] = [
  {
    id: "1",
    dni: "12345678",
    nombres: "Admin",
    apellidos: "Sistema",
    email: "admin@regionayacucho.gob.pe",
    telefono: "999999999",
    password: "admin123",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    dni: "87654321",
    nombres: "Juan Carlos",
    apellidos: "Pérez López",
    email: "juan.perez@email.com",
    telefono: "987654321",
    password: "test123",
    role: "postulante",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    dni: "11223344",
    nombres: "María Elena",
    apellidos: "García Ruiz",
    email: "maria.garcia@email.com",
    telefono: "976543210",
    password: "test123",
    role: "verificador",
    createdAt: new Date().toISOString(),
  },
]

export const mockQuestions: Question[] = [
  {
    id: "1",
    pregunta: "¿Qué es el Sistema de Gestión Documental (SGD)?",
    opciones: [
      "Un sistema para gestionar documentos físicos únicamente",
      "Una plataforma integral para la gestión electrónica de documentos y procesos administrativos",
      "Un archivo digital simple",
      "Un sistema de correo electrónico",
    ],
    respuestaCorrecta: 1,
    categoria: "Conceptos Básicos",
  },
  {
    id: "2",
    pregunta: "¿Cuál es el objetivo principal del SGD en el Gobierno Regional de Ayacucho?",
    opciones: [
      "Reducir el uso de papel",
      "Modernizar y optimizar los procesos administrativos mediante la gestión electrónica",
      "Crear más empleos",
      "Aumentar los costos operativos",
    ],
    respuestaCorrecta: 1,
    categoria: "Objetivos",
  },
  {
    id: "3",
    pregunta: "¿Qué componentes principales tiene el SGD?",
    opciones: [
      "Solo gestión de archivos",
      "Gestión documental, workflow, firma digital y archivo electrónico",
      "Únicamente correo electrónico",
      "Solo impresión de documentos",
    ],
    respuestaCorrecta: 1,
    categoria: "Componentes",
  },
  {
    id: "4",
    pregunta: "¿Qué es un workflow en el contexto del SGD?",
    opciones: [
      "Un tipo de documento",
      "El flujo automatizado de procesos y aprobaciones documentales",
      "Una impresora especial",
      "Un tipo de archivo",
    ],
    respuestaCorrecta: 1,
    categoria: "Workflow",
  },
  {
    id: "5",
    pregunta: "¿Cuál es la importancia de la firma digital en el SGD?",
    opciones: [
      "No tiene importancia",
      "Garantiza la autenticidad, integridad y no repudio de los documentos electrónicos",
      "Solo sirve para decorar documentos",
      "Es opcional en todos los casos",
    ],
    respuestaCorrecta: 1,
    categoria: "Firma Digital",
  },
  {
    id: "6",
    pregunta: "¿Qué beneficios aporta el SGD a la administración pública?",
    opciones: [
      "Aumenta la burocracia",
      "Mejora la eficiencia, transparencia, trazabilidad y reduce tiempos de respuesta",
      "Complica los procesos",
      "No aporta beneficios",
    ],
    respuestaCorrecta: 1,
    categoria: "Beneficios",
  },
  {
    id: "7",
    pregunta: "¿Qué es la trazabilidad en el SGD?",
    opciones: [
      "Un tipo de documento",
      "La capacidad de seguir el historial completo de un documento desde su creación hasta su archivo",
      "Una función de impresión",
      "Un error del sistema",
    ],
    respuestaCorrecta: 1,
    categoria: "Trazabilidad",
  },
  {
    id: "8",
    pregunta: "¿Cuál es el rol de los metadatos en el SGD?",
    opciones: [
      "No tienen función",
      "Proporcionan información descriptiva sobre los documentos para facilitar su búsqueda y gestión",
      "Solo ocupan espacio",
      "Son errores del sistema",
    ],
    respuestaCorrecta: 1,
    categoria: "Metadatos",
  },
  {
    id: "9",
    pregunta: "¿Qué aspectos de seguridad debe considerar el SGD?",
    opciones: [
      "Ninguno, es público",
      "Control de acceso, cifrado, auditoría, backup y recuperación de datos",
      "Solo contraseñas simples",
      "No es importante la seguridad",
    ],
    respuestaCorrecta: 1,
    categoria: "Seguridad",
  },
  {
    id: "10",
    pregunta: "¿Cómo contribuye el SGD a la transparencia gubernamental?",
    opciones: [
      "No contribuye",
      "Facilita el acceso ciudadano a la información pública y mejora la rendición de cuentas",
      "Oculta información",
      "Complica el acceso a la información",
    ],
    respuestaCorrecta: 1,
    categoria: "Transparencia",
  },
  {
    id: "11",
    pregunta: "¿Qué es la interoperabilidad en el SGD?",
    opciones: [
      "Un error del sistema",
      "La capacidad de intercambiar información con otros sistemas y entidades",
      "Una función de impresión",
      "No existe este concepto",
    ],
    respuestaCorrecta: 1,
    categoria: "Interoperabilidad",
  },
  {
    id: "12",
    pregunta: "¿Cuál es la importancia del archivo electrónico en el SGD?",
    opciones: [
      "No es importante",
      "Permite el almacenamiento seguro y organizado de documentos con valor histórico y legal",
      "Solo ocupa espacio",
      "Es innecesario",
    ],
    respuestaCorrecta: 1,
    categoria: "Archivo Electrónico",
  },
]

export const mockCertificates: Certificate[] = [
  {
    id: "1",
    userId: "2",
    examResultId: "1",
    codigo: "SGD-2024-001",
    fechaEmision: new Date().toISOString(),
    estado: "activo",
  },
]

export const mockExamResults: ExamResult[] = [
  {
    id: "1",
    userId: "2",
    score: 8,
    totalQuestions: 10,
    passed: true,
    completedAt: new Date().toISOString(),
    certificateCode: "SGD-2024-001",
  },
]
