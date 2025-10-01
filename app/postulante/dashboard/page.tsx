"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  BookOpen,
  Clock,
  FileText,
  LogOut,
  User,
  Award,
  AlertCircle,
} from "lucide-react";

import type {
  User as UserType,
  ExamResult,
  Certificate,
} from "@/lib/mock-data";
import { signOut, useSession } from "next-auth/react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function PostulanteDashboard() {
  //LoginForm guarda el usuario en sessionStorage
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  //useSession() de next-auth que no está funcionando.
  const { data: session, status } = useSession();
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [hasActiveCertificate, setHasActiveCertificate] = useState(false);
  const router = useRouter();

  /*useEffect(() => {
    const user = sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user") as string)
      : null;

    console.log("👤 Usuario desde sessionStorage:", user);
    console.log("👤 Usuario desde sessionStorage:", session?.user);

    if (status === "loading") return; // espera a que NextAuth cargue

    //if (status === "authenticated" && session) { console.log("✅ Usuario autenticado:", session.user); }

    if (!session || session.user.role !== "postulante") {
      router.push("/login");
      return;
    }

    // cargar resultados del examen
    const loadExamResults = async () => {
      const res = await fetch(`/api/exam-results?userId=${session.user.id}`);
      if (res.ok) {
        const data = await res.json();
        setExamResults(data);
      }
    };

    // cargar certificados
    const loadCertificates = async () => {
      const res = await fetch(`/api/certificates?userId=${session.user.id}`);
      if (res.ok) {
        const data: Certificate[] = await res.json();
        const userCertificate = data.find((c) => c.estado === "activo");
        setHasActiveCertificate(!!userCertificate);
      }

      console.log("🔑 Sesión cargada en dashboard:", session.user);
    };

    loadExamResults();
    loadCertificates();
  }, [status, session, router]);*/

  useEffect(() => {
    // Obtener usuario desde sessionStorage
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      console.log("👤 Usuario desde sessionStorage:", userData);

      // Verificar rol
      if (userData.role !== "postulante") {
        router.push("/auth/login");
        return;
      }

      // Cargar datos del usuario
      loadUserData(userData.id);
    } else {
      // No hay usuario, redirigir al login
      console.log("❌ No hay usuario en sessionStorage");
      router.push("/auth/login");
    }
  }, [router]);

  const loadUserData = async (userId: string) => {
    try {
      // Cargar resultados del examen
      const examRes = await fetch(`/api/exam-results?userId=${userId}`);
      if (examRes.ok) {
        const examData = await examRes.json();
        setExamResults(examData.data || examData); // Ajuste según la estructura de la respuesta
      }

      // Cargar certificados
      const certRes = await fetch(`/api/certificates?userId=${userId}`);
      if (certRes.ok) {
        const certData: Certificate[] = await certRes.json();
        console.log(certData)
        const userCertificate = certData.find((c) => c.estado === "activo");
        console.log("certificado del usuario: "+ userCertificate)
        console.log(userCertificate)
        setHasActiveCertificate(!!userCertificate);
      }

      console.log(certRes);

    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    //await signOut({ callbackUrl: "/" });
    // Limpiar sessionStorage y redirigir
    sessionStorage.removeItem("user");
    router.push("/login");
  };


  const handleStartExam = () => {
    router.push("/postulante/examen");
  };

  const canTakeExam = () => {
    // Allow retaking if no passing result exists
    return !examResults.some((result) => result.passed);
  };

  console.log(examResults)


  const getLastExamResult = () => {
    console.log("dentro del resultado del ultimo examen"+examResults)
    console.log(examResults) //{data: Array(1), count: 1}
    if (examResults.length === 0) return null;
    return examResults.sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )[0];
  };

  if (status === "loading") {
    return <div>Cargando sesión...</div>;
  }

  /*if (!session) {
    return <div>No autenticado</div>;
  }*/

  const lastResult = getLastExamResult();


  return (
    <ProtectedRoute requiredRole="postulante">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="gov-header text-red-500 p-6 shadow-md mb-8">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Panel del Postulante</h1>
                <p className="text-gray-400">
                  Bienvenido, {user?.nombres} {user?.apellidos}{/*session.user.name*/} {/*session.user.lastname*/}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-gray-500 hover:bg-white/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
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
                    <p className="font-medium">{user?.dni}{/*session.user.dni*/}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}{/*session.user.email*/}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre Completo</p>
                    <p className="font-medium">{user?.nombres} {user?.apellidos}{/*session.user.telefono*/}</p>
                  </div>
                  {/*<div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{user.telefono}{/*session.user.telefono}</p>
                  </div>*/}
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Fecha de Registro
                    </p>
                    <p className="font-medium">
                      {/*new Date(session.user.createdAt).toLocaleDateString("es-PE")*/}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exam Status */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Take Exam Card */}
              <Card className="gov-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-red-600" />
                    <span>Examen SGD</span>
                  </CardTitle>
                  <CardDescription>
                    Evaluación del Sistema de Gestión Documental
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Duración: 10 minutos</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>10 preguntas de opción múltiple</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>Nota mínima: 16/20 (80%)</span>
                    </div>
                  </div>

                  {examResults.length >= 2 ? (
                    <Alert className="border-red-500 text-red-500 bg-red-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Ya no puede realizar el examen por número de intentos
                        excedidos. Acérquese a la oficina de OTIC.
                      </AlertDescription>
                    </Alert>
                  ) : canTakeExam() ? (
                    <Button
                      onClick={handleStartExam}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      {examResults.length > 0
                        ? "Reintentar Examen"
                        : "Iniciar Examen"}
                    </Button>
                  ) : (
                    <Alert className="border-green-500 text-green-500 bg-green-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription >
                        Ya has aprobado el examen. Puedes descargar tu
                        certificado.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Results Card */}
              <Card className="gov-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-red-600" />
                    <span>Resultados</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {examResults.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Aún no has tomado el examen
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {lastResult && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Último intento:
                            </span>
                            <span
                              className={`font-bold ${
                                lastResult.passed
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {lastResult.passed ? "APROBADO" : "DESAPROBADO"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Puntaje:
                            </span>
                            <span className="font-medium">
                              {lastResult.score}/{lastResult.totalQuestions} (
                              {Math.round(
                                (lastResult.score / lastResult.totalQuestions) *
                                  100
                              )}
                              %)
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Fecha:
                            </span>
                            <span className="text-sm">
                              {new Date(
                                lastResult.completedAt
                              ).toLocaleDateString("es-PE")}
                            </span>
                          </div>

                          {lastResult.passed && lastResult.certificateCode && (
                            <Button
                              variant="outline"
                              className="w-full mt-4 bg-transparent"
                              onClick={() =>
                                router.push(
                                  `/postulante/resultado/${lastResult.id}`
                                )
                              }
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Ver Certificado
                            </Button>
                          )}
                        </div>
                      )}

                      {examResults.length > 1 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            Total de intentos: {examResults.length}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Instructions */}
            <Card className="gov-card">
              <CardHeader>
                <CardTitle>Instrucciones del Examen</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • El examen consta de 10 preguntas sobre el Sistema de
                    Gestión Documental
                  </li>
                  <li>
                    • Tienes 10 minutos para completar todas las preguntas
                  </li>
                  <li>• La nota mínima para aprobar es 16/20 (80%)</li>
                  <li>• Puedes navegar entre preguntas durante el examen</li>
                  <li>
                    • El examen se enviará automáticamente al terminar el tiempo
                  </li>
                  <li>
                    • Si apruebas, recibirás un certificado oficial con código
                    de verificación
                  </li>
                  <li>
                    • Puedes reintentar el examen si no apruebas en el primer
                    intento
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
