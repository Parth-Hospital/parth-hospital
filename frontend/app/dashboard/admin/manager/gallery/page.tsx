"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Image as ImageIcon, Loader2, Trash2, FolderPlus, Images } from "lucide-react"
import { galleryApi, Gallery, GalleryAlbum } from "@/lib/api/gallery"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function ManagerGalleryPage() {
  const [images, setImages] = useState<Gallery[]>([])
  const [albums, setAlbums] = useState<GalleryAlbum[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploadType, setUploadType] = useState<"single" | "album">("single")
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [albumTitle, setAlbumTitle] = useState("")
  const [albumDescription, setAlbumDescription] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "image" | "album" } | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadGalleries()
  }, [])

  const loadGalleries = async () => {
    try {
      setLoading(true)
      const data = await galleryApi.getGalleries()
      setImages(data.images)
      setAlbums(data.albums)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load galleries",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setSelectedFiles(files)
      if (uploadType === "album") {
        setShowUploadDialog(true)
      } else {
        setShowUploadDialog(true)
      }
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    if (uploadType === "single") {
      if (!title) {
        toast({
          title: "Error",
          description: "Title is required",
          variant: "destructive",
        })
        return
      }

      try {
        setUploading(true)
        await galleryApi.createGallery({
          image: selectedFiles[0],
          title,
          description: description || undefined,
        })
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
        setShowUploadDialog(false)
        setSelectedFiles([])
        setTitle("")
        setDescription("")
        await loadGalleries()
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to upload image",
          variant: "destructive",
        })
      } finally {
        setUploading(false)
      }
    } else {
      // Album upload flow
      if (!albumTitle) {
        toast({
          title: "Error",
          description: "Album title is required",
          variant: "destructive",
        })
        return
      }

      try {
        setUploading(true)
        // First create the album
        const album = await galleryApi.createAlbum({
          title: albumTitle,
          description: albumDescription || undefined,
        })

        // Then upload all images to the album (no titles needed)
        const uploadPromises = selectedFiles.map((file) => {
          return galleryApi.createGallery({
            image: file,
            albumId: album.id,
          })
        })

        await Promise.all(uploadPromises)
        toast({
          title: "Success",
          description: `Album "${albumTitle}" created with ${selectedFiles.length} image(s)`,
        })
        setShowUploadDialog(false)
        setSelectedFiles([])
        setTitle("")
        setDescription("")
        setAlbumTitle("")
        setAlbumDescription("")
        await loadGalleries()
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to create album and upload images",
          variant: "destructive",
        })
      } finally {
        setUploading(false)
      }
    }
  }

  const handleDeleteClick = (id: string, type: "image" | "album") => {
    setItemToDelete({ id, type })
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return

    try {
      setDeleting(itemToDelete.id)
      setDeleteDialogOpen(false)
      if (itemToDelete.type === "album") {
        await galleryApi.deleteAlbum(itemToDelete.id)
        toast({
          title: "Success",
          description: "Album deleted successfully",
        })
      } else {
        await galleryApi.deleteGallery(itemToDelete.id)
        toast({
          title: "Success",
          description: "Image deleted successfully",
        })
      }
      await loadGalleries()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete",
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
          <h2 className="text-2xl font-bold mb-2">Gallery Management</h2>
          <p className="text-muted-foreground">Manage gallery images and albums for the main website</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Single Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <ImageIcon size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium">Upload a single image</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG or WebP format</p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="single-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setUploadType("single")
                    document.getElementById("single-upload")?.click()
                  }}
                >
                  Select Image
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Album with Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <FolderPlus size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium">Create album and upload images</p>
                <p className="text-xs text-muted-foreground mt-1">Select multiple images at once</p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="album-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setUploadType("album")
                    document.getElementById("album-upload")?.click()
                  }}
                >
                  Create Album & Upload Images
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="images" className="space-y-4">
          <TabsList>
            <TabsTrigger value="images">Single Images ({images.length})</TabsTrigger>
            <TabsTrigger value="albums">Albums ({albums.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Single Images</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : images.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No single images yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.imageUrl}
                          alt={image.title || "Gallery image"}
                          className="w-full h-48 object-cover rounded-lg border border-border"
                        />
                        {image.title && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 rounded-b-lg">
                            <p className="text-xs font-medium truncate">{image.title}</p>
                          </div>
                        )}
                        <button
                          onClick={() => handleDeleteClick(image.id, "image")}
                          disabled={deleting === image.id}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                        >
                          {deleting === image.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="albums" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Albums</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : albums.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No albums yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {albums.map((album) => (
                      <div key={album.id} className="relative group">
                        <img
                          src={album.coverImageUrl || album.images[0]?.imageUrl || "/placeholder.jpg"}
                          alt={album.title}
                          className="w-full h-48 object-cover rounded-lg border border-border"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 rounded-b-lg">
                          <p className="text-xs font-medium truncate">{album.title}</p>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {album.images.length} images
                          </Badge>
                        </div>
                        <button
                          onClick={() => handleDeleteClick(album.id, "album")}
                          disabled={deleting === album.id}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                        >
                          {deleting === album.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Upload Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {uploadType === "single" ? "Upload Single Image" : "Upload Images to Album"}
              </DialogTitle>
              <DialogDescription>
                {uploadType === "single"
                  ? "Add a new image to the gallery"
                  : "Add multiple images to an album"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {uploadType === "album" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="albumTitle">Album Title *</Label>
                    <Input
                      id="albumTitle"
                      value={albumTitle}
                      onChange={(e) => setAlbumTitle(e.target.value)}
                      placeholder="Enter album title..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="albumDescription">Album Description (Optional)</Label>
                    <Textarea
                      id="albumDescription"
                      value={albumDescription}
                      onChange={(e) => setAlbumDescription(e.target.value)}
                      placeholder="Enter album description..."
                      rows={2}
                    />
                  </div>
                </>
              )}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Preview ({selectedFiles.length} file(s))</Label>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}
              {uploadType === "single" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">Image Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter image title..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter description..."
                      rows={3}
                    />
                  </div>
                </>
              )}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowUploadDialog(false)
                    setSelectedFiles([])
                    setTitle("")
                    setDescription("")
                    setAlbumTitle("")
                    setAlbumDescription("")
                  }}
                  className="flex-1"
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpload} className="flex-1" disabled={uploading || selectedFiles.length === 0}>
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4  animate-spin" />
                      {uploadType === "album" ? "Creating Album..." : "Uploading..."}
                    </>
                  ) : uploadType === "album" ? (
                    `Create Album & Upload ${selectedFiles.length} Image(s)`
                  ) : (
                    "Upload Image"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>


        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete {itemToDelete?.type === "album" ? "Album" : "Image"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this {itemToDelete?.type === "album" ? "album" : "image"}? This action
                cannot be undone.
                {itemToDelete?.type === "album" && " All images in this album will also be deleted."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting !== null}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
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
