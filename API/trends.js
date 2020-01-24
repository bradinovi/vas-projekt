const googleTrends = require('google-trends-api');

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
                        try {
                            result.default.trendingSearchesDays[0].trendingSearches.forEach(search => {
                                trends.push(search.title.query);
                            });
                        } catch (error) {
                            console.log("ERROR trends")
                        }
                        resolve(trends)
                    }
                });
        }
    );
}
exports.getGoogleTrends = getGoogleTrends;