'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Filter, Edit2, Trash2, 
  CheckCircle, Clock, AlertCircle, Loader2, 
  Save, User, ShieldCheck, ShieldAlert,
  Trash
} from 'lucide-react'
import Image from 'next/image'
import { getAllReviewsAdmin, updateReview, deleteReview, adminCreateReview } from '@/lib/api'
import { Review } from '@/lib/types'
import { toast } from 'sonner'
import { useIsMobile } from '@/hooks/use-mobile'

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<Review['status']>('pending')
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Review | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const isMobile = useIsMobile()

  const [newReview, setNewReview] = useState<Partial<Review>>({
    customer_name: '',
    review_text: '',
    status: 'published',
    is_verified: true
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const data = await getAllReviewsAdmin()
      setReviews(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id: string, status: Review['status']) => {
    try {
      const { error } = await updateReview(id, { status })
      if (error) throw error
      toast.success(`Review ${status}`)
      setReviews(reviews.map(r => r.id === id ? { ...r, status } : r))
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (review: Review) => {
    try {
      const { error } = await deleteReview(review.id, review.customer_photo || undefined)
      if (error) throw error
      toast.success('Review deleted permanently')
      setReviews(reviews.filter(r => r.id !== review.id))
      setShowDeleteConfirm(null)
    } catch (error) {
      toast.error('Failed to delete review')
    }
  }

  const handleSaveEdit = async () => {
    if (!editingReview) return
    if (!editingReview.customer_name?.trim() || !editingReview.review_text?.trim()) {
      toast.error('Customer Name and Review Text are mandatory')
      return
    }
    setIsSaving(true)
    try {
      const { error } = await updateReview(editingReview.id, {
        customer_name: editingReview.customer_name,
        review_text: editingReview.review_text,
        is_verified: editingReview.is_verified
      })
      if (error) throw error
      toast.success('Review updated')
      setReviews(reviews.map(r => r.id === editingReview.id ? editingReview : r))
      setEditingReview(null)
    } catch (error) {
      toast.error('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateReview = async () => {
    if (!newReview.customer_name || !newReview.review_text) {
      toast.error('Please fill in all required fields')
      return
    }
    setIsSaving(true)
    try {
      const { data, error } = await adminCreateReview(newReview, photoFile || undefined)
      if (error) throw error
      toast.success('Review created successfully')
      if (data) setReviews([data[0], ...reviews])
      setShowCreateModal(false)
      setNewReview({ customer_name: '', review_text: '', status: 'published', is_verified: true })
      setPhotoFile(null)
      setPhotoPreview(null)
    } catch (error) {
      toast.error('Failed to create review')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const filteredReviews = reviews.filter(r => 
    r.status === activeTab &&
    (r.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     r.review_text.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Review Moderation</h1>
          <p className="text-text-secondary">Manage and approve customer feedback</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-105 transition-all"
        >
          <Plus size={16} />
          Create Review
        </button>
      </div>

      {/* Stats & Tabs */}
      <div className="flex flex-wrap gap-4">
        {[
          { id: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-500' },
          { id: 'published', label: 'Published', icon: CheckCircle, color: 'text-emerald-500' },
          { id: 'archived', label: 'Archived', icon: Filter, color: 'text-text-secondary' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Review['status'])}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id 
                ? 'bg-surface border border-border shadow-lg shadow-black/5 text-text-primary' 
                : 'text-text-secondary hover:bg-surface/50'
            }`}
          >
            <tab.icon size={16} className={tab.color} />
            {tab.label}
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-surface-secondary">
              {reviews.filter(r => r.status === tab.id).length}
            </span>
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/40" size={18} />
        <input
          type="text"
          placeholder="Search reviews..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface/50 border border-border focus:border-accent/40 outline-none text-text-primary text-sm font-bold transition-all"
        />
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 size={40} className="animate-spin text-accent" />
          <p className="text-text-secondary font-bold text-sm animate-pulse">Syncing data...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-20 text-center bg-surface/30 rounded-3xl border border-dashed border-border">
          <AlertCircle size={40} className="mx-auto text-text-secondary/20 mb-4" />
          <p className="text-text-secondary font-bold">No reviews found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                layout={!isMobile}
                initial={isMobile ? false : { opacity: 0, scale: 0.9 }}
                animate={isMobile ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
                exit={isMobile ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                className={`bg-surface border border-border rounded-3xl p-6 flex flex-col gap-4 group ${!isMobile && 'backdrop-blur-xl'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl border border-border bg-surface-secondary overflow-hidden flex items-center justify-center">
                      {review.customer_photo ? (
                        <Image src={review.customer_photo} alt="" width={48} height={48} className="w-full h-full object-cover" />
                      ) : (
                        <User size={20} className="text-text-secondary/20" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-text-primary text-sm uppercase tracking-tight">{review.customer_name}</h3>
                      <div className="flex items-center gap-1.5 text-text-secondary/40 text-[10px] font-bold">
                        <Clock size={10} />
                        {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Just now'}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingReview({ ...review })}
                      className="p-2 rounded-lg bg-surface-secondary text-text-secondary hover:text-accent transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(review)}
                      className="p-2 rounded-lg bg-surface-secondary text-text-secondary hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-surface-secondary/50 border border-border/50 text-sm text-text-secondary leading-relaxed flex-1">
                  &quot;{review.review_text}&quot;
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {review.is_verified ? (
                      <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-500/20">
                        <ShieldCheck size={12} />
                        Verified
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-text-secondary text-[10px] font-bold uppercase tracking-widest bg-surface-secondary px-3 py-1.5 rounded-full border border-border">
                        <User size={12} />
                        Normal
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {activeTab === 'pending' && (
                      <button 
                        onClick={() => handleStatusChange(review.id, 'published')}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                      >
                        <CheckCircle size={12} />
                        Publish
                      </button>
                    )}
                    {activeTab === 'published' && (
                      <button 
                        onClick={() => handleStatusChange(review.id, 'archived')}
                        className="px-4 py-2 rounded-xl bg-surface-secondary text-text-secondary text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                      >
                        <AlertCircle size={12} />
                        Archive
                      </button>
                    )}
                    {activeTab === 'archived' && (
                      <button 
                        onClick={() => handleStatusChange(review.id, 'published')}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                      >
                        <CheckCircle size={12} />
                        Unarchive
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)} className={`absolute inset-0 bg-background/80 ${!isMobile && 'backdrop-blur-md'}`} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-surface border border-border rounded-[2rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
              <h2 className="text-xl font-bold text-text-primary mb-6">Create New Review</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Customer Name *</label>
                  <input 
                    type="text" 
                    value={newReview.customer_name}
                    onChange={(e) => setNewReview({ ...newReview, customer_name: e.target.value })}
                    className="w-full p-4 rounded-xl bg-surface-secondary border border-border text-text-primary font-bold text-sm outline-none focus:border-accent"
                    placeholder="e.g. Alex Johnson"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Review Text *</label>
                  <textarea 
                    value={newReview.review_text}
                    onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
                    rows={4}
                    className="w-full p-4 rounded-xl bg-surface-secondary border border-border text-text-primary font-bold text-sm outline-none focus:border-accent resize-none"
                    placeholder="Write the testimonial here..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Customer Photo</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer group">
                      <div className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-border group-hover:border-accent/40 bg-surface-secondary/50 transition-all">
                        <User size={18} className="text-text-secondary group-hover:text-accent" />
                        <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary">Upload Avatar</span>
                      </div>
                      <input type="file" onChange={handlePhotoChange} className="hidden" accept="image/*" />
                    </label>
                    {photoPreview && (
                      <div className="w-14 h-14 rounded-xl border border-border overflow-hidden shrink-0 relative">
                        <Image src={photoPreview} alt="" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Status</label>
                    <select 
                      value={newReview.status}
                      onChange={(e) => setNewReview({ ...newReview, status: e.target.value as Review['status'] })}
                      className="w-full p-4 rounded-xl bg-surface-secondary border border-border text-text-primary font-bold text-sm outline-none focus:border-accent appearance-none"
                    >
                      <option value="published">Published</option>
                      <option value="pending">Pending</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-secondary/50 border border-border h-[54px]">
                      <input 
                        type="checkbox" 
                        id="new_is_verified" 
                        checked={newReview.is_verified}
                        onChange={(e) => setNewReview({ ...newReview, is_verified: e.target.checked })}
                        className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                      />
                      <label htmlFor="new_is_verified" className="text-sm font-bold text-text-primary cursor-pointer select-none">
                        Verified
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-4 rounded-xl border border-border text-text-secondary font-bold text-xs uppercase">Cancel</button>
                <button 
                  onClick={handleCreateReview} 
                  disabled={isSaving}
                  className="flex-1 py-4 rounded-xl bg-accent text-white font-black text-xs uppercase flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Create Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingReview && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingReview(null)} className={`absolute inset-0 bg-background/80 ${!isMobile && 'backdrop-blur-md'}`} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-surface border border-border rounded-[2rem] p-8 shadow-2xl">
              <h2 className="text-xl font-bold text-text-primary mb-6">Edit Review Content</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Customer Name</label>
                  <input 
                    type="text" 
                    value={editingReview.customer_name}
                    onChange={(e) => setEditingReview({ ...editingReview, customer_name: e.target.value })}
                    className="w-full p-4 rounded-xl bg-surface-secondary border border-border text-text-primary font-bold text-sm outline-none focus:border-accent"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Review Text</label>
                  <textarea 
                    value={editingReview.review_text}
                    onChange={(e) => setEditingReview({ ...editingReview, review_text: e.target.value })}
                    rows={4}
                    className="w-full p-4 rounded-xl bg-surface-secondary border border-border text-text-primary font-bold text-sm outline-none focus:border-accent resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-secondary/50 border border-border">
                  <input 
                    type="checkbox" 
                    id="is_verified" 
                    checked={editingReview.is_verified}
                    onChange={(e) => setEditingReview({ ...editingReview, is_verified: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <label htmlFor="is_verified" className="text-sm font-bold text-text-primary cursor-pointer select-none">
                    Mark as Verified Customer
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={() => setEditingReview(null)} className="flex-1 py-4 rounded-xl border border-border text-text-secondary font-bold text-xs uppercase">Cancel</button>
                <button 
                  onClick={handleSaveEdit} 
                  disabled={isSaving}
                  className="flex-1 py-4 rounded-xl bg-accent text-white font-black text-xs uppercase flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(null)} className={`absolute inset-0 bg-background/80 ${!isMobile && 'backdrop-blur-md'}`} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-surface border border-border rounded-[2rem] p-8 text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert size={32} />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">Permanent Deletion?</h2>
              <p className="text-text-secondary text-sm mb-8 leading-relaxed">
                This will remove the review and the customer&apos;s photo from both the database and storage. This action cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={() => handleDelete(showDeleteConfirm)} className="w-full py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase flex items-center justify-center gap-2">
                  <Trash size={14} />
                  Delete Everything
                </button>
                <button onClick={() => setShowDeleteConfirm(null)} className="w-full py-4 rounded-xl border border-border text-text-secondary font-bold text-xs uppercase">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

