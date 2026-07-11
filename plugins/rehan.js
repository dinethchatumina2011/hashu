const { cmd } = require('../zaidi');
const { sleep } = require('../lib/functions');

cmd({
    pattern: "rehan",
    alias: ["rehana"],
    react: "👑",
    desc: "Rehan custom reply plugin",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Eka paswse eka react wenna emoji set ekak
        const emojis = ["🔥", "⚡", "❤️", "👑", "✨"];
        
        for (const emoji of emojis) {
            await conn.sendMessage(from, {
                react: { text: emoji, key: m.key }
            });
            await sleep(400); // Reaction wenas wenna podi delay ekak denawa
        }

        // React wela iwara unama ena reply message eka
        return reply("ITS ME REHAN");

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});
