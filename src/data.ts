import { horseTuples } from './horses.generated'

export type StableKey = 'two' | 'three' | 'four'

export type Horse = {
  name: string
  code: string
  rating: number | null
  hasPhoto: boolean
  stable: StableKey
}

export type Stable = {
  key: StableKey
  label: string
  title: string
  description: string
  source: string
}

type HorseTuple = readonly [
  name: string,
  code: string,
  rating: number | null,
  hasPhoto: boolean,
]

const makeHorses = (
  stable: StableKey,
  horses: readonly HorseTuple[],
): Horse[] => horses.map(([name, code, rating, hasPhoto]) => ({
  name,
  code,
  rating,
  hasPhoto,
  stable,
}))

export const stables: Stable[] = [
  {
    key: 'two',
    label: '二字馬',
    title: '短途熱身',
    description: '名字精簡，先練眼界。',
    source: 'https://racing.hkjc.com/zh-hk/local/information/selecthorsebychar?ordertype=2',
  },
  {
    key: 'three',
    label: '三字馬',
    title: '中班挑戰',
    description: '節奏多變，考你記性。',
    source: 'https://racing.hkjc.com/zh-hk/local/information/selecthorsebychar?ordertype=3',
  },
  {
    key: 'four',
    label: '四字馬',
    title: '冠軍大賽',
    description: '名駒雲集，終極考驗。',
    source: 'https://racing.hkjc.com/zh-hk/local/information/selecthorsebychar?ordertype=4',
  },
]

export const horseData: Record<StableKey, Horse[]> = {
  two: makeHorses('two', horseTuples.two),
  three: makeHorses('three', horseTuples.three),
  four: makeHorses('four', horseTuples.four),
}

export const horsePhoto = (code: string) =>
  `https://racing.hkjc.com/general/-/media/Sites/JCRW/Horse_Images/${code[0]}/${code}_l.jpg`

export const horseSilk = (code: string) =>
  `https://racing.hkjc.com/racing/content/Images/RaceColor/${code}.gif`
