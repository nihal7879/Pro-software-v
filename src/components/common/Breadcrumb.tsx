import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
      {items.map((item, i) => {
        const last = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1.5">
            {item.to && !last ? (
              <Link to={item.to} className="hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className={last ? 'font-medium text-foreground' : ''}>{item.label}</span>
            )}
            {!last && <ChevronRight className="h-4 w-4" />}
          </span>
        )
      })}
    </nav>
  )
}
