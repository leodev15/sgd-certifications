"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { StatsCards } from "@/components/admin/stats-cards"
import { UsersTable } from "@/components/admin/users-table"
import { QuestionsManager } from "@/components/admin/questions-manager"
import { CertificatesTable } from "@/components/admin/certificates-table"
import { LogOut, Shield } from "lucide-react"
import { getCurrentUser, setCurrentUser, getUsers, getQuestions, getCertificates, getExamResults } from "@/lib/storage"
import type { User as UserType, Question, Certificate } from "@/lib/mock-data"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

export default function AdminDashboard() {
  const [user, setUser] = useState<UserType | null>(null)
  const [users, setUsers] = useState<UserType[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExams: 0,
    totalCertificates: 0,
    passRate: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login")
      return
    }

    setUser(currentUser)
    loadData()
  }, [router])

  const loadData = () => {
    const allUsers = getUsers()
    const allQuestions = getQuestions()
    const allCertificates = getCertificates()
    const allExamResults = getExamResults()

    setUsers(allUsers)
    setQuestions(allQuestions)
    setCertificates(allCertificates)

    // Calculate stats
    const postulantes = allUsers.filter((u) => u.role === "postulante")
    const passedExams = allExamResults.filter((r) => r.passed)
    const passRate = allExamResults.length > 0 ? Math.round((passedExams.length / allExamResults.length) * 100) : 0

    setStats({
      totalUsers: postulantes.length,
      totalExams: allExamResults.length,
      totalCertificates: allCertificates.filter((c) => c.estado === "activo").length,
      passRate,
    })
  }

  const handleLogout = () => {
    setCurrentUser(null)
    router.push("/")
  }

  const handleViewUser = (user: UserType) => {
    // TODO: Implement user detail modal
    console.log("View user:", user)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("¿Está seguro de que desea eliminar este usuario?")) {
      const updatedUsers = users.filter((u) => u.id !== userId)
      // Update localStorage
      localStorage.setItem("sgd_users", JSON.stringify(updatedUsers))
      setUsers(updatedUsers)
      loadData()
    }
  }

  const handleAddQuestion = (questionData: Omit<Question, "id">) => {
    const newQuestion: Question = {
      ...questionData,
      id: Date.now().toString(),
    }
    const updatedQuestions = [...questions, newQuestion]
    localStorage.setItem("sgd_questions", JSON.stringify(updatedQuestions))
    setQuestions(updatedQuestions)
  }

  const handleUpdateQuestion = (id: string, questionData: Omit<Question, "id">) => {
    const updatedQuestions = questions.map((q) => (q.id === id ? { ...questionData, id } : q))
    localStorage.setItem("sgd_questions", JSON.stringify(updatedQuestions))
    setQuestions(updatedQuestions)
  }

  const handleDeleteQuestion = (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar esta pregunta?")) {
      const updatedQuestions = questions.filter((q) => q.id !== id)
      localStorage.setItem("sgd_questions", JSON.stringify(updatedQuestions))
      setQuestions(updatedQuestions)
    }
  }

  const handleViewCertificate = (certificate: Certificate) => {
    // TODO: Implement certificate detail modal
    console.log("View certificate:", certificate)
  }

  const handleRevokeCertificate = (certificateId: string) => {
    if (confirm("¿Está seguro de que desea revocar este certificado?")) {
      const updatedCertificates = certificates.map((c) =>
        c.id === certificateId ? { ...c, estado: "revocado" as const } : c,
      )
      localStorage.setItem("sgd_certificates", JSON.stringify(updatedCertificates))
      setCertificates(updatedCertificates)
      loadData()
    }
  }

  const handleActivateCertificate = (certificateId: string) => {
    const updatedCertificates = certificates.map((c) =>
      c.id === certificateId ? { ...c, estado: "activo" as const } : c,
    )
    localStorage.setItem("sgd_certificates", JSON.stringify(updatedCertificates))
    setCertificates(updatedCertificates)
    loadData()
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <ProtectedRoute requiredRole="admin">
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="gov-header text-red-500 p-6 shadow-md mb-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Panel de Administración</h1>
              <p className="text-gray-400">Sistema de Evaluación SGD - OTI</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500">
              {user.nombres} {user.apellidos}
            </span>
            <ThemeToggle />
            <Button variant="ghost" onClick={handleLogout} className="text-gray-500 hover:bg-white/20">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <StatsCards
            totalUsers={stats.totalUsers}
            totalExams={stats.totalExams}
            totalCertificates={stats.totalCertificates}
            passRate={stats.passRate}
          />

          {/* Management Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">Usuarios</TabsTrigger>
              <TabsTrigger value="questions">Preguntas</TabsTrigger>
              <TabsTrigger value="certificates">Certificados</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <UsersTable users={users} onViewUser={handleViewUser} onDeleteUser={handleDeleteUser} />
            </TabsContent>

            <TabsContent value="questions">
              <QuestionsManager
                questions={questions}
                onAddQuestion={handleAddQuestion}
                onUpdateQuestion={handleUpdateQuestion}
                onDeleteQuestion={handleDeleteQuestion}
              />
            </TabsContent>

            <TabsContent value="certificates">
              <CertificatesTable
                certificates={certificates}
                users={users}
                onViewCertificate={handleViewCertificate}
                onRevokeCertificate={handleRevokeCertificate}
                onActivateCertificate={handleActivateCertificate}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  )
}
