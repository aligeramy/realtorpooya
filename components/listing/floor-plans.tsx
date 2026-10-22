'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FileText, Maximize2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { FloorPlanItem } from '@/lib/listing/load'

interface FloorPlansProps {
  plans: FloorPlanItem[]
}

function planLabel(plan: FloorPlanItem, index: number) {
  return plan.label || `Floor plan ${index + 1}`
}

export default function FloorPlans({ plans }: FloorPlansProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  if (!plans.length) return null

  const images = plans.map((plan, index) => ({ plan, index })).filter(({ plan }) => plan.kind === 'image')
  const pdfs = plans.map((plan, index) => ({ plan, index })).filter(({ plan }) => plan.kind === 'pdf')
  const open = openIndex !== null ? plans[openIndex] : null

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className={`grid gap-4 ${images.length > 1 ? 'sm:grid-cols-2' : ''}`}>
          {images.map(({ plan, index }) => (
            <button
              key={plan.url}
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group text-left"
              aria-label={`Open ${planLabel(plan, index)}`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <Image
                  src={plan.url}
                  alt={planLabel(plan, index)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <span className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-gray-700 opacity-0 shadow transition-opacity group-hover:opacity-100">
                  <Maximize2 className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-2 font-manrope text-sm text-gray-700">{planLabel(plan, index)}</p>
            </button>
          ))}
        </div>
      )}

      {pdfs.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {pdfs.map(({ plan, index }) => (
            <a
              key={plan.url}
              href={plan.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#aa9578] px-5 py-2.5 font-manrope text-sm text-[#473729] transition-colors hover:bg-[#f3ecdf]"
            >
              <FileText className="h-4 w-4" />
              {planLabel(plan, index)} (PDF)
            </a>
          ))}
        </div>
      )}

      <Dialog open={open !== null} onOpenChange={(isOpen) => !isOpen && setOpenIndex(null)}>
        <DialogContent className="max-w-6xl w-[95vw] p-4 sm:p-6 bg-white">
          <DialogTitle className="font-tenor-sans text-xl text-gray-900">
            {open && openIndex !== null ? planLabel(open, openIndex) : 'Floor plan'}
          </DialogTitle>
          {open && (
            <div className="relative h-[75vh] w-full">
              <Image src={open.url} alt={planLabel(open, openIndex ?? 0)} fill sizes="95vw" className="object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
