"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Question } from "@/lib/mock-data"

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedAnswer: number | null
  onAnswerSelect: (answerIndex: number) => void
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
}: QuestionCardProps) {

  return (
    <Card className="gov-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-primary">
            Pregunta {questionNumber} de {totalQuestions}
          </span>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">{question.categoria}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium text-foreground leading-relaxed">{question.pregunta}</div>

        <div className="space-y-3">
          {question.opciones.map((opcion, index) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              className={`w-full text-left justify-start p-4 h-auto whitespace-normal ${
                selectedAnswer === index
                  ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                  : "hover:bg-red-50 dark:hover:bg-red-950 border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => onAnswerSelect(index)}
            >
              <span className="flex items-start space-x-3 w-full">
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                    selectedAnswer === index ? "border-white bg-white text-red-600" : "border-current"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-left">{opcion}</span>
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
