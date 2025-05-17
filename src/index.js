require('dotenv').config();
const {App} = require('@slack/bolt');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
// urls to scrape  https://hacker-news.firebaseio.com/v0/topstories.json (only ID's) ( please slice to top 30)
// https://api.hackerwebapp.com/news?page=0 full detail more accurate