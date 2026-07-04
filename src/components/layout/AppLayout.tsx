import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Topbar } from './Topbar'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Topbar
        onMenuClick={() => setMobileOpen((v) => !v)}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        collapsed={collapsed}
      />

      {/* Fixed desktop sidebar — stays in place while the page scrolls */}
      <aside
        className={cn(
          'fixed bottom-0 left-0 top-14 z-20 hidden border-r border-border bg-card transition-[width] duration-200 lg:block',
          collapsed ? 'w-16' : 'w-60',
        )}
      >
        <Sidebar collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-14 h-[calc(100vh-3.5rem)] w-60 border-r border-border bg-card">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Content offset for the fixed header + sidebar */}
      <div className={cn('pt-14 transition-[padding] duration-200', collapsed ? 'lg:pl-16' : 'lg:pl-60')}>
        <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
