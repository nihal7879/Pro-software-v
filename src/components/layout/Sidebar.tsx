import { NavLink } from 'react-router-dom'
import { navByRole } from '@/config/navigation'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

interface SidebarProps {
  onNavigate?: () => void
  collapsed?: boolean
}

export function Sidebar({ onNavigate, collapsed = false }: SidebarProps) {
  const role = useAuthStore((s) => s.currentUser.role)
  const items = navByRole[role]

  return (
    <nav className="flex h-full flex-col gap-0.5 p-3">
      {!collapsed && (
        <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
      )}
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          title={collapsed ? item.label : undefined}
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-md py-2 text-sm font-medium transition-colors',
              collapsed ? 'justify-center px-2' : 'gap-3 px-3',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            )
          }
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{item.label}</span>}
        </NavLink>
      ))}
    </nav>
  )
}
