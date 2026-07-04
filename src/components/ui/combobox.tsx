import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronsUpDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ComboOption {
  value: string
  label: string
  hint?: string
}

interface ComboboxProps {
  options: ComboOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  /** Allow using the typed text as a custom value not present in options. */
  allowCustom?: boolean
  className?: string
}

interface MenuRect {
  top: number
  left: number
  width: number
}

/**
 * Searchable single-select dropdown ("type search dropdown"). Selects from
 * master data; with allowCustom it also lets the user commit free text.
 *
 * The menu is rendered in a portal with fixed positioning so it is never
 * clipped by overflow containers (e.g. horizontally-scrolling grids/dialogs).
 */
export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results.',
  allowCustom = false,
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [rect, setRect] = useState<MenuRect | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const updateRect = () => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setRect({ top: r.bottom + 4, left: r.left, width: Math.max(r.width, 240) })
  }

  useLayoutEffect(() => {
    if (open) updateRect()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onScrollOrResize = () => updateRect()
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node
      if (triggerRef.current?.contains(t) || menuRef.current?.contains(t)) return
      setOpen(false)
    }
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    document.addEventListener('mousedown', onClick)
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.hint?.toLowerCase().includes(q),
    )
  }, [options, query])

  const selected = options.find((o) => o.value === value)
  const display = selected?.label ?? (value && allowCustom ? value : '')

  const commit = (val: string) => {
    onChange(val)
    setOpen(false)
    setQuery('')
  }

  return (
    <div className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <span className={cn('truncate text-left', !display && 'text-muted-foreground')}>
          {display || placeholder}
        </span>
        <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
      </button>

      {open &&
        rect &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: 'fixed', top: rect.top, left: rect.left, width: rect.width }}
            className="z-[100] overflow-hidden rounded-md border border-border bg-card shadow-md"
          >
            <div className="flex items-center gap-2 border-b border-border px-2.5">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <ul className="max-h-60 overflow-y-auto p-1">
              {filtered.map((o) => (
                <li key={o.value}>
                  <button
                    type="button"
                    onClick={() => commit(o.value)}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <Check className={cn('h-4 w-4 shrink-0', value === o.value ? 'opacity-100' : 'opacity-0')} />
                    <span className="flex-1 truncate">
                      {o.label}
                      {o.hint && <span className="ml-1 text-xs text-muted-foreground">{o.hint}</span>}
                    </span>
                  </button>
                </li>
              ))}
              {!filtered.length && !allowCustom && (
                <li className="px-2 py-6 text-center text-sm text-muted-foreground">{emptyText}</li>
              )}
              {allowCustom &&
                query.trim() &&
                !filtered.some((o) => o.label.toLowerCase() === query.trim().toLowerCase()) && (
                  <li>
                    <button
                      type="button"
                      onClick={() => commit(query.trim())}
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-primary hover:bg-accent"
                    >
                      <span className="flex h-4 w-4 items-center justify-center text-xs">+</span>
                      Add “{query.trim()}”
                    </button>
                  </li>
                )}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  )
}
