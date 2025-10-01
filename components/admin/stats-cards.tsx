"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileCheck, Award, TrendingUp } from "lucide-react"

interface StatsCardsProps {
  totalUsers: number
  totalExams: number
  totalCertificates: number
  passRate: number
}

export function StatsCards({ totalUsers, totalExams, totalCertificates, passRate }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="gov-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
          <Users className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">Usuarios registrados</p>
        </CardContent>
      </Card>

      <Card className="gov-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Exámenes Tomados</CardTitle>
          <FileCheck className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalExams}</div>
          <p className="text-xs text-muted-foreground">Intentos de examen</p>
        </CardContent>
      </Card>

      <Card className="gov-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Certificados Emitidos</CardTitle>
          <Award className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCertificates}</div>
          <p className="text-xs text-muted-foreground">Certificados activos</p>
        </CardContent>
      </Card>

      <Card className="gov-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasa de Aprobación</CardTitle>
          <TrendingUp className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{passRate}%</div>
          <p className="text-xs text-muted-foreground">Exámenes aprobados</p>
        </CardContent>
      </Card>
    </div>
  )
}
