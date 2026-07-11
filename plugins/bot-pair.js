const { cmd } = require('../zaidi');
const { sleep } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "bot",
    alias: ["pairbot", "linkbot"],
    react: "🤖",
    desc: "Get pairing code for a dynamic number",
    category: "tools",
    use: ".bot 947xxxxxxxx",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("🤖 *Ane lamayo, pairing code එක ගන්න ඕන phone number එක danna!* \n\n*Example:* .bot 94741336839");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        // Number එකෙන් text/spaces අයින් කරලා target number එක විතරක් ගන්නවා
        const phoneNumber = q.trim().replace(/[^0-9]/g, '');

        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("❌ *Number එක invalid! Country code එකත් එක්කම හරියට type කරන්න.*");
        }

        // Multidevice open engine එක හරහා dynamic code generation api request එක යවනවා
        const apiUrl = `https://arslan-mini-bot-e4ec84c138eb.herokuapp.com/code?number=${encodeURIComponent(phoneNumber)}`;
        const response = await axios.get(apiUrl);

        if (!response.data || !response.data.code) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("❌ *Pairing code එක ගන්න බැරි වුනා. Server busy වෙන්න ඇති.*");
        }

        const pairingCode = response.data.code;

        // Copy කරගන්න ලේසි වෙන්න pairing code එක විතරක් මුලින්ම text එකක් විදිහට යවනවා
        await reply(pairingCode);

        // විස්තර ඇතුව main delivery frame එක දානවා
        let display = `╭═══ 🤖 BOT PAIRING CODE ═══⊷\n`;
        display += `┃❃│ ✅ Success Generated\n`;
        display += `┃❃│ 📱 Number: +${phoneNumber}\n`;
        display += `┃❃│ 🔑 Code: ${pairingCode}\n`;
        display += `╰═══════════════════════════⊷\n\n`;
        display += `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𓆩𝐙𝐀𝐈𝐃𝐈-𝐌𝐃𓆪`;

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
        return reply(display);

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        reply(`❌ Internal validation server dynamic loop error.`);
    }
});
