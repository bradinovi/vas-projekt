const https = require('https')
const url = require('url');


const getNytNews = (queryTerm) => {
    return new Promise((resolve, reject) => {
        const today = new Date();

        const requestUrl = url.parse(url.format({
            protocol: 'https',
            hostname: 'api.nytimes.com',
            pathname: '/svc/search/v2/articlesearch.json',
            query: {
                begin_date: 20200122,
                end_date: 20200122,
                query: queryTerm,
                "api-key": "FqZbKRbPDpjFRTS8o8V3uPv91XAVLUS0"
            }
        }));

        const req = https.get({
            hostname: requestUrl.hostname,
            path: requestUrl.path,
        }, (res) => {
            let body = "";
            res.on("data", data => {
                body += data;
            });
            let articleData = [];
            res.on("end", () => {
                body = JSON.parse(body);
                articleData = [];
                body.response.docs.forEach(a => {
                    var multimedia = Object.assign({}, a.multimedia[0]);
                    var mediaUrl = "";
                    if (multimedia != undefined)
                        mediaUrl = "https://static01.nyt.com/" + multimedia.url;
                    articleData.push({
                        headline: a.headline.main,
                        summary: a.snippet,
                        url: a.web_url,
                        image: mediaUrl
                    })
                });
                resolve(articleData);
            })

        })
    })
};

exports.getNews = getNytNews;
