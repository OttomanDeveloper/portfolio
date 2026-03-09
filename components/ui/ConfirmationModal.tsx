'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from './Button'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const colors = {
    danger: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    warning: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    info: 'text-accent bg-accent/10 border-accent/20'
  }

  const buttonColors = {
    danger: 'bg-rose-500 hover:bg-rose-600',
    warning: 'bg-amber-500 hover:bg-amber-600',
    info: 'bg-accent hover:bg-accent-secondary'
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md bg-surface border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
        >
          <div className="p-8 space-y-6">
            <div className={`p-4 rounded-2xl w-fit ${colors[variant]}`}>
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-text-primary tracking-tight">{title}</h3>
              <p className="text-text-secondary font-medium leading-relaxed">{message}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={onConfirm}
                className={`flex-1 py-6 rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-lg transition-all ${buttonColors[variant]}`}
              >
                {confirmText}
              </Button>
              <Button 
                variant="outline"
                onClick={onClose}
                className="flex-1 py-6 rounded-2xl border-border hover:bg-surface text-text-secondary font-black uppercase tracking-widest text-xs transition-all"
              >
                {cancelText}
              </Button>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-text-secondary hover:text-text-primary transition-all"
          >
            <X size={20} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
