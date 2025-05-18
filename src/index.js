require('dotenv').config();
const {App} = require('@slack/bolt');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
// urls to scrape  https://hacker-news.firebaseio.com/v0/topstories.json (only ID's) ( please slice to top 30)
// https://api.hackerwebapp.com/news?page=0 full detail more accurate
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    // logLevel: 'debug',
});

app.command('/hn-subscribe', async ({ ack, body, client, context, say }) => {
    if(ack) ack()
        
})

app.command('/hn-unsubscribe', async ({ ack, body, client, context, say }) => {
if (ack) ack()
})

