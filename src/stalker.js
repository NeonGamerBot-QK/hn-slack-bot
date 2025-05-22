/**
 * @typedef {Object} MetaInfo
 * @property {string} by - The author of the post.
 * @property {number} descendants - The number of total comments.
 * @property {number} id - Unique identifier for the item.
 * @property {number[]} kids - Array of IDs for child comments/items.
 * @property {number} score - The score or points the item has received.
 * @property {number} time - Unix timestamp of creation time.
 * @property {string} title - Title of the post.
 * @property {string} type - Type of item (e.g., "story", "comment").
 * @property {string} url - URL linked to the post.
 */
async function stalker(app, db) {
    const ids = (await  db.all()).map(e=>e.value)
const IDS= await fetch("https://hacker-news.firebaseio.com/v0/topstories.json").then(r=>r.json()).then(d=>d.slice(0,30))
for(const entry of ids){
   for(const item of entry) {
     if(IDS.includes(item.id)){
        console.log(`Positive on ${item}`)
        /** @type {MetaInfo} */
        const meta = await fetch(`https://hacker-news.firebaseio.com/v0/item/${item.id}.json?print=pretty`).then(r=>r.json())
        // console.log(meta)
        const strgin = `:yay: Found your post (or post by ${meta.by}) which was recorded on the front page (first 30) of hacker news @ ${new Date(meta.time*1000).toString()} w/ a score of ${meta.score}..\ntitle: ${meta.title}\nurl: ${meta.url}`
          await app.client.chat.postMessage({
            channel: item.channel,
            text: strgin,
        })
    } else {
        console.log(`Negative on ${id}`)
    }
   }
    await new Promise(r=>setTimeout(r,100))
}
}

async function stalkerCron() {
await stalker()
await new Promise(r=> setTimeout(r,1000*30))
stalkerCron()
}