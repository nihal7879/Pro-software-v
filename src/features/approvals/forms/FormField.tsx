interface FormFieldProps {
  label: string
  value: React.ReactNode
}

export function FormField({ label, value }: FormFieldProps) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm">{value || '—'}</p>
    </div>
  )
}
