const { cmd } = require('../zaidi');
const { sleep } = require('../lib/functions');
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

cmd({
    pattern: "url",
    alias: ["tourl", "imgurl", "makeurl"],
    react: "🌐",
    desc: "Convert replied image to a public web URL link",
    category: "tools",
    use: ".url (reply to an image)",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Reply karapu message ekak thiyenawada kiyala check karanawa
        if (!m.quoted) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("📸 *Ane lamayo, URL ekak karanna ona image ekakata reply karala me command eka gahanna!*");
        }

        // Reply karapu message eka image ekakda kiyala check karanawa
        let quotedMsg = m.quoted;
        let msg = quotedMsg.message;
        if (msg?.viewOnceMessageV2) msg = msg.viewOnceMessageV2.message;
        if (msg?.viewOnceMessageV2Extension) msg = msg.viewOnceMessageV2Extension.message;

        const type = Object.keys(msg)[0];
        if (type !== "imageMessage") {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("❌ *Meke karanna puluwan Image walata vitharayi!*");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        // Image media file eka download karagannawa temporary buffer ekakata
        const buffer = await quotedMsg.download();
        const tempPath = `./temp_thumb_${Date.now()}.jpg`;
        fs.writeFileSync(tempPath, buffer);

        // Catbox free hosting server eka form data processing walata use karanawa
        const bodyForm = new FormData();
        bodyForm.append("reqtype", "fileupload");
        bodyForm.append("fileToUpload", fs.createReadStream(tempPath));

        const response = await fetch("https://catbox.moe/user/api.php", {
            method: "POST",
            body: bodyForm
        });

        const textUrl = await response.text();

        // Temporary file eka delete karala clean up karanawa
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

        if (textUrl && textUrl.includes("https://")) {
            await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
            
            let displayMsg = `╭═══ 🌐 IMAGE TO URL ═══⊷\n`;
            displayMsg += `┃❃│ ✅ Upload Success\n`;
            displayMsg += `┃❃│ 🔗 URL: ${textUrl.trim()}\n`;
            displayMsg += `╰═════════════════════════⊷\n\n`;
            displayMsg += `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀᴛʜᴜᴡᴀ-xᴍᴅ`;

            return reply(displayMsg);
        } else {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("❌ *Server error! Image upload eka fail una.*");
        }

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        reply(`❌ System failure profile error inside download thread.`);
    }
});
