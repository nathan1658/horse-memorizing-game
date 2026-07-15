import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  Flag,
  Gauge,
  RotateCcw,
  Sparkles,
  Timer,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { horseData, horsePhoto, horseSilk, stables, type Horse, type StableKey } from './data'

type Phase = 'setup' | 'playing' | 'result'
type CardKind = 'photo' | 'name'

type GameCard = {
  uid: string
  horse: Horse
  kind: CardKind
}

const difficulties = [
  { pairs: 6, label: '輕鬆跑', note: '6 對' },
  { pairs: 8, label: '標準賽', note: '8 對' },
  { pairs: 10, label: '冠軍賽', note: '10 對' },
] as const

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }
  return copy
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}

const bestKey = (stable: StableKey, pairs: number) => `horse-memory-best-${stable}-${pairs}`

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <span>馬</span>
      <i />
    </div>
  )
}

type HeaderProps = {
  soundOn: boolean
  setSoundOn: (next: boolean) => void
  compact?: boolean
}

function Header({ soundOn, setSoundOn, compact = false }: HeaderProps) {
  return (
    <header className={`masthead ${compact ? 'masthead--compact' : ''}`}>
      <div className="brand-lockup">
        <BrandMark />
        <div>
          <strong>香港馬名記憶賽</strong>
          <span>HK HORSE MEMORY</span>
        </div>
      </div>
      <div className="masthead-actions">
        <span className="season-label">2025/26 馬季</span>
        <button
          className="icon-button"
          type="button"
          onClick={() => setSoundOn(!soundOn)}
          aria-label={soundOn ? '關閉讀名聲音' : '開啟讀名聲音'}
          title={soundOn ? '關閉讀名聲音' : '開啟讀名聲音'}
        >
          {soundOn ? <Volume2 size={19} /> : <VolumeX size={19} />}
        </button>
      </div>
    </header>
  )
}

function HorseImage({ horse, className = '' }: { horse: Horse; className?: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`horse-image-fallback ${className}`} role="img" aria-label={`${horse.name}相片暫未提供`}>
        <span>馬</span>
        <small>{horse.code}</small>
      </div>
    )
  }

  return (
    <img
      className={className}
      src={horsePhoto(horse.code)}
      alt={`${horse.name}馬匹相片`}
      onError={() => setFailed(true)}
    />
  )
}

type SetupProps = {
  stableKey: StableKey
  setStableKey: (key: StableKey) => void
  pairCount: number
  setPairCount: (count: number) => void
  onStart: () => void
  soundOn: boolean
  setSoundOn: (next: boolean) => void
}

