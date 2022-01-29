const client = global.client;

module.exports = async() => {
    client.guilds.cache.forEach(async(guild) => {
        const invites = await guild.fetchInvites();
        client.invites.set(guild.id, invites);
    });
    //client.user.setActivity(`Valentin'e hoş geldin! Tagımızı "✯" alarak bize destek olabilirsin.`);
    console.log(client.user.tag)
    let botVoiceChannel = client.channels.cache.get("935891293987545150");
    if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Bot ses kanalına bağlanamadı!"));
};

module.exports.conf = {
    name: "ready",
};