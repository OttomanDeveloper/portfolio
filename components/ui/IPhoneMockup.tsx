'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface IPhoneMockupProps {
  children: React.ReactNode
  className?: string
}

export function IPhoneMockup({ children, className }: IPhoneMockupProps) {
  return (
    <div className={cn("relative mx-auto border-gray-900 bg-gray-900 border-[8px] rounded-[3rem] h-[640px] w-[320px] shadow-2xl overflow-hidden", className)}>
      {/* Side buttons - very subtle */}
      <div className="h-[24px] w-[2px] bg-gray-800 absolute -left-[8px] top-[100px] rounded-l-sm opacity-50"></div>
      <div className="h-[40px] w-[2px] bg-gray-800 absolute -left-[8px] top-[150px] rounded-l-sm opacity-50"></div>
      <div className="h-[40px] w-[2px] bg-gray-800 absolute -right-[8px] top-[140px] rounded-r-sm opacity-50"></div>
      
      <div className="rounded-[2.5rem] overflow-hidden w-full h-full bg-background relative flex flex-col">
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-12 z-20 flex items-center justify-between px-8 pt-2">
            <span className="text-[11px] font-bold text-text-primary">9:41</span>
            <div className="flex items-center gap-1.5 opacity-80">
                <div className="w-4 h-2 rounded-[2px] border border-text-primary/40 flex items-center px-[1px]">
                    <div className="w-2.5 h-1 bg-text-primary rounded-[1px]" />
                </div>
            </div>
        </div>

        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30" />
        
        <div className="flex-1 overflow-y-auto pt-14 px-5 pb-8 scrollbar-hide">
          {children}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full z-20" />
      </div>
    </div>
  )
}
