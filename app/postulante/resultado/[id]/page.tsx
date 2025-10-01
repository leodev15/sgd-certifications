"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ExamResults } from "@/components/results/exam-results";
import { ArrowLeft, User } from "lucide-react";
import {getExamResults, getCertificates } from "@/lib/storage";
import {
  generateCertificatePDF,
  downloadCertificateHTML,
} from "@/lib/pdf-generator";
import type {
  User as UserType,
  ExamResult,
  Certificate,
} from "@/lib/mock-data";

export default function ResultadoPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const resultId = params.id as string;

  useEffect(() => {
    //const currentUser = getCurrentUser()
    // 🔹 Recuperar usuario desde sessionStorage

    const loadData = async () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        const currentUser = storedUser ? JSON.parse(storedUser) : null;
        console.log("🔍 Usuario en resultados:", currentUser);

        if (!currentUser || currentUser.role !== "postulante") {
          router.push("/login");
          return;
        }

        setUser(currentUser);

        // Load exam result
        /*const examResults = getExamResults()
    const result = examResults.find((r) => r.id === resultId && r.userId === currentUser.id)
*/
        // 🔹 Obtener resultados del examen desde la API

        const resExam = await fetch(
          `/api/exam-results?userId=${currentUser.id}`
        );

        if (!resExam.ok) throw new Error("Error obteniendo resultados");

        const response = await resExam.json();
        console.log("📄 Respuesta completa de la API:", response);

        // Opción 1: Si la API devuelve { data: ExamResult[], count: number }
        const examResults: ExamResult[] = response.data || response;
        const result = examResults.find((r) => r.id === resultId);

        // Opción 2: Si quieres ser más específico
        // const examResults: ExamResult[] = response.data ? response.data : response;

        console.log("📄 Resultado encontrado:", result);
        if (!result) {
          console.log("❌ No se encontró el resultado con ID:", resultId);
          router.push("/postulante/dashboard");
          return;
        }

        setExamResult(result);

        // Load certificate if exists
        if (result.certificateCode) {
          const resCert = await fetch(
            `/api/certificates?code=${result.certificateCode}`
          );
          if (resCert.ok) {
            const cert: Certificate = await resCert.json();
            setCertificate(cert || null);
          }
        }
        /*if (result.certificateCode) {
          const certificates = getCertificates();
          const cert = certificates.find(
            (c) => c.codigo === result.certificateCode
          );
          setCertificate(cert || null);
        }*/
      } catch (err) {
        console.error("❌ Error cargando datos de resultado:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [router, resultId]);

  const handleDownloadPDF = async () => {
    if (!examResult || !user || !certificate) return;

    try {
      /*await generateCertificatePDF({
        codigo: certificate.codigo,
        nombres: user.nombres,
        apellidos: user.apellidos,
        dni: user.dni,
        fechaEmision: certificate.fecha_emision? certificate.fecha_emision.toString() : "",
        score: examResult.score,
        totalQuestions: examResult.totalQuestions,
      });*/
      await downloadCertificateHTML({
        codigo: certificate.codigo,
        nombres: user.nombres,
        apellidos: user.apellidos,
        dni: user.dni,
        fechaEmision: certificate.fecha_emision? certificate.fecha_emision.toString() : "",
        score: examResult.score,
        totalQuestions: examResult.totalQuestions,
      });
      
    } catch (error) {
      // Fallback to HTML download
      downloadCertificateHTML({
        codigo: certificate.codigo,
        nombres: user.nombres,
        apellidos: user.apellidos,
        dni: user.dni,
        fechaEmision: certificate.fechaEmision,
        score: examResult.score,
        totalQuestions: examResult.totalQuestions,
      });
    }
  };

  const handleBackToDashboard = () => {
    router.push("/postulante/dashboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Cargando resultados...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !examResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            No se encontraron los resultados del examen.
          </p>
          <Button onClick={handleBackToDashboard} className="mt-4">
            Volver al Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="gov-header text-red-500 p-6 shadow-md mb-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Resultados del Examen</h1>
              <p className="text-gray-400">Sistema de Gestión Documental</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleBackToDashboard}
              className="text-gray-400 hover:bg-white/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <ExamResults
          examResult={examResult}
          user={user}
          certificate={certificate || undefined}
          onDownloadPDF={handleDownloadPDF}
        />
      </main>
    </div>
  );
}
