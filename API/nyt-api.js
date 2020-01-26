const https = require('https')
const url = require('url');
var moment = require('moment');
const config = require('../config.json')

// Data provided by The New York Times

const getNytNews = (queryTerm) => {
    return new Promise((resolve, reject) => {
        const today = moment().format('YYYYMMDD')
        const yesterday = moment().subtract(1, 'days').format('YYYYMMDD')
        const requestUrl = url.parse(url.format({
            protocol: 'https',
            hostname: 'api.nytimes.com',
            pathname: '/svc/search/v2/articlesearch.json',
            query: {
                begin_date: yesterday,
                end_date: today,
                query: queryTerm,
                "api-key": config.nyt.api_key
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
                if (body.response != undefined) {
                    if (body.response.docs != undefined) {
                        body.response.docs.forEach(a => {
                            var multimedia = Object.assign({}, a.multimedia[0]);
                            var mediaUrl = "";
                            if (multimedia != undefined)
                                mediaUrl = "https://static01.nyt.com/" + multimedia.url;
                            var article = {
                                headline: a.headline.main,
                                summary: a.snippet,
                                url: a.web_url,
                                image: mediaUrl
                            }
                            articleData.push(article);
                        });
                    }
                }
                resolve(articleData);
            })
        })
    })
};

exports.getNews = getNytNews;
