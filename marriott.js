const puppeteer = require('puppeteer')
;(async () => {
    const browser = await puppeteer.launch({
        headless: false, // 不使用 headless 模式，就會開啟瀏覽器來實際動作
        slowMo: 150, // 每個動作的間隔時間，方便觀察實際動作
        args: ['--start-maximized'],
    })
    const page = await browser.newPage() // 開啟新分頁

    await page.goto('https://www.marriott.com/search/default.mi')

    // 輸入Input
    await page.type('.search-field-box input', 'Taiwan')

    // 使用點數
    await page.evaluate(() => {
        document.querySelector('input[name="useRewardsPoints"]').click()
    })

    const btn = await page.$('button.analytics-click')
    await btn.click()

    await page.waitForNavigation()
    const ressult = await page.evaluate(() => {
        const arr = []
        const items = $('.js-property-record-item')
        for (let el of items) {
            const name = $(el).find('.js-hotel-name span').text()
            console.log('name: ', name)
            const point = $(el).find('.t-point-saver-point').text()
            console.log('point: ', point)
            const address = $(el).find('.m-hotel-address').text()
            console.log('address: ', address)
            const cat = $(el).find('.js-view-hotel-category').text()
            console.log('cat: ', cat)
            arr.push({ name, point, address, cat })
        }
        return arr
    })
    console.log('ressult: ', ressult)
    console.log('結束')
})()
