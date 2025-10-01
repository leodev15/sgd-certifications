"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import type { Question } from "@/lib/mock-data"

interface QuestionsManagerProps {
  questions: Question[]
  onAddQuestion: (question: Omit<Question, "id">) => void
  onUpdateQuestion: (id: string, question: Omit<Question, "id">) => void
  onDeleteQuestion: (id: string) => void
}

export function QuestionsManager({
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
}: QuestionsManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    pregunta: "",
    opciones: ["", "", "", ""],
    respuestaCorrecta: 0,
    categoria: "",
  })

  const resetForm = () => {
    setFormData({
      pregunta: "",
      opciones: ["", "", "", ""],
      respuestaCorrecta: 0,
      categoria: "",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.pregunta.trim() || !formData.categoria.trim()) return
    if (formData.opciones.some((opcion) => !opcion.trim())) return

    if (editingId) {
      onUpdateQuestion(editingId, formData)
      setEditingId(null)
    } else {
      onAddQuestion(formData)
      setIsAdding(false)
    }

    resetForm()
  }

  const handleEdit = (question: Question) => {
    setFormData({
      pregunta: question.pregunta,
      opciones: [...question.opciones],
      respuestaCorrecta: question.respuestaCorrecta,
      categoria: question.categoria,
    })
    setEditingId(question.id)
    setIsAdding(false)
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    resetForm()
  }

  const updateOpcion = (index: number, value: string) => {
    const newOpciones = [...formData.opciones]
    newOpciones[index] = value
    setFormData({ ...formData, opciones: newOpciones })
  }

  return (
    <Card className="gov-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gestión de Preguntas</CardTitle>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-red-600 hover:bg-red-700"
            disabled={isAdding || editingId !== null}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva Pregunta
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <Card className="border-2 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-lg">{editingId ? "Editar Pregunta" : "Nueva Pregunta"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría</Label>
                    <Input
                      id="categoria"
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      placeholder="Ej: Conceptos Básicos"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pregunta">Pregunta</Label>
                  <Textarea
                    id="pregunta"
                    value={formData.pregunta}
                    onChange={(e) => setFormData({ ...formData, pregunta: e.target.value })}
                    placeholder="Escriba la pregunta aquí..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label>Opciones de Respuesta</Label>
                  {formData.opciones.map((opcion, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="respuestaCorrecta"
                          checked={formData.respuestaCorrecta === index}
                          onChange={() => setFormData({ ...formData, respuestaCorrecta: index })}
                          className="text-red-600"
                        />
                        <span className="w-6 text-sm font-medium">{String.fromCharCode(65 + index)}:</span>
                      </div>
                      <Input
                        value={opcion}
                        onChange={(e) => updateOpcion(index, e.target.value)}
                        placeholder={`Opción ${String.fromCharCode(65 + index)}`}
                        required
                        className="flex-1"
                      />
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground">
                    Seleccione la opción correcta marcando el círculo correspondiente
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    <Save className="mr-2 h-4 w-4" />
                    {editingId ? "Actualizar" : "Guardar"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id} className="border">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{question.categoria}</Badge>
                      <span className="text-sm text-muted-foreground">Pregunta #{index + 1}</span>
                    </div>

                    <h3 className="font-medium text-foreground">{question.pregunta}</h3>

                    <div className="space-y-1">
                      {question.opciones.map((opcion, opcionIndex) => (
                        <div
                          key={opcionIndex}
                          className={`text-sm flex items-center space-x-2 ${
                            opcionIndex === question.respuestaCorrecta
                              ? "text-green-600 font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          <span className="w-6">{String.fromCharCode(65 + opcionIndex)}:</span>
                          <span>{opcion}</span>
                          {opcionIndex === question.respuestaCorrecta && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Correcta</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(question)}
                      disabled={isAdding || editingId !== null}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={isAdding || editingId !== null}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
