import { apiClient } from "./client"

export interface Gallery {
  id: string
  imageUrl: string
  title?: string
  description?: string
  albumId?: string
  uploadedBy?: string
  createdAt: string
  updatedAt: string
  album?: GalleryAlbum
}

export interface GalleryAlbum {
  id: string
  title: string
  description?: string
  coverImageUrl?: string
  uploadedBy?: string
  createdAt: string
  updatedAt: string
  images: Gallery[]
}

export interface CreateGalleryData {
  image: File
  title?: string
  description?: string
  albumId?: string
}

export interface CreateAlbumData {
  title: string
  description?: string
  coverImageUrl?: string
}

export interface UpdateGalleryData {
  title?: string
  description?: string
}

export interface UpdateAlbumData {
  title?: string
  description?: string
  coverImageUrl?: string
}

export interface GalleriesResponse {
  images: Gallery[]
  albums: GalleryAlbum[]
}

export const galleryApi = {
  getGalleries: async (): Promise<GalleriesResponse> => {
    const response = await apiClient.get<GalleriesResponse>("/gallery")
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch galleries")
  },

  getGalleryById: async (id: string): Promise<Gallery> => {
    const response = await apiClient.get<Gallery>(`/gallery/images/${id}`)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch gallery")
  },

  getAlbumById: async (id: string): Promise<GalleryAlbum> => {
    const response = await apiClient.get<GalleryAlbum>(`/gallery/albums/${id}`)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch album")
  },

  getAlbumImages: async (albumId: string): Promise<Gallery[]> => {
    const response = await apiClient.get<Gallery[]>(`/gallery/albums/${albumId}/images`)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to fetch album images")
  },

  createGallery: async (data: CreateGalleryData): Promise<Gallery> => {
    const formData = new FormData()
    formData.append("image", data.image)
    formData.append("title", data.title)
    if (data.description) formData.append("description", data.description)
    if (data.albumId) formData.append("albumId", data.albumId)

    const token = apiClient.getToken()
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

    const response = await fetch(`${API_BASE_URL}/gallery/images`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: formData,
    })

    const result = await response.json()
    if (result.success && result.data) {
      return result.data
    }
    throw new Error(result.message || "Failed to create gallery")
  },

  createAlbum: async (data: CreateAlbumData): Promise<GalleryAlbum> => {
    const response = await apiClient.post<GalleryAlbum>("/gallery/albums", data)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to create album")
  },

  updateGallery: async (id: string, data: UpdateGalleryData): Promise<Gallery> => {
    const response = await apiClient.patch<Gallery>(`/gallery/images/${id}`, data)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to update gallery")
  },

  updateAlbum: async (id: string, data: UpdateAlbumData): Promise<GalleryAlbum> => {
    const response = await apiClient.patch<GalleryAlbum>(`/gallery/albums/${id}`, data)
    if (response.success && response.data) {
      return response.data
    }
    throw new Error(response.message || "Failed to update album")
  },

  deleteGallery: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/gallery/images/${id}`)
    if (!response.success) {
      throw new Error(response.message || "Failed to delete gallery")
    }
  },

  deleteAlbum: async (id: string): Promise<void> => {
    const response = await apiClient.delete(`/gallery/albums/${id}`)
    if (!response.success) {
      throw new Error(response.message || "Failed to delete album")
    }
  },
}
