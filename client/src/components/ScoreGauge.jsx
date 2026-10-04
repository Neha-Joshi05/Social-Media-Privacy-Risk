import { motion } from 'framer-motion'
import { getRiskColor } from '../utils/helpers'

export default function ScoreGauge({ score, level, size=140 }) {
  const color = getRiskColor(level)
  const r = size*0.38
  const circ = 2*Math.PI*r
  const offset = circ - (score/100)*circ
  return (
    <div style={{ position:'relative', width:size, height:size,
      display:'flex', alignItems:'center', justifyContent:'center' }}>
      <svg width={size} height={size}
        style={{ position:'absolute', transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke="#1e2038" strokeWidth={10}/>
        <motion.circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circ}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration:1.2, ease:'easeOut' }}
          style={{ filter:`drop-shadow(0 0 8px ${color})` }}/>
      </svg>
      <div style={{ textAlign:'center', zIndex:1 }}>
        <motion.div animate={{ color }}
          style={{ fontSize: size>120?38:26, fontWeight:700,
            fontFamily:"'JetBrains Mono',monospace", lineHeight:1 }}>
          {score}
        </motion.div>
        <div style={{ fontSize:9, color:'#5a5c7a',
          fontFamily:"'JetBrains Mono',monospace",
          letterSpacing:1, marginTop:2 }}>RISK SCORE</div>
      </div>
    </div>
  )
}