import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Combobox, type ComboOption } from '@/components/ui/combobox'
import { SignaturePad } from '@/components/common/SignaturePad'
import { useAuthStore } from '@/store/authStore'
import type { ApprovalRemark, Role } from '@/types'

interface ApprovalDecisionFormProps {
  onDecide: (remark: ApprovalRemark, selectedVendorId?: string) => void
  /** When provided, the approver must choose the winning vendor to approve. */
  vendorOptions?: ComboOption[]
  defaultVendorId?: string
}

const remarkLabel: Record<Role, string> = {
  purchaser: 'Remark',
  hod: 'HOD Remark',
  ceo: 'CEO Final Remark',
}

export function ApprovalDecisionForm({ onDecide, vendorOptions, defaultVendorId }: ApprovalDecisionFormProps) {
  const user = useAuthStore((s) => s.currentUser)
  const [remark, setRemark] = useState('')
  const [signature, setSignature] = useState<string | null>(null)
  const [vendorId, setVendorId] = useState(defaultVendorId ?? '')
  const [error, setError] = useState('')

  const submit = (decision: 'approved' | 'rejected') => {
    if (decision === 'approved' && !signature) {
      setError('An e-signature is required to approve.')
      return
    }
    if (decision === 'approved' && vendorOptions && !vendorId) {
      setError('Select the vendor to award before approving.')
      return
    }
    if (decision === 'rejected' && remark.trim().length < 3) {
      setError('Please add a remark explaining the rejection.')
      return
    }
    onDecide(
      {
        role: user.role,
        author: user.name,
        decision,
        remark: remark.trim(),
        signature: signature ?? '',
        timestamp: new Date().toISOString(),
      },
      vendorId || undefined,
    )
  }

  return (
    <div className="space-y-3 rounded-md border border-border bg-secondary/40 p-4">
      <p className="text-sm font-semibold">Your Decision</p>

      {vendorOptions && (
        <div className="space-y-1.5">
          <Label>Select Vendor to Award</Label>
          <Combobox
            options={vendorOptions}
            value={vendorId}
            onChange={setVendorId}
            placeholder="Choose winning vendor"
          />
          <p className="text-[11px] text-muted-foreground">Required to approve the comparison.</p>
        </div>
      )}

      <div className="space-y-1.5">
        <Label>{remarkLabel[user.role]}</Label>
        <Textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Add your remarks (optional for approval, required for rejection)"
        />
      </div>

      <div className="space-y-1.5">
        <Label>E-Signature</Label>
        <SignaturePad onChange={setSignature} />
        <p className="text-[11px] text-muted-foreground">
          Signing as <span className="font-medium text-foreground">{user.name}</span>. Required to approve.
        </p>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button className="flex-1" onClick={() => submit('approved')}>
          <Check className="h-4 w-4" /> Approve &amp; Sign
        </Button>
        <Button variant="destructive" className="flex-1" onClick={() => submit('rejected')}>
          <X className="h-4 w-4" /> Reject
        </Button>
      </div>
    </div>
  )
}
