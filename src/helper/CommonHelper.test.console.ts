import { CommonHelper } from './CommonHelper'

console.log(`
————————————————————————————————————————————————————————————————————
"this will test the ContinuousExecuteBySetTimeout"
————————————————————————————————————————————————————————————————————
`)
;(async () => {
  // use func with all parameters provided
  let index = 0
  let ret = await CommonHelper.continuousExecuteBySetTimeout(
    async () => {
      index++
      console.log(`${index} Do job`)

      if (Math.random() > 0.5) {
        console.log(`❌`)
        throw new Error('oops in actionFn execution') // to inform the LOOPER to change interval for next request
      } else {
        console.log(`✅`)
      }
    },
    5000,

    (delay: number, isPreviousRunSuccess: boolean) => {
      console.log(`Delay: ${delay}, isPreviousRunSuccess: ${isPreviousRunSuccess}`)
      return 3000
    },
    true,
    () => true
  )

  // use DEFAULT intervalFn with DEFAULT_INTERVAL
  setTimeout(() => {
    console.log(`===================clearing timerId ${ret.delay} ${ret.timerId}`)
    clearTimeout(ret.timerId)
  }, 17000)

  let index2 = 0
  let ret2 = await CommonHelper.continuousExecuteBySetTimeout(async () => {
    index2++
    console.log(`                                                      ##${index2} Do job`)

    if (Math.random() > 0.5) {
      console.log(`                                                      ❌`)
      throw new Error('oops in actionFn execution') // to inform the LOOPER to change interval for next request
    } else {
      console.log(`                                                      ✅`)
    }
  })

  setTimeout(() => {
    console.log(`                                                      ===================clearing timerId ${ret2.delay} ${ret2.timerId}`)
    clearTimeout(ret2.timerId)
  }, 56000)

  // end wrapper func
})()
