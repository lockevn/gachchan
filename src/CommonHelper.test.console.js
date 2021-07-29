import CommonHelper from "./CommonHelper"

// this will test the ContinuousExecuteBySetTimeout

let index = 0
let ret = CommonHelper.ContinuousExecuteBySetTimeout(
  async () => {
    index++
    console.log(`${index} Do job`)

    if (Math.random() > 0.5) {
      console.log(`❌`)
      throw new Error("oops") // to inform the LOOPER to change interval for next request
    } else {
      console.log(`✅`)
    }
  },
  5000,
  
  (delay, isPreviousRunSuccess) => {
    console.log(`${delay} ${isPreviousRunSuccess}`)
    return 3000
  }
)

setTimeout(() => {
  console.log(`===================clearing timerId ${ret.delay} ${ret.timerId}`)
  clearTimeout(ret.timerId)
}, 17000)

let index2 = 0
let ret2 = CommonHelper.ContinuousExecuteBySetTimeout(async () => {
  index2++
  console.log(`                                                      ##${index2} Do job`)

  if (Math.random() > 0.5) {
    console.log(`                                                      ❌`)
    throw new Error("oops") // to inform the LOOPER to change interval for next request
  } else {
    console.log(`                                                      ✅`)
  }
})

setTimeout(() => {
  console.log(`                                                      ===================clearing timerId ${ret2.delay} ${ret2.timerId}`)
  clearTimeout(ret2.timerId)
}, 56000)
