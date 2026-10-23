import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`editorial-card p-5 ${className}`}>
      {children}
    </div>
  )
}
