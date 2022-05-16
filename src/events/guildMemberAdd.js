const client = global.client;
const { Collection } = require("discord.js");
const moment = require('moment');
const inviterSchema = require("../schemas/inviter");
const inviteMemberSchema = require("../schemas/inviteMember");
const conf = require("../configs/config.json");

module.exports = async(member) => {

    // tanimlamalari yapıoz  
    const welcomeChannel = member.guild.channels.cache.get(conf.welcomeChannel);
    const joinChannel = member.guild.channels.cache.get(conf.joinChannel);
    const joinleaveChannel = member.guild.channels.cache.get(conf.joinleaveChannel);

    // if tanımı
    if (!welcomeChannel) return;
    if (!joinChannel) return;
    if (!joinleaveChannel) return;
    if (member.user.bot) return;

    // invite seylerini tanimliyoz  
    const gi = client.invites.get(member.guild.id).clone() || new Collection().clone();
    const invites = await member.guild.fetchInvites();
    const invite = invites.find((x) => gi.has(x.code) && gi.get(x.code).uses < x.uses) || gi.find((x) => !invites.has(x.code)) || member.guild.vanityURLCode;
    client.invites.set(member.guild.id, invites);

    // kendim bişeyler ekiom işte kardesh
    let emojiTag = conf.emojiStar
    let emojiTada = conf.emojiTada
    let emojiCheck = conf.emojiCheck
    let emojiX = conf.emojiX
    let valentinTag = conf.tag
    let yetkiRegister = conf.yetkiRegister

    let saitoraday = moment(member.user.createdAt).format("DD");
    let saitoramonth = moment(member.user.createdAt).format("MM").replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık");
    let saitorayear = moment(member.user.createdAt).format("YYYY");
    let saitorahour = moment(member.user.createdAt).format("HH:mm:ss");
    let hesabınxtarihindeolusturulmus = `${saitoraday} ${saitoramonth} ${saitorayear} ${saitorahour}`
    let saitoratotalmember = member.guild.memberCount;

    // özel URL katildi
    if (invite === member.guild.vanityURLCode) joinChannel.send(`${emojiCheck} ${member} Kişisi sunucumuzun Özel URL'sini kullanarak giriş yaptı!`)
    if (invite === member.guild.vanityURLCode) joinleaveChannel.send(`${emojiCheck} ${member} Kişisi sunucumuzun Özel URL'sini kullanarak giriş yaptı!`)
    if (invite === member.guild.vanityURLCode) welcomeChannel.send(`
${emojiTag} 1001 e hoş geldin ${member} (\`${member.id}\`)! Hesabın ${hesabınxtarihindeolusturulmus} tarihinde oluşturulmuş.

Kayıt olmak için "V.Confirmed" odalarından birisine giriş yapıp <@&${yetkiRegister}> rolündeki yetlililere ses teyit vermelisin. Seninle beraber ${saitoratotalmember} kişi olduk! Hakkımızda bilgi edinebilmek için yukarıdaki hazırlamış olduğumuz kanallara göz atabilirsin.

Tagımızı "${valentinTag}" alarak bize destek olup sunucu içerisinde ayrıcalık ve avantaj kazanabilirsin!

**Özel URL** Kullanarak sunucumuza giriş yaptın. Etkinlik rollerini almayı unutma. İyi eğlenceler! ${emojiCheck}
`)

    if (!invite.inviter) return;
    await inviteMemberSchema.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $set: { inviter: invite.inviter.id, date: Date.now() } }, { upsert: true });
    if (Date.now() - member.user.createdTimestamp <= 1000 * 60 * 60 * 24 * 7) {
        await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: invite.inviter.id }, { $inc: { total: 1, fake: 1 } }, { upsert: true });
        const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: invite.inviter.id });
        const total = inviterData ? inviterData.total : 0;

        // fake davet
        joinChannel.send(`${emojiCheck} ${member} Kişisi ${invite.inviter} kullanıcısının daveti ile katıldı! (Davet sayısı: \`${total}\`)`)
        joinleaveChannel.send(`${emojiCheck} ${member} Kişisi ${invite.inviter} kullanıcısının daveti ile katıldı! (Davet sayısı: \`${total}\`)`)
        welcomeChannel.send(`
${emojiTag} Wia#1965 e hoş geldin ${member} (\`${member.id}\`)! Hesabın ${hesabınxtarihindeolusturulmus} tarihinde oluşturulmuş.

Kayıt olmak için "V.Confirmed" odalarından birisine giriş yapıp <@&${yetkiRegister}> rolündeki yetlililere ses teyit vermelisin. Seninle beraber ${saitoratotalmember} kişi olduk! Hakkımızda bilgi edinebilmek için yukarıdaki hazırlamış olduğumuz kanallara göz atabilirsin.

Tagımızı "```wia - x - #1965``" alarak bize destek olup sunucu içerisinde ayrıcalık ve avantaj kazanabilirsin!

${invite.inviter} Kullanıcısının ${total}. Daveti ile sunucumuza giriş yaptın. Etkinlik rollerini almayı unutma. İyi eğlenceler! ${emojiCheck}
`);

    } else {
        await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: invite.inviter.id }, { $inc: { total: 1, regular: 1 } }, { upsert: true });
        const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: invite.inviter.id });
        const total = inviterData ? inviterData.total : 0;

        // güvenli davet
        joinChannel.send(`${emojiCheck} ${member} Kişisi ${invite.inviter} kullanıcısının daveti ile katıldı! (Davet sayısı: \`${total}\`)`)
        joinleaveChannel.send(`${emojiCheck} ${member} Kişisi ${invite.inviter} kullanıcısının daveti ile katıldı! (Davet sayısı: \`${total}\`)`)
        welcomeChannel.send(`
${emojiTag} Wia#1965 e hoş geldin ${member} (\`${member.id}\`)! Hesabın ${hesabınxtarihindeolusturulmus} tarihinde oluşturulmuş.

Kayıt olmak için "V.Confirmed" odalarından birisine giriş yapıp <@&${yetkiRegister}> rolündeki yetlililere ses teyit vermelisin. Seninle beraber ${saitoratotalmember} kişi olduk! Hakkımızda bilgi edinebilmek için yukarıdaki hazırlamış olduğumuz kanallara göz atabilirsin.

Tagımızı "```wia - x - #1965``" alarak bize destek olup sunucu içerisinde ayrıcalık ve avantaj kazanabilirsin!

${invite.inviter} Kullanıcısının ${total}. Daveti ile sunucumuza giriş yaptın. Etkinlik rollerini almayı unutma. İyi eğlenceler! ${emojiCheck}
    `);
    }
};

module.exports.conf = {
    name: "guildMemberAdd",
};
