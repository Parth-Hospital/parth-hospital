"use client"

import { useState, useEffect } from "react"
import { EmployeeLayout } from "@/components/layouts/employee-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  CheckSquare,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Flag,
  StickyNote,
  X,
  Loader2,
} from "lucide-react"
import { todoApi, Todo } from "@/lib/api/todo"
import { noteApi, Note } from "@/lib/api/note"
import { useToast } from "@/hooks/use-toast"

const NOTE_COLORS = [
  "#fff9c4", // Yellow
  "#f1f8e9", // Light Green
  "#e3f2fd", // Light Blue
  "#fce4ec", // Light Pink
  "#f3e5f5", // Light Purple
  "#fff3e0", // Light Orange
  "#ffffff", // White
]

export default function NexRoutinePage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [showTodoDialog, setShowTodoDialog] = useState(false)
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [todoForm, setTodoForm] = useState({
    title: "",
    dueDate: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
  })
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    color: NOTE_COLORS[0],
  })
  const [processing, setProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [todosData, notesData] = await Promise.all([
        todoApi.getTodos(),
        noteApi.getNotes(),
      ])
      setTodos(todosData)
      setNotes(notesData)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTodo = async () => {
    if (!todoForm.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive",
      })
      return
    }

    try {
      setProcessing(true)
      const newTodo = await todoApi.createTodo({
        title: todoForm.title,
        dueDate: todoForm.dueDate || undefined,
        priority: todoForm.priority,
      })
      setTodos([...todos, newTodo])
      setShowTodoDialog(false)
      setTodoForm({ title: "", dueDate: "", priority: "MEDIUM" })
      toast({
        title: "Success",
        description: "Task created successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleUpdateTodo = async () => {
    if (!editingTodo || !todoForm.title.trim()) {
      return
    }

    try {
      setProcessing(true)
      const updated = await todoApi.updateTodo(editingTodo.id, {
        title: todoForm.title,
        dueDate: todoForm.dueDate || null,
        priority: todoForm.priority,
      })
      setTodos(todos.map((t) => (t.id === updated.id ? updated : t)))
      setShowTodoDialog(false)
      setEditingTodo(null)
      setTodoForm({ title: "", dueDate: "", priority: "MEDIUM" })
      toast({
        title: "Success",
        description: "Task updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleToggleTodo = async (todo: Todo) => {
    try {
      const updated = await todoApi.updateTodo(todo.id, {
        completed: !todo.completed,
      })
      setTodos(todos.map((t) => (t.id === updated.id ? updated : t)))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoApi.deleteTodo(id)
      setTodos(todos.filter((t) => t.id !== id))
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setTodoForm({
      title: todo.title,
      dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split("T")[0] : "",
      priority: todo.priority,
    })
    setShowTodoDialog(true)
  }

  const handleCreateNote = async () => {
    if (!noteForm.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter note content",
        variant: "destructive",
      })
      return
    }

    try {
      setProcessing(true)
      const newNote = await noteApi.createNote({
        title: noteForm.title || undefined,
        content: noteForm.content,
        color: noteForm.color,
      })
      setNotes([newNote, ...notes])
      setShowNoteDialog(false)
      setNoteForm({ title: "", content: "", color: NOTE_COLORS[0] })
      toast({
        title: "Success",
        description: "Note created successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create note",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleUpdateNote = async () => {
    if (!editingNote || !noteForm.content.trim()) {
      return
    }

    try {
      setProcessing(true)
      const updated = await noteApi.updateNote(editingNote.id, {
        title: noteForm.title || undefined,
        content: noteForm.content,
        color: noteForm.color,
      })
      setNotes(notes.map((n) => (n.id === updated.id ? updated : n)))
      setShowNoteDialog(false)
      setEditingNote(null)
      setNoteForm({ title: "", content: "", color: NOTE_COLORS[0] })
      toast({
        title: "Success",
        description: "Note updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update note",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleDeleteNote = async (id: string) => {
    try {
      await noteApi.deleteNote(id)
      setNotes(notes.filter((n) => n.id !== id))
      toast({
        title: "Success",
        description: "Note deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete note",
        variant: "destructive",
      })
    }
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setNoteForm({
      title: note.title || "",
      content: note.content,
      color: note.color || NOTE_COLORS[0],
    })
    setShowNoteDialog(true)
  }

  const openNewTodo = () => {
    setEditingTodo(null)
    setTodoForm({ title: "", dueDate: "", priority: "MEDIUM" })
    setShowTodoDialog(true)
  }

  const openNewNote = () => {
    setEditingNote(null)
    setNoteForm({ title: "", content: "", color: NOTE_COLORS[0] })
    setShowNoteDialog(true)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-300"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "LOW":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const pendingTodos = todos.filter((t) => !t.completed)
  const completedTodos = todos.filter((t) => t.completed)

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </EmployeeLayout>
    )
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">NexRoutine</h2>
          <p className="text-muted-foreground">Manage your daily tasks and notes</p>
        </div>

        {/* Side-by-side layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Todo List Section */}
          <Card className="h-[calc(100vh-250px)] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  Tasks ({pendingTodos.length})
                </CardTitle>
                <Button size="sm" onClick={openNewTodo}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-3">
              {pendingTodos.length === 0 && completedTodos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No tasks yet. Create your first task!</p>
                </div>
              ) : (
                <>
                  {pendingTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <button
                        onClick={() => handleToggleTodo(todo)}
                        className="mt-1 flex-shrink-0"
                      >
                        <div className="w-5 h-5 border-2 border-primary rounded flex items-center justify-center">
                          {todo.completed && (
                            <CheckSquare className="w-4 h-4 text-primary fill-primary" />
                          )}
                        </div>
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium">{todo.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {todo.dueDate && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(todo.dueDate).toLocaleDateString("en-IN")}
                                </div>
                              )}
                              <Badge
                                variant="outline"
                                className={`text-xs ${getPriorityColor(todo.priority)}`}
                              >
                                <Flag className="w-3 h-3 mr-1" />
                                {todo.priority}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditTodo(todo)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTodo(todo.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {completedTodos.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Completed ({completedTodos.length})
                      </p>
                      {completedTodos.map((todo) => (
                        <div
                          key={todo.id}
                          className="flex items-start gap-3 p-3 border rounded-lg opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <button
                            onClick={() => handleToggleTodo(todo)}
                            className="mt-1 flex-shrink-0"
                          >
                            <CheckSquare className="w-5 h-5 text-primary fill-primary" />
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium line-through">{todo.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {todo.dueDate && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(todo.dueDate).toLocaleDateString("en-IN")}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTodo(todo.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card className="h-[calc(100vh-250px)] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <StickyNote className="w-5 h-5" />
                  Notes ({notes.length})
                </CardTitle>
                <Button size="sm" onClick={openNewNote}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {notes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <StickyNote className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No notes yet. Create your first note!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      style={{ backgroundColor: note.color || NOTE_COLORS[0] }}
                      onClick={() => handleEditNote(note)}
                    >
                      {note.title && (
                        <h3 className="font-semibold mb-2">{note.title}</h3>
                      )}
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-end gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteNote(note.id)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Todo Dialog */}
        <Dialog open={showTodoDialog} onOpenChange={setShowTodoDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTodo ? "Edit Task" : "Create New Task"}
              </DialogTitle>
              <DialogDescription>
                {editingTodo
                  ? "Update your task details"
                  : "Add a new task to your daily routine"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Task Title</label>
                <Input
                  placeholder="Enter task title"
                  value={todoForm.title}
                  onChange={(e) => setTodoForm({ ...todoForm, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={todoForm.dueDate}
                    onChange={(e) =>
                      setTodoForm({ ...todoForm, dueDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={todoForm.priority}
                    onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") =>
                      setTodoForm({ ...todoForm, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTodoDialog(false)
                    setEditingTodo(null)
                    setTodoForm({ title: "", dueDate: "", priority: "MEDIUM" })
                  }}
                  className="flex-1"
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingTodo ? handleUpdateTodo : handleCreateTodo}
                  className="flex-1"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingTodo ? "Updating..." : "Creating..."}
                    </>
                  ) : editingTodo ? (
                    "Update Task"
                  ) : (
                    "Create Task"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Note Dialog */}
        <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingNote ? "Edit Note" : "Create New Note"}
              </DialogTitle>
              <DialogDescription>
                {editingNote
                  ? "Update your note"
                  : "Jot down your thoughts and ideas"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title (Optional)</label>
                <Input
                  placeholder="Note title"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Write your note here..."
                  value={noteForm.content}
                  onChange={(e) =>
                    setNoteForm({ ...noteForm, content: e.target.value })
                  }
                  rows={8}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex gap-2">
                  {NOTE_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded border-2 ${
                        noteForm.color === color ? "border-primary" : "border-border"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNoteForm({ ...noteForm, color })}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNoteDialog(false)
                    setEditingNote(null)
                    setNoteForm({ title: "", content: "", color: NOTE_COLORS[0] })
                  }}
                  className="flex-1"
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingNote ? handleUpdateNote : handleCreateNote}
                  className="flex-1"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingNote ? "Updating..." : "Creating..."}
                    </>
                  ) : editingNote ? (
                    "Update Note"
                  ) : (
                    "Create Note"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </EmployeeLayout>
  )
}
