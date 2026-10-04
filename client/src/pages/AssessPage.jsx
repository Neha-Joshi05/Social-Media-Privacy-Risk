import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Shield, CheckCircle } from 'lucide-react'
import { getQuestions, submitAssess } from '../utils/api'
import QuestionCard from '../components/QuestionCard'

const PLATFORMS = ['Instagram','Facebook','Twitter/X','LinkedIn',
  'Snapchat','TikTok','YouTube','General']

const CAT_COLORS = {
  A:'#a78bfa', B:'#00cfff', C:'#ff9100', D:'#5b8fff',
  E:'#f472b6', F:'#ffd600', G:'#00e676', H:'#ff1744',
  I:'#f5c518', J:'#a3e635'
}

export default function AssessPage({ onResult }) {
  const [questions,  setQuestions]  = useState([])
  const [categories, setCategories] = useState({})
  const [answers,    setAnswers]    = useState({})
  const [catIdx,     setCatIdx]     = useState(0)
  const [platform,   setPlatform]   = useState('General')
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [started,    setStarted]    = useState(false)

  useEffect(() => {
    getQuestions().then(r => {
      setQuestions(r.data.questions)
      setCategories(r.data.categories)
    }).finally(() => setLoading(false))
  }, [])

  const catKeys   = Object.keys(categories)
  const curCatKey = catKeys[catIdx]
  const curCat    = categories[curCatKey]
  const curQs     = questions.filter(q => q.cat === curCatKey)
  const answered  = curQs.filter(q => answers[q.id] !== undefined).length
  const allDone   = questions.every(q => answers[q.id] !== undefined)
  const totalAnswered = Object.keys(answers).length

  const handleSelect = (id, val) => {
    setAnswers(prev => ({ ...prev, [id]: val }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const { data } = await submitAssess({ answers, platform })
      onResult(data)
    } catch {
      alert('Submission failed — is backend running?')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div style={{ textAlign:'center', padding:60,
      color:'#5a5c7a', fontFamily:"'JetBrains Mono',monospace" }}>
      Loading assessment...
    </div>
  )

  if (!started) return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      style={{ maxWidth:600, margin:'0 auto', textAlign:'center',
        padding:'40px 20px' }}>
      <div style={{ width:64, height:64, borderRadius:16, margin:'0 auto 20px',
        background:'linear-gradient(135deg,#a78bfa,#00cfff)',
        display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Shield size={30} color="#fff"/>
      </div>
      <h2 style={{ fontSize:24, fontWeight:700, color:'#dde0f0', marginBottom:8 }}>
        Privacy Risk Assessment
      </h2>
      <p style={{ fontSize:13, color:'#5a5c7a', lineHeight:1.7, marginBottom:24 }}>
        Answer 40 questions about your social media behavior to get a
        personalized privacy risk score and actionable recommendations.
        <br/><br/>
        <span style={{ color:'#a78bfa' }}>⚠️ Educational use only.</span>
        {' '}This is a self-assessment tool — no data is stored or shared.
      </p>

      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:'#5a5c7a', marginBottom:8,
          fontFamily:"'JetBrains Mono',monospace", letterSpacing:1 }}>
          SELECT PLATFORM
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6,
          justifyContent:'center' }}>
          {PLATFORMS.map(p => (
            <motion.button key={p}
              whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
              onClick={() => setPlatform(p)}
              style={{
                padding:'6px 14px', borderRadius:7, cursor:'pointer',
                border: platform===p
                  ? '1px solid #a78bfa' : '1px solid #1e2038',
                background: platform===p ? '#a78bfa18' : '#0c0d18',
                color: platform===p ? '#a78bfa' : '#5a5c7a',
                fontSize:12, fontFamily:"'JetBrains Mono',monospace"
              }}>{p}</motion.button>
          ))}
        </div>
      </div>

      <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
        onClick={() => setStarted(true)}
        style={{ padding:'12px 32px', borderRadius:10, border:'none',
          background:'linear-gradient(135deg,#a78bfa,#5b8fff)',
          color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer' }}>
        Start Assessment →
      </motion.button>
    </motion.div>
  )

  return (
    <div style={{ maxWidth:700, margin:'0 auto' }}>

      {/* Progress header */}
      <div style={{ background:'#0c0d18', border:'1px solid #1e2038',
        borderRadius:12, padding:'14px 16px', marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between',
          alignItems:'center', marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:10, height:10, borderRadius:'50%',
              background: CAT_COLORS[curCatKey] || '#5a5c7a' }}/>
            <span style={{ fontSize:13, fontWeight:500, color:'#dde0f0' }}>
              {curCat?.name}
            </span>
          </div>
          <span style={{ fontSize:11, color:'#5a5c7a',
            fontFamily:"'JetBrains Mono',monospace" }}>
            {totalAnswered} / {questions.length} answered
          </span>
        </div>

        {/* Category tabs */}
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {catKeys.map((k, i) => {
            const catQs   = questions.filter(q => q.cat === k)
            const catDone = catQs.filter(q => answers[q.id] !== undefined).length
            const done    = catDone === catQs.length
            return (
              <motion.button key={k}
                whileTap={{ scale:0.95 }}
                onClick={() => setCatIdx(i)}
                style={{
                  padding:'4px 10px', borderRadius:6, cursor:'pointer',
                  border: i===catIdx
                    ? `1px solid ${CAT_COLORS[k]}` : '1px solid #1e2038',
                  background: i===catIdx
                    ? `${CAT_COLORS[k]}18` : '#11121e',
                  color: done ? CAT_COLORS[k]
                    : i===catIdx ? CAT_COLORS[k] : '#3a3c5a',
                  fontSize:10, fontFamily:"'JetBrains Mono',monospace"
                }}>
                {k} {done ? '✓' : ''}
              </motion.button>
            )
          })}
        </div>

        {/* Overall progress bar */}
        <div style={{ height:3, background:'#1e2038',
          borderRadius:2, overflow:'hidden', marginTop:10 }}>
          <motion.div
            animate={{ width:`${(totalAnswered/questions.length)*100}%` }}
            style={{ height:'100%', borderRadius:2,
              background:'linear-gradient(90deg,#a78bfa,#00cfff)' }}/>
        </div>
      </div>

      {/* Questions */}
      <AnimatePresence mode="wait">
        <motion.div key={curCatKey}
          initial={{ opacity:0, x:20 }}
          animate={{ opacity:1, x:0 }}
          exit={{ opacity:0, x:-20 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {curQs.map((q, i) => (
              <QuestionCard key={q.id} question={q}
                index={questions.indexOf(q)}
                total={questions.length}
                selected={answers[q.id]}
                onSelect={handleSelect}/>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div style={{ display:'flex', justifyContent:'space-between',
        alignItems:'center', marginTop:16 }}>
        <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
          onClick={() => setCatIdx(Math.max(0, catIdx-1))}
          disabled={catIdx===0}
          style={{ padding:'8px 16px', borderRadius:8, cursor:'pointer',
            border:'1px solid #1e2038', background:'#0c0d18',
            color: catIdx===0 ? '#3a3c5a' : '#dde0f0',
            display:'flex', alignItems:'center', gap:5, fontSize:12 }}>
          <ChevronLeft size={14}/> Previous
        </motion.button>

        {catIdx < catKeys.length-1 ? (
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onClick={() => setCatIdx(catIdx+1)}
            style={{ padding:'8px 16px', borderRadius:8, cursor:'pointer',
              border:`1px solid ${CAT_COLORS[curCatKey]}`,
              background:`${CAT_COLORS[curCatKey]}18`,
              color: CAT_COLORS[curCatKey],
              display:'flex', alignItems:'center', gap:5, fontSize:12 }}>
            Next <ChevronRight size={14}/>
          </motion.button>
        ) : (
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
            onClick={handleSubmit}
            disabled={submitting || totalAnswered < 20}
            style={{ padding:'10px 24px', borderRadius:8, cursor:'pointer',
              border:'none',
              background: totalAnswered >= 20
                ? 'linear-gradient(135deg,#a78bfa,#5b8fff)'
                : '#1e2038',
              color: totalAnswered >= 20 ? '#fff' : '#3a3c5a',
              display:'flex', alignItems:'center', gap:5,
              fontSize:13, fontWeight:600 }}>
            {submitting ? 'Analyzing...' : <><CheckCircle size={14}/> Get My Risk Score</>}
          </motion.button>
        )}
      </div>

      {totalAnswered < 20 && catIdx===catKeys.length-1 && (
        <p style={{ textAlign:'center', fontSize:11, color:'#5a5c7a',
          marginTop:8, fontFamily:"'JetBrains Mono',monospace" }}>
          Answer at least 20 questions to submit
        </p>
      )}
    </div>
  )
}