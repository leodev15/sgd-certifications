"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { CertificateSearch } from "@/components/verification/certificate-search"
import { CertificateResult } from "@/components/verification/certificate-result"
import { Shield, LogOut, User, Search, FileCheck } from "lucide-react"
import { getCurrentUser, setCurrentUser, getCertificates } from "@/lib/storage"
import type { User as UserType, Certificate } from "@/lib/mock-data"

export default function VerificadorDashboard() {
  const [user, setUser] = useState<UserType | null>(null)
  const [foundCertificate, setFoundCertificate] = useState<Certificate | null>(null)
  const [foundUser, setFoundUser] = useState<UserType | null>(null)
  const [totalCertificates, setTotalCertificates] = useState(0)
  const [activeCertificates, setActiveCertificates] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "verificador") {
      router.push("/login")
      return
    }

    setUser(currentUser)

    // Load certificate statistics
    const certificates = getCertificates()
    setTotalCertificates(certificates.length)
    setActiveCertificates(certificates.filter((c) => c.estado === "activo").length)
  }, [router])

  const handleLogout = () => {
    setCurrentUser(null)
    router.push("/")
  }

  const handleCertificateFound = (certificate: Certificate, user: UserType) => {
    setFoundCertificate(certificate)
    setFoundUser(user)
  }

  const handleBack = () => {
    setFoundCertificate(null)
    setFoundUser(null)
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="gov-header text-red-500 p-6 shadow-md mb-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Panel del Verificador</h1>
              <p className="text-red-100">
                Bienvenido, {user.nombres} {user.apellidos}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
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
        {foundCertificate && foundUser ? (
          <CertificateResult certificate={foundCertificate} user={foundUser} onBack={handleBack} />
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* User Info Card */}
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-red-600" />
                  <span>Información Personal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">DNI</p>
                    <p className="font-medium">{user.dni}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{user.telefono}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rol</p>
                    <p className="font-medium text-blue-600">Verificador</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="gov-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Certificados</CardTitle>
                  <FileCheck className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCertificates}</div>
                  <p className="text-xs text-muted-foreground">Certificados en el sistema</p>
                </CardContent>
              </Card>

              <Card className="gov-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Certificados Activos</CardTitle>
                  <Shield className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{activeCertificates}</div>
                  <p className="text-xs text-muted-foreground">Certificados válidos</p>
                </CardContent>
              </Card>
            </div>

            {/* Verification Tool */}
            <Card className="gov-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-red-600" />
                  <span>Herramienta de Verificación</span>
                </CardTitle>
                <CardDescription>
                  Utilice esta herramienta para verificar la autenticidad de los certificados SGD
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CertificateSearch onCertificateFound={handleCertificateFound} />
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="gov-card">
              <CardHeader>
                <CardTitle>Instrucciones para Verificadores</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Utilice el código del certificado o DNI del titular para realizar la verificación</li>
                  <li>• Verifique que los datos mostrados coincidan con el documento físico presentado</li>
                  <li>• Los certificados activos son válidos y tienen valor oficial</li>
                  <li>• Los certificados revocados no tienen validez y deben ser rechazados</li>
                  <li>• En caso de dudas, contacte con la Oficina de Tecnologías de la Información</li>
                  <li>• Mantenga un registro de las verificaciones realizadas</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
