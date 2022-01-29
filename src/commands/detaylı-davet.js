const inviteMemberSchema = require("../schemas/inviteMember");
const moment = require("moment");
moment.locale("tr");
module.exports = {
  conf: {
    aliases: ["detaylı-davet"],
    name: "d-davet"
  },
  run: async (client, message, args, embed) => {

        // yetki, izin ayarlamaları
if ( !message.member.roles.cache.has("860942008541118524") &&  !message.member.hasPermission("ADMINISTRATOR") && !message.member.id !== author )
return message.reply(`Bu komut için yeterli iznin yok!`).then( sd => sd.delete({ timeout: 5000 }))

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const data = await inviteMemberSchema.find({ guildID: message.guild.id, inviter: member.user.id });
    const filtered = data.filter(x => message.guild.members.cache.get(x.userID));
    console.log(filtered)
    embed.setColor('ff0000').setDescription(filtered.length > 0 ? filtered.map(m => `${member} Kullanıcısının davetleri aşağıya sıralanmıştır;\n\n<@${m.userID}> - \`${moment(m.date).format("LLL")}\``).join("\n") : `${member} Bu kullanıcı sunucumuza henüz kimseyi davet etmemiş!`);
    message.channel.send(embed);
  },
};
