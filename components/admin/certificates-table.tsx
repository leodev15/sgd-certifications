"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Ban, CheckCircle } from "lucide-react"
import type { Certificate, User } from "@/lib/mock-data"

interface CertificatesTableProps {
  certificates: Certificate[]
  users: User[]
  onViewCertificate: (certificate: Certificate) => void
  onRevokeCertificate: (certificateId: string) => void
  onActivateCertificate: (certificateId: string) => void
}

export function CertificatesTable({
  certificates,
  users,
  onViewCertificate,
  onRevokeCertificate,
  onActivateCertificate,
}: CertificatesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const getUserById = (userId: string) => {
    return users.find((user) => user.id === userId)
  }

  const filteredCertificates = certificates.filter((certificate) => {
    const user = getUserById(certificate.userId)
    return (
      certificate.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.dni.includes(searchTerm)
    )
  })

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Activo</Badge>
      case "revocado":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Revocado</Badge>
      default:
        return <Badge variant="secondary">{estado}</Badge>
    }
  }

  return (
    <Card className="gov-card">
      <CardHeader>
        <CardTitle>Gestión de Certificados</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código, nombre o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4 font-medium">Código</th>
                <th className="text-left py-2 px-4 font-medium">Usuario</th>
                <th className="text-left py-2 px-4 font-medium">DNI</th>
                <th className="text-left py-2 px-4 font-medium">Fecha Emisión</th>
                <th className="text-left py-2 px-4 font-medium">Estado</th>
                <th className="text-left py-2 px-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCertificates.map((certificate) => {
                const user = getUserById(certificate.userId)
                return (
                  <tr key={certificate.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-4 font-mono text-sm">{certificate.codigo}</td>
                    <td className="py-2 px-4">
                      {user ? `${user.nombres} ${user.apellidos}` : "Usuario no encontrado"}
                    </td>
                    <td className="py-2 px-4 font-mono">{user?.dni || "N/A"}</td>
                    <td className="py-2 px-4 text-sm">
                      {new Date(certificate.fechaEmision).toLocaleDateString("es-PE")}
                    </td>
                    <td className="py-2 px-4">{getStatusBadge(certificate.estado)}</td>
                    <td className="py-2 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => onViewCertificate(certificate)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {certificate.estado === "activo" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRevokeCertificate(certificate.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onActivateCertificate(certificate.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredCertificates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "No se encontraron certificados que coincidan con la búsqueda"
                : "No hay certificados emitidos"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
