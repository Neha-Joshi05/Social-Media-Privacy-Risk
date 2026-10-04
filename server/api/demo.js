const { score } = require('../engine/scorer')

// Synthetic demo profiles
const DEMO_PROFILES = [
  { name:'Alex (High Risk)',    platform:'Instagram',
    answers:{ A1:0,A2:0,A3:0,A4:0, B1:0,B2:0,B3:0,B4:0,
              C1:0,C2:0,C3:0,C4:2, D1:0,D2:0,D3:0,D4:0,
              E1:0,E2:0,E3:0,E4:0, F1:0,F2:0,F3:0,F4:0,
              G1:0,G2:0,G3:0,G4:0, H1:0,H2:0,H3:0,H4:0,
              I1:0,I2:0,I3:0,I4:0, J1:0,J2:0,J3:0,J4:0 } },
  { name:'Sam (Moderate)',      platform:'LinkedIn',
    answers:{ A1:1,A2:1,A3:0,A4:2, B1:1,B2:1,B3:2,B4:0,
              C1:2,C2:2,C3:1,C4:2, D1:1,D2:1,D3:1,D4:3,
              E1:1,E2:1,E3:1,E4:1, F1:1,F2:1,F3:1,F4:1,
              G1:1,G2:1,G3:1,G4:2, H1:1,H2:1,H3:1,H4:2,
              I1:2,I2:2,I3:1,I4:1, J1:2,J2:2,J3:1,J4:1 } },
  { name:'Jordan (Low Risk)',   platform:'Twitter',
    answers:{ A1:2,A2:1,A3:2,A4:1, B1:2,B2:2,B3:2,B4:1,
              C1:3,C2:3,C3:1,C4:1, D1:2,D2:2,D3:3,D4:3,
              E1:3,E2:2,E3:1,E4:3, F1:2,F2:2,F3:1,F4:3,
              G1:2,G2:3,G3:1,G4:3, H1:1,H2:2,H3:3,H4:3,
              I1:3,I2:1,I3:2,I4:1, J1:3,J2:1,J3:3,J4:3 } },
]

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const demos = DEMO_PROFILES.map(p => ({
    name:     p.name,
    platform: p.platform,
    ...score(p.answers)
  }))

  res.json({ profiles: demos })
}