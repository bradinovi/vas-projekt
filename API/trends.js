const https = require('https')
const googleTrends = require('google-trends-api');

const nytArticlesAPI = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
const nytAPIkey = "FqZbKRbPDpjFRTS8o8V3uPv91XAVLUS0";

const options = {
    hostname: 'whatever.com',
    port: 443,
    path: '/todos',
    method: 'GET'
}


const getGoogleTrends = () => {
    return new Promise(
        (resolve, reject) => {
            googleTrends.dailyTrends({
                trendDate: new Date(),
                geo: 'US',
            },
                (err, results) => {
                    if (err) {
                        console.log(err);
                    } else {
                        result = JSON.parse(results);
                        let trends = [];
                        result.default.trendingSearchesDays[0].trendingSearches.forEach(search => {
                            console.log(search.title);
                            trends.push(search.title.query);
                        });
                        resolve(trends)
                    }
                });
        }
    );
}
exports.getGoogleTrends = getGoogleTrends;



