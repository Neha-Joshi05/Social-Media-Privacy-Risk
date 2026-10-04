import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function WeaknessCard({ weakness, index }) {
  const color = weakness.risk >= 0.9 ? '#ff1744'
    : weakness.risk >= 0.7 ? '#ff9100' : '#ffd600'
  return (
    <motion.div initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
      transition={{ delay: index*0.05 }}
      style={{ background:'#0c0d18', border:`1px solid ${color}30`,
        borderRadius:10, padding:'12px 14px', marginBottom:8 }}>
      <div style={{ display:'flex', gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:7, flexShrink:0,
          background:`${color}15`, border:`1px solid ${color}40`,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <AlertTriangle size={14} color={color}/>
        </div>
        <div>
          <div style={{ fontSize:10, color, marginBottom:3,
            fontFamily:"'JetBrains Mono',monospace",
            letterSpacing:0.5 }}>{weakness.category}</div>
          <div style={{ fontSize:12, color:'#dde0f0',
            marginBottom:5, lineHeight:1.5 }}>{weakness.question}</div>
          <div style={{ fontSize:11, color:'#5a5c7a',
            fontStyle:'italic' }}>
            Your answer: <span style={{ color }}>{weakness.answer}</span>
          </div>
          <div style={{ fontSize:11, color:'#a78bfa', marginTop:5 }}>
            💡 {weakness.tip}
          </div>
        </div>
      </div>
    </motion.div>
  )
}