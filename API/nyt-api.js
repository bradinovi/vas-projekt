const https = require('https')
const url = require('url');
var moment = require('moment');



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
                //console.log(body)

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
                            //console.log(article)
                            articleData.push(article);
                        });
                    }
                }
                //console.log(articleData);
                resolve(articleData);
            })

        })
    })
};

exports.getNews = getNytNews;

//getNytNews('trump').then(data => console.log(data[0]))