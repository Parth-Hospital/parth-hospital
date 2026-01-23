"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingActions } from "@/components/floating-actions"
import { galleryApi, Gallery, GalleryAlbum } from "@/lib/api/gallery"
import { logger } from "@/lib/utils/logger"
import { Loader2, ImageIcon, Images, ChevronLeft, ChevronRight, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

type SelectedItem = 
  | { type: "image"; data: Gallery }
  | { type: "album"; data: GalleryAlbum; currentIndex: number }

export default function GalleryPage() {
  const [images, setImages] = useState<Gallery[]>([])
  const [albums, setAlbums] = useState<GalleryAlbum[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)

  useEffect(() => {
    loadGalleries()
  }, [])

  const loadGalleries = async () => {
    try {
      setLoading(true)
      const data = await galleryApi.getGalleries()
      setImages(data.images)
      setAlbums(data.albums)
    } catch (error) {
      // Only log in development
      logger.error("Failed to load galleries:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageClick = (image: Gallery) => {
    setSelectedItem({ type: "image", data: image })
  }

  const handleAlbumClick = (album: GalleryAlbum) => {
    if (album.images.length > 0) {
      setSelectedItem({ type: "album", data: album, currentIndex: 0 })
    }
  }

  const handleNext = () => {
    if (!selectedItem || selectedItem.type === "image") return
    
    const nextIndex = (selectedItem.currentIndex + 1) % selectedItem.data.images.length
    setSelectedItem({ ...selectedItem, currentIndex: nextIndex })
  }

  const handlePrevious = () => {
    if (!selectedItem || selectedItem.type === "image") return
    
    const prevIndex = selectedItem.currentIndex === 0 
      ? selectedItem.data.images.length - 1 
      : selectedItem.currentIndex - 1
    setSelectedItem({ ...selectedItem, currentIndex: prevIndex })
  }

  const handleClose = () => {
    setSelectedItem(null)
  }

  const currentAlbumImages = selectedItem?.type === "album" ? selectedItem.data.images : []
  const currentImage = selectedItem?.type === "album" 
    ? currentAlbumImages[selectedItem.currentIndex] 
    : selectedItem?.type === "image" 
    ? selectedItem.data 
    : null

  return (
    <main className="min-h-screen">
      <Navbar />
      <FloatingActions />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-6 md:space-y-8 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest">
              Our Facilities
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-huge text-primary leading-[0.85] mb-6 sm:mb-8 break-words">
              HOSPITAL
              <br />
              <span className="text-foreground italic font-light opacity-80">GALLERY</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-muted-foreground leading-relaxed max-w-2xl pt-4 md:pt-8 break-words">
              Explore our state-of-the-art facilities, modern infrastructure, and the environment where we provide
              world-class healthcare services.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : images.length === 0 && albums.length === 0 ? (
            <div className="text-center py-32">
              <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-xl text-muted-foreground">No gallery images available yet</p>
              <p className="text-sm text-muted-foreground mt-2">Check back soon for updates</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Single Images */}
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-muted"
                  onClick={() => handleImageClick(image)}
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.title || "Gallery image"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {image.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold text-lg mb-1">{image.title}</h3>
                      {image.description && (
                        <p className="text-white/90 text-sm line-clamp-2">{image.description}</p>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Albums */}
              {albums.map((album, index) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (images.length + index) * 0.1 }}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer bg-muted"
                  onClick={() => handleAlbumClick(album)}
                >
                  <Image
                    src={album.coverImageUrl || album.images[0]?.imageUrl || "/placeholder.jpg"}
                    alt={album.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4 bg-primary/90 text-white p-2 rounded-full">
                    <Images className="w-5 h-5" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-semibold text-lg">{album.title}</h3>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        {album.images.length}
                      </Badge>
                    </div>
                    {album.description && (
                      <p className="text-white/90 text-sm line-clamp-2">{album.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Counter (top-left) */}
              {selectedItem.type === "album" && currentAlbumImages.length > 1 && (
                <div className="absolute top-4 left-4 text-white text-lg z-20">
                  {selectedItem.currentIndex + 1}/{currentAlbumImages.length}
                </div>
              )}

              {/* Close Button (top-right) */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Navigation Arrows (for albums) */}
              {selectedItem.type === "album" && currentAlbumImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors z-20"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors z-20"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Main Image */}
              <div className="relative w-full max-w-5xl max-h-[85vh] mx-auto">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={currentImage.imageUrl}
                    alt={currentImage.title || (selectedItem.type === "album" ? selectedItem.data.title : "Gallery image")}
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                </div>

                {/* Text Overlay (bottom-left) */}
                {selectedItem.type === "album" && (
                  <div className="absolute bottom-4 left-4 text-white z-20">
                    <h3 className="text-2xl font-semibold mb-1">{selectedItem.data.title}</h3>
                    {selectedItem.data.description && (
                      <p className="text-base text-white/90">{selectedItem.data.description}</p>
                    )}
                  </div>
                )}
                {selectedItem.type === "image" && (currentImage.title || currentImage.description) && (
                  <div className="absolute bottom-4 left-4 text-white z-20">
                    {currentImage.title && (
                      <h3 className="text-2xl font-semibold mb-1">{currentImage.title}</h3>
                    )}
                    {currentImage.description && (
                      <p className="text-base text-white/90">{currentImage.description}</p>
                    )}
                  </div>
                )}

                {/* Thumbnail Strip (bottom center, overlapping image) */}
                {selectedItem.type === "album" && currentAlbumImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {currentAlbumImages.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedItem({ ...selectedItem, currentIndex: idx })}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          idx === selectedItem.currentIndex
                            ? "border-white scale-110"
                            : "border-white/30 hover:border-white/60"
                        }`}
                      >
                        <Image
                          src={img.imageUrl}
                          alt={img.title || `Image ${idx + 1}`}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
