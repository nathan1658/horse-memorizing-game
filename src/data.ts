export type StableKey = 'two' | 'three' | 'four'

export type Horse = {
  name: string
  code: string
  rating: number
  stable: StableKey
}

export type Stable = {
  key: StableKey
  label: string
  title: string
  description: string
  source: string
}

const makeHorses = (
  stable: StableKey,
  horses: Array<[name: string, code: string, rating: number]>,
): Horse[] => horses.map(([name, code, rating]) => ({ name, code, rating, stable }))

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
  two: makeHorses('two', [
    ['祝願', 'J256', 124],
    ['球星', 'H412', 102],
    ['翠紅', 'K173', 100],
    ['安騁', 'H452', 100],
    ['玩笑', 'K014', 90],
    ['安都', 'K033', 83],
    ['晒冷', 'K369', 83],
    ['奔放', 'K156', 83],
    ['增強', 'J114', 81],
    ['煌上', 'L301', 80],
    ['凌登', 'L151', 80],
    ['馬力', 'J431', 79],
  ]),
  three: makeHorses('three', [
    ['大至尊', 'J208', 101],
    ['和平波', 'J245', 100],
    ['韋金主', 'K061', 95],
    ['信心星', 'J161', 93],
    ['勁沙塵', 'J514', 90],
    ['喜慶寶', 'K583', 89],
    ['昇瀧駒', 'J141', 89],
    ['桃花開', 'J301', 89],
    ['大天王', 'L113', 88],
    ['超輕鬆', 'L148', 87],
    ['喜尊龍', 'J481', 86],
    ['會當凌', 'K122', 85],
  ]),
  four: makeHorses('four', [
    ['嘉應高昇', 'J062', 142],
    ['浪漫勇士', 'E486', 139],
    ['遨遊氣泡', 'E436', 128],
    ['金鑽貴人', 'G180', 123],
    ['舉步生風', 'J358', 121],
    ['驕陽明駒', 'H302', 121],
    ['錶之銀河', 'H399', 120],
    ['精算暴雪', 'H368', 117],
    ['美麗同享', 'E058', 114],
    ['百賀飛駒', 'K021', 112],
    ['白鷺金剛', 'K296', 112],
    ['手機錶霸', 'H485', 112],
  ]),
}

export const horsePhoto = (code: string) =>
  `https://racing.hkjc.com/general/-/media/Sites/JCRW/Horse_Images/${code[0]}/${code}_l.jpg`

export const horseSilk = (code: string) =>
  `https://racing.hkjc.com/racing/content/Images/RaceColor/${code}.gif`
