import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ClipboardList, BarChart2, ChevronRight } from 'lucide-react'
import AssessPage from './pages/AssessPage'
import ResultPage from './pages/ResultPage'
import DemoPage   from './pages/DemoPage'

const NAV = [
  { id:'assess', label:'Assessment', icon:ClipboardList },
  { id:'demo',   label:'Demo Data',  icon:BarChart2 },
]

export default function App() {
  const [page,   setPage]   = useState('assess')
  const [result, setResult] = useState(null)

  const handleResult = (r) => { setResult(r); setPage('result') }
  const handleReset  = ()  => { setResult(null); setPage('assess') }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>

      {/* Header */}
      <header style={{ background:'#0c0d18',
        borderBottom:'1px solid #1e2038',
        padding:'0 20px', height:56,
        display:'flex', alignItems:'center',
        justifyContent:'space-between',
        position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8,
            background:'linear-gradient(135deg,#a78bfa,#00cfff)',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Shield size={17} color="#fff"/>
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:600,
              color:'#dde0f0', lineHeight:1 }}>PrivacyGuard</div>
            <div style={{ fontSize:9, color:'#3a3c5a',
              fontFamily:"'JetBrains Mono',monospace",
              letterSpacing:1 }}>SOCIAL MEDIA RISK ASSESSMENT</div>
          </div>
        </div>
        <nav style={{ display:'flex', gap:4 }}>
          {NAV.map(n => {
            const active = page === n.id
            return (
              <motion.button key={n.id}
                whileHover={{ scale:1.03 }}
                whileTap={{ scale:0.97 }}
                onClick={() => { setPage(n.id); setResult(null) }}
                style={{ display:'flex', alignItems:'center', gap:6,
                  padding:'6px 12px', borderRadius:8, cursor:'pointer',
                  border: active
                    ? '1px solid #a78bfa40' : '1px solid transparent',
                  background: active ? '#a78bfa15' : 'transparent',
                  color: active ? '#a78bfa' : '#5a5c7a',
                  fontSize:12, fontWeight:500 }}>
                <n.icon size={13}/>
                {n.label}
                {active && <ChevronRight size={11}/>}
              </motion.button>
            )
          })}
        </nav>
      </header>

      <main style={{ flex:1, padding:'24px 20px',
        maxWidth:960, margin:'0 auto', width:'100%' }}>
        <AnimatePresence mode="wait">
          <motion.div key={page+String(!!result)}
            initial={{ opacity:0, y:8 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-8 }}
            transition={{ duration:0.2 }}>
            {page==='assess' && !result &&
              <AssessPage onResult={handleResult}/>}
            {page==='result' && result &&
              <ResultPage result={result} onReset={handleReset}/>}
            {page==='demo' && <DemoPage/>}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}