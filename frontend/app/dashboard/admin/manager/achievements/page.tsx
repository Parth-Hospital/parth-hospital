"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Trophy, Loader2, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { achievementApi, Achievement } from "@/lib/api/achievement"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type AchievementType = "OWNER" | "HOSPITAL"

export default function ManagerAchievementsPage() {
  const [activeTab, setActiveTab] = useState<AchievementType>("OWNER")
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    type: "OWNER" as AchievementType,
  })
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadAchievements(activeTab)
  }, [activeTab])

  const loadAchievements = async (type: AchievementType) => {
    try {
      setLoading(true)
      const data = await achievementApi.getAchievements(type)
      setAchievements(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load achievements",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newAchievement.title || !newAchievement.description) {
      toast({
        title: "Error",
        description: "Title and description are required",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      await achievementApi.createAchievement({
        title: newAchievement.title,
        description: newAchievement.description,
        date: new Date(newAchievement.date).toISOString(),
        type: newAchievement.type,
      })
      toast({
        title: "Success",
        description: "Achievement added successfully",
      })
      setNewAchievement({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        type: activeTab,
      })
      setIsAdding(false)
      await loadAchievements(activeTab)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add achievement",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemoveClick = (id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleRemoveConfirm = async () => {
    if (!itemToDelete) return

    try {
      setDeleting(itemToDelete)
      setDeleteDialogOpen(false)
      await achievementApi.deleteAchievement(itemToDelete)
      toast({
        title: "Success",
        description: "Achievement deleted successfully",
      })
      await loadAchievements(activeTab)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete achievement",
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
      setItemToDelete(null)
    }
  }

  return (
    <AdminLayout role="manager">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Achievements Management</h2>
          <p className="text-muted-foreground">Manage Dr. Subash's achievements and hospital achievements displayed on the main website</p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AchievementType)}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="OWNER">Dr. Subash's Achievements</TabsTrigger>
            <TabsTrigger value="HOSPITAL">Hospital Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {activeTab === "OWNER" ? "Dr. Subash's Achievements" : "Hospital Achievements"}
                  </CardTitle>
                  <Button
                    onClick={() => {
                      setNewAchievement({
                        title: "",
                        description: "",
                        date: new Date().toISOString().split("T")[0],
                        type: activeTab,
                      })
                      setIsAdding(true)
                    }}
                    size="sm"
                  >
                    <Plus size={16} className="" />
                    Add Achievement
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isAdding && (
                  <Card className="mb-4 border-primary">
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <Label>Title *</Label>
                        <Input
                          value={newAchievement.title || ""}
                          onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                          placeholder="Achievement title"
                        />
                      </div>
                      <div>
                        <Label>Description *</Label>
                        <Textarea
                          value={newAchievement.description || ""}
                          onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                          placeholder="Achievement description"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Date *</Label>
                        <Input
                          type="date"
                          value={newAchievement.date}
                          onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAdd} size="sm" disabled={submitting}>
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4  animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsAdding(false)
                            setNewAchievement({
                              title: "",
                              description: "",
                              date: new Date().toISOString().split("T")[0],
                              type: activeTab,
                            })
                          }}
                          disabled={submitting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {achievements.length === 0 ? (
                      <div className="text-center py-8">
                        <Trophy size={48} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No achievements added yet</p>
                      </div>
                    ) : (
                      achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Trophy size={18} className="text-primary" />
                              <h4 className="font-semibold">{achievement.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {new Date(achievement.date).getFullYear()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(achievement.date).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveClick(achievement.id)}
                            disabled={deleting === achievement.id}
                            className="text-red-600 hover:text-red-700"
                          >
                            {deleting === achievement.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Achievement</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this achievement? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting !== null}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemoveConfirm}
                disabled={deleting !== null}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4  animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
}
