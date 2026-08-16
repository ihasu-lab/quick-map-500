import { Search } from "lucide-react"

interface QueryPreviewProps {
  query: string
}

export function QueryPreview({ query }: QueryPreviewProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-dashed border-border bg-secondary/60 px-4 py-3">
      <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <p className="truncate font-mono text-[13px] leading-none text-muted-foreground">
        <span className="text-foreground">{query}</span>
      </p>
    </div>
  )
}
