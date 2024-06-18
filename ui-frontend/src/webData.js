// blueprint file to retrieve web data from Twitter using Puppeteer - webscraping

const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log("Hang on... we're just getting some web data from Twitter ;)")
    // Launch a new browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Define URLs to fetch data from
    const urls = [
        'https://twitter.com/aspnetcore_news',
        'https://twitter.com/java',
        'https://twitter.com/ThePSF'
    ];

    // Array to store all tweets from both URLs
    const allTweets = [];

    // Loop through each URL and fetch tweets
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];

        // Navigate to the URL
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Wait for the tweets to load
        await page.waitForSelector('article');

        // Extract tweets from the page
        const tweets = await page.evaluate(() => {
            // Get all tweet elements
            const tweetElements = document.querySelectorAll('article');
            const tweetData = [];

            tweetElements.forEach(tweet => {
                // Extract tweet content and metadata
                const content = tweet.querySelector('div[lang]')?.innerText || '';
                // const timestamp = tweet.querySelector('time')?.getAttribute('datetime') || '';
                // const author = tweet.querySelector('div > div > div > div > span > span')?.innerText || ''; not used
                tweetData.push({ content });
            });

            return tweetData;
        });

        // Add tweets from this URL to allTweets array
        allTweets.push(...tweets);

        console.log(`Tweets from ${url} retrieved: ${tweets.length}`);
        // console.log(allTweets);
    }

    // Close the browser
    await browser.close();

    // Write all tweets data to a JSON file
    const jsonContent = JSON.stringify(allTweets, null, 2);
    try {
        fs.writeFileSync("./src/all_tweets.json", jsonContent)
        console.log('All tweets retrieved and saved to all_tweets.json successfully.');
    } catch (err) {
        console.error('Error writing JSON file:', err);
    }
})();

// (async () => { // for a single instance using one URL
//     // Launch a new browser instance
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
    
//     // Navigate to the Twitter account page
//     const url = 'https://twitter.com/JavaScriptDaily';
//     await page.goto(url, { waitUntil: 'networkidle2' });

//     // Wait for the tweets to load
//     await page.waitForSelector('article');

//     // Extract tweets
//     const tweets_two = await page.evaluate(() => {
//         // Get all tweet elements
//         const tweetElements = document.querySelectorAll('article');
//         const tweetData_two = [];

//         tweetElements.forEach(tweet => {
//             // Extract tweet content and metadata
//             const content_two = tweet.querySelector('div[lang]')?.innerText || '';
//             const timestamp_two = tweet.querySelector('time')?.getAttribute('datetime') || '';
//             const author_two = tweet.querySelector('div > div > div > div > span > span')?.innerText || '';
//             tweetData_two.push({ author_two, content_two, timestamp_two });
//         });

//         return tweetData_two;
//     });

//     console.log(tweets_two);
//     // Close the browser
//     await browser.close();

//     const jsonContent = JSON.stringify(tweets_two, null, 2);
//     fs.writeFile('./src/tweets_two.json', jsonContent, 'utf8', (err) => {
//         if (err) {
//             console.error('Error writing JSON file:', err);
//             return;
//         }
//         console.log('Tweets retrieve success! The JSON file has been saved.');
//     });

// })();