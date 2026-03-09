'use client'

import { WifiOff, RefreshCcw } from 'lucide-react'
import { Button } from './Button'
import { motion } from 'framer-motion'

export function ConnectivityError() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-surface/50 backdrop-blur-xl border border-border p-8 rounded-[2.5rem] text-center shadow-2xl relative z-10"
      >
        <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center text-accent mx-auto mb-6">
          <WifiOff size={40} />
        </div>
        
        <h2 className="text-3xl font-black text-text-primary mb-4 tracking-tight">Sync Interrupted</h2>
        <p className="text-text-secondary font-medium leading-relaxed mb-8">
          We're having trouble connecting to the professional ecosystem. Please check your connectivity or try refreshing the experience.
        </p>
        
        <Button 
          onClick={() => window.location.reload()}
          className="w-full py-5 rounded-2xl bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-accent/20 transition-all active:scale-95"
        >
          <RefreshCcw size={18} />
          Reconnect
        </Button>
      </motion.div>
    </div>
  )
}
