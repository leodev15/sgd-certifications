"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Send, AlertTriangle } from "lucide-react";
import { ExamTimer } from "./exam-timer";
import { QuestionCard } from "./question-card";
import type { Question, ExamResult } from "@/lib/mock-data";
import {
  saveExamResult,
  saveCertificate,
  generateCertificateCode,
} from "@/lib/storage";
import { User } from "next-auth";

interface ExamInterfaceProps {
  questions: Question[];
}

export function ExamInterface({ questions }: ExamInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [isExamActive, setIsExamActive] = useState(true);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const EXAM_DURATION = 8 * 60; // 10 minutes in seconds

  useEffect(() => {
    // Prevent page refresh/navigation during exam
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isExamActive) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isExamActive]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleTimeUp = () => {
    setIsExamActive(false);
    submitExam();
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      //if (answers[index] === question.respuestaCorrecta) {
      if ((answers[index] ?? -1) + 1 === question.respuestaCorrecta) {
        correctAnswers++;
      }
    });
    return correctAnswers;
  };

  const submitExam = async () => {
    setIsSubmitting(true);
    setIsExamActive(false);

    //const user = getCurrentUser()
    // 🔹 Obtener usuario de sessionStorage (o NextAuth)
    const storedUser = sessionStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      router.push("/login");
      return;
    }

    const score = calculateScore();
    const passed = score >= 8; // 80% minimum to pass (8 out of 10)

    /*const examResult: ExamResult = {
      id: Date.now().toString(),
      userId: user.id,
      score,
      totalQuestions: questions.length,
      passed,
      completedAt: new Date().toISOString(),
    }

    // Generate certificate if passed
    if (passed) {
      const certificateCode = await generateCertificateCode()
      examResult.certificateCode = certificateCode

      saveCertificate({
        id: Date.now().toString(),
        userId: user.id,
        examResultId: examResult.id,
        codigo: certificateCode,
        fechaEmision: new Date().toISOString(),
        estado: "activo",
      })*/
    try {
      // 🔹 Llamada al endpoint server-side para guardar examen
      const yearCurrent = new Date().getFullYear();

      const certificateCode =
        "SGD-"+ yearCurrent +"-"+ Math.random().toString(36).substring(2, 8).toUpperCase();

      const resExam = await fetch("/api/exam-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          score,
          totalQuestions: questions.length,
          passed,
          certificateCode: passed ? certificateCode : null,
        }),
      });

      if (!resExam.ok) {
        throw new Error("Error guardando el examen");
      }

      const examResult = await resExam.json();

      // 🔹 Si pasó, generar certificado vía endpoint
      if (passed) {

        /*const certificateCode =
        "SGD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      console.log("Codigo de certificado" + certificateCode);*/

        const resCert = await fetch("/api/certificates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            examResultId: examResult.id,
            codigo: certificateCode,
            fechaEmision: new Date().toISOString(),
            estado: "activo",
          }),
        });

        if (!resCert.ok) {
          throw new Error("Error generando certificado");
        }

        const certificate = await resCert.json();
        console.log("🎓 Certificado generado:", certificate);
      }

      // Redirigir a página de resultados
      router.push(`/postulante/resultado/${examResult.id}`);
    } catch (err) {
      console.error("❌ Error al enviar examen:", err);
      setIsSubmitting(false);
      setIsExamActive(true);
    }
  };

  const handleSubmitClick = () => {
    if (answeredCount < questions.length) {
      setShowSubmitConfirm(true);
    } else {
      submitExam();
    }
  };

  if (showSubmitConfirm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md gov-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Confirmar Envío</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Has respondido {answeredCount} de {questions.length} preguntas.
              {answeredCount < questions.length && (
                <span className="text-yellow-600 font-medium">
                  {" "}
                  Tienes {questions.length - answeredCount} preguntas sin
                  responder.
                </span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              Una vez enviado el examen, no podrás modificar tus respuestas.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1"
              >
                Continuar Examen
              </Button>
              <Button
                onClick={submitExam}
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Examen"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="gov-header text-red-500 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Examen SGD</h1>
            <p className="text-gray-400 text-sm">
              Gobierno Regional de Ayacucho
            </p>
          </div>
          <ExamTimer
            duration={EXAM_DURATION}
            onTimeUp={handleTimeUp}
            isActive={isExamActive}
          />
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progreso del Examen
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {answeredCount}/{questions.length} respondidas
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={answers[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
          />

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Anterior</span>
            </Button>

            <div className="flex items-center space-x-4">
              {/* Question Navigation Dots */}
              <div className="flex space-x-1">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                      index === currentQuestionIndex
                        ? "bg-red-600 text-white"
                        : answers[index] !== null
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmitClick}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? "Enviando..." : "Enviar Examen"}</span>
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="flex items-center space-x-2"
              >
                <span>Siguiente</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Instructions */}
          <Alert className="mt-6">
            <AlertDescription>
              <strong>Instrucciones:</strong> Seleccione la respuesta correcta
              para cada pregunta. Puede navegar entre preguntas usando los
              botones o haciendo clic en los números. El examen se enviará
              automáticamente cuando termine el tiempo.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  );
}
