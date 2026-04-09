// Best For Section - Use case matching for AI recommendations
// Helps AI engines understand when to recommend this tool

type UseCase = {
  title: string
  description?: string
  icon?: string
}

type BestForProps = {
  title?: string
  useCases: UseCase[] | string[]
}

export function BestFor({ title = 'Best For', useCases }: BestForProps) {
  // Normalize string array to UseCase objects
  const cases: UseCase[] = useCases.map((useCase) =>
    typeof useCase === 'string'
      ? { title: useCase }
      : useCase
  )

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {cases.map((useCase, index) => (
          <div key={index} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-3">
              {useCase.icon && (
                <span className="text-2xl flex-shrink-0">{useCase.icon}</span>
              )}
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{useCase.title}</h3>
                {useCase.description && (
                  <p className="text-sm text-muted-foreground">{useCase.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
