require("dotenv").config();
const { App } = require("@slack/bolt");
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
// db.all().then((e) => console.log(e[0]));

app.event("app_home_opened", async ({ event, context, say }) => {
  await app.client.views.publish({
    user_id: event.user,
    view: {
      type: "home",
      callback_id: "home_view",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Welcome to the HN Slack Bot!`,
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Use /hn-subscribe <id> <channel> to subscribe to a story. Use /hn-unsubscribe <id> <channel> to unsubscribe.`,
          },
        },
      ],
    },
  });
});
require("./cmds")(app, db);
app.start();
