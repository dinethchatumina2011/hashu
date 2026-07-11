const { cmd } = require('../zaidi');
const { sleep } = require('../lib/functions');
const yts = require("yt-search");
const fetch = require("node-fetch");

cmd({
    pattern: "song",
    alias: ["ytmp3", "play", "music"],
    react: "🎵",
    desc: "Search and download YouTube song as MP3 with thumbnail image",
    category: "download",
    use: ".song <song name>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("🎵 *Sinduwe nama danna!* \n\n*Example:* .song Pasoori");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        // YouTube Search කරනවා
        const search = await yts(query);
        if (!search.videos || !search.videos.length) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("❌ *Sinduwa hoyaganna baha!*");
        }

        const video = search.videos[0];
        const videoUrl = video.url;
        const thumbnail = video.thumbnail;
        const title = video.title;

        // API එකෙන් Audio ඩවුන්ලෝඩ් කරනවා
        const apiUrl = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(videoUrl)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.status || !data.result || !data.result.media) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("❌ *API Error! Audio එක ගන්න බැරි වුනා.*");
        }

        // HD හෝ SD audio එක තෝරා ගන්නවා
        const audioUrl = data.result.media.audio_url || data.result.media.video_url_sd;

        if (!audioUrl || audioUrl.includes('No')) {
            await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
            return reply("❌ *Download link එකක් හම්බුනේ නැහැ.*");
        }

        // මුලින්ම සින්දුවේ විස්තර සහ Thumbnail Image එක යවනවා
        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: `🎵 *SONG DOWNLOADER* 🎵\n\n📌 *Title:* ${title}\n⏱️ *Duration:* ${video.timestamp}\n🔗 *Link:* ${videoUrl}\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𓆩𝐙𝐀𝐈𝐃𝐈-𝐌𝐃𓆪`
        }, { quoted: mek });

        // ඊටපස්සේ MP3 Music Audio එකක් විදිහට සින්දුව යවනවා
        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: 'audio/mp4',
            ptt: false // Audio message එකක් විදිහට යවන්න (Voice note එකක් නෙමෙයි)
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
        reply(`❌ Error: ${e.message}`);
    }
});
