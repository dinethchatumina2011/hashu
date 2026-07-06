const { cmd } = require('../zaidi');
const { sleep } = require('../lib/functions');
const config = require('../config');
const os = require('os');

// =================================================================
// 🏓 UPTIME COMMAND
// =================================================================
cmd({
    pattern: "Uptime",
    alias: ["speed", "runtime", "status"],
    desc: "Check bot latency and resources",
    category: "general",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from, reply, myquoted }) => {
    try {
        await conn.sendMessage(from, {
            react: { text: "⚡", key: m.key }
        });

        const start = Date.now();

        const msg = await conn.sendMessage(from, {
            text: `╭═══ ⏳ TESTING ═══⊷\n┃❃╭──────────────\n┃❃│ ⏳ Please wait...\n┃❃╰───────────────\n╰═════════════════⊷`
        }, { quoted: myquoted });

        await sleep(500);

        const end = Date.now();
        const latency = end - start;

        // RAM Calculation
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
        const freeMem = (os.freemem() / 1024 / 1024).toFixed(0);
        const usedMem = (totalMem - freeMem).toFixed(0);

        // Uptime
        const uptimeSeconds = process.uptime();
        const uptimeHours = Math.floor(uptimeSeconds / 3600);
        const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
        const uptimeSecs = Math.floor(uptimeSeconds % 60);

        // 🎨 Final Output
        const display = `╭═══ 👑 UPTIME ═══⊷
┃❃╭──────────────
┃❃│ ⚡ Latency: ${latency}ms
┃❃│ ⏳ Uptime: ${uptimeHours}h ${uptimeMinutes}m ${uptimeSecs}s
┃❃│ 💾 RAM: ${usedMem}MB / ${totalMem}MB
┃❃│ 🤖 Bot: ᴄʜᴀᴛʜᴜᴡᴀ-xᴍᴅ
┃❃╰───────────────
╰═════════════════⊷

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀᴛʜᴜᴡᴀ-xᴍᴅ`;

        await conn.sendMessage(from, {
            text: display,
            edit: msg.key
        });

        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

    } catch (e) {
        console.error("Uptime Error:", e);
        await conn.sendMessage(from, {
            react: { text: "❌", key: m.key }
        });
        reply("❌ Error: " + e.message);
    }
});

// =================================================================
// 👑 OWNER COMMAND (Contact Card)
// =================================================================
cmd({
    pattern: "owner",
    desc: "Get bot owner contact",
    category: "general",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from, reply, myquoted }) => {
    try {
        await conn.sendMessage(from, {
            react: { text: "👑", key: m.key }
        });

        const ownerNumber = config.OWNER_NUMBER || "94741336839";

        // Send Contact Card
        const vcard = 'BEGIN:VCARD\n' +
                      'VERSION:3.0\n' +
                      'FN:chathuwa-MD (Owner)\n' +
                      'ORG:chathuwa-MD Corp;\n' +
                      `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:${ownerNumber}\n` +
                      'END:VCARD';

        await conn.sendMessage(from, {
            contacts: {
                displayName: '𝐂𝐇𝐀𝐓𝐇𝐔𝐖𝐀-𝐗𝐌𝐃',
                contacts: [{ vcard }]
            }
        }, { quoted: myquoted });

        const display = `╭═══ 👑 OWNER ═══⊷
┃❃╭──────────────
┃❃│ 📱 Number: ${ownerNumber}
┃❃│ 🤖 Bot: 𓆩𝐙𝐀𝐈𝐃𝐈-𝐌𝐃𓆪
┃❃│ 💡 Contact card sent!
┃❃╰───────────────
╰═════════════════⊷

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀᴛʜᴜᴡᴀ-xᴍᴅ`;

        await conn.sendMessage(from, {
            text: display,
            quoted: myquoted
        });

        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

    } catch (e) {
        console.error("Owner Error:", e);
        await conn.sendMessage(from, {
            react: { text: "❌", key: m.key }
        });
        reply("❌ Error: " + e.message);
    }
});
