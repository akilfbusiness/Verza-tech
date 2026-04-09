// Comparison Table - Structured data for AI parsing
// Clean, semantic table structure that AI engines can extract

type ComparisonRow = {
  feature: string
  values: (string | boolean | number)[]
}

type ComparisonTableProps = {
  title?: string
  columns: string[]
  rows: ComparisonRow[]
}

export function ComparisonTable({ title, columns, rows }: ComparisonTableProps) {
  const formatValue = (value: string | boolean | number) => {
    if (typeof value === 'boolean') {
      return value ? '✓' : '×'
    }
    return String(value)
  }

  return (
    <div className="overflow-x-auto">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-border">
            <th className="text-left p-3 font-semibold">Feature</th>
            {columns.map((col, index) => (
              <th key={index} className="text-left p-3 font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border hover:bg-muted/30 transition-colors">
              <td className="p-3 font-medium">{row.feature}</td>
              {row.values.map((value, colIndex) => (
                <td key={colIndex} className="p-3 text-muted-foreground">
                  {formatValue(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
