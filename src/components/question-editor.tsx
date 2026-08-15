'use client'

import { useState } from 'react'
import type { Question, QuestionType, TimerChoice } from '@/lib/types'
import { TIMER_CHOICES } from '@/lib/types'
import { apiPost, apiPut, apiDelete } from '@/lib/client/api'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Trash2, Copy, Edit3, Image as ImageIcon, Check } from 'lucide-react'

interface QuestionEditorProps {
  quizId: string
  initialQuestions: Question[]
  onQuestionsChange: (questions: Question[]) => void
}

function SortableQuestionRow({
  question,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  question: Question
  onEdit: (q: Question) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: question.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card p-4 flex items-center justify-between gap-3 border border-line-strong bg-paper hover:bg-cream-deep transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-1 text-ink-faint hover:text-ink cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-lav-tint text-lav-ink text-[10px] font-black uppercase">
              {question.type}
            </span>
            <span className="text-xs font-semibold text-ink-soft tnum">
              {question.timerSeconds}s
            </span>
          </div>
          <p className="font-bold text-ink text-sm sm:text-base line-clamp-1">
            {question.prompt}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(question)}
          className="p-2 rounded-lg text-ink-soft hover:text-lav-ink hover:bg-lav-tint transition-all cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDuplicate(question.id)}
          className="p-2 rounded-lg text-ink-soft hover:text-blue-ink hover:bg-blue-tint transition-all cursor-pointer"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(question.id)}
          className="p-2 rounded-lg text-ink-soft hover:text-rose-ink hover:bg-rose-tint transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export function QuestionEditor({
  quizId,
  initialQuestions,
  onQuestionsChange,
}: QuestionEditorProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = questions.findIndex((q) => q.id === active.id)
    const newIndex = questions.findIndex((q) => q.id === over.id)

    if (oldIndex < 0 || newIndex < 0) return

    const reordered = [...questions]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)

    setQuestions(reordered)
    onQuestionsChange(reordered)

    try {
      await apiPost('/api/admin/questions/reorder', {
        orderedIds: reordered.map((q) => q.id),
      })
    } catch {
      setQuestions(questions)
    }
  }

  const handleCreateNew = () => {
    setEditingQuestion({
      quizId,
      type: 'MCQ',
      prompt: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      timerSeconds: 20,
      explanation: '',
      imageId: null,
    })
  }

  const handleDuplicate = async (id: string) => {
    try {
      const res = await apiPost<{ question: Question }>(`/api/admin/questions/${id}/duplicate`)
      const updated = [...questions, res.question]
      setQuestions(updated)
      onQuestionsChange(updated)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Duplicate failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return
    try {
      await apiDelete(`/api/admin/questions/${id}`)
      const updated = questions.filter((q) => q.id !== id)
      setQuestions(updated)
      onQuestionsChange(updated)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('image', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      setEditingQuestion((prev) => (prev ? { ...prev, imageId: data.imageId } : null))
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveModal = async () => {
    if (!editingQuestion) return
    if (!editingQuestion.prompt?.trim()) {
      alert('Question prompt is required')
      return
    }

    try {
      setIsSaving(true)

      let saved: Question
      if (editingQuestion.id) {
        const res = await apiPut<{ question: Question }>(
          `/api/admin/questions/${editingQuestion.id}`,
          editingQuestion,
        )
        saved = res.question
        const updated = questions.map((q) => (q.id === saved.id ? saved : q))
        setQuestions(updated)
        onQuestionsChange(updated)
      } else {
        const res = await apiPost<{ question: Question }>('/api/admin/questions', editingQuestion)
        saved = res.question
        const updated = [...questions, saved]
        setQuestions(updated)
        onQuestionsChange(updated)
      }

      setEditingQuestion(null)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Header action */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-ink">Quiz Questions ({questions.length})</h2>
        <button
          type="button"
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl bg-lav-ink text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-lav-ink/90 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Question</span>
        </button>
      </div>

      {/* Questions list with drag & drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {questions.map((q) => (
              <SortableQuestionRow
                key={q.id}
                question={q}
                onEdit={(q) => setEditingQuestion(q)}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Question Edit / Create Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg card-solid p-6 space-y-5 border-2 border-line-strong shadow-2xl my-8">
            <h3 className="text-xl font-bold text-ink">
              {editingQuestion.id ? 'Edit Question' : 'Add New Question'}
            </h3>

            <div className="space-y-4">
              {/* Type Select */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-ink-soft mb-1.5">
                  Question Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['MCQ', 'TRUE_FALSE', 'IMAGE'] as QuestionType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        const opts =
                          t === 'TRUE_FALSE'
                            ? ['True', 'False']
                            : editingQuestion.options?.length === 4
                            ? editingQuestion.options
                            : ['', '', '', '']
                        setEditingQuestion((prev) => ({ ...prev, type: t, options: opts, correctIndex: 0 }))
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        editingQuestion.type === t
                          ? 'bg-lav-ink text-white border-lav-ink shadow-xs'
                          : 'bg-cream-deep border-line-strong text-ink hover:bg-paper'
                      }`}
                    >
                      {t === 'MCQ' ? 'Multiple Choice' : t === 'TRUE_FALSE' ? 'True / False' : 'Image Question'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-ink-soft mb-1.5">
                  Question Prompt
                </label>
                <input
                  type="text"
                  value={editingQuestion.prompt || ''}
                  onChange={(e) =>
                    setEditingQuestion((prev) => ({ ...prev, prompt: e.target.value }))
                  }
                  placeholder="Enter the question..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-line-strong bg-cream-deep text-ink text-sm font-semibold focus:bg-paper focus:outline-hidden focus:ring-2 focus:ring-lav-ink"
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase text-ink-soft">
                  Answer Options & Correct Choice
                </label>

                {(editingQuestion.options || ['', '', '', '']).map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingQuestion((prev) => ({ ...prev, correctIndex: idx }))}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                        editingQuestion.correctIndex === idx
                          ? 'bg-emerald-600 border-emerald-700 text-white shadow-xs'
                          : 'bg-cream-deep border-line-strong text-ink-faint hover:text-ink'
                      }`}
                    >
                      {editingQuestion.correctIndex === idx && <Check className="w-4 h-4" />}
                    </button>

                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...(editingQuestion.options || [])]
                        newOpts[idx] = e.target.value
                        setEditingQuestion((prev) => ({ ...prev, options: newOpts }))
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      className="w-full px-3 py-2 rounded-xl border border-line-strong bg-cream-deep text-ink text-sm font-medium focus:bg-paper focus:outline-hidden"
                    />
                  </div>
                ))}
              </div>

              {/* Timer Choice */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-ink-soft mb-1.5">
                  Timer Duration
                </label>
                <div className="flex flex-wrap gap-2">
                  {TIMER_CHOICES.map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() =>
                        setEditingQuestion((prev) => ({ ...prev, timerSeconds: sec as TimerChoice }))
                      }
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        editingQuestion.timerSeconds === sec
                          ? 'bg-lav-ink text-white border-lav-ink'
                          : 'bg-cream-deep border-line-strong text-ink'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-ink-soft mb-1.5">
                  Question Image (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-2 rounded-xl border border-line-strong bg-cream-deep text-ink text-xs font-bold flex items-center gap-2 hover:bg-paper cursor-pointer">
                    <ImageIcon className="w-4 h-4" />
                    <span>{uploadingImage ? 'Uploading...' : 'Choose Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>

                  {editingQuestion.imageId && (
                    <span className="text-xs font-semibold text-emerald-700">Image Attached</span>
                  )}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-ink-soft mb-1.5">
                  Explanation (Optional)
                </label>
                <textarea
                  value={editingQuestion.explanation || ''}
                  onChange={(e) =>
                    setEditingQuestion((prev) => ({ ...prev, explanation: e.target.value }))
                  }
                  rows={2}
                  placeholder="Show fun facts or explanation in reveal phase..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-line-strong bg-cream-deep text-ink text-xs font-medium focus:bg-paper focus:outline-hidden"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 rounded-xl border border-line-strong text-ink-soft text-xs font-bold hover:bg-cream-deep cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-lav-ink text-white text-xs font-bold hover:bg-lav-ink/90 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
