import { motion } from 'framer-motion'

const CAT_COLORS = {
  A:'#a78bfa', B:'#00cfff', C:'#ff9100', D:'#5b8fff',
  E:'#f472b6', F:'#ffd600', G:'#00e676', H:'#ff1744',
  I:'#f5c518', J:'#a3e635'
}

export default function QuestionCard({ question, index, total,
  selected, onSelect }) {
  const color = CAT_COLORS[question.cat] || '#5a5c7a'
  return (
    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
      style={{ background:'#0c0d18', border:`1px solid ${color}30`,
        borderRadius:14, padding:'20px' }}>

      <div style={{ display:'flex', alignItems:'center',
        gap:8, marginBottom:14 }}>
        <span style={{ fontSize:10, padding:'2px 8px', borderRadius:5,
          background:`${color}20`, border:`1px solid ${color}40`,
          color, fontFamily:"'JetBrains Mono',monospace",
          letterSpacing:1 }}>
          {question.id}
        </span>
        <span style={{ fontSize:10, color:'#3a3c5a',
          fontFamily:"'JetBrains Mono',monospace" }}>
          {index+1} of {total}
        </span>
      </div>

      <p style={{ fontSize:14, color:'#dde0f0', lineHeight:1.7,
        marginBottom:16 }}>{question.text}</p>

      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {question.options.map((opt, i) => {
          const isSelected = selected === i
          return (
            <motion.button key={i}
              whileHover={{ scale:1.01 }} whileTap={{ scale:0.99 }}
              onClick={() => onSelect(question.id, i)}
              style={{
                padding:'10px 14px', borderRadius:8,
                border: isSelected
                  ? `1px solid ${color}` : '1px solid #1e2038',
                background: isSelected ? `${color}18` : '#11121e',
                color: isSelected ? color : '#5a5c7a',
                fontSize:12, textAlign:'left', cursor:'pointer',
                fontFamily:"'JetBrains Mono',monospace",
                transition:'all 0.15s'
              }}>
              <span style={{ marginRight:8, opacity:0.5 }}>
                {['A','B','C','D'][i]}
              </span>
              {opt}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}