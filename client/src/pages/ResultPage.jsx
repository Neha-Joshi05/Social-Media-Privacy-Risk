import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle,
         RotateCcw, Download } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis,
         ResponsiveContainer } from 'recharts'
import ScoreGauge   from '../components/ScoreGauge'
import RiskBadge    from '../components/RiskBadge'
import CategoryBar  from '../components/CategoryBar'
import WeaknessCard from '../components/WeaknessCard'
import { getRiskColor, getRiskBg, getRiskBorder } from '../utils/helpers'

export default function ResultPage({ result, onReset }) {
  const color  = getRiskColor(result.level)
  const bg     = getRiskBg(result.level)
  const border = getRiskBorder(result.level)

  const radarData = Object.values(result.categories).map(c => ({
    subject: c.name.split(' ')[0],
    score:   c.score,
    fullMark: 100
  }))

  const handleDownload = () => {
    const lines = [
      '=== SOCIAL MEDIA PRIVACY RISK REPORT ===',
      `Date: ${new Date(result.timestamp).toLocaleString()}`,
      `Platform: ${result.platform}`,
      `Risk Score: ${result.score}/100`,
      `Risk Level: ${result.level}`,
      '',
      '--- CATEGORY SCORES ---',
      ...Object.values(result.categories).map(c =>
        `${c.name}: ${c.score}/100 (${c.level})`),
      '',
      '--- TOP WEAKNESSES ---',
      ...result.weaknesses.map((w, i) =>
        `${i+1}. [${w.category}] ${w.question}\n   Answer: ${w.answer}\n   Tip: ${w.tip}`),
      '',
      '--- RECOMMENDATIONS ---',
      ...result.recommendations.map((r, i) => `${i+1}. ${r}`),
      '',
      '--- PRIVACY CHECKLIST ---',
      ...result.checklist.map(c => `[ ] ${c.item}`),
      '',
      'DISCLAIMER: This is an educational self-assessment tool.',
      'It does not guarantee account security or privacy.',
    ]
    const blob = new Blob([lines.join('\n')], { type:'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'privacy-risk-report.txt'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>

      {/* Score header */}
      <motion.div
        animate={{ borderColor: border, boxShadow:`0 0 32px ${color}15` }}
        style={{ background:'#0c0d18', border:'1px solid',
          borderRadius:16, padding:'24px', marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center',
          gap:24, flexWrap:'wrap' }}>
          <ScoreGauge score={result.score} level={result.level} size={150}/>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center',
              gap:10, marginBottom:8 }}>
              <RiskBadge level={result.level} size="lg"/>
              <span style={{ fontSize:12, color:'#5a5c7a',
                fontFamily:"'JetBrains Mono',monospace" }}>
                {result.platform} · {result.answeredCount} questions answered
              </span>
            </div>
            <p style={{ fontSize:13, color:'#5a5c7a', lineHeight:1.7,
              marginBottom:12 }}>
              {result.level === 'CRITICAL' &&
                '🚨 Your privacy is severely exposed. Immediate action required.'}
              {result.level === 'HIGH' &&
                '⚠️ Significant privacy risks detected. Take action soon.'}
              {result.level === 'MODERATE' &&
                '⚡ Some privacy risks found. Review recommendations below.'}
              {result.level === 'LOW' &&
                '✅ Good privacy practices detected. Keep it up!'}
            </p>
            <div style={{ display:'flex', gap:8 }}>
              <motion.button whileHover={{ scale:1.03 }}
                whileTap={{ scale:0.97 }} onClick={onReset}
                style={{ padding:'7px 14px', borderRadius:8,
                  border:'1px solid #1e2038', background:'#11121e',
                  color:'#5a5c7a', cursor:'pointer',
                  display:'flex', alignItems:'center', gap:5,
                  fontSize:12 }}>
                <RotateCcw size={12}/> Retake
              </motion.button>
              <motion.button whileHover={{ scale:1.03 }}
                whileTap={{ scale:0.97 }} onClick={handleDownload}
                style={{ padding:'7px 14px', borderRadius:8,
                  border:'1px solid #a78bfa40',
                  background:'#a78bfa15', color:'#a78bfa',
                  cursor:'pointer',
                  display:'flex', alignItems:'center', gap:5,
                  fontSize:12 }}>
                <Download size={12}/> Download Report
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category scores + radar */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
        gap:12, marginBottom:14 }}>

        <div style={{ background:'#0c0d18', border:'1px solid #1e2038',
          borderRadius:14, padding:'16px' }}>
          <div style={{ fontSize:10, color:'#3a3c5a', letterSpacing:1.5,
            textTransform:'uppercase', marginBottom:12,
            fontFamily:"'JetBrains Mono',monospace" }}>
            Category Scores
          </div>
          {Object.values(result.categories).map((c, i) => (
            <CategoryBar key={i} name={c.name} score={c.score}
              level={c.level} color={c.color}/>
          ))}
        </div>

        <div style={{ background:'#0c0d18', border:'1px solid #1e2038',
          borderRadius:14, padding:'16px' }}>
          <div style={{ fontSize:10, color:'#3a3c5a', letterSpacing:1.5,
            textTransform:'uppercase', marginBottom:12,
            fontFamily:"'JetBrains Mono',monospace" }}>
            Risk Radar
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e2038"/>
              <PolarAngleAxis dataKey="subject"
                tick={{ fill:'#5a5c7a', fontSize:9 }}/>
              <Radar dataKey="score" stroke={color} fill={color}
                fillOpacity={0.15}
                style={{ filter:`drop-shadow(0 0 6px ${color})` }}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weaknesses + Recommendations */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
        gap:12, marginBottom:14 }}>

        <div style={{ background:'#0c0d18', border:'1px solid #1e2038',
          borderRadius:14, padding:'16px' }}>
          <div style={{ fontSize:10, color:'#3a3c5a', letterSpacing:1.5,
            textTransform:'uppercase', marginBottom:12,
            fontFamily:"'JetBrains Mono',monospace" }}>
            Top Privacy Weaknesses ({result.weaknesses.length})
          </div>
          <div style={{ maxHeight:360, overflowY:'auto' }}>
            {result.weaknesses.length === 0 ? (
              <div style={{ display:'flex', alignItems:'center',
                gap:8, color:'#00e676', fontSize:12 }}>
                <CheckCircle size={16}/> No major weaknesses detected!
              </div>
            ) : result.weaknesses.map((w, i) => (
              <WeaknessCard key={i} weakness={w} index={i}/>
            ))}
          </div>
        </div>

        <div style={{ background:'#0c0d18', border:'1px solid #1e2038',
          borderRadius:14, padding:'16px' }}>
          <div style={{ fontSize:10, color:'#3a3c5a', letterSpacing:1.5,
            textTransform:'uppercase', marginBottom:12,
            fontFamily:"'JetBrains Mono',monospace" }}>
            Recommendations
          </div>
          <div style={{ maxHeight:200, overflowY:'auto', marginBottom:14 }}>
            {result.recommendations.map((r, i) => (
              <motion.div key={i}
                initial={{ opacity:0, x:-6 }}
                animate={{ opacity:1, x:0 }}
                transition={{ delay:i*0.05 }}
                style={{ display:'flex', gap:8, padding:'6px 0',
                  borderBottom:'1px solid #0f101a', fontSize:12 }}>
                <span style={{ color:'#a78bfa', flexShrink:0 }}>▸</span>
                <span style={{ color:'#dde0f0', lineHeight:1.5 }}>{r}</span>
              </motion.div>
            ))}
          </div>

          <div style={{ fontSize:10, color:'#3a3c5a', letterSpacing:1.5,
            textTransform:'uppercase', marginBottom:10,
            fontFamily:"'JetBrains Mono',monospace" }}>
            Privacy Checklist
          </div>
          <div style={{ maxHeight:160, overflowY:'auto' }}>
            {result.checklist.map((c, i) => (
              <div key={i} style={{ display:'flex', gap:8,
                padding:'5px 0', borderBottom:'1px solid #0f101a',
                fontSize:11 }}>
                <span style={{ color:'#1e2038' }}>☐</span>
                <span style={{ color:'#5a5c7a' }}>{c.item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background:'#0c0d18', border:'1px solid #1e2038',
        borderRadius:10, padding:'12px 16px', fontSize:11,
        color:'#3a3c5a', textAlign:'center',
        fontFamily:"'JetBrains Mono',monospace" }}>
        ⚠️ Educational self-assessment only — results do not guarantee
        account security or privacy. Consult a cybersecurity professional
        for comprehensive audits.
      </div>
    </motion.div>
  )
}