// Key Facts Box - Scannable information for AI engines
// Structured key-value pairs that are easy to extract

type Fact = {
  label: string
  value: string | number | boolean
  icon?: string
}

type KeyFactsProps = {
  title?: string
  facts: Fact[]
  columns?: 1 | 2 | 3
}

export function KeyFacts({ title = 'Key Facts', facts, columns = 2 }: KeyFactsProps) {
  const formatValue = (value: string | number | boolean) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }
    return String(value)
  }

  return (
    <div className="border rounded-lg p-6 bg-muted/30">
      <h3 className="font-semibold mb-4">{title}</h3>
      <dl 
        className="grid gap-4"
        style={{ 
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` 
        }}
      >
        {facts.map((fact, index) => (
          <div key={index} className="space-y-1">
            <dt className="text-sm text-muted-foreground flex items-center gap-2">
              {fact.icon && <span>{fact.icon}</span>}
              <span>{fact.label}</span>
            </dt>
            <dd className="text-sm font-medium">{formatValue(fact.value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
