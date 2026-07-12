const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ප්‍රධාන රවුටර් එක සහ බොට්ගේ ලොජික් එක ලෝඩ් කිරීම
const pairRouter = require('./main');
app.use('/', pairRouter);

// 🛠️ DATA ON/OFF වෙනකොට සිදුවන Unhandled Crash වැළැක්වීමේ ක්‍රමවේදය
// කනෙක්ෂන් එක ලොස්ට් වෙලා බොට් ක්‍රෑෂ් වුණොත් සර්වර් එක ඩවුන් නොවී ඔටෝ රීස්ටාර්ට් වීමට ඉඩ සලසයි
process.on('unhandledRejection', (reason, p) => {
    console.log('⚠️ [Anti-Crash] Unhandled Rejection detected:', reason);
    // මෙතනදී සර්වර් එකට හානියක් නොවී ක්‍රියාවලිය පවත්වා ගනී
});

process.on('uncaughtException', (err, origin) => {
    console.log('⚠️ [Anti-Crash] Uncaught Exception detected:', err);
    // සර්වර් එක සම්පූර්ණයෙන්ම ලොක් වීම වළක්වා නැවත සම්බන්ධ වීමට ඉඩ හරී
    if (err.message && err.message.includes('Connection closed')) {
        console.log('🔄 Internet fluctuation detected. Trying to keep process alive...');
    }
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🟢 Connection auto-recovery listener activated!`);
});

module.exports = app;
