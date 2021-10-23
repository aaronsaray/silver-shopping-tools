const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

function getSilverSpotPrice(data) {
    return data.find(
        o => Object.keys(o)[0] === 'silver'
    ).silver;
}

function getSilverSpotPriceUpdateTimestamp(data) {
    return data.find(
        o => Object.keys(o)[0] === 'timestamp'
    ).timestamp;
}

function getApmexASEPrice(data) {
    const $ = cheerio.load(data);

    const priceHTML = $(".price-table [data-range='19'] td:nth-child(2)");
    return priceHTML.text().replace('$', '').trim();
}

function getApmexBar10OzPrice(data) {
    const $ = cheerio.load(data);

    const priceHTML = $(".product-volume-pricing [data-range='9'] td:nth-child(2)");
    return priceHTML.text().replace('$', '').trim();
}

function getApmexBuffalo1oz(data) {
    const $ = cheerio.load(data);

    const priceHTML = $(".product-volume-pricing [data-range='19'] td:nth-child(2)");
    return priceHTML.text().replace('$', '').trim();
}

function getApmexJunk5Dimes(data) {
    const $ = cheerio.load(data);

    const priceHTML = $("[data-range='Any Quantity'] td:nth-child(2)");
    return priceHTML.text().replace('$', '').trim();
}

function getJMASEPrice(data) {
    const $ = cheerio.load(data);

    const priceHTML = $(".payment-section table:nth-child(2) tbody tr:first-child td:nth-child(2)");
    return priceHTML.text().replace('$', '').trim();
}

function getJMBar10OzPrice(data) {
    const $ = cheerio.load(data);

    const priceHTML = $(".payment-section table:nth-child(2) tbody tr:first-child td:nth-child(2)");
    return priceHTML.text().replace('$', '').trim();
}

function getJMBuffalo1oz(data) {
    const $ = cheerio.load(data);

    const priceHTML = $(".payment-section table:nth-child(2) tbody tr:first-child td:nth-child(2)");
    return priceHTML.text().replace('$', '').trim();
}

function getMMXASEPrice(data) {
    const $ = cheerio.load(data);

    const priceHTML = $("#premium_data_parent tr[data-range='1'] td:last-child");
    return priceHTML.text().replace('$', '').trim();
}

function getMMXBar10OzPrice(data) {
    const $ = cheerio.load(data);

    const priceHTML = $("#premium_data_parent tr[data-range='1'] td:last-child");
    return priceHTML.text().replace('$', '').trim();
}

function getMMXBuffalo1oz(data) {
    const $ = cheerio.load(data);

    const priceHTML = $("#premium_data_parent tr[data-range='1'] td:last-child");
    return priceHTML.text().replace('$', '').trim();
}

function getMMXJunk5Dimes(data) {
    const $ = cheerio.load(data);

    const priceHTML = $("#premium_data_parent tr[data-range='$ 5 Face'] td:last-child");
    return priceHTML.text().replace('$', '').trim();
}

