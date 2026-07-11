const { cmd } = require('../zaidi');
const { sleep } = require('../lib/functions');

cmd({
    pattern: "chathu",
    alias: ["chathuwa"],
    react: "❤️",
    desc: "Chathu reply command",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, {
            react: { text: "❤️", key: m.key }
        });

        const replyMessage = `ane lassna lamayo mn chathuwa thama mokkda awla in awilla kiyannako prashne\n\n📱 *Contact:* 94741336839`;

        return reply(replyMessage);

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});
