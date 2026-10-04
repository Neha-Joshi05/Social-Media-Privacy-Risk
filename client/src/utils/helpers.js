export function getRiskColor(level) {
  const m = { LOW:'#00e676', MODERATE:'#ffd600', HIGH:'#ff9100', CRITICAL:'#ff1744' }
  return m[level] || '#5a5c7a'
}
export function getRiskBg(level) {
  const m = { LOW:'#00e67615', MODERATE:'#ffd60015', HIGH:'#ff910015', CRITICAL:'#ff174415' }
  return m[level] || '#1a1b2e'
}
export function getRiskEmoji(level) {
  const m = { LOW:'🟢', MODERATE:'🟡', HIGH:'🟠', CRITICAL:'🔴' }
  return m[level] || '⚪'
}
export function getRiskBorder(level) {
  const m = { LOW:'#00e67640', MODERATE:'#ffd60040', HIGH:'#ff910040', CRITICAL:'#ff174440' }
  return m[level] || '#1e2038'
}