axios.all([
    axios.get('https://api.metals.live/v1/spot'),
    axios.get('https://www.apmex.com/product/23331/1-oz-american-silver-eagle-coin-bu-random-year'),
    axios.get('https://www.apmex.com/product/21/10-oz-silver-bar-secondary-market'),
    axios.get('https://www.apmex.com/product/44447/1-oz-silver-round-buffalo'),
    axios.get('https://www.apmex.com/product/213198/90-silver-coins-5-face-value-roll-dimes'),
    axios.get('https://www.jmbullion.com/american-silver-eagle-varied-year/'),
    axios.get('https://www.jmbullion.com/10-oz-silver-bar/'),
    axios.get('https://www.jmbullion.com/1-oz-sunshine-buffalo-silver-round/'),
    axios.get('https://www.moneymetals.com/silver-american-eagle-one-ounce-coin/9'),
    axios.get('https://www.moneymetals.com/10-oz-silver-bars/37'),
    axios.get('https://www.moneymetals.com/1-oz-silver-buffalo-round/158'),
    axios.get('https://www.moneymetals.com/mercury-dimes/279'),
]).then(axios.spread(
    (
        spotPriceResponse,
        apmexASEResponse,
        apmex10ozResponse,
        apmex1ozBuffaloResponse,
        apmexJunk5DimesResponse,
        jmASEResponse,
        jm10ozResponse,
        jm1ozBuffaloResponse,
        mmxASEResponse,
        mmx10ozResponse,
        mmx1ozBuffaloResponse,
        mmxJunk5DimesResponse,
    ) => {
        return {
            spotPrice: {
                price: getSilverSpotPrice(spotPriceResponse.data),
                source: "https://api.metals.live/v1/spot",
                timestamp: getSilverSpotPriceUpdateTimestamp(spotPriceResponse.data),
            },
            apmex: {
                ASE: {
                    price: getApmexASEPrice(apmexASEResponse.data),
                    source: "https://www.apmex.com/product/23331/1-oz-american-silver-eagle-coin-bu-random-year",
                    description: "apmex - random year ASE - BU 1-19 check/wire"
                },
                bar10oz: {
                    price: getApmexBar10OzPrice(apmex10ozResponse.data),
                    source: "https://www.apmex.com/product/21/10-oz-silver-bar-secondary-market",
                    description: "apmex - 10oz secondary market silver bar - 1-9 check/wire"
                },
                buffalo1oz: {
                    price: getApmexBuffalo1oz(apmex1ozBuffaloResponse.data),
                    source: "https://www.apmex.com/product/44447/1-oz-silver-round-buffalo",
                    description: "apmex - 1oz silver round - buffalo - 1-19 check/wire"
                },
                junk5Dimes: {
                    price: getApmexJunk5Dimes(apmexJunk5DimesResponse.data),
                    source: "https://www.apmex.com/product/213198/90-silver-coins-5-face-value-roll-dimes",
                    description: "apmex - $5 dimes junk - any"
                }
            },
            jm: {
                ASE: {
                    price: getJMASEPrice(jmASEResponse.data),
                    source: "https://www.jmbullion.com/american-silver-eagle-varied-year/",
                    description: "jm bullion - random year ASE - U - 1-19 check/wire"
                },
                bar10oz: {
                    price: getJMBar10OzPrice(jm10ozResponse.data),
                    source: "https://www.jmbullion.com/10-oz-silver-bar/",
                    description: "jm bullion - 10oz secondary market silver bar - 1-9 check/wire"
                },
                buffalo1oz: {
                    price: getJMBuffalo1oz(jm1ozBuffaloResponse.data),
                    source: "https://www.jmbullion.com/1-oz-sunshine-buffalo-silver-round/",
                    description: "jm bullion - 1oz silver round buffalo (SMI)  - 1-19 check/wire"
                },
                junk5Dimes: {
                    price: '',
                    source: '',
                    description: 'none',
                }
            },
            mmx: {
                ASE: {
                    price: getMMXASEPrice(mmxASEResponse.data),
                    source: "https://www.moneymetals.com/silver-american-eagle-one-ounce-coin/9",
                    description: "mmx - 2021 ASE - 1-39",
                },
                bar10oz: {
                    price: getMMXBar10OzPrice(mmx10ozResponse.data),
                    source: "https://www.moneymetals.com/10-oz-silver-bars/37",
                    description: "mmx - 10oz secondary market silver bar 1-4"
                },
                buffalo1oz: {
                    price: getMMXBuffalo1oz(mmx1ozBuffaloResponse.data),
                    source: "https://www.moneymetals.com/1-oz-silver-buffalo-round/158",
                    description: "mmx - 1oz silver round buffalo - 1-39"
                },
                junk5Dimes: {
                    price: getMMXJunk5Dimes(mmxJunk5DimesResponse.data),
                    source: "https://www.moneymetals.com/mercury-dimes/279",
                    description: "mmx - $5 dimes junk mercury"
                }
            },
            timestamp: Math.floor(new Date().getTime() / 1000)
        }
    })).then(data => {
        fs.writeFileSync('prices.json', JSON.stringify(data));
        console.log('Written to file', data);
    });