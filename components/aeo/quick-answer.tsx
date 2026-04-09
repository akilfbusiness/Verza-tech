// Quick Answer Box - Optimized for AI extraction
// Provides direct, concise answers that AI engines can easily cite

type QuickAnswerProps = {
  question: string
  answer: string
  highlights?: string[]
}

export function QuickAnswer({ question, answer, highlights }: QuickAnswerProps) {
  return (
    <div className="border-2 border-primary/20 rounded-lg p-6 bg-primary/5 mb-8">
      <h2 className="text-lg font-semibold mb-3 flex items-start gap-2">
        <span className="text-primary mt-1">💡</span>
        <span className="text-balance">{question}</span>
      </h2>
      <p className="text-base leading-relaxed mb-4 text-pretty">
        {answer}
      </p>
      {highlights && highlights.length > 0 && (
        <ul className="space-y-2">
          {highlights.map((highlight, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-primary mt-0.5">•</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
