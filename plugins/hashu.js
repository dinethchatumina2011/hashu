const { cmd } = require('../zaidi');
const { sleep } = require('../lib/functions');

cmd({
    pattern: "hashu",
    alias: ["hashi", "smile"],
    react: "✨",
    desc: "Sends a beautiful customized message with automated reactions",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, reply, pushname }) => {
    try {
        const text = `╭═══ ✨ 𝐉𝐔𝐒𝐓 𝐅𝐎𝐑 𝐘𝐎𝐔 ✨ ═══⊷
┃❃╭──────────────
┃❃│ 🌟 *Hey ${pushname || "Friend"}!*
┃❃│ 
┃❃│ 🍁 *Life is beautiful, stay happy always!*
┃❃│ ✨ *Keep smiling and have a wonderful day!*
┃❃│ ──────────────
┃❃│ 🤖 *Status:* Online & Active
┃❃╰───────────────
╰═════════════════⊷

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀᴛʜᴜᴡᴀ-xᴍᴅ`;

        // Send the beautiful message
        const sentMsg = await conn.sendMessage(from, { text: text }, { quoted: mek });

        // List of emojis to react to the sent message
        const emojis = ["❤️", "💖", "✨", "🌟", "🌹", "👑", "🕊️", "🎈", "🎉", "🔥", "💯", "🧸", "🍀", "💎", "🌸", "⚡", "🔮", "🌈", "🦋", "💘"];

        // Loop through emojis and react one by one with a small delay
        for (const emoji of emojis) {
            await conn.sendMessage(from, {
                react: { text: emoji, key: sentMsg.key }
            });
            await sleep(300); // 300ms delay between each reaction
        }

    } catch (e) {
        console.log(e);
        reply("❌ An error occurred while running the command.");
    }
});
