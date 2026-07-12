const { cmd } = require('../zaidi');
const { sleep } = require('../lib/functions');
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

cmd({
    pattern: "url",
    alias: ["tourl", "makeurl", "imgurl"],
    react: "🌐",
    desc: "Convert replied image to an ImgBB public URL link",
    category: "tools",
    use: ".url (reply to an image)",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Reply karapu message ekak thiyenawada check karanawa
        if (!m.quoted) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("📸 *Ane lamayo, URL ekak karanna ona image ekakata reply karala me command eka gahanna!*");
        }

        // View-once hari normal images check karagannawa
        let quotedMsg = m.quoted;
        let msg = quotedMsg.message;
        if (msg?.viewOnceMessageV2) msg = msg.viewOnceMessageV2.message;
        if (msg?.viewOnceMessageV2Extension) msg = msg.viewOnceMessageV2Extension.message;

        const type = Object.keys(msg)[0];
        if (type !== "imageMessage") {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("❌ *Meke karanna puluwan Image walata vitharayi lamayo!*");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        // Media file eka buffer ekakata download karagannawa
        const buffer = await quotedMsg.download();
        const tempPath = `./temp_${Date.now()}.jpg`;
        fs.writeFileSync(tempPath, buffer);

        // ImgBB integration block (Free API structure)
        // APIKEY kiyana thanata oyaage custom key eka danna puluwan, nathi unath base key eka wada
        const apiKey = "c08e5e8e78a631bf3c990ee53676c8cb"; 
        
        const bodyForm = new FormData();
        bodyForm.append("image", fs.createReadStream(tempPath));

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: bodyForm
        });

        const data = await response.json();

        // Temp file clean up pipeline
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

        if (data && data.success && data.data && data.data.url) {
            const uploadedUrl = data.data.url;
            await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

            let displayMsg = `╭═══ 🌐 IMAGE TO URL (ImgBB) ═══⊷\n`;
            displayMsg += `┃❃│ ✅ Dynamic Upload Success\n`;
            displayMsg += `┃❃│ 🔗 URL: ${uploadedUrl}\n`;
            displayMsg += `╰══════════════════════════════⊷\n\n`;
            displayMsg += `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀᴛʜᴜᴡᴀ-xᴍᴅ`;

            return reply(displayMsg);
        } else {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("❌ *Hosting server configuration error! Try again later.*");
        }

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        reply(`❌ Media sync fail buffer session crashed.`);
    }
});
