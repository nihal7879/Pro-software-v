import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type PageSize = number | 'all'

interface PaginationApi<T> {
  pageData: T[]
  page: number
  pageCount: number
  pageSize: PageSize
  total: number
  setPage: (p: number) => void
  setPageSize: (s: PageSize) => void
}

/** Client-side pagination over an in-memory array. */
export function usePagination<T>(data: T[], initial: PageSize = 10): PaginationApi<T> {
  const [pageSize, setPageSize] = useState<PageSize>(initial)
  const [page, setPage] = useState(0)

  return useMemo(() => {
    const total = data.length
    const size = pageSize === 'all' ? Math.max(total, 1) : pageSize
    const pageCount = Math.max(1, Math.ceil(total / size))
    const current = Math.min(page, pageCount - 1)
    const pageData = pageSize === 'all' ? data : data.slice(current * size, current * size + size)
    return { pageData, page: current, pageCount, pageSize, total, setPage, setPageSize }
  }, [data, page, pageSize])
}

const OPTIONS = [10, 20, 50] as const

export function TablePagination<T>({ api }: { api: PaginationApi<T> }) {
  const { page, pageCount, pageSize, total, setPage, setPageSize } = api
  const start = pageSize === 'all' ? 1 : page * pageSize + 1
  const end = pageSize === 'all' ? total : Math.min(total, (page + 1) * pageSize)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-2.5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Rows per page</span>
        <select
          value={String(pageSize)}
          onChange={(e) => {
            setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value))
            setPage(0)
          }}
          className="h-8 rounded-md border border-input bg-card px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
          <option value="all">All</option>
        </select>
        <span className="ml-1">
          {total ? `${start}–${end}` : 0} of {total}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          Page {page + 1} of {pageCount}
        </span>
        <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
          <ChevronLeft className="h-4 w-4" /> Prev
        </Button>
        <Button variant="outline" size="sm" disabled={page >= pageCount - 1} onClick={() => setPage(page + 1)}>
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
