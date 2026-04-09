// Verdict/Summary Box - Clear conclusion for AI citation
// Provides the "bottom line" that AI engines can extract as a definitive answer

type VerdictProps = {
  title?: string
  verdict: string
  rating?: number
  recommendation?: 'highly-recommended' | 'recommended' | 'conditional' | 'not-recommended'
}

export function Verdict({ 
  title = 'Final Verdict', 
  verdict, 
  rating,
  recommendation 
}: VerdictProps) {
  const recommendationColors = {
    'highly-recommended': 'border-green-500/50 bg-green-500/5',
    'recommended': 'border-primary/50 bg-primary/5',
    'conditional': 'border-yellow-500/50 bg-yellow-500/5',
    'not-recommended': 'border-red-500/50 bg-red-500/5',
  }

  const recommendationLabels = {
    'highly-recommended': '⭐ Highly Recommended',
    'recommended': '👍 Recommended',
    'conditional': '⚠️ Recommended with Conditions',
    'not-recommended': '⛔ Not Recommended',
  }

  return (
    <div 
      className={`border-2 rounded-lg p-6 ${
        recommendation ? recommendationColors[recommendation] : 'border-primary/20 bg-muted/30'
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        {rating && (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{rating}</span>
            <span className="text-muted-foreground">/5</span>
          </div>
        )}
      </div>
      {recommendation && (
        <div className="mb-3 font-medium text-sm">
          {recommendationLabels[recommendation]}
        </div>
      )}
      <p className="leading-relaxed text-pretty">{verdict}</p>
    </div>
  )
}
