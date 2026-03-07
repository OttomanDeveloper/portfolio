import { cn } from '@/lib/utils'
import { motion, HTMLMotionProps } from 'framer-motion'

interface CardProps extends HTMLMotionProps<'div'> {
  className?: string
  children: React.ReactNode
}

export const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <motion.div
      className={cn(
        'rounded-2xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
