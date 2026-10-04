module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json({
    status: 'ok',
    message: 'Privacy Risk Assessment API running'
  })
}