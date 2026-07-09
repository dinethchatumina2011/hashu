const events = require('./zaidi');
const config = require('./config');

events.cmd({
    pattern: "chatu",
    desc: "Replies with a custom Sinhala voice/text message representation",
    category: "misc",
    fromMe: false, // ඕනෑම කෙනෙකුට මේ command එක පාවිච්චි කරන්න පුළුවන්
    filename: __filename
}, async (zaidiSocket, sendMsg, msgInfo, { from, reply }) => {
    try {
        const replyText = `චතු මහත්තයා තමා කතා කරන්නේ, ඔයාට ප්‍රශ්නයක් තියෙන්නම් කියන්න අනේ.. 94741336839`;

        await zaidiSocket.sendMessage(from, { 
            text: replyText 
        }, { quoted: msgInfo });

        console.log("[⚡] .chatu command executed successfully!");
    } catch (e) {
        console.log("❌ Error in chatu command: " + e.message);
    }
});
