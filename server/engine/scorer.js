// ============================================
// scorer.js — Privacy Risk Scoring Engine
// Weighted category scoring → 0–100 risk score
// ============================================
const { QUESTIONS, CATEGORIES } = require('./questions')

function classify(score) {
  if (score >= 71) return 'CRITICAL'
  if (score >= 41) return 'HIGH'
  if (score >= 21) return 'MODERATE'
  return 'LOW'
}

function getRiskColor(level) {
  const colors = {
    LOW:      '#00e676',
    MODERATE: '#ffd600',
    HIGH:     '#ff9100',
    CRITICAL: '#ff1744'
  }
  return colors[level] || '#5a5c7a'
}

function getWeaknesses(answers, questions) {
  const weaknesses = []
  questions.forEach(q => {
    const ans = answers[q.id]
    if (ans === undefined) return
    const riskVal = q.risk[ans]
    if (riskVal >= 0.7) {
      weaknesses.push({
        category: CATEGORIES[q.cat].name,
        question: q.text,
        answer:   q.options[ans],
        risk:     riskVal,
        tip:      q.tip
      })
    }
  })
  return weaknesses.sort((a, b) => b.risk - a.risk)
}

function getRecommendations(weaknesses, level) {
  const recs = []

  if (level === 'CRITICAL' || level === 'HIGH') {
    recs.push('🚨 URGENT: Enable MFA on all social accounts immediately')
    recs.push('🔐 Change all social media passwords to strong unique ones today')
    recs.push('🔒 Set all profiles to Private or Friends Only right now')
    recs.push('📍 Disable location sharing on all social apps')
  }

  weaknesses.slice(0, 8).forEach(w => {
    if (!recs.includes(w.tip)) recs.push(w.tip)
  })

  recs.push('📋 Download your data from each platform to audit what is stored')
  recs.push('🔍 Search your name on Google to check your public footprint')
  recs.push('📱 Review all connected third-party apps and revoke unused access')

  return [...new Set(recs)].slice(0, 12)
}

function getChecklist(level) {
  const base = [
    { item: 'Enable MFA on all accounts',              done: false },
    { item: 'Use unique passwords for each platform',  done: false },
    { item: 'Set profile visibility to Friends/Private', done: false },
    { item: 'Disable search by phone/email',           done: false },
    { item: 'Enable tag review and approval',          done: false },
    { item: 'Review connected third-party apps',       done: false },
    { item: 'Disable real-time location sharing',      done: false },
    { item: 'Enable login alerts',                     done: false },
    { item: 'Audit old posts and delete sensitive ones', done: false },
    { item: 'Check search engine indexing settings',   done: false },
    { item: 'Delete inactive social media accounts',   done: false },
    { item: 'Strip EXIF data from photos before posting', done: false },
  ]
  return base
}

function score(answers) {
  const catScores = {}
  const catCounts = {}

  // Init
  Object.keys(CATEGORIES).forEach(k => {
    catScores[k] = 0
    catCounts[k] = 0
  })

  // Score each answered question
  QUESTIONS.forEach(q => {
    const ans = answers[q.id]
    if (ans === undefined) return
    const riskVal = q.risk[ans]
    catScores[q.cat] += riskVal
    catCounts[q.cat]++
  })

  // Normalise per category (0–100) and apply weight
  let totalWeightedScore = 0
  let totalWeight = 0
  const categoryResults = {}

  Object.keys(CATEGORIES).forEach(k => {
    const cat = CATEGORIES[k]
    const count = catCounts[k]
    const raw   = catScores[k]
    const normalised = count > 0
      ? Math.round((raw / count) * 100)
      : 0

    categoryResults[k] = {
      name:  cat.name,
      score: normalised,
      level: classify(normalised),
      color: cat.color,
      weight: cat.weight,
      answered: count
    }

    totalWeightedScore += normalised * cat.weight
    totalWeight        += cat.weight
  })

  const overallScore = totalWeight > 0
    ? Math.round(totalWeightedScore / totalWeight)
    : 0

  const level      = classify(overallScore)
  const weaknesses = getWeaknesses(answers, QUESTIONS)
  const recommendations = getRecommendations(weaknesses, level)
  const checklist  = getChecklist(level)

  return {
    score:        overallScore,
    level,
    color:        getRiskColor(level),
    categories:   categoryResults,
    weaknesses:   weaknesses.slice(0, 10),
    recommendations,
    checklist,
    answeredCount: Object.keys(answers).length,
    totalQuestions: QUESTIONS.length
  }
}

module.exports = { score, classify, getRiskColor }