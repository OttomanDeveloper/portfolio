'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { SectionHeading } from '../ui/SectionHeading'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { fadeInUp } from '@/lib/animations'
import { Mail, MessageSquare, User, Send, CheckCircle2, AlertCircle, Phone, Youtube, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { submitMessage } from '@/lib/api'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactProps {
  dbProfile?: any
}

export function Contact({ dbProfile }: ContactProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const { error: submitError } = await submitMessage({
        fullName: data.name,
        email: data.email,
        subject: 'Portfolio Inquiry',
        message: data.message
      })
      
      if (submitError) throw new Error(typeof submitError === 'string' ? submitError : 'Failed to send message')

      setIsSuccess(true)
      reset()
      setTimeout(() => setIsSuccess(false), 5000)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactEmail = dbProfile?.contact_email
  const whatsappNumber = dbProfile?.whatsapp_number
  const youtubeUrl = dbProfile?.youtube_url

  return (
    <section id="contact" className="relative py-24 px-4 bg-background dark:bg-transparent overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <SectionHeading 
          title="Get In Touch" 
          centered
        />

        <div className="grid gap-12 lg:grid-cols-2 mt-12">
          {/* Info */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "100px 0px", amount: 0.1 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-text-primary">Let&apos;s Connect</h3>
              <p className="text-text-secondary leading-relaxed text-lg">
                {dbProfile?.contactDescription || "I'm currently open to new opportunities and freelance projects. Whether you have a specific proposal or just want to discuss your next big idea, I'd love to hear from you."}
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email', value: contactEmail, href: `mailto:${contactEmail}` },
                ...(whatsappNumber ? [{ icon: Phone, label: 'WhatsApp', value: 'Chat with me', href: `https://wa.me/${whatsappNumber}` }] : []),
                ...(youtubeUrl ? [{ icon: Youtube, label: 'YouTube', value: 'My Channel', href: youtubeUrl }] : []),
              ].map((item) => (
                <a 
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface border border-border group-hover:border-accent group-hover:bg-accent/5 transition-all shadow-sm group-hover:shadow-md">
                    <item.icon className="text-accent" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-text-secondary/40">{item.label}</p>
                    <p className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
            
            <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 ">
              <p className="text-sm text-text-primary font-bold italic">
                &ldquo;Design is not just what it looks like and feels like. Design is how it works.&rdquo;
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "100px 0px", amount: 0.1 }}
          >
            <Card className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <User size={14} className="text-accent" />
                    Full Name
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    className={`w-full bg-surface border border-border rounded-xl px-4 py-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none placeholder:text-text-secondary/30 ${
                      errors.name ? 'border-red-500' : 'border-border'
                    } focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all dark:bg-white/[0.03] placeholder:text-text-secondary/40 dark:placeholder:text-text-secondary/30`}
                  />
                  {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <Mail size={14} className="text-accent" />
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3 rounded-xl bg-background border ${
                      errors.email ? 'border-red-500' : 'border-border'
                    } focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all dark:bg-white/[0.03] placeholder:text-text-secondary/40 dark:placeholder:text-text-secondary/30`}
                  />
                  {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <MessageSquare size={14} className="text-accent" />
                    Message
                  </label>
                  <textarea
                    {...register('message')}
                    id="message"
                    rows={4}
                    placeholder="How can I help you?"
                    className={`w-full bg-surface border border-border rounded-xl px-4 py-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-text-secondary/30 ${
                      errors.message ? 'border-red-500' : 'border-border'
                    } focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none dark:bg-white/[0.03] placeholder:text-text-secondary/40 dark:placeholder:text-text-secondary/30`}
                  />
                  {errors.message && <p className="text-xs text-red-500 font-medium">{errors.message.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full py-4 text-lg"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 size={24} />
                    </motion.div>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message
                      <Send size={18} />
                    </span>
                  )}
                </Button>

                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 justify-center text-green-500 font-medium p-3 rounded-lg bg-green-500/10"
                  >
                    <CheckCircle2 size={18} />
                    Message sent successfully!
                  </motion.div>
                )}

                {error && (
                  <div className="flex items-center gap-2 justify-center text-red-500 font-medium p-3 rounded-lg bg-red-500/10">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
