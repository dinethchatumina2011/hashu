const config = require('./config');

// ⚠️ මෙන්න මෙතන තියෙන JID එක වෙනුවට ඔයාගේ Channel එකේ JID එක දාන්න!
const TARGET_CHANNEL_JID = '120363294829392@newsletter'; 

async function handleChannelAutoReact(zaidiSocket, mek) {
    try {
        // මැසේජ් එකක් නැත්නම් return කරනවා
        if (!mek || !mek.messages || !mek.messages[0]) return;
        
        const channelMek = mek.messages[0];
        if (!channelMek.key || !channelMek.key.remoteJid) return;

        // මැසේජ් එක එන්නේ ඔයා සෙට් කරපු චැනල් JID එකෙන්ද කියලා බලනවා
        if (channelMek.key.remoteJid === TARGET_CHANNEL_JID) {
            
            // Bot විසින්ම දාන ඒවට ආයෙත් රියැක්ට් නොවෙන්න
            if (channelMek.key.fromMe) return; 

            // Random වදින්න ඕන Emoji ටික (ඔයාට ඕන නම් එකක් විතරක් ඉතුරු කරන්න පුළුවන්)
            const reactionEmojis = ["❤️", "🔥", "👍", "👑", "⚡", "✨", "💯"];
            const randomEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
            
            // Channel Post එකට React කරනවා
            await zaidiSocket.sendMessage(TARGET_CHANNEL_JID, {
                react: {
                    text: randomEmoji,
                    key: channelMek.key
                }
            });
            
            console.log(`[⚡ ZAIDI-MD] Auto Reacted ${randomEmoji} to Channel Post!`);
        }
    } catch (err) {
        console.log("❌ Channel React Error: " + err.message);
    }
}

module.exports = { handleChannelAutoReact };
