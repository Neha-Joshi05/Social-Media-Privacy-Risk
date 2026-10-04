const { score } = require('../engine/scorer')
const { v4: uuidv4 } = require('uuid')

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { answers, platform } = req.body
    if (!answers || Object.keys(answers).length === 0)
      return res.status(400).json({ error: 'No answers provided' })

    const result = score(answers)
    res.json({
      id:        uuidv4(),
      timestamp: new Date().toISOString(),
      platform:  platform || 'General',
      ...result
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Assessment failed' })
  }
}