const { cmd } = require('../zaidi');
const { sleep } = require('../lib/functions');
const fs = require('fs');
const path = require('path');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

cmd({
    pattern: "stk",
    alias: ["sticker", "s", "wm"],
    react: "🎨",
    desc: "Convert replied image to a high quality WhatsApp sticker with custom meta description",
    category: "tools",
    use: ".stk (reply to an image)",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Reply karapu message ekak thiyenawada check karanawa
        if (!m.quoted) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("📸 *Ane lamayo, sticker ekak karanna ona image ekakata reply karala .stk command eka gahanna!*");
        }

        let quotedMsg = m.quoted;
        let msg = quotedMsg.message;
        
        // View-once filter handler block
        if (msg?.viewOnceMessageV2) msg = msg.viewOnceMessageV2.message;
        if (msg?.viewOnceMessageV2Extension) msg = msg.viewOnceMessageV2Extension.message;

        const type = Object.keys(msg)[0];
        if (type !== "imageMessage" && type !== "videoMessage") {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("❌ *Meke sticker karanna puluwan normal images/videos walata vitharayi lamayo!*");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        // Media buffer eka download karagannawa
        const mediaBuffer = await quotedMsg.download();
        
        // Dynamic WA-Sticker-Formatter framework integration
        const sticker = new Sticker(mediaBuffer, {
            pack: "chathuwa",               // Pack Name eka
            author: "chathuwa",             // Author Name eka
            type: StickerTypes.FULL,        // Full canvas border mode
            categories: ['🤩', '🎉'], 
            id: 'zaidi-md-stk', 
            quality: 70                     // High quality buffer scaling
        });

        const stickerBuffer = await sticker.toBuffer();

        // Target active channel chat flow ekata direct grid deliver කරනවා
        await conn.sendMessage(from, { 
            sticker: stickerBuffer 
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        reply(`❌ Sticker session encoder transaction failed.`);
    }
});
