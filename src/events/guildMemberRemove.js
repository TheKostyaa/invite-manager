const client = global.client;
const inviterSchema = require("../schemas/inviter");
const inviteMemberSchema = require("../schemas/inviteMember");
const conf = require("../configs/config.json");
module.exports = async (member) => {

// tanimlama yapioz
  const leaveChannel = member.guild.channels.cache.get(conf.leaveChannel);
  const joinleaveChannel = member.guild.channels.cache.get(conf.joinleaveChannel);
  let emojiX = conf.emojiX

// engellemeler
  if (!leaveChannel) return;
  if (!joinleaveChannel) return;
  if (member.user.bot) return;

// davet fonksiyonunu tanimlioz  
  const inviteMemberData = await inviteMemberSchema.findOne({ guildID: member.guild.id, userID: member.user.id });
  if (!inviteMemberData) {

// belirsiz davet
    leaveChannel.send(`${emojiX} ${member} Kişisi sunucumuzdan ayrıldı! Onu sunucuda olmayan bir kişi davet etmişti!`);
    joinleaveChannel.send(`${emojiX} ${member} Kişisi sunucumuzdan ayrıldı! Onu sunucuda olmayan bir kişi davet etmişti!`);


  } else {
    const inviter = await client.users.fetch(inviteMemberData.inviter);
    await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: inviter.id }, { $inc: { leave: 1, total: -1 } }, { upsert: true });
    const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: inviter.id, });
    const total = inviterData ? inviterData.total : 0;

// belirli davet
    leaveChannel.send(`${emojiX} ${member} Kişisi sunucumuzdan ayrıldı! Onu ${inviter} davet etmişti. (Davet sayısı: \`${total}\`)`);
    joinleaveChannel.send(`${emojiX} ${member} Kişisi sunucumuzdan ayrıldı! Onu ${inviter} davet etmişti. (Davet sayısı: \`${total}\`)`);
  }
};

module.exports.conf = {
  name: "guildMemberRemove",
};
