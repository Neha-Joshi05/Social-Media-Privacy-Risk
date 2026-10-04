// ============================================
// index.js — Express server (local dev only)
// Vercel uses api/ folder for serverless
// ============================================
const express = require('express')
const cors    = require('cors')
const helmet  = require('helmet')
const morgan  = require('morgan')

const app  = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

app.get('/api/health',    require('./api/health'))
app.get('/api/questions', require('./api/questions'))
app.post('/api/assess',   require('./api/assess'))
app.get('/api/demo',      require('./api/demo'))

app.listen(PORT, () =>
  console.log(`🔒 Privacy Risk API running on port ${PORT}`))