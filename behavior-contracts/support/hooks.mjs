import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  setDefaultTimeout,
} from '@cucumber/cucumber'
import { chromium } from 'playwright'

let browser

setDefaultTimeout(20_000)

BeforeAll(async function () {
  browser = await chromium.launch({ headless: true })
})

Before(async function () {
  await this.startScenario(browser)
})

After(async function () {
  await this.closeScenario()
})

AfterAll(async function () {
  await browser?.close()
  browser = undefined
})
