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

export function buildSearchQuery(subject: string, filters: FiltersState): string {
  const parts: string[] = []
  const cleanSubject = subject.trim()

  // 1. メインの対象（営業中フラグに応じたプレフィックス付与）
  if (filters.openNow && cleanSubject) {
    parts.push(`近くの営業中の${cleanSubject}`)
  } else if (cleanSubject) {
    parts.push(cleanSubject)
  }

  // 2. トッピング条件（チェーン除外・選択など）
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

  // 3. 評価基準
  parts.push(MIN_RATING_TERM)

  return parts.join(" ")
}

export function buildMapsUrl(query: string, lat?: number | null, lng?: number | null): string {
  let url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  
  // Geolocation APIで取得した座標があれば center パラメータを付与（検索の中心点を固定）
  if (lat != null && lng != null) {
    url += `&center=${lat},${lng}`
  }

  return url
}

export function openMapsSearch(query: string, lat?: number | null, lng?: number | null) {
  const url = buildMapsUrl(query, lat, lng)
  window.location.href = url
}