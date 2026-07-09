// ---- CHANNEL AUTO REACT LOGIC START ----
if (global.autoReactChannel && global.targetChannelJid) {
    const channelMek = mek.messages[0];
    if (channelMek && channelMek.key && channelMek.key.remoteJid === global.targetChannelJid) {
        try {
            // Bot ම දාන ඒවට react නොවීම සඳහා
            if (!channelMek.key.fromMe) { 
                const reactionEmojis = ["❤️", "🔥", "👍", "👑", "⚡", "✨"];
                const randomEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
                
                // Baileys Socket එක හරහා Channel post එකට React කරනවා
                await zaidiSocket.sendMessage(global.targetChannelJid, {
                    react: {
                        text: randomEmoji,
                        key: channelMek.key
                    }
                });
                console.log(`[⚡] Auto Reacted ${randomEmoji} to Channel Post!`);
            }
        } catch (err) {
            console.log("❌ Channel React Error: " + err.message);
        }
    }
}
// ---- CHANNEL AUTO REACT LOGIC END ----
