import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export const SectionHeading = ({ 
  title, 
  subtitle, 
  centered = false, 
  className 
}: SectionHeadingProps) => {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className={cn(
        'mb-12 space-y-2',
        centered && 'text-center mx-auto',
        className
      )}
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-text-primary">
        {title}<span className="text-accent">.</span>
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-lg text-text-secondary mx-auto font-medium tracking-tight opacity-70">
          {subtitle}
        </p>
      )}
      <div className={cn(
        'h-[2px] w-12 bg-accent rounded-full mt-4',
        centered && 'mx-auto'
      )} />
    </motion.div>
  )
}
