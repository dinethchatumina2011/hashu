const { cmd } = require('../zaidi');
const config = require('../config');

cmd({
    pattern: "active",
    alias: ["listsessions", "allsessions", "activesessions"],
    react: "📊",
    desc: "List all currently connected active bot sessions on the server (Owner Only)",
    category: "owner",
    use: ".active",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        // Bot Creator/Owner ද කියලා check කරනවා
        if (!isCreator) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("❌ *මෙම විධානය භාවිතා කළ හැක්කේ බොට් අයිතිකරුට (Owner) පමණි!*");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        // main.js එකේ තියෙන activeSockets Map එකෙන් data dynamic access කරනවා
        // main.js හි ගෝලීයව activeSockets export කර නොමැති නම් require හරහා හෝ process context එකෙන් ගනු ලැබේ
        const mainModule = require('../main');
        
        // dynamic fallback mapping for active sockets array
        let sessionsList = [];
        
        // Server memory එකේ ධාවනය වන sockets පරික්ශා කිරීම
        if (global.activeSockets || mainModule.activeSockets) {
            const sockets = global.activeSockets || mainModule.activeSockets;
            let index = 1;
            
            sockets.forEach((socket, number) => {
                sessionsList.push(`┃ ${index}. 📱 *Number:* ${number}\n┃    🟢 *Status:* Connected / Active`);
                index++;
            });
        } else {
            // Memory stack එක direct කියවීමට නොහැකි වුවහොත් වත්මන් බොට් එක පමණක් පෙන්වයි
            sessionsList.push(`┃ 1. 📱 *Number:* ${conn.user.id.split(':')[0]}\n┃    🟢 *Status:* Connected (Current Session)`);
        }

        let displayMsg = `╭═══ 📊 𝐐𝐔𝐄𝐄𝐍 𝐂𝐇𝐀𝐓𝐇𝐔𝐖𝐀 𝐀𝐂𝐓𝐈𝐕𝐄 𝐂𝐋𝐔𝐒𝐓𝐄𝐑𝐒 ═══⊷\n`;
        displayMsg += `┃\n`;
        displayMsg += `┃ 🌐 *Total Active Sessions:* ${sessionsList.length}\n`;
        displayMsg += `┃ ═══════════════════════════════\n`;
        displayMsg += sessionsList.join('\n┃ ═══════════════════════════════\n') + '\n';
        displayMsg += `╰══════════════════════════════════════⊷\n\n`;
        displayMsg += `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀᴛʜᴜᴡᴀ-xᴍᴅ`;

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
        return reply(displayMsg);

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        reply("❌ *Active sessions ලැයිස්තුව ලබා ගැනීමේදී පද්ධති දෝෂයක් ඇති විය.*");
    }
});
