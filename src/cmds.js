module.exports = (app, db) => {
  app.command("/hn-subscribe", async ({ ack, body, client, context, say }) => {
    if (ack) ack();
    const args = body.text.split(" ");
    const channel = args[1];
    const idToTrack = args[0];
    console.log(idToTrack, channel);
    await db.push(body.user_id, {
      channel: channel || body.user_id,
      id: idToTrack,
    });
    await say({
      text: `Subscribed to ${idToTrack}${channel ? ` in ${channel}` : ""}.`,
      ephemeral: true,
    });
  });
  app.command(
    "/hn-unsubscribe",
    async ({ ack, body, client, context, say }) => {
      if (ack) ack();
      const args = body.text.split(" ");
      const channel = args[1];
      const idToTrack = args[0];
      console.log(idToTrack, channel);
      await db.remove(body.user_id, {
        channel: channel || body.user_id,
        id: idToTrack,
      });
      await say({
        text: `Unsubscribed from ${idToTrack}${channel ? ` in ${channel}` : ""}.`,
        ephemeral: true,
      });
    },
  );
};

