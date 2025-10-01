"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Calendar,
  User,
  FileText,
  ArrowLeft,
} from "lucide-react";
import type { Certificate, User as UserType } from "@/lib/mock-data";

interface CertificateResultProps {
  certificate: Certificate;
  user: UserType;
  onBack: () => void;
}

export function CertificateResult({
  certificate,
  user,
  onBack,
}: CertificateResultProps) {
  const isActive = certificate.estado === "activo";

  console.log(user);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Nueva Búsqueda
      </Button>

      {/* Status Card */}
      <Card
        className={`gov-card border-2 ${
          isActive ? "border-green-500" : "border-red-500"
        }`}
      >
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            {isActive ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
            <CardTitle
              className={`text-2xl ${
                isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isActive ? "Certificado Válido" : "Certificado Revocado"}
            </CardTitle>
          </div>
          <Badge
            className={`text-sm ${
              isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            }`}
          >
            {isActive ? "ACTIVO" : "REVOCADO"}
          </Badge>
        </CardHeader>
      </Card>

      {/* Certificate Details */}
      <Card className="gov-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-red-600" />
            <span>Detalles del Certificado</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Certificate Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Código del Certificado
                </p>
                <p className="text-lg font-mono font-bold text-green-600">
                  {certificate.codigo}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Fecha de Emisión
                </p>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {/*<p className="font-medium">
                    {new Date(certificate.fechaEmision).toLocaleDateString(
                      "es-PE"
                    )}
                  </p>*/}
                  <p className="font-medium">
                    {certificate.fecha_emision
                      ? new Date(certificate.fecha_emision).toLocaleDateString(
                          "es-PE",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Estado
                </p>
                <Badge
                  className={`${
                    isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {certificate.estado.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Certificación
                </p>
                <p className="font-medium">Sistema de Gestión Documental</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="border-t pt-6">
            <h3 className="flex items-center space-x-2 text-lg font-semibold mb-4">
              <User className="h-5 w-5 text-red-600" />
              <span>Información del Titular</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Nombre Completo
                  </p>
                  <p className="font-medium">
                    {user.nombres} {user.apellidos}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    DNI
                  </p>
                  <p className="font-mono font-medium">{user.dni}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="font-medium text-sm">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Fecha de Registro
                  </p>
                  <p className="font-medium text-sm">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString("es-PE", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true, // formato 24h
                          timeZone: "America/Lima", // ⏰ asegura hora peruana
                        })
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Info */}
          <div className="border-t pt-6 bg-muted/50 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Información de Verificación
            </h3>
            <p className="text-xs text-muted-foreground">
              Este certificado ha sido verificado el{" "}
              {new Date().toLocaleDateString("es-PE")} a las{" "}
              {new Date().toLocaleTimeString("es-PE")} a través del Sistema de
              Evaluación SGD del Gobierno Regional de Ayacucho.
            </p>
            {!isActive && (
              <p className="text-xs text-red-600 mt-2 font-medium">
                ADVERTENCIA: Este certificado ha sido revocado y no tiene
                validez oficial.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Institution Info */}
      <Card className="gov-card">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-bold text-red-600">
              Gobierno Regional de Ayacucho
            </h3>
            <p className="text-sm text-muted-foreground">
              Oficina de Tecnologías de la Información
            </p>
            <p className="text-xs text-muted-foreground">
              Sistema de Evaluación del Sistema de Gestión Documental
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
