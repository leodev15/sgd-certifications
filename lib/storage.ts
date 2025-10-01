import { query } from "./db";
import type { User, Question, ExamResult, Certificate } from "./mock-data";

// ========================
// USER OPERATIONS
// ========================
export async function getUsers(): Promise<User[]> {
  const res = await query("SELECT * FROM users ORDER BY created_at DESC");
  return res.rows;
}

export async function saveUser(user: User): Promise<User> {
  const res = await query(
    `INSERT INTO users (dni, nombres, apellidos, email, telefono, password, role)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (dni) DO UPDATE
       SET nombres = EXCLUDED.nombres,
           apellidos = EXCLUDED.apellidos,
           email = EXCLUDED.email,
           telefono = EXCLUDED.telefono,
           password = EXCLUDED.password,
           role = EXCLUDED.role
     RETURNING *`,
    [user.dni, user.nombres, user.apellidos, user.email, user.telefono, user.password, user.role]
  );
  return res.rows[0];
}

export async function getUserByDni(dni: string): Promise<User | null> {
  const res = await query("SELECT * FROM users WHERE dni = $1", [dni]);
  return res.rows[0] || null;
}

export async function authenticateUser(dni: string, password: string): Promise<User | null> {
  const res = await query("SELECT * FROM users WHERE dni = $1 AND password = $2", [dni, password]);
  return res.rows[0] || null;
}

// ========================
// QUESTION OPERATIONS
// ========================
export async function getQuestions(): Promise<Question[]> {
  const res = await query("SELECT * FROM questions");
  return res.rows;
}

export async function getRandomQuestions(count = 10): Promise<Question[]> {
  const res = await query("SELECT * FROM questions ORDER BY RANDOM() LIMIT $1", [count]);
  return res.rows;
}

// ========================
// EXAM RESULT OPERATIONS
// ========================
export async function saveExamResult(result: ExamResult): Promise<ExamResult> {
  const res = await query(
    `INSERT INTO exam_results (user_id, score, total_questions, passed, completed_at, certificate_code)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      result.userId,
      result.score,
      result.totalQuestions,
      result.passed,
      result.completedAt,
      result.certificateCode,
    ]
  );
  return res.rows[0];
}

export async function getExamResults(): Promise<ExamResult[]> {
  const res = await query("SELECT * FROM exam_results ORDER BY completed_at DESC");
  return res.rows;
}

export async function getUserExamResults(userId: number): Promise<ExamResult[]> {
  const res = await query("SELECT * FROM exam_results WHERE user_id = $1 ORDER BY completed_at DESC", [userId]);
  return res.rows;
}

// ========================
// CERTIFICATE OPERATIONS
// ========================
export async function saveCertificate(certificate: Certificate): Promise<Certificate> {
  const res = await query(
    `INSERT INTO certificates (user_id, exam_result_id, codigo, fecha_emision, estado, pdf_path)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      certificate.userId,
      certificate.examResultId,
      certificate.codigo,
      certificate.fechaEmision,
      certificate.estado,
      //certificate.pdfPath,
    ]
  );
  return res.rows[0];
}

export async function getCertificates(): Promise<Certificate[]> {
  const res = await query("SELECT * FROM certificates ORDER BY fecha_emision DESC");
  return res.rows;
}

export async function getCertificateByCode(codigo: string): Promise<Certificate | null> {
  const res = await query("SELECT * FROM certificates WHERE codigo = $1", [codigo]);
  return res.rows[0] || null;
}

export async function getCertificateByDni(dni: string): Promise<Certificate | null> {
  const res = await query(
    `SELECT c.*
     FROM certificates c
     JOIN users u ON c.user_id = u.id
     WHERE u.dni = $1
     ORDER BY c.fecha_emision DESC
     LIMIT 1`,
    [dni]
  );
  return res.rows[0] || null;
}

