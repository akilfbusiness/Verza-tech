import { CheckCircle, XCircle, AlertCircle, Star } from 'lucide-react'
import type { BlogVerdictBox } from '@/lib/sanity.types'

interface VerdictBoxProps {
  verdict: BlogVerdictBox
}

const RECOMMENDATION_CONFIG = {
  'highly-recommended': {
    label: 'Highly Recommended',
    icon: CheckCircle,
    className: 'border-green-500 bg-green-50 text-green-900',
    iconClass: 'text-green-600',
  },
  'recommended': {
    label: 'Recommended',
    icon: CheckCircle,
    className: 'border-blue-500 bg-blue-50 text-blue-900',
    iconClass: 'text-blue-600',
  },
  'conditional': {
    label: 'Conditionally Recommended',
    icon: AlertCircle,
    className: 'border-yellow-500 bg-yellow-50 text-yellow-900',
    iconClass: 'text-yellow-600',
  },
  'not-recommended': {
    label: 'Not Recommended',
    icon: XCircle,
    className: 'border-red-500 bg-red-50 text-red-900',
    iconClass: 'text-red-600',
  },
}

export function VerdictBox({ verdict }: VerdictBoxProps) {
  const config = verdict.recommendation
    ? RECOMMENDATION_CONFIG[verdict.recommendation]
    : RECOMMENDATION_CONFIG['recommended']

  const Icon = config.icon

  return (
    <div className={`rounded-xl border-2 p-6 my-8 ${config.className}`} role="note" aria-label="Verza Verdict">
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`w-6 h-6 flex-shrink-0 ${config.iconClass}`} aria-hidden="true" />
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg">Verza Verdict:</span>
          <span className="font-semibold">{config.label}</span>
        </div>
        {verdict.rating && (
          <div className="flex items-center gap-1 ml-auto">
            <Star className="w-5 h-5 fill-current text-yellow-500" aria-hidden="true" />
            <span className="font-bold text-xl">{verdict.rating}</span>
            <span className="text-sm opacity-70">/5</span>
          </div>
        )}
      </div>
      <p className="text-base font-medium leading-relaxed">{verdict.summary}</p>
      {verdict.verdictChanged && verdict.verdictChangedDate && (
        <p className="text-xs mt-3 opacity-70">
          Verdict updated {new Date(verdict.verdictChangedDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      )}
    </div>
  )
}
