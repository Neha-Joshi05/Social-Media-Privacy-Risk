import { motion } from 'framer-motion'
import { getRiskColor, getRiskBg, getRiskEmoji } from '../utils/helpers'

export default function RiskBadge({ level, size='sm' }) {
  const color = getRiskColor(level)
  const bg    = getRiskBg(level)
  return (
    <motion.span animate={{ color, background: bg, borderColor: color }}
      style={{
        display:'inline-flex', alignItems:'center', gap:5,
        padding: size==='lg' ? '7px 16px' : '3px 10px',
        borderRadius:7, border:'1px solid',
        fontSize: size==='lg' ? 14 : 11,
        fontWeight:700, fontFamily:"'JetBrains Mono',monospace",
        letterSpacing:0.5
      }}>
      {getRiskEmoji(level)} {level || 'UNKNOWN'}
    </motion.span>
  )
}