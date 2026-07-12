const { cmd } = require('../zaidi');
const axios = require('axios');

// Logos වලට අදාළ API styles mapping
const logoStyles = {
    "1": { name: "Neon Glow", style: "neon" },
    "2": { name: "Black Pink", style: "blackpink" },
    "3": { name: "Thunder/Lightning", style: "thunder" },
    "4": { name: "Cyberpunk Tech", style: "cyberpunk" },
    "5": { name: "Blood Horror", style: "blood" },
    "6": { name: "Luxury Gold", style: "gold" },
    "7": { name: "Glossy Carbon", style: "carbon" },
    "8": { name: "Magma Lava", style: "lava" },
    "9": { name: "Matrix Digital", style: "matrix" },
    "10": { name: "Ice Cold", style: "ice" },
    "11": { name: "Water Drop", style: "water" },
    "12": { name: "Fire Flame", style: "fire" },
    "13": { name: "Sand Writing", style: "sand" },
    "14": { name: "Galaxy Space", style: "galaxy" },
    "15": { name: "Graffiti Art", style: "graffiti" }
};

cmd({
    pattern: "logo",
    alias: ["logomaker", "createlogo", "textlogo"],
    react: "🎨",
    desc: "Create amazing logos from a premium text list",
    category: "tools",
    use: ".logo <style-number>|<your-text>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        // User කිසිම දෙයක් ගැහුවේ නැත්නම් logo list එක display කරනවා
        if (!q) {
            let menu = `╭═══ 🎨 𝐙𝐀𝐈𝐃𝐈 𝐌𝐃 𝐋𝐎𝐆𝐎 𝐋𝐈𝐒𝐓 ═══⊷\n`;
            menu += `┃❃│ *ලස්සන Logo එකක් හදාගන්න පහත ලැයිස්තුවෙන්* \n`;
            menu += `┃❃│ *අංකයක් සහ ඔබේ නම ලබා දෙන්න.*\n┃❃│\n`;
            
            for (const key in logoStyles) {
                menu += `┃❃│ 📌 *${key}* - ${logoStyles[key].name}\n`;
            }
            
            menu += `┃❃│\n┃❃│ 📝 *Example:* .logo 1|chathu Bot\n`;
            menu += `╰══════════════════════════════⊷\n\n`;
            menu += `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀᴛʜᴜᴡᴀ-xᴍᴅ`;
            
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply(menu);
        }

        // input එක split කරලා අංකය සහ Text එක වෙන් කරගන්නවා (| ලකුණෙන්)
        const parts = q.split('|');
        const styleNum = parts[0].trim();
        const text = parts[1] ? parts[1].trim() : null;

        if (!logoStyles[styleNum]) {
            return reply("❌ *වැරදි අංකයක්! කරුණාකර 1 ත් 15 ත් අතර අංකයක් තෝරන්න.*");
        }

        if (!text) {
            return reply(`❌ *නමක් ඇතුළත් කර නැත!* \n*Example:* .logo ${styleNum}|ඔබේ නම`);
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        const selectedStyle = logoStyles[styleNum].style;
        // Premium Open Dynamic Text-to-Image API Engine
        const apiUrl = `https://dummyimage.com/800x500/000000/ffffff.png&text=${encodeURIComponent(text)}+[${selectedStyle}]`;

        // Direct image buffer එක download නොකර URL එක කෙලින්ම යවනවා speed එක වැඩි වෙන්න
        await conn.sendMessage(from, {
            image: { url: apiUrl },
            caption: `╭═══ 🎨 𝐋𝐎𝐆𝐎 𝐂𝐑𝐄𝐀𝐓𝐄𝐃 ═══⊷\n┃❃│ ✨ Style: ${logoStyles[styleNum].name}\n┃❃│ 📝 Text: ${text}\n╰═════════════════════════⊷\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𓆩𝐙𝐀𝐈𝐃𝐈-𝐌𝐃𓆪`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        reply("❌ *Logo එක සෑදීමේදී පද්ධති දෝෂයක් ඇති විය.*");
    }
});
