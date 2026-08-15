'use client'

import { useEffect, useState } from 'react'
import { apiGet } from '@/lib/client/api'
import type { Question, Quiz } from '@/lib/types'
import { QuestionEditor } from '@/components/question-editor'

export function AdminQuestionsClient() {
  const [quizId, setQuizId] = useState<string>('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiGet<{ quiz: Quiz }>('/api/admin/quiz'),
      apiGet<{ questions: Question[] }>('/api/admin/questions'),
    ])
      .then(([quizRes, qRes]) => {
        setQuizId(quizRes.quiz.id)
        setQuestions(qRes.questions)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-ink-soft font-bold">
        <span>Loading question pool...</span>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-ink">Manage Questions</h1>
        <p className="text-xs text-ink-soft font-medium">
          Drag and drop to reorder questions in the question pool. Each participant will receive questions in a randomized order.
        </p>
      </div>

      <div className="notebook-card p-6">
        <QuestionEditor
          quizId={quizId}
          initialQuestions={questions}
          onQuestionsChange={(updated) => setQuestions(updated)}
        />
      </div>
    </div>
  )
}