function Setup({
  stableKey,
  setStableKey,
  pairCount,
  setPairCount,
  onStart,
  soundOn,
  setSoundOn,
}: SetupProps) {
  const stable = stables.find((item) => item.key === stableKey)!
  const previewHorses = horseData[stableKey].slice(0, 4)
  const best = Number(localStorage.getItem(bestKey(stableKey, pairCount))) || 0

  return (
    <div className="site-shell setup-shell">
      <Header soundOn={soundOn} setSoundOn={setSoundOn} />
      <main className="setup-main">
        <section className="intro-panel">
          <p className="eyebrow"><Flag size={15} /> 今場目標：認出每一匹</p>
          <h1>眼熟，<br /><em>先係真馬迷。</em></h1>
          <p className="intro-copy">
            翻開馬匹相片，再找出對應馬名。由兩字短名到四字名駒，逐場操熟你的馬房記憶。
          </p>

          <div className="setup-controls">
            <fieldset>
              <legend><span>01</span> 揀選馬名字數</legend>
              <div className="stable-selector">
                {stables.map((item) => (
                  <button
                    type="button"
                    className={stableKey === item.key ? 'is-selected' : ''}
                    onClick={() => setStableKey(item.key)}
                    key={item.key}
                  >
                    <strong>{item.label}</strong>
                    <small>{item.title}</small>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend><span>02</span> 揀選賽事長度</legend>
              <div className="difficulty-selector">
                {difficulties.map((difficulty) => (
                  <button
                    type="button"
                    className={pairCount === difficulty.pairs ? 'is-selected' : ''}
                    onClick={() => setPairCount(difficulty.pairs)}
                    key={difficulty.pairs}
                  >
                    <span className="radio-dot" />
                    <strong>{difficulty.label}</strong>
                    <small>{difficulty.note}</small>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="start-row">
            <button className="primary-button" type="button" onClick={onStart}>
              開閘起步 <ArrowRight size={20} />
            </button>
            <div className="best-note">
              <Trophy size={17} />
              <span>{best ? `最佳時間 ${formatTime(best)}` : '完成首場，寫下紀錄'}</span>
            </div>
          </div>
        </section>

        <aside className="race-card" aria-label={`${stable.label}焦點馬匹`}>
          <div className="race-card-heading">
            <div>
              <span>焦點馬房</span>
              <h2>{stable.label}</h2>
            </div>
            <p>{stable.description}</p>
          </div>
          <div className="track-curve" aria-hidden="true"><i /><i /><i /></div>
          <ol className="horse-preview-list">
            {previewHorses.map((horse, index) => (
              <li key={horse.code}>
                <span className={`cloth-number cloth-${index + 1}`}>{index + 1}</span>
                <HorseImage horse={horse} />
                <div>
                  <strong>{horse.name}</strong>
                  <span>{horse.code}</span>
                </div>
                <b>{horse.rating}<small>評分</small></b>
              </li>
            ))}
          </ol>
          <a href={stable.source} target="_blank" rel="noreferrer" className="source-link">
            查看香港賽馬會馬匹資料 <ExternalLink size={14} />
          </a>
        </aside>
      </main>

      <footer className="site-footer">
        <span>非香港賽馬會官方產品 · 只供馬名學習及娛樂</span>
        <span>馬匹名稱、評分及相片資料來源：香港賽馬會 · 擷取於 15.07.2026</span>
      </footer>
    </div>
  )
}

type GameProps = {
  stableKey: StableKey
  pairCount: number
  cards: GameCard[]
  flipped: string[]
  matched: string[]
  moves: number
  elapsed: number
  soundOn: boolean
  setSoundOn: (next: boolean) => void
  onFlip: (card: GameCard) => void
  onBack: () => void
  onRestart: () => void
}

function Game({
  stableKey,
  pairCount,
  cards,
  flipped,
  matched,
  moves,
  elapsed,
  soundOn,
  setSoundOn,
  onFlip,
  onBack,
  onRestart,
}: GameProps) {
  const stable = stables.find((item) => item.key === stableKey)!
  const matchedCount = matched.length

  return (
    <div className="site-shell game-shell">
      <Header soundOn={soundOn} setSoundOn={setSoundOn} compact />
      <main className="game-main">
        <div className="game-toolbar">
          <button className="text-button" type="button" onClick={onBack}>
            <ArrowLeft size={17} /> 揀馬房
          </button>
          <div className="race-progress-copy">
            <span>{stable.label} · {pairCount} 對挑戰</span>
            <strong>{matchedCount === pairCount ? '全數認出' : `尋找第 ${matchedCount + 1} 對`}</strong>
          </div>
          <button className="icon-button" type="button" onClick={onRestart} aria-label="重新洗牌" title="重新洗牌">
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="game-status">
          <div className="progress-track" aria-label={`已配對 ${matchedCount} 對，共 ${pairCount} 對`}>
            <i style={{ transform: `scaleX(${matchedCount / pairCount})` }} />
          </div>
          <div className="stat-strip">
            <span><Check size={16} /><b>{matchedCount}</b> / {pairCount} 對</span>
            <span><Gauge size={16} /><b>{moves}</b> 步</span>
            <span><Timer size={16} /><b>{formatTime(elapsed)}</b></span>
          </div>
        </div>

        <section
          className={`memory-grid grid-${pairCount}`}
          aria-label="馬名記憶卡牌"
          style={{ '--desktop-columns': pairCount === 10 ? 5 : 4 } as React.CSSProperties}
        >
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(card.uid) || matched.includes(card.horse.code)
            const isMatched = matched.includes(card.horse.code)
            return (
              <button
                type="button"
                className={`memory-card ${isFlipped ? 'is-flipped' : ''} ${isMatched ? 'is-matched' : ''}`}
                key={card.uid}
                onClick={() => onFlip(card)}
                disabled={isMatched}
                aria-label={isFlipped ? `${card.horse.name}${card.kind === 'photo' ? '相片卡' : '馬名卡'}` : `第 ${index + 1} 張未翻開卡牌`}
                aria-pressed={isFlipped}
              >
                <span className="card-inner">
                  <span className="card-face card-back">
                    <span className="card-back-top">HK</span>
                    <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="card-back-bottom">馬名記憶賽</span>
                  </span>
                  <span className={`card-face card-front card-front--${card.kind}`}>
                    {card.kind === 'photo' ? (
                      <>
                        <HorseImage horse={card.horse} />
                        <span className="photo-caption">
                          <small>PHOTO</small>
                          <b>{card.horse.code}</b>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="silk-wrap">
                          <img src={horseSilk(card.horse.code)} alt="" />
                          <small>{card.horse.code}</small>
                        </span>
                        <strong>{card.horse.name}</strong>
                        <span className="rating-line"><b>{card.horse.rating}</b> 現時評分</span>
                      </>
                    )}
                    {isMatched && <span className="match-stamp"><Check size={15} /> 配對</span>}
                  </span>
                </span>
              </button>
            )
          })}
        </section>
        <p className="game-tip"><Volume2 size={15} /> 翻開馬名卡會讀出馬名；相片卡與馬名卡各一張。</p>
      </main>
    </div>
  )
}

type ResultProps = {
  horses: Horse[]
  stableKey: StableKey
  pairCount: number
  elapsed: number
  moves: number
  isBest: boolean
  soundOn: boolean
  setSoundOn: (next: boolean) => void
  onReplay: () => void
  onSetup: () => void
}

function Result({
  horses,
  stableKey,
  pairCount,
  elapsed,
  moves,
  isBest,
  soundOn,
  setSoundOn,
  onReplay,
  onSetup,
}: ResultProps) {
  const stable = stables.find((item) => item.key === stableKey)!
  const accuracy = Math.round((pairCount / Math.max(moves, pairCount)) * 100)

  return (
    <div className="site-shell result-shell">
      <Header soundOn={soundOn} setSoundOn={setSoundOn} compact />
      <main className="result-main">
        <section className="finish-banner">
          <div className="finish-badge"><Trophy size={25} /></div>
          <p className="eyebrow"><Sparkles size={15} /> 衝線完成</p>
          <h1>全數認出，<em>好眼光！</em></h1>
          <p>{stable.label} · {pairCount} 對挑戰</p>
          {isBest && <span className="new-record">NEW RECORD · 新紀錄</span>}
          <div className="finish-lines" aria-hidden="true"><i /><i /><i /><i /></div>
        </section>

        <section className="result-content">
          <div className="result-summary">
            <p>今場賽果</p>
            <dl>
              <div><dt>時間</dt><dd>{formatTime(elapsed)}</dd></div>
              <div><dt>步數</dt><dd>{moves}</dd></div>
              <div><dt>命中率</dt><dd>{accuracy}%</dd></div>
            </dl>
            <div className="result-actions">
              <button className="primary-button" type="button" onClick={onReplay}>
                再跑一場 <RotateCcw size={18} />
              </button>
              <button className="secondary-button" type="button" onClick={onSetup}>
                轉換馬房
              </button>
            </div>
          </div>

          <div className="learned-roster">
            <div className="roster-heading">
              <span>今場已認出</span>
              <strong>{horses.length} 匹</strong>
            </div>
            <ol>
              {horses.map((horse, index) => (
                <li key={horse.code}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <HorseImage horse={horse} />
                  <div><strong>{horse.name}</strong><small>{horse.code}</small></div>
                  <b>{horse.rating}<small>評分</small></b>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [stableKey, setStableKey] = useState<StableKey>('four')
  const [pairCount, setPairCount] = useState(8)
  const [soundOn, setSoundOn] = useState(true)
  const [selectedHorses, setSelectedHorses] = useState<Horse[]>([])
  const [cards, setCards] = useState<GameCard[]>([])
  const [flipped, setFlipped] = useState<string[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [isBest, setIsBest] = useState(false)
  const lockRef = useRef(false)

  const buildRound = () => {
    const horses = shuffle(horseData[stableKey]).slice(0, pairCount)
    const nextCards = shuffle(
      horses.flatMap((horse) => [
        { uid: `${horse.code}-photo`, horse, kind: 'photo' as const },
        { uid: `${horse.code}-name`, horse, kind: 'name' as const },
      ]),
    )
    setSelectedHorses(horses)
    setCards(nextCards)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setElapsed(0)
    setIsBest(false)
    lockRef.current = false
    setPhase('playing')
  }

  useEffect(() => {
    if (phase !== 'playing') return
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'playing' || matched.length !== pairCount) return
    const storedBest = Number(localStorage.getItem(bestKey(stableKey, pairCount))) || 0
    const nextIsBest = storedBest === 0 || elapsed < storedBest
    if (nextIsBest) localStorage.setItem(bestKey(stableKey, pairCount), String(elapsed))
    setIsBest(nextIsBest)
    const finishDelay = window.setTimeout(() => setPhase('result'), 700)
    return () => window.clearTimeout(finishDelay)
  }, [matched, pairCount, phase, stableKey, elapsed])

  const speakName = (name: string) => {
    if (!soundOn || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(name)
    utterance.lang = 'zh-HK'
    utterance.rate = 0.82
    window.speechSynthesis.speak(utterance)
  }

  const handleFlip = (card: GameCard) => {
    if (lockRef.current || flipped.includes(card.uid) || matched.includes(card.horse.code)) return
    if (card.kind === 'name') speakName(card.horse.name)

    const nextFlipped = [...flipped, card.uid]
    setFlipped(nextFlipped)
    if (nextFlipped.length < 2) return

    setMoves((value) => value + 1)
    lockRef.current = true
    const [firstUid, secondUid] = nextFlipped
    const first = cards.find((item) => item.uid === firstUid)!
    const second = cards.find((item) => item.uid === secondUid)!
    const isMatch = first.horse.code === second.horse.code && first.kind !== second.kind

    window.setTimeout(() => {
      if (isMatch) setMatched((items) => [...items, first.horse.code])
      setFlipped([])
      lockRef.current = false
    }, isMatch ? 480 : 900)
  }

  const screen = useMemo(() => {
    if (phase === 'playing') {
      return (
        <Game
          stableKey={stableKey}
          pairCount={pairCount}
          cards={cards}
          flipped={flipped}
          matched={matched}
          moves={moves}
          elapsed={elapsed}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
          onFlip={handleFlip}
          onBack={() => setPhase('setup')}
          onRestart={buildRound}
        />
      )
    }
    if (phase === 'result') {
      return (
        <Result
          horses={selectedHorses}
          stableKey={stableKey}
          pairCount={pairCount}
          elapsed={elapsed}
          moves={moves}
          isBest={isBest}
          soundOn={soundOn}
          setSoundOn={setSoundOn}
          onReplay={buildRound}
          onSetup={() => setPhase('setup')}
        />
      )
    }
    return (
      <Setup
        stableKey={stableKey}
        setStableKey={setStableKey}
        pairCount={pairCount}
        setPairCount={setPairCount}
        onStart={buildRound}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
      />
    )
  }, [phase, stableKey, pairCount, cards, flipped, matched, moves, elapsed, soundOn, selectedHorses, isBest])

  return screen
}
