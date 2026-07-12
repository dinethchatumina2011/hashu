const { cmd } = require('../zaidi');
const fs = require('fs');
const path = require('path');

// File path to store the targeted channel configuration permanently
const configPath = path.join(__dirname, '../channel_config.json');

// Helper function to read config
function getConfig() {
    try {
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
    } catch (e) {
        console.error("Error reading channel config:", e);
    }
    return { targetChannel: null, reactionEmoji: "❤️" };
}

// Helper function to save config
function saveConfig(config) {
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    } catch (e) {
        console.error("Error saving channel config:", e);
    }
}

// ==================== COMMAND: SET CHANNEL ====================
cmd({
    pattern: "setchannel",
    alias: ["channelreact", "targetchannel"],
    react: "📢",
    desc: "Set a specific WhatsApp channel to automatically react to its posts.",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, isCreator }) => {
    try {
        // Only allow the bot owner to change configuration
        if (!isCreator) {
            return reply("❌ This command is restricted to the Bot Owner.");
        }

        if (!q) {
            return reply("❌ Please provide a WhatsApp Channel link or Channel JID.\n\n*Example:* `.setchannel https://whatsapp.com/channel/xxxxxx`");
        }

        // Clean up and extract identifier or store directly
        const target = q.trim();
        let currentConfig = getConfig();
        currentConfig.targetChannel = target;
        
        saveConfig(currentConfig);

        return reply(`✅ *Success!* Automated channel monitoring active.\n📢 *Target:* ${target}\n✨ Bot will now try to react to incoming updates.`);

    } catch (e) {
        console.error(e);
        reply("❌ An error occurred inside the setchannel plugin.");
    }
});

// ==================== BACKGROUND EVENT LISTENER ====================
// This handles background message execution outside the standard command trigger
setTimeout(() => {
    if (global.conn) {
        global.conn.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const mek = chatUpdate.messages[0];
                if (!mek || !mek.message) return;

                const from = mek.key.remoteJid;
                
                // Verify if the incoming message originates from a newsletter/channel
                if (!from.endsWith('@newsletter')) return;

                const currentConfig = getConfig();
                if (!currentConfig.targetChannel) return;

                // Validate if it matches the saved target configuration
                // Note: Complete URL verification requires matching via metadata.
                // This checks if the ID matches or is contained inside the configuration URL string.
                if (currentConfig.targetChannel.includes(from) || from.includes(currentConfig.targetChannel)) {
                    
                    // Automatically send a reaction to the newly published channel message
                    await global.conn.sendMessage(from, {
                        react: {
                            text: currentConfig.reactionEmoji || "❤️",
                            key: mek.key
                        }
                    });
                }
            } catch (err) {
                // Suppress background errors quietly to prevent crash logs
                console.error("Auto-channel react error:", err);
            }
        });
    }
}, 5000); // 5-second initial delay to ensure global conn connection object is initialized
