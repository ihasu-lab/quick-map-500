export type Mode = "walk" | "drive"

export type FilterKey =
  | "openNow"
  | "excludeChain"
  | "parking"
  | "chainOnly"
  | "localCuisine"

export type FiltersState = Record<FilterKey, boolean>

export interface Category {
  id: string
  label: string
  sublabel: string
  query: string
}

export const CATEGORIES: Category[] = [
  { id: "ramen", label: "ラーメン", sublabel: "麺類", query: "ラーメン" },
  { id: "teishoku", label: "定食", sublabel: "食堂", query: "定食" },
  { id: "cafe", label: "カフェ", sublabel: "喫茶", query: "カフェ" },
  { id: "izakaya", label: "居酒屋", sublabel: "バー", query: "居酒屋" },
  { id: "curry", label: "カレー", sublabel: "エスニック", query: "カレー" },
  { id: "conveni", label: "コンビニ", sublabel: "スーパー", query: "コンビニ" },
]

export const MODE_DEFAULTS: Record<Mode, FiltersState> = {
  walk: {
    openNow: true,
    excludeChain: false,
    parking: false,
    chainOnly: false,
    localCuisine: false,
  },
  drive: {
    openNow: true,
    excludeChain: false,
    parking: true,
    chainOnly: false,
    localCuisine: false,
  },
}

export function buildSearchQuery(subject: string, filters: FiltersState): string {
  const cleanSubject = subject.trim()
  const queryParts: string[] = []

  if (!cleanSubject) return ""

  if (filters.openNow) {
    queryParts.push(`近くの営業中の${cleanSubject}`)
  } else {
    queryParts.push(`近くの${cleanSubject}`)
  }

  if (filters.chainOnly) {
    queryParts.push("チェーン店")
  } else if (filters.excludeChain) {
    queryParts.push("個人店")
  }

  if (filters.parking) {
    queryParts.push("駐車場あり")
  }

  if (filters.localCuisine) {
    queryParts.push("名物")
  }

  return queryParts.join(" ")
}

export function buildMapsUrl(
  query: string,
  lat?: number | null,
  lng?: number | null
): string {
  let url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

  if (lat != null && lng != null) {
    url += `&center=${lat},${lng}&ll=${lat},${lng}`
  }

  return url
}

export function openMapsSearch(
  query: string,
  lat?: number | null,
  lng?: number | null
) {
  window.location.href = buildMapsUrl(query, lat, lng)
}