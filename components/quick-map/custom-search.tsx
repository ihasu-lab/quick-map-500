"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CustomSearchProps {
  onSearch: (term: string) => void
}

export function CustomSearch({ onSearch }: CustomSearchProps) {
  const [value, setValue] = useState("")

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSearch(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="自由入力（例: うどん, 焼き鳥）"
        aria-label="自由入力キーワード"
        className="h-12 rounded-2xl bg-card text-sm"
      />
      <Button
        type="submit"
        disabled={!value.trim()}
        className="h-12 shrink-0 rounded-2xl px-4 font-semibold"
      >
        <Search className="size-4" aria-hidden="true" />
        検索
      </Button>
    </form>
  )
}
