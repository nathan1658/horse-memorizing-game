import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  Flag,
  Flame,
  RotateCcw,
  Sparkles,
  Timer,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { horseData, horsePhoto, horseSilk, stables, type Horse, type StableKey } from './data'

type Phase = 'setup' | 'playing' | 'result'

type Question = {
  horse: Horse
  options: Horse[]
}

type BestRecord = {
  correct: number
  time: number
}

const difficulties = [
  { count: 6, label: '輕鬆跑', note: '6 題' },
  { count: 8, label: '標準賽', note: '8 題' },
  { count: 10, label: '冠軍賽', note: '10 題' },
] as const

const optionLetters = ['A', 'B', 'C', 'D']

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

const bestKey = (stable: StableKey, count: number) => `horse-quiz-best-${stable}-${count}`

const readBest = (stable: StableKey, count: number): BestRecord | null => {
  try {
    const stored = localStorage.getItem(bestKey(stable, count))
    if (!stored) return null
    const parsed = JSON.parse(stored) as BestRecord
    if (typeof parsed.correct !== 'number' || typeof parsed.time !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

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

function HorseImage({
  horse,
  className = '',
  hideName = false,
}: {
  horse: Horse
  className?: string
  hideName?: boolean
}) {
  const [failed, setFailed] = useState(false)

  useEffect(() => setFailed(false), [horse.code])

  if (failed) {
    return (
      <div
        className={`horse-image-fallback ${className}`}
        role="img"
        aria-label={hideName ? '待辨認馬匹相片暫未提供' : `${horse.name}相片暫未提供`}
      >
        <span>馬</span>
        <small>{horse.code}</small>
      </div>
    )
  }

  return (
    <img
      className={className}
      src={horsePhoto(horse.code)}
      alt={hideName ? '待辨認馬匹相片' : `${horse.name}馬匹相片`}
      onError={() => setFailed(true)}
    />
  )
}

type SetupProps = {
  stableKey: StableKey
  setStableKey: (key: StableKey) => void
  questionCount: number
  setQuestionCount: (count: number) => void
  onStart: () => void
  soundOn: boolean
  setSoundOn: (next: boolean) => void
}

function Setup({
  stableKey,
  setStableKey,
  questionCount,
  setQuestionCount,
  onStart,
  soundOn,
  setSoundOn,
}: SetupProps) {
  const stable = stables.find((item) => item.key === stableKey)!
  const previewHorses = horseData[stableKey].slice(0, 4)
  const best = readBest(stableKey, questionCount)

  return (
    <div className="site-shell setup-shell">
      <Header soundOn={soundOn} setSoundOn={setSoundOn} />
      <main className="setup-main">
        <section className="intro-panel">
          <p className="eyebrow"><Flag size={15} /> 今場目標：睇相認馬</p>
          <h1>眼熟，<br /><em>先係真馬迷。</em></h1>
          <p className="intro-copy">
            睇清楚馬匹相片，再從四個馬名中揀出正確答案。由兩字短名到四字名駒，逐場操熟你的馬房眼界。
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
                    className={questionCount === difficulty.count ? 'is-selected' : ''}
                    onClick={() => setQuestionCount(difficulty.count)}
                    key={difficulty.count}
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
              <span>
                {best
                  ? `最佳 ${best.correct}/${questionCount} · ${formatTime(best.time)}`
                  : '完成首場，寫下紀錄'}
              </span>
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
  questions: Question[]
  currentIndex: number
  selectedCode: string | null
  correctCount: number
  streak: number
  elapsed: number
  soundOn: boolean
  setSoundOn: (next: boolean) => void
  onAnswer: (horse: Horse) => void
  onBack: () => void
  onRestart: () => void
}

function Game({
  stableKey,
  questions,
  currentIndex,
  selectedCode,
  correctCount,
  streak,
  elapsed,
  soundOn,
  setSoundOn,
  onAnswer,
  onBack,
  onRestart,
}: GameProps) {
  const stable = stables.find((item) => item.key === stableKey)!
  const question = questions[currentIndex]
  if (!question) return null

  const answered = selectedCode !== null
  const wasCorrect = selectedCode === question.horse.code
  const progress = (currentIndex + (answered ? 1 : 0)) / questions.length

  return (
    <div className="site-shell game-shell">
      <Header soundOn={soundOn} setSoundOn={setSoundOn} compact />
      <main className="game-main">
        <div className="game-toolbar">
          <button className="text-button" type="button" onClick={onBack}>
            <ArrowLeft size={17} /> 揀馬房
          </button>
          <div className="race-progress-copy">
            <span>{stable.label} · 四選一挑戰</span>
            <strong>第 {currentIndex + 1} / {questions.length} 題</strong>
          </div>
          <button className="icon-button" type="button" onClick={onRestart} aria-label="重新開始" title="重新開始">
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="game-status">
          <div className="progress-track" aria-label={`已完成 ${currentIndex + (answered ? 1 : 0)} 題，共 ${questions.length} 題`}>
            <i style={{ transform: `scaleX(${progress})` }} />
          </div>
          <div className="stat-strip">
            <span><Check size={16} /><b>{correctCount}</b> 答中</span>
            <span><Flame size={16} /><b>{streak}</b> 連中</span>
            <span><Timer size={16} /><b>{formatTime(elapsed)}</b></span>
          </div>
        </div>

        <section className="quiz-stage" key={question.horse.code} aria-label={`第 ${currentIndex + 1} 題`}>
          <article className="horse-spotlight">
            <div className="spotlight-meta">
              <span>HORSE PHOTO · 馬匹相片</span>
              <b>Q{String(currentIndex + 1).padStart(2, '0')}</b>
            </div>
            <div className="spotlight-photo">
              <HorseImage horse={question.horse} hideName />
              <span className="photo-question-mark" aria-hidden="true">?</span>
              <div className="photo-rail" aria-hidden="true"><i /><i /><i /></div>
            </div>
            <div className="spotlight-prompt">
              <small>睇相認馬</small>
              <strong>呢匹馬叫咩名？</strong>
            </div>
          </article>

          <div className="answer-panel">
            <div className="answer-panel-heading">
              <div>
                <span>CHOOSE ONE</span>
                <h2>四選一</h2>
              </div>
              <p>揀出相片中馬匹的正確中文名</p>
            </div>

            <div className="answer-grid" role="group" aria-label="四個馬名選項">
              {question.options.map((horse, index) => {
                const isCorrect = horse.code === question.horse.code
                const isSelected = horse.code === selectedCode
                const answerClass = answered
                  ? isCorrect
                    ? 'is-correct'
                    : isSelected
                      ? 'is-wrong'
                      : 'is-dimmed'
                  : ''

                return (
                  <button
                    type="button"
                    className={`answer-option ${answerClass}`}
                    key={horse.code}
                    onClick={() => onAnswer(horse)}
                    disabled={answered}
                    aria-pressed={isSelected}
                  >
                    <span className="option-letter">{optionLetters[index]}</span>
                    <span className="option-copy">
                      <strong>{horse.name}</strong>
                      <small>{answered && isCorrect ? `${horse.code} · 評分 ${horse.rating}` : '馬名選項'}</small>
                    </span>
                    {answered && isCorrect && <Check className="answer-mark" size={21} />}
                    {answered && isSelected && !isCorrect && <X className="answer-mark" size={21} />}
                  </button>
                )
              })}
            </div>

            <div className={`answer-feedback ${answered ? (wasCorrect ? 'is-correct' : 'is-wrong') : ''}`} aria-live="polite">
              {answered ? (
                <>
                  <span className="feedback-icon">{wasCorrect ? <Check size={22} /> : <X size={22} />}</span>
                  <img src={horseSilk(question.horse.code)} alt="" />
                  <div>
                    <strong>{wasCorrect ? '好眼光！答啱喇。' : `差少少！答案係「${question.horse.name}」。`}</strong>
                    <small>{question.horse.code} · 現時評分 {question.horse.rating} · 即將進入下一題</small>
                  </div>
                </>
              ) : (
                <>
                  <Volume2 size={17} />
                  <span>答題後會讀出正確馬名</span>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

type ResultProps = {
  horses: Horse[]
  stableKey: StableKey
  questionCount: number
  correctCount: number
  bestStreak: number
  elapsed: number
  isBest: boolean
  soundOn: boolean
  setSoundOn: (next: boolean) => void
  onReplay: () => void
  onSetup: () => void
}

function Result({
  horses,
  stableKey,
  questionCount,
  correctCount,
  bestStreak,
  elapsed,
  isBest,
  soundOn,
  setSoundOn,
  onReplay,
  onSetup,
}: ResultProps) {
  const stable = stables.find((item) => item.key === stableKey)!
  const accuracy = Math.round((correctCount / questionCount) * 100)
  const perfect = correctCount === questionCount

  return (
    <div className="site-shell result-shell">
      <Header soundOn={soundOn} setSoundOn={setSoundOn} compact />
      <main className="result-main">
        <section className="finish-banner">
          <div className="finish-badge"><Trophy size={25} /></div>
          <p className="eyebrow"><Sparkles size={15} /> 衝線完成</p>
          <h1>{perfect ? '全部答中，' : `答中 ${correctCount} 匹，`}<em>{perfect ? '好眼光！' : '再跑一場！'}</em></h1>
          <p>{stable.label} · {questionCount} 題四選一挑戰</p>
          {isBest && <span className="new-record">NEW RECORD · 新紀錄</span>}
          <div className="finish-lines" aria-hidden="true"><i /><i /><i /><i /></div>
        </section>

        <section className="result-content">
          <div className="result-summary">
            <p>今場賽果</p>
            <dl>
              <div><dt>答中</dt><dd>{correctCount} / {questionCount}</dd></div>
              <div><dt>時間</dt><dd>{formatTime(elapsed)}</dd></div>
              <div><dt>最高連中</dt><dd>{bestStreak}</dd></div>
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
              <span>今場出題馬匹</span>
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
  const [questionCount, setQuestionCount] = useState(8)
  const [soundOn, setSoundOn] = useState(true)
  const [selectedHorses, setSelectedHorses] = useState<Horse[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [finalTime, setFinalTime] = useState(0)
  const [finalCorrect, setFinalCorrect] = useState(0)
  const [isBest, setIsBest] = useState(false)
  const nextQuestionTimer = useRef<number | null>(null)

  const clearNextQuestionTimer = () => {
    if (nextQuestionTimer.current !== null) {
      window.clearTimeout(nextQuestionTimer.current)
      nextQuestionTimer.current = null
    }
  }

  const buildRound = () => {
    clearNextQuestionTimer()
    const allHorses = horseData[stableKey]
    const horses = shuffle(allHorses).slice(0, questionCount)
    const nextQuestions = horses.map((horse) => {
      const distractors = shuffle(allHorses.filter((item) => item.code !== horse.code)).slice(0, 3)
      return { horse, options: shuffle([horse, ...distractors]) }
    })

    setSelectedHorses(horses)
    setQuestions(nextQuestions)
    setCurrentIndex(0)
    setSelectedCode(null)
    setCorrectCount(0)
    setStreak(0)
    setBestStreak(0)
    setElapsed(0)
    setFinalTime(0)
    setFinalCorrect(0)
    setIsBest(false)
    setPhase('playing')
  }

  useEffect(() => {
    if (phase !== 'playing') return
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [phase])

  useEffect(() => () => clearNextQuestionTimer(), [])

  const speakName = (name: string) => {
    if (!soundOn || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(name)
    utterance.lang = 'zh-HK'
    utterance.rate = 0.82
    window.speechSynthesis.speak(utterance)
  }

  const saveResult = (score: number, time: number) => {
    const currentBest = readBest(stableKey, questionCount)
    const nextIsBest = !currentBest
      || score > currentBest.correct
      || (score === currentBest.correct && time < currentBest.time)

    if (nextIsBest) {
      localStorage.setItem(bestKey(stableKey, questionCount), JSON.stringify({ correct: score, time }))
    }
    setFinalCorrect(score)
    setFinalTime(time)
    setIsBest(nextIsBest)
  }

  const handleAnswer = (answer: Horse) => {
    if (selectedCode !== null) return
    const question = questions[currentIndex]
    if (!question) return

    const correct = answer.code === question.horse.code
    const nextCorrectCount = correctCount + (correct ? 1 : 0)
    setSelectedCode(answer.code)
    speakName(question.horse.name)

    if (correct) {
      const nextStreak = streak + 1
      setCorrectCount(nextCorrectCount)
      setStreak(nextStreak)
      setBestStreak((value) => Math.max(value, nextStreak))
    } else {
      setStreak(0)
    }

    const isLastQuestion = currentIndex === questions.length - 1
    if (isLastQuestion) saveResult(nextCorrectCount, elapsed)

    nextQuestionTimer.current = window.setTimeout(() => {
      if (isLastQuestion) {
        setPhase('result')
      } else {
        setCurrentIndex((value) => value + 1)
        setSelectedCode(null)
      }
      nextQuestionTimer.current = null
    }, 1250)
  }

  const returnToSetup = () => {
    clearNextQuestionTimer()
    setPhase('setup')
  }

  if (phase === 'playing') {
    return (
      <Game
        stableKey={stableKey}
        questions={questions}
        currentIndex={currentIndex}
        selectedCode={selectedCode}
        correctCount={correctCount}
        streak={streak}
        elapsed={elapsed}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
        onAnswer={handleAnswer}
        onBack={returnToSetup}
        onRestart={buildRound}
      />
    )
  }

  if (phase === 'result') {
    return (
      <Result
        horses={selectedHorses}
        stableKey={stableKey}
        questionCount={questionCount}
        correctCount={finalCorrect}
        bestStreak={bestStreak}
        elapsed={finalTime}
        isBest={isBest}
        soundOn={soundOn}
        setSoundOn={setSoundOn}
        onReplay={buildRound}
        onSetup={returnToSetup}
      />
    )
  }

  return (
    <Setup
      stableKey={stableKey}
      setStableKey={setStableKey}
      questionCount={questionCount}
      setQuestionCount={setQuestionCount}
      onStart={buildRound}
      soundOn={soundOn}
      setSoundOn={setSoundOn}
    />
  )
}
