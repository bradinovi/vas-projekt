const nyt = require('./API/nyt-api')
const trends = require('./API/trends')
/*
nyt.getNews("Terry Jones").then((data) => {
    console.log(data);
})
*/
trends.getGoogleTrends().then(
    (data) => {
        console.log(data);
    }
)


