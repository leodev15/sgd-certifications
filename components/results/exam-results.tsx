"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  Download,
  Share2,
  Award,
  Calendar,
  Clock,
  User,
  FileBadge,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import type {
  ExamResult,
  User as UserType,
  Certificate,
} from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { tr } from "date-fns/locale";

interface ExamResultsProps {
  examResult: ExamResult;
  user: UserType;
  certificate?: Certificate;
  onDownloadPDF: () => void;
}

export function ExamResults({
  examResult,
  user,
  certificate,
  onDownloadPDF,
}: ExamResultsProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const percentage = Math.round(
    (examResult.score / examResult.totalQuestions) * 100
  );
  const isPassed = examResult.passed;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownloadPDF();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && certificate) {
      try {
        await navigator.share({
          title: "Certificado SGD - Gobierno Regional de Ayacucho",
          text: `He obtenido mi certificación en Sistema de Gestión Documental. Código: ${certificate.codigo}`,
          url: `${window.location.origin}/verificar`,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(
          `Certificado SGD - Código: ${certificate.codigo} - Verificar en: ${window.location.origin}/verificar`
        );
      }
    }
  };

  console.log("El certificado: ", certificate);
  console.log("El certificado: ", certificate?.codigo);

  const handleGenerateCertificate = async () => {
    try {
      setOpen(true);
      setLoading(true);
      setError(false);
      setMessage("Generando certificado...");

      // Simulación de proceso (puedes llamar aquí a tu API)
      /*setTimeout(() => {
        setLoading(false);
        setMessage(
          "✅ Su certificado ha sido generado con éxito. Para obtenerlo acérquese a la OTIC."
        );
      }, 2000);*/

      // 🔹 Simulación: código de certificado y PDF en base64

      const codigo = "ABC123";
      const pdfBase64 = "JVBERi0xLjQKJ..."; // <- aquí pondrías tu PDF real

      /*const res = await fetch("/api/certificates/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo, pdfBase64 }),
      });

      if (!res.ok) {
        throw new Error("Error al generar el certificado");
      }

      const data = await res.json();*/

      setLoading(false);
      setMessage(
        "✅ Su certificado ha sido generado con éxito. Para obtenerlo acérquese a la OTIC."
      );
    } catch (err) {
      console.error("❌ Error generando certificado:", err);
      setLoading(false);
      setError(true);
      setMessage(
        "❌ Ocurrió un error al generar el certificado. Intente nuevamente."
      );
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Result Card */}
        <Card
          className={`gov-card border-2 ${
            isPassed ? "border-green-500" : "border-red-500"
          }`}
        >
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              {isPassed ? (
                <CheckCircle className="h-12 w-12 text-green-600" />
              ) : (
                <XCircle className="h-12 w-12 text-red-600" />
              )}
              <div>
                <CardTitle
                  className={`text-3xl ${
                    isPassed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPassed ? "APROBADO" : "DESAPROBADO"}
                </CardTitle>
                <p className="text-muted-foreground">
                  Examen del Sistema de Gestión Documental
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <Badge
                className={`text-lg px-4 py-2 ${
                  isPassed
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {examResult.score}/{examResult.totalQuestions} ({percentage}%)
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Puntaje obtenido</span>
                <span>{percentage}%</span>
              </div>
              <Progress
                value={percentage}
                className={`h-3 ${
                  isPassed ? "[&>div]:bg-green-500" : "[&>div]:bg-red-500"
                }`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Mínimo requerido: 70%</span>
                <span>
                  {isPassed ? "Objetivo alcanzado" : "Objetivo no alcanzado"}
                </span>
              </div>
            </div>

            {/* Exam Details */}
            <div className="grid md:grid-cols-3 gap-6 pt-6 border-t">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Duración</span>
                </div>
                <p className="text-2xl font-bold text-primary">10 min</p>
                <p className="text-sm text-muted-foreground">Tiempo límite</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Preguntas</span>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {examResult.totalQuestions}
                </p>
                <p className="text-sm text-muted-foreground">Total evaluadas</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Fecha</span>
                </div>
                <p className="text-lg font-bold text-primary">
                  {new Date(examResult.completedAt).toLocaleDateString("es-PE")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(examResult.completedAt).toLocaleTimeString("es-PE")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        <Card className="gov-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-red-600" />
              <span>Información del Participante</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Nombre Completo
                  </p>
                  <p className="text-lg font-medium">
                    {user.nombres} {user.apellidos}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    DNI
                  </p>
                  <p className="font-mono text-lg">{user.dni}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Teléfono
                  </p>
                  <p className="text-lg">{user.telefono}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificate Information */}
        {isPassed && certificate && (
          <Card className="gov-card border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                <Award className="h-5 w-5" />
                <span>Certificado Oficial</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Código del Certificado
                  </p>
                  <p className="text-xl font-mono font-bold text-green-700 dark:text-green-300">
                    {certificate.codigo}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Fecha de Emisión
                  </p>
                  <p className="text-lg font-medium">
                    {
                      certificate.fecha_emision
                        ? new Date(
                            certificate.fecha_emision
                          ).toLocaleDateString("es-PE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }) +
                          " " +
                          new Date(
                            certificate.fecha_emision
                          ).toLocaleTimeString("es-PE", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                        : "Sin fecha" /*new Date(certificate.fechaEmision).toLocaleDateString("es-PE")*/
                    }
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generando PDF...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Descargar Certificado
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleGenerateCertificate}
                  className="bg-gray-600 hover:bg-gray-700 text-white flex-1"
                >
                  <FileBadge className="mr-2 h-4 w-4" />
                  Generar Certificado
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 bg-transparent"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartir
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="gov-card">
          <CardHeader>
            <CardTitle>
              {isPassed ? "Felicitaciones" : "Próximos Pasos"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPassed ? (
              <div className="space-y-3">
                <p className="text-green-700 dark:text-green-300 font-medium">
                  ¡Has aprobado exitosamente el examen del Sistema de Gestión
                  Documental!
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • Tu certificado oficial ha sido generado con el código{" "}
                    {certificate?.codigo}
                  </li>
                  <li>• Puedes descargar tu constancia en formato PDF</li>
                  <li>
                    • El certificado puede ser verificado públicamente en
                    cualquier momento
                  </li>
                  <li>
                    • Conserva tu código de certificado para futuras referencias
                  </li>
                </ul>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-red-700 dark:text-red-300 font-medium">
                  No has alcanzado la nota mínima requerida (80%).
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Puedes volver a tomar el examen cuando desees</li>
                  <li>• Revisa los temas del Sistema de Gestión Documental</li>
                  <li>• Cada intento incluye preguntas diferentes</li>
                  <li>• La nota mínima para aprobar es 16/20 (80%)</li>
                </ul>
                <Button
                  onClick={() =>
                    (window.location.href = "/postulante/dashboard")
                  }
                  className="mt-4 bg-red-600 hover:bg-red-700"
                >
                  Volver al Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Institution Footer */}
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
              <p className="text-xs text-muted-foreground">
                Resultado generado el {new Date().toLocaleDateString("es-PE")} a
                las {new Date().toLocaleTimeString("es-PE")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl shadow-xl border-0 bg-white dark:bg-gray-900">
          <DialogHeader className="flex flex-col items-center space-y-3">
            {loading && (
              <Loader2 className="h-12 w-12 animate-spin text-green-600" />
            )}
            {!loading && !error && (
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            )}
            {!loading && error && (
              <XCircle className="h-12 w-12 text-red-600" />
            )}

            <DialogTitle className="text-xl font-bold text-center">
              {loading
                ? "Procesando..."
                : error
                ? "Error al generar"
                : "Certificado generado"}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 dark:text-gray-300">
              {message}
            </DialogDescription>
          </DialogHeader>

          {!loading && (
            <DialogFooter className="flex justify-center">
              <Button
                onClick={() => setOpen(false)}
                className={
                  error
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }
              >
                Cerrar
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
