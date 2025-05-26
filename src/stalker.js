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

async function archiveURL(targetUrl) {
  const response = await fetch(
    `https://web.archive.org/save/${encodeURIComponent(targetUrl)}`,
    {
      method: "GET",
      redirect: "manual", // don't follow redirects
    },
  );

  // Wayback returns a redirect to the archived version in the Location header
  const archiveUrl = response.headers.get("Location");

  if (archiveUrl) {
    console.log("Archived URL:", `https://web.archive.org${archiveUrl}`);
    return archiveUrl;
  } else {
    console.log("Failed to archive the URL.");
    return null;
  }
}

async function stalker(app, db) {
  const ids = ((await db.all()) || []).map((e) => e.value);
  const IDS = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
  )
    .then((r) => r.json())
    .then((d) => d.slice(0, 30));
  for (const entry of ids.filter((d) => !d.found)) {
    for (const item of entry) {
      if (IDS.includes(parseInt(item.id))) {
        console.log(`Positive on ${item}`);
        /** @type {MetaInfo} */
        const meta = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${item.id}.json?print=pretty`,
        ).then((r) => r.json());
        // console.log(meta)
        const archivedURL = await archiveURL(
          "https://news.ycombinator.com/news",
        );
        const strgin = `:yay: Found your post (or post by ${meta.by}) which was recorded on the front page (first 30) of hacker news @ ${new Date(meta.time * 1000).toString()} w/ a score of ${meta.score}..\ntitle: ${meta.title}\nurl: ${meta.url}\n Here is also an archived url which shows it from this time: ${archivedURL}`;
        await app.client.chat.postMessage({
          channel: item.channel,
          text: strgin,
        });
        // now mark it as  found
        await db.set(`${item.id}`, {
          ...item,
          found: true,
        });
      } else {
        console.log(`Negative on ${item.id}`, IDS, item.id);
      }
    }
    await new Promise((r) => setTimeout(r, 100));
  }
}

async function stalkerCron(app, db) {
  await stalker(app, db);
  await new Promise((r) => setTimeout(r, 1000 * 30));
  stalkerCron(app, db);
}

module.exports = {
  stalker,
  stalkerCron,
};
