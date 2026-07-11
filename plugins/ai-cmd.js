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

        // AI ekata custom prompt ekak ekka request eka yawanawa Sinhala language eka support wenna
        const prompt = `You are a helpful AI assistant. Please reply accurately. If the user asks in Sinhala, reply in Sinhala: ${text}`;
        const apiUrl = `https://aemt.me/gpt4?text=${encodeURIComponent(prompt)}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.result) {
            await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
            return reply(data.result);
        } else {
            // Backup Free AI API ekak first api weda naththam
            const backupUrl = `https://api.lolhuman.xyz/api/openai?apikey=FREE&text=${encodeURIComponent(prompt)}`;
            const resBackup = await fetch(backupUrl);
            const dataBackup = await resBackup.json();
            
            if (dataBackup.status === 200 && dataBackup.result) {
                await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
                return reply(dataBackup.result);
            } else {
                await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
                return reply("❌ *AI Server eka busy. Poddak hitapochan!*");
            }
        }

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        reply(`❌ Error: ${e.message}`);
    }
});
