import { useNavigate } from 'react-router-dom'
import { Boxes, Menu, PanelLeftClose, PanelLeft, ChevronsUpDown, Check } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import type { Role } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const roleLabels: Record<Role, string> = {
  purchaser: 'Purchaser',
  hod: 'Head of Department',
  ceo: 'Chief Executive Officer',
}

const roles: Role[] = ['purchaser', 'hod', 'ceo']

interface TopbarProps {
  onMenuClick: () => void
  onToggleCollapse: () => void
  collapsed: boolean
}

export function Topbar({ onMenuClick, onToggleCollapse, collapsed }: TopbarProps) {
  const { currentUser, loginAs } = useAuthStore()
  const navigate = useNavigate()

  const switchRole = (role: Role) => {
    loginAs(role)
    navigate('/dashboard')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between bg-primary px-4 text-primary-foreground shadow-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-primary-foreground hover:bg-white/10 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden text-primary-foreground hover:bg-white/10 lg:inline-flex"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>
        <div className="flex items-center gap-2">
          <Boxes className="h-6 w-6" />
          <div className="leading-tight">
            <p className="text-sm font-semibold">ProcureFlow</p>
            <p className="hidden text-[11px] text-primary-foreground/70 sm:block">
              Procurement Management System
            </p>
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-white/10">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs font-semibold">
              {currentUser.avatarInitials}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-medium">{currentUser.name}</span>
              <span className="block text-[11px] text-primary-foreground/70">
                {roleLabels[currentUser.role]}
              </span>
            </span>
            <ChevronsUpDown className="h-4 w-4 opacity-80" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {roles.map((role) => (
            <DropdownMenuItem key={role} onClick={() => switchRole(role)}>
              <span className="flex-1">{roleLabels[role]}</span>
              {currentUser.role === role && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
