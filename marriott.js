const puppeteer = require('puppeteer')
;(async () => {
    const browser = await puppeteer.launch({
        headless: false, // 不使用 headless 模式，就會開啟瀏覽器來實際動作
        slowMo: 150, // 每個動作的間隔時間，方便觀察實際動作
    })

    const page = await browser.newPage() // 開啟新分頁

    await page.goto('https://www.marriott.com/search/default.mi')
    await page.goto('https://www.marriott.com/search/default.mi') // 第一次會到中文頁面，要轉導第二次

    // 輸入Input
    await page.type('.search-field-box input', 'Taiwan')

    // 使用點數
    await page.evaluate(() => {
        document.querySelector('input[name="useRewardsPoints"]').click()
    })

    const submitBtn = await page.$('button.analytics-click')
    await submitBtn.click()

    await page.waitForNavigation()
    const result = await page.evaluate(() => {
        const arr = []
        const items = $('.js-property-record-item')
        for (let el of items) {
            const name = $(el).find('.js-hotel-name span').first().text()

            const point = $(el).find('.t-point-saver-point').first().text()

            const address = $(el).find('.m-hotel-address').first().text()

            const cat = $(el).find('.js-view-hotel-category').first().text()

            arr.push({ name, point, address, cat })
        }
        return arr
    })
    console.log('result: ', result)
    console.log('結束')
})()
