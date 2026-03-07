'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { SectionHeading } from '../ui/SectionHeading'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { fadeInUp } from '@/lib/animations'
import { Mail, MessageSquare, User, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { useState } from 'react'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export function Contact() {
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to send message')

      setIsSuccess(true)
      reset()
      setTimeout(() => setIsSuccess(false), 5000)
    } catch (err) {
      setError('Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <SectionHeading 
          title="Get In Touch" 
          subtitle="Have a project in mind or just want to say hi? Feel free to reach out!"
          centered
        />

        <div className="grid gap-12 lg:grid-cols-2 mt-12">
          {/* Info */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-text-primary">Let&apos;s Connect</h3>
              <p className="text-text-secondary leading-relaxed">
                I&apos;m currently open to new opportunities and freelance projects. Whether you have a specific proposal or just want to discuss your next big idea, I&apos;d love to hear from you.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email', value: 'hello@ottoman.dev', href: 'mailto:hello@ottoman.dev' },
                { icon: MessageSquare, label: 'Social', value: '@OttomanDeveloper', href: 'https://twitter.com/OttomanDeveloper' },
              ].map((item) => (
                <a 
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface border border-border group-hover:border-accent group-hover:bg-accent/10 transition-all shadow-sm group-hover:shadow-md">
                    <item.icon className="text-accent" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-text-secondary/60">{item.label}</p>
                    <p className="text-lg font-bold text-text-primary group-hover:text-accent transition-colors">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
            
            <div className="p-6 rounded-2xl bg-accent/[0.03] dark:bg-accent/5 border border-accent/10">
              <p className="text-sm text-accent font-semibold italic">
                &ldquo;Design is not just what it looks like and feels like. Design is how it works.&rdquo;
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
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
                    className={`w-full px-4 py-3 rounded-xl bg-background border ${
                      errors.name ? 'border-red-500' : 'border-border dark:border-white/10'
                    } focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all dark:bg-white/5`}
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
                      errors.email ? 'border-red-500' : 'border-border dark:border-white/10'
                    } focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all dark:bg-white/5`}
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
                    className={`w-full px-4 py-3 rounded-xl bg-background border ${
                      errors.message ? 'border-red-500' : 'border-border dark:border-white/10'
                    } focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none dark:bg-white/5`}
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

function Loader2({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
