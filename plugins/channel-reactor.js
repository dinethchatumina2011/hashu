const { cmd } = require('../zaidi');

// Methanata oyaage Channel JID eka danna (Format eka me wage: '120363xxxxxxxxx@newsletter')
const TARGET_CHANNEL_JID = '120363424546838736@newsletter'; 

// Hama message ekakatama danna one reaction emoji eka methanata danna
const REACTION_EMOJI = '❤️'; 

cmd({
    on: "body",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        // Message eka enne oya target karapu channel ekenma kiyala check karagannawa
        if (from === TARGET_CHANNEL_JID) {
            
            // Channel message ekata auto react karanawa
            await conn.sendMessage(from, {
                react: {
                    text: REACTION_EMOJI,
                    key: m.key // Message eka adura ganna key eka
                }
            });
            
            console.log(`[Auto React] Reacted ${REACTION_EMOJI} to channel message: ${m.key.id}`);
        }
    } catch (e) {
        console.error("Error in Channel Auto React:", e);
    }
});
