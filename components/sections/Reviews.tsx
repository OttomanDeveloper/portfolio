'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeading } from '../ui/SectionHeading'
import { Review, Profile } from '@/lib/types'
import { Card } from '../ui/Card'
import { Star, Quote, ChevronDown, Plus, ShieldCheck, User } from 'lucide-react'
import { getReviews } from '@/lib/api'
import { ReviewForm } from '../ui/ReviewForm'
import { Button } from '../ui/Button'

interface ReviewsProps {
  initialReviews: Review[]
}

export function Reviews({ initialReviews }: ReviewsProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialReviews.length === 6)
  const [isLoading, setIsLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const loadMore = async () => {
    setIsLoading(true)
    const limit = 6
    const offset = page * limit
    const newReviews = await getReviews(limit, offset)
    
    if (newReviews.length < limit) {
      setHasMore(false)
    }
    
    setReviews([...reviews, ...newReviews])
    setPage(page + 1)
    setIsLoading(false)
  }

  return (
    <section id="reviews" className="py-32 px-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <SectionHeading 
              title="Client Testimonials" 
              subtitle="Kind words from people I've worked with. Real feedback from real projects."
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-3 px-8 py-4 bg-surface border border-border rounded-2xl text-text-primary font-black uppercase tracking-widest text-xs hover:border-accent/40 shadow-xl shadow-black/5 transition-all group"
          >
            <Plus size={18} className="text-accent group-hover:rotate-90 transition-transform" />
            Leave a Review
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "200px 0px", amount: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="h-full"
              >
                <Card className="h-full p-8 flex flex-col bg-surface/40 backdrop-blur-lg md:backdrop-blur-xl border-border hover:border-accent/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-accent/5">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-1 text-accent">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" stroke="none" />
                      ))}
                    </div>
                    <Quote className="text-accent/20 group-hover:text-accent/40 transition-colors" size={24} />
                  </div>

                  <p className="text-text-secondary text-sm leading-relaxed mb-8 flex-1 italic">
                    &quot;{review.review_text}&quot;
                  </p>

                  <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-surface-secondary border border-border shrink-0 flex items-center justify-center">
                      {review.customer_photo ? (
                        <div className="relative w-full h-full">
                          <Image 
                            src={review.customer_photo} 
                            alt={review.customer_name} 
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <User className="text-text-secondary/40" size={20} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-text-primary truncate uppercase tracking-tight">
                        {review.customer_name}
                      </h4>
                      {review.is_verified && (
                        <div className="flex items-center gap-1.5 text-emerald-500 mt-0.5">
                          <ShieldCheck size={12} fill="currentColor" className="text-white dark:text-emerald-500 fill-emerald-500/20" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Verified Customer</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {hasMore && (
          <div className="mt-16 text-center">
            <Button
              onClick={loadMore}
              disabled={isLoading}
              className="px-12 py-5 rounded-2xl bg-surface border border-border text-text-primary hover:border-accent/40 font-black uppercase tracking-widest text-xs shadow-xl transition-all"
            >
              {isLoading ? 'Syncing...' : 'Load More Reviews'}
              {!isLoading && <ChevronDown size={14} className="ml-2" />}
            </Button>
          </div>
        )}
      </div>

      <ReviewForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </section>
  )
}
