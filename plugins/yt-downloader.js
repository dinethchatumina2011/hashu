const { cmd } = require('../zaidi');
const { sleep } = require('../lib/functions');
const yts = require("yt-search");
const fetch = require("node-fetch");

cmd({
    pattern: "yt",
    alias: ["ytmp4", "video", "ytdownload"],
    react: "🎬",
    desc: "Download YouTube video by link or name",
    category: "download",
    use: ".yt <video link or name>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("🎬 *Video link ekak hari nama hari danna!* \n\n*Example:* .yt https://youtube.com/watch?v=xxxx");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        let videoUrl = query.trim();

        // Input eka link ekak newei nam YouTube search ekak karala link eka gannawa
        if (!videoUrl.includes("youtube.com") && !videoUrl.includes("youtu.be")) {
            const search = await yts(query);
            if (!search.videos || !search.videos.length) {
                await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
                return reply("❌ *Video ekak hoyaganna baha!*");
            }
            videoUrl = search.videos[0].url;
        }

        // Direct fetch video link data API url
        const apiUrl = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(videoUrl)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.status || !data.result || !data.result.media) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("❌ *Video eka ganna bari una. Server down wenna athi.*");
        }

        // HD hari SD hari available thiyena link eka filter karagannawa
        const media = data.result.media;
        const finalUrl = media.video_url_hd !== "No HD video URL available" ? media.video_url_hd : media.video_url_sd;

        if (!finalUrl || finalUrl.includes('No')) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("❌ *Download link ekak generate unema naha.*");
        }

        // Target chat ekata video file eka deliver karanawa direct streaming url eken
        await conn.sendMessage(from, {
            video: { url: finalUrl },
            caption: `╭═══ 🎬 VIDEO DOWNLOADER ═══⊷\n┃❃│ ✅ Download Complete\n┃❃│ 🔗 Link: ${videoUrl}\n╰═════════════════════════⊷\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𓆩𝐙𝐀𝐈𝐃𝐈-𝐌𝐃𓆪`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        reply(`❌ System error ekak awa, poddak iwasala try karanna.`);
    }
});
