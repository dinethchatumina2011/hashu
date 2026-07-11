const { cmd } = require('../zaidi');
const fetch = require('node-fetch');

cmd({
    pattern: "ai",
    alias: ["gpt", "chatgpt", "bot"],
    react: "🤖",
    desc: "Chat with AI (Sinhala supported)",
    category: "main",
    use: ".ai <prashne>",
    filename: __filename
}, async (conn, mek, m, { args, from, reply }) => {
    try {
        const text = args.join(" ");
        if (!text) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("🤖 *Ane lamayo, prashnayak type karanna!* \n\n*Example:* .ai oya kawuda?");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        // AI ekata input data filter karala request eka yawana primary line eka
        const prompt = `You are a helpful assistant. Reply clearly. If user language is Sinhala, reply in Sinhala: ${text}`;
        const apiUrl = `https://api.giftedtech.my.id/api/ai/gpt4?apikey=gifted&q=${encodeURIComponent(prompt)}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.success && data.results) {
            await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
            return reply(data.results);
        } else {
            // Backup framework line (Aluth open engine ekak)
            const backupUrl = `https://widipe.com/gpt4?text=${encodeURIComponent(prompt)}`;
            const resBackup = await fetch(backupUrl);
            const dataBackup = await resBackup.text(); // text form eken ena nisa format karanawa
            
            if (dataBackup && !dataBackup.includes('Error')) {
                await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
                return reply(dataBackup);
            } else {
                await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
                return reply("❌ *AI Response server block ekak thiyenawa. Poddak hitala gahanna.*");
            }
        }

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        reply(`❌ Error ekak mathu una, poddak thawa tikakin try karanna.`);
    }
});
