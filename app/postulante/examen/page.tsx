"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExamInterface } from "@/components/exam/exam-interface";
import { getRandomQuestions } from "@/lib/storage";
import type { Question } from "@/lib/mock-data";

export default function ExamenPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  /*useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "postulante") {
      router.push("/login")
      return
    }

    // Load random questions for the exam
    const examQuestions = getRandomQuestions(10)
    setQuestions(examQuestions)
    setIsLoading(false)
  }, [router])*/

  /*const loadExam = async () => {
    // Obtener usuario desde sessionStorage
    const storedUser = sessionStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    console.log("🔍 Usuario en examen:", currentUser);

    if (!currentUser || currentUser.role !== "postulante") {
      console.log("❌ Usuario no autorizado para examen");
      router.push("/auth/login");
      return;
    }

    setUser(currentUser);

    try {
      // Cargar preguntas aleatorias para el examen - ahora con await
      const examQuestions = await getRandomQuestions(10);
      console.log("✅ Preguntas cargadas:", examQuestions);

      // 🔹 CORRECCIÓN: Mapear usando los nombres de propiedades en ESPAÑOL
        const mappedQuestions = examQuestions.map((q: any) => ({
          id: q.id,
          pregunta: q.pregunta, // Usar 'pregunta' en lugar de 'question'
          opciones: q.opciones, // Usar 'opciones' en lugar de 'options'
          respuestaCorrecta: q.respuesta_correcta || q.respuestaCorrecta, // Usar 'respuestaCorrecta'
          categoria: q.categoria // Usar 'categoria' en lugar de 'category'
        }))

      setQuestions(mappedQuestions);
    } catch (error) {
      console.error("❌ Error cargando preguntas:", error);
      setError("Error al cargar las preguntas del examen");
      // Puedes cargar preguntas de emergencia aquí si lo deseas
    } finally {
      setIsLoading(false);
    }
  };

  loadExam();*/

  useEffect(() => {
    const loadExam = async () => {
      // 🔹 Obtener usuario desde sessionStorage
      const storedUser = sessionStorage.getItem("user");
      const currentUser = storedUser ? JSON.parse(storedUser) : null;

      console.log("🔍 Usuario en examen:", currentUser);

      if (!currentUser || currentUser.role !== "postulante") {
        console.log("❌ Usuario no autorizado para examen");
        router.push("/auth/login");
        return;
      }

      setUser(currentUser);

      try {
        // 🔹 Llamada al endpoint de preguntas
        const res = await fetch("/api/exam-questions?count=10");
        if (!res.ok) throw new Error("Error al obtener preguntas");

        const data: Question[] = await res.json();

        console.log("✅ Preguntas cargadas:", data);

        // Mapear para asegurarnos de usar nombres correctos
        const mappedQuestions = data.map((q: any) => ({
          id: q.id,
          pregunta: q.pregunta,
          opciones: q.opciones,
          respuestaCorrecta: q.respuestaCorrecta || q.respuesta_correcta,
          categoria: q.categoria,
        }));

        setQuestions(mappedQuestions);
      } catch (err) {
        console.error("❌ Error cargando preguntas:", err);
        setError("Error al cargar las preguntas del examen");
      } finally {
        setIsLoading(false);
      }
    };

    loadExam();
  }, [router]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Preparando examen...
          </p>
        </div>
      </div>
    );
  }

  return <ExamInterface questions={questions} />;
}
