'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, MessageSquare, Camera, Check, Loader2, ShieldCheck, Rocket } from 'lucide-react'
import Image from 'next/image'
import { submitReview } from '@/lib/api'
import { compressImage } from '@/lib/supabase/storage'
import { toast } from 'sonner'

interface ReviewFormProps {
  isOpen: boolean
  onClose: () => void
}

export function ReviewForm({ isOpen, onClose }: ReviewFormProps) {
  const [customerName, setCustomerName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Increased limit since we compress anyway
        toast.error('File size too large (max 5MB)')
        return
      }
      
      try {
        // Compress for preview and upload
        const compressedBlob = await compressImage(file, 512, 0.8)
        const compressedFile = new File([compressedBlob], file.name.replace(/\.[^.]+$/, '.webp'), {
          type: 'image/webp'
        })
        
        setPhoto(compressedFile)
        const reader = new FileReader()
        reader.onloadend = () => setPhotoPreview(reader.result as string)
        reader.readAsDataURL(compressedFile)
      } catch (err) {
        console.error('Compression failed:', err)
        // Fallback to original
        setPhoto(file)
        const reader = new FileReader()
        reader.onloadend = () => setPhotoPreview(reader.result as string)
        reader.readAsDataURL(file)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName || !reviewText) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await submitReview({ customerName, reviewText }, photo || undefined)
      if (error) throw error
      
      setSubmitted(true)
      toast.success('Review submitted for moderation!')
      setTimeout(() => {
        onClose()
        setSubmitted(false)
        resetForm()
      }, 3000)
    } catch (err) {
      console.error('Review submission failed:', err)
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setCustomerName('')
    setReviewText('')
    setPhoto(null)
    setPhotoPreview(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-surface border border-border rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-text-primary tracking-tight">Share Your Experience</h2>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-1">Help others know what to expect</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={40} className="stroke-[3]" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">Review Submitted!</h3>
                  <p className="text-text-secondary text-sm">Thank you for your feedback. It will be visible once reviewed by the admin.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Photo Upload */}
                  <div className="flex items-center gap-6">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative w-24 h-24 rounded-3xl bg-surface-secondary flex items-center justify-center cursor-pointer group overflow-hidden border-2 border-dashed border-border hover:border-accent transition-all"
                    >
                      {photoPreview ? (
                        <Image src={photoPreview} alt="Preview" fill className="object-cover" />
                      ) : (
                        <Camera className="text-text-secondary group-hover:text-accent transition-colors" size={32} />
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handlePhotoChange} 
                        className="hidden" 
                        accept="image/*"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-primary">Your Photo</h4>
                      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider mt-1 opacity-60">Auto-Optimized • High Quality</p>
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/40" size={18} />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-secondary border border-border focus:border-accent/40 outline-none text-text-primary text-sm font-bold transition-all"
                      />
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60 ml-1">Your Review</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 text-text-secondary/40" size={18} />
                      <textarea
                        required
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="How was your experience working with me?"
                        rows={4}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-secondary border border-border focus:border-accent/40 outline-none text-text-primary text-sm font-bold transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-1 text-[10px] font-bold text-text-secondary/40 uppercase tracking-widest">
                    <ShieldCheck size={12} />
                    <span>Secure & Moderated Submission</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 rounded-2xl bg-accent hover:bg-accent/90 disabled:opacity-50 text-white font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-accent/20"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Rocket size={18} />
                        Launch Review
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