// ========================
// CERTIFICATE CODE GENERATOR
// ========================
export async function generateCertificateCode(): Promise<string> {
  const year = new Date().getFullYear();
  const res = await query("SELECT COUNT(*) FROM certificates");
  const count = parseInt(res.rows[0].count) + 1;
  return `SGD-${year}-${count.toString().padStart(3, "0")}`;
}



// Local storage utilities for mock database operations

/*import {
  type User,
  type Question,
  type ExamResult,
  type Certificate,
  mockUsers,
  mockQuestions,
  mockCertificates,
  mockExamResults,
} from "./mock-data"

const STORAGE_KEYS = {
  USERS: "sgd_users",
  QUESTIONS: "sgd_questions",
  EXAM_RESULTS: "sgd_exam_results",
  CERTIFICATES: "sgd_certificates",
  CURRENT_USER: "sgd_current_user",
}

// Initialize storage with mock data if empty
export const initializeStorage = () => {
  if (typeof window === "undefined") return

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers))
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(mockQuestions))
  }
  if (!localStorage.getItem(STORAGE_KEYS.CERTIFICATES)) {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(mockCertificates))
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS)) {
    localStorage.setItem(STORAGE_KEYS.EXAM_RESULTS, JSON.stringify(mockExamResults))
  }
}

// User operations
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem(STORAGE_KEYS.USERS)
  return users ? JSON.parse(users) : []
}

export const saveUser = (user: User): void => {
  if (typeof window === "undefined") return
  const users = getUsers()
  const existingIndex = users.findIndex((u) => u.id === user.id)

  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

export const getUserByDni = (dni: string): User | null => {
  const users = getUsers()
  return users.find((u) => u.dni === dni) || null
}

export const authenticateUser = (dni: string, password: string): User | null => {
  const users = getUsers()
  return users.find((u) => u.dni === dni && u.password === password) || null
}

// Current user session
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return user ? JSON.parse(user) : null
}

export const setCurrentUser = (user: User | null): void => {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

// Question operations
export const getQuestions = (): Question[] => {
  if (typeof window === "undefined") return []
  const questions = localStorage.getItem(STORAGE_KEYS.QUESTIONS)
  return questions ? JSON.parse(questions) : []
}

export const getRandomQuestions = (count = 10): Question[] => {
  const allQuestions = getQuestions()
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Exam result operations
export const saveExamResult = (result: ExamResult): void => {
  if (typeof window === "undefined") return
  const results = getExamResults()
  results.push(result)
  localStorage.setItem(STORAGE_KEYS.EXAM_RESULTS, JSON.stringify(results))
}

export const getExamResults = (): ExamResult[] => {
  if (typeof window === "undefined") return []
  const results = localStorage.getItem(STORAGE_KEYS.EXAM_RESULTS)
  return results ? JSON.parse(results) : []
}

export const getUserExamResults = (userId: string): ExamResult[] => {
  const results = getExamResults()
  return results.filter((r) => r.userId === userId)
}

// Certificate operations
export const saveCertificate = (certificate: Certificate): void => {
  if (typeof window === "undefined") return
  const certificates = getCertificates()
  certificates.push(certificate)
  localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certificates))
}

export const getCertificates = (): Certificate[] => {
  if (typeof window === "undefined") return []
  const certificates = localStorage.getItem(STORAGE_KEYS.CERTIFICATES)
  return certificates ? JSON.parse(certificates) : []
}

export const getCertificateByCode = (codigo: string): Certificate | null => {
  const certificates = getCertificates()
  return certificates.find((c) => c.codigo === codigo) || null
}

export const getCertificateByDni = (dni: string): Certificate | null => {
  const users = getUsers()
  const user = users.find((u) => u.dni === dni)
  if (!user) return null

  const certificates = getCertificates()
  return certificates.find((c) => c.userId === user.id) || null
}

// Generate unique certificate code
export const generateCertificateCode = (): string => {
  const year = new Date().getFullYear()
  const certificates = getCertificates()
  const count = certificates.length + 1
  return `SGD-${year}-${count.toString().padStart(3, "0")}`
}
*/