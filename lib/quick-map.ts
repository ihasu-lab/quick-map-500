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

export const MODE_DEFAULTS: Record<Mode, { radius: number; radiusLabel: string; filters: FiltersState }> = {
  walk: {
    radius: 500,
    radiusLabel: "500m",
    filters: {
      openNow: true,
      excludeChain: false,
      parking: false,
      chainOnly: false,
      localCuisine: false,
    },
  },
  drive: {
    radius: 3000,
    radiusLabel: "3km",
    filters: {
      openNow: true,
      excludeChain: false,
      parking: true,
      chainOnly: false,
      localCuisine: false,
    },
  },
}

// Googleマップの検索エンジンが解釈しやすい検索条件キーワードマップ
const FILTER_QUERY_TERMS: Partial<Record<FilterKey, string>> = {
  excludeChain: "-チェーン",
  parking: "駐車場あり",
  chainOnly: "チェーン店",
  localCuisine: "ご当地グルメ",
}

const MIN_RATING_TERM = "高評価"

// ズームレベルの定義
const MODE_ZOOM: Record<Mode, number> = {
  walk: 16, // 500m圏内が画面に収まる拡大率
  drive: 14, // 3km圏内が画面に収まる拡大率
}

export function buildSearchQuery(subject: string, filters: FiltersState, mode: Mode): string {
  const parts: string[] = []
  const cleanSubject = subject.trim()

  // 徒歩モード時は「徒歩圏内」などのコンテクストをクエリに含める
  const distanceContext = mode === "walk" ? "徒歩圏内の" : ""

  if (filters.openNow && cleanSubject) {
    parts.push(`近くの営業中の${distanceContext}${cleanSubject}`)
  } else if (cleanSubject) {
    parts.push(`近くの${distanceContext}${cleanSubject}`)
  }

  if (filters.chainOnly) {
    if (FILTER_QUERY_TERMS.chainOnly) parts.push(FILTER_QUERY_TERMS.chainOnly)
  } else if (filters.excludeChain) {
    if (FILTER_QUERY_TERMS.excludeChain) parts.push(FILTER_QUERY_TERMS.excludeChain)
  }

  if (filters.parking && FILTER_QUERY_TERMS.parking) {
    parts.push(FILTER_QUERY_TERMS.parking)
  }

  if (filters.localCuisine && FILTER_QUERY_TERMS.localCuisine) {
    parts.push(FILTER_QUERY_TERMS.localCuisine)
  }

  parts.push(MIN_RATING_TERM)

  return parts.join(" ")
}

export function buildMapsUrl(
  query: string,
  mode: Mode,
  lat?: number | null,
  lng?: number | null
): string {
  // Search API の query パラメータは center/z を無視するため、
  // 座標があるときはビューポート付きのパス形式で現在地周辺に絞り込む
  if (lat != null && lng != null) {
    const zoom = MODE_ZOOM[mode]
    return `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${lat},${lng},${zoom}z`
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function openMapsSearch(
  query: string,
  mode: Mode,
  lat?: number | null,
  lng?: number | null
) {
  window.location.href = buildMapsUrl(query, mode, lat, lng)
}