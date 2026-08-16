"use client"

import { useEffect, useState } from "react"
import { LocateFixed, LocateOff, Loader2 } from "lucide-react"

type Status = "pending" | "found" | "denied"

export function StatusHeader() {
  const [status, setStatus] = useState<Status>("pending")

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setStatus("denied")
      return
    }
    navigator.geolocation.getCurrentPosition(
      () => setStatus("found"),
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 8000 },
    )
  }, [])

  return (
    <header className="flex items-center justify-between gap-3 px-5 pt-6 pb-2">
      <div className="flex flex-col">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Quick Map 500
        </span>
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          ワンタップ店舗検索
        </h1>
      </div>

      <div
        className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5"
        role="status"
        aria-live="polite"
      >
        {status === "pending" && (
          <>
            <Loader2 className="size-3.5 animate-spin text-muted-foreground" aria-hidden="true" />
            <span className="text-xs font-medium text-muted-foreground">取得中…</span>
          </>
        )}
        {status === "found" && (
          <>
            <LocateFixed className="size-3.5 text-primary" aria-hidden="true" />
            <span className="text-xs font-medium text-foreground">現在地取得完了</span>
          </>
        )}
        {status === "denied" && (
          <>
            <LocateOff className="size-3.5 text-muted-foreground" aria-hidden="true" />
            <span className="text-xs font-medium text-muted-foreground">位置情報オフ</span>
          </>
        )}
      </div>
    </header>
  )
}
