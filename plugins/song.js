const { cmd } = require('../zaidi');
const { sleep } = require('../lib/functions');
const yts = require("yt-search");
const axios = require("axios");
const { fakevCard } = require('../lib/fakevCard');

// ==================== SONG DOWNLOADER ====================
cmd({
    pattern: "song",
    alias: ["ytmp3", "play", "mp3", "gana", "music", "audio"],
    react: "🎵",
    desc: "YouTube search & MP3 download",
    category: "download",
    use: ".song <song name>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            const display = `╭═══ ❌ SONG ═══⊷
┃❃╭──────────────
┃❃│ ❌ No song name!
┃❃│ 💡 Use: .song <song name>
┃❃│ 📝 Example: .song Pasoori
┃❃╰───────────────
╰═════════════════⊷

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀᴛʜᴜᴡᴀ-xᴍᴅ`;
            return reply(display);
        }

        await conn.sendMessage(from, {
            react: { text: "⏳", key: m.key }
        });

        // YouTube Search
        const search = await yts(query);
        if (!search.videos || !search.videos.length) {
            await conn.sendMessage(from, {
                react: { text: "❌", key: m.key }
            });
            return reply("❌ No result found.");
        }

        const video = search.videos[0];

        // MP3 API
        const apiUrl = `https://arslan-apis-v2.vercel.app/download/ytmp3?url=${video.url}`;
        const res = await axios.get(apiUrl, { timeout: 60000 });

        if (!res.data || !res.data.status || !res.data.result || !res.data.result.download || !res.data.result.download.url) {
            await conn.sendMessage(from, {
                react: { text: "❌", key: m.key }
            });
            return reply("❌ Audio not generated.");
        }

        const dlUrl = res.data.result.download.url;
        const meta = res.data.result.metadata;
        const quality = res.data.result.download.quality || "128kbps";

        // Send Audio
        await conn.sendMessage(from, {
            audio: { url: dlUrl },
            mimetype: "audio/mpeg",
            ptt: false,
            fileName: `${meta.title || "song"}.mp3`,
            caption: `╭═══ 🎵 SONG ═══⊷
┃❃╭──────────────
┃❃│ 🎵 ${meta.title || "Unknown Title"}
┃❃│ 🎚️ Quality: ${quality}
┃❃╰───────────────
╰═════════════════⊷

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀᴛʜᴜᴡᴀ-xᴍᴅ`
        }, { quoted: fakevCard });

        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

    } catch (err) {
        console.error("SONG ERROR:", err);
        await conn.sendMessage(from, {
            react: { text: "❌", key: m.key }
        });
        reply("❌ Error found. Please try later.");
    }
});

// ==================== VIDEO DOWNLOADER ====================
cmd({
    pattern: "video1",
    alias: ["vid", "ytv"],
    desc: "Download YouTube Video",
    category: "downloader",
    react: "🪄",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        await conn.sendMessage(from, {
            react: { text: "🪄", key: m.key }
        });

        if (!q) {
            const display = `╭═══ ❌ VIDEO ═══⊷
┃❃╭──────────────
┃❃│ ❌ No link or query!
┃❃│ 💡 Use: .video <YouTube link>
┃❃│ 💡 Use: .video <song name>
┃❃╰───────────────
╰═════════════════⊷

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀᴛʜᴜᴡᴀ-xᴍᴅ`;
            await conn.sendMessage(from, {
                react: { text: "❌", key: m.key }
            });
            return reply(display);
        }

        let videoUrl;
        if (q.includes("youtube.com") || q.includes('youtu.be')) {
            videoUrl = q;
        } else {
            const search = await yts(q);
            if (!search || !search.videos || search.videos.length === 0) {
                await conn.sendMessage(from, {
                    react: { text: "❌", key: m.key }
                });
                return reply("❌ No results found.");
            }
            videoUrl = search.videos[0].url;
        }

        const apiUrl = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(videoUrl)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.status) {
            await conn.sendMessage(from, {
                react: { text: "❌", key: m.key }
            });
            return reply("❌ Failed to fetch video.");
        }

        const { video_url_hd, video_url_sd } = data.result.media;
        const finalUrl = video_url_hd !== "No HD video URL available" ? video_url_hd : video_url_sd;

        if (!finalUrl || finalUrl.includes('No')) {
            await conn.sendMessage(from, {
                react: { text: "❌", key: m.key }
            });
            return reply("❌ No downloadable video found.");
        }

        await conn.sendMessage(from, {
            video: { url: finalUrl },
            caption: `╭═══ 🎬 VIDEO ═══⊷
┃❃╭──────────────
┃❃│ 📹 YouTube Video
┃❃│ ✅ Download complete
┃❃╰───────────────
╰═════════════════⊷

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʜᴀᴛʜᴜᴡᴀ-xᴍᴅ`
        }, { quoted: fakevCard });

        await conn.sendMessage(from, {
            react: { text: "✅", key: m.key }
        });

    } catch (err) {
        console.log("VIDEO ERROR:", err);
        await conn.sendMessage(from, {
            react: { text: "❌", key: m.key }
        });
        reply("❌ Error while fetching video.");
    }
});
