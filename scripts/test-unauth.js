(async () => {
  try {
    const { GET: invGET } = require('../app/api/dashboard/investor/route')
    const { GET: sGET } = require('../app/api/dashboard/startup/route')
    const { POST: matchPOST } = require('../app/api/match/route')
    const { GET: notifGET } = require('../app/api/notifications/route')
    const { GET: completionGET } = require('../app/api/profile/completion/route')

    const r = new Request('http://localhost')

    const invRes = await invGET(r)
    console.log('/api/dashboard/investor -> status (expect 401):', invRes.status)
    console.log('body:', await invRes.json())

    const sRes = await sGET(r)
    console.log('/api/dashboard/startup -> status (expect 401):', sRes.status)
    console.log('body:', await sRes.json())

    const mReq = new Request('http://localhost', { method: 'POST', body: JSON.stringify({ sector: 'saas', stage: 'seed' }), headers: { 'content-type': 'application/json' } })
    const mRes = await matchPOST(mReq)
    console.log('/api/match -> status (expect 401):', mRes.status)
    console.log('body:', await mRes.json())

    const nRes = await notifGET(r)
    console.log('/api/notifications -> status (expect 401):', nRes.status)
    console.log('body:', await nRes.json())

    const cRes = await completionGET(r)
    console.log('/api/profile/completion -> status (expect 401):', cRes.status)
    console.log('body:', await cRes.json())
  } catch (e) {
    console.error('Test failed', e)
  }
})()
