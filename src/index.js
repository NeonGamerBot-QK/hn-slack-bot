require('dotenv').config();
const {App} = require('@slack/bolt');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
// urls to scrape  https://hacker-news.firebaseio.com/v0/topstories.json (only ID's) ( please slice to top 30)
// https://api.hackerwebapp.com/news?page=0 full detail more accurate
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    // signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
//    logLevel: 'debug',
});

app.command('/hn-subscribe', async ({ ack, body, client, context, say }) => {
    if(ack) ack()
    const args = body.text.split(' ');
    const channel = args[1];
    const idToTrack = args[0]
    console.log(idToTrack, channel)
  await   db.push(body.user_id, {
        channel: channel || body.user_id,
        id: idToTrack
    })
await say({
    text: `Subscribed to ${idToTrack}${channel ? ` in ${channel}` : ''}.`,
    ephemeral: true,
});
})
app.command('/hn-unsubscribe', async ({ ack, body, client, context, say }) => {
if (ack) ack()
    const args = body.text.split(' ');
    const channel = args[1];
    const idToTrack = args[0]
    console.log(idToTrack, channel)
    await db.remove(body.user_id, {
        channel: channel || body.user_id,
        id: idToTrack
    })
    await say({
        text: `Unsubscribed from ${idToTrack}${channel ? ` in ${channel}` : ''}.`,
        ephemeral: true,
    });
})

app.start()
