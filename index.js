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

axios.all([
    axios.get('https://api.metals.live/v1/spot'),
    axios.get('https://www.apmex.com/product/23331/1-oz-american-silver-eagle-coin-bu-random-year'),
    axios.get('https://www.apmex.com/product/21/10-oz-silver-bar-secondary-market'),
    axios.get('https://www.apmex.com/product/44447/1-oz-silver-round-buffalo'),
    axios.get('https://www.jmbullion.com/american-silver-eagle-varied-year/'),
    axios.get('https://www.jmbullion.com/10-oz-silver-bar/'),
    axios.get('https://www.jmbullion.com/1-oz-sunshine-buffalo-silver-round/'),
]).then(axios.spread(
    (
        spotPriceResponse,
        apmexASEResponse,
        apmex10ozResponse,
        apmex1ozBuffaloResponse,
        jmASEResponse,
        jm10ozResponse,
        jm1ozBuffaloResponse
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
            },
            timestamp: Math.floor(new Date().getTime() / 1000)
        }
    })).then(data => {
        fs.writeFileSync('prices.json', JSON.stringify(data));
        console.log('Written to file', data);
    });