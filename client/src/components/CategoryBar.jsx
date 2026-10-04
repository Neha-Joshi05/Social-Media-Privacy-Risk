import { motion } from 'framer-motion'
import RiskBadge from './RiskBadge'

export default function CategoryBar({ name, score, level, color }) {
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:'flex', justifyContent:'space-between',
        alignItems:'center', marginBottom:5 }}>
        <span style={{ fontSize:12, color:'#dde0f0' }}>{name}</span>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:11, color,
            fontFamily:"'JetBrains Mono',monospace" }}>{score}</span>
          <RiskBadge level={level}/>
        </div>
      </div>
      <div style={{ height:5, background:'#1e2038',
        borderRadius:3, overflow:'hidden' }}>
        <motion.div
          animate={{ width:`${score}%`, background:color }}
          transition={{ duration:0.8 }}
          style={{ height:'100%', borderRadius:3,
            boxShadow:`0 0 8px ${color}60` }}/>
      </div>
    </div>
  )
}