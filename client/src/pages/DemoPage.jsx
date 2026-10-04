import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RadarChart, Radar, PolarGrid,
         PolarAngleAxis, ResponsiveContainer,
         BarChart, Bar, XAxis, YAxis,
         Cell, Tooltip } from 'recharts'
import { getDemo } from '../utils/api'
import ScoreGauge from '../components/ScoreGauge'
import RiskBadge  from '../components/RiskBadge'
import { getRiskColor } from '../utils/helpers'

export default function DemoPage() {
  const [profiles, setProfiles] = useState([])
  const [selected, setSelected] = useState(0)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getDemo().then(r => setProfiles(r.data.profiles))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ textAlign:'center', padding:60,
      color:'#5a5c7a', fontFamily:"'JetBrains Mono',monospace" }}>
      Loading demo profiles...
    </div>
  )

  const profile = profiles[selected]
  if (!profile) return null

  const radarData = Object.values(profile.categories).map(c => ({
    subject: c.name.split(' ')[0], score: c.score
  }))

  const barData = Object.values(profile.categories).map(c => ({
    name: c.name.split(' ').slice(0,2).join(' '),
    score: c.score, color: c.color
  }))

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:20, fontWeight:600,
          color:'#dde0f0', marginBottom:4 }}>Demo Profiles</h1>
        <p style={{ fontSize:12, color:'#5a5c7a',
          fontFamily:"'JetBrains Mono',monospace" }}>
          Synthetic fictional profiles showing how different
          privacy behaviors affect risk scores
        </p>
      </div>

      {/* Profile selector */}
      <div style={{ display:'flex', gap:8, marginBottom:16,
        flexWrap:'wrap' }}>
        {profiles.map((p, i) => {
          const color = getRiskColor(p.level)
          return (
            <motion.button key={i}
              whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
              onClick={() => setSelected(i)}
              style={{ padding:'8px 16px', borderRadius:9, cursor:'pointer',
                border: selected===i
                  ? `1px solid ${color}` : '1px solid #1e2038',
                background: selected===i ? `${color}15` : '#0c0d18',
                color: selected===i ? color : '#5a5c7a',
                fontSize:12, fontFamily:"'JetBrains Mono',monospace"
              }}>{p.name}</motion.button>
          )
        })}
      </div>

      {/* Profile detail */}
      <div style={{ background:'#0c0d18', border:'1px solid #1e2038',
        borderRadius:14, padding:'20px', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center',
          gap:20, flexWrap:'wrap' }}>
          <ScoreGauge score={profile.score} level={profile.level}/>
          <div>
            <h2 style={{ fontSize:18, fontWeight:600,
              color:'#dde0f0', marginBottom:6 }}>{profile.name}</h2>
            <div style={{ display:'flex', gap:8,
              alignItems:'center', marginBottom:8 }}>
              <RiskBadge level={profile.level} size="lg"/>
              <span style={{ fontSize:11, color:'#5a5c7a',
                fontFamily:"'JetBrains Mono',monospace" }}>
                {profile.platform}
              </span>
            </div>
            <p style={{ fontSize:12, color:'#5a5c7a',
              lineHeight:1.6, maxWidth:400 }}>
              {profile.level==='CRITICAL' &&
                'This profile shares too much publicly and has weak account security.'}
              {profile.level==='HIGH' &&
                'This profile has several significant privacy gaps to address.'}
              {profile.level==='MODERATE' &&
                'This profile has some privacy risks but also good practices.'}
              {profile.level==='LOW' &&
                'This profile demonstrates strong privacy practices overall.'}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
        gap:12 }}>
        <div style={{ background:'#0c0d18', border:'1px solid #1e2038',
          borderRadius:14, padding:'16px' }}>
          <div style={{ fontSize:10, color:'#3a3c5a', letterSpacing:1.5,
            textTransform:'uppercase', marginBottom:12,
            fontFamily:"'JetBrains Mono',monospace" }}>
            Risk by Category
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="name"
                tick={{ fill:'#3a3c5a', fontSize:9 }}
                axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:'#3a3c5a', fontSize:9 }}
                axisLine={false} tickLine={false} domain={[0,100]}/>
              <Tooltip contentStyle={{ background:'#0c0d18',
                border:'1px solid #1e2038', borderRadius:8,
                color:'#dde0f0' }}/>
              <Bar dataKey="score" radius={[4,4,0,0]}>
                {barData.map((d, i) => (
                  <Cell key={i} fill={d.color}
                    style={{ filter:`drop-shadow(0 0 4px ${d.color})` }}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background:'#0c0d18', border:'1px solid #1e2038',
          borderRadius:14, padding:'16px' }}>
          <div style={{ fontSize:10, color:'#3a3c5a', letterSpacing:1.5,
            textTransform:'uppercase', marginBottom:12,
            fontFamily:"'JetBrains Mono',monospace" }}>
            Privacy Radar
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e2038"/>
              <PolarAngleAxis dataKey="subject"
                tick={{ fill:'#5a5c7a', fontSize:9 }}/>
              <Radar dataKey="score"
                stroke={getRiskColor(profile.level)}
                fill={getRiskColor(profile.level)}
                fillOpacity={0.15}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}