"use client"

import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { CertificateSearch } from "@/components/verification/certificate-search"
import { CertificateResult } from "@/components/verification/certificate-result"
import { Button } from "@/components/ui/button"
import { Shield, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Certificate, User } from "@/lib/mock-data"
import { Header } from "@/components/ui/header"

export default function VerificarPage() {

  const [foundCertificate, setFoundCertificate] = useState<Certificate | null>(null)
  const [foundUser, setFoundUser] = useState<User | null>(null)
  const router = useRouter()

  const handleCertificateFound = (certificate: Certificate, user: User) => {
    console.log(certificate, user)
    setFoundCertificate(certificate)
    setFoundUser(user)
  }

  const handleBack = () => {
    setFoundCertificate(null)
    setFoundUser(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      {/*<header className="gov-header text-red-500 p-6 shadow-md mb-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Verificación de Certificados</h1>
              <p className="text-gray-600">Gobierno Regional de Ayacucho</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/")} className="text-white hover:bg-white/20">
              <Home className="mr-2 h-4 w-4" />
              Inicio
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
*/}
      <Header></Header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {foundCertificate && foundUser ? (
          <CertificateResult certificate={foundCertificate} user={foundUser} onBack={handleBack} />
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Verificación Pública de Certificados
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Verifique la autenticidad de los certificados emitidos por el Sistema de Evaluación SGD
              </p>
            </div>

            <CertificateSearch onCertificateFound={handleCertificateFound} />

            {/* Information Section */}
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mt-16">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 gov-card">
                <h3 className="text-xl font-bold text-red-600 mb-4">¿Cómo verificar?</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Ingrese el código del certificado (formato: SGD-YYYY-XXX)</li>
                  <li>• O ingrese el DNI del titular del certificado</li>
                  <li>• El sistema mostrará el estado actual del certificado</li>
                  <li>• Verifique que los datos coincidan con el documento físico</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 gov-card">
                <h3 className="text-xl font-bold text-red-600 mb-4">Estados del Certificado</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Activo:</strong> Certificado válido y vigente
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      <strong>Revocado:</strong> Certificado sin validez oficial
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-300">
            © 2025 Gobierno Regional de Ayacucho - Oficina de Tecnologías de la Información
          </p>
          <p className="text-gray-400 text-sm mt-2">Sistema de Verificación de Certificados SGD</p>
        </div>
      </footer>
    </div>
  )
}
