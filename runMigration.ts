import fs from 'fs';

async function run() {
    const envConfig = fs.readFileSync('.env.local', 'utf8').split('\n');
    for (const line of envConfig) {
        if (line && line.includes('=')) {
            const [key, ...valueChunks] = line.split('=');
            let val = valueChunks.join('=');
            val = val.replace(/\r/g, ''); // strip carriage returns
            if (!process.env[key]) {
                process.env[key] = val.replace(/^["']|["']$/g, '').trim();
            }
        }
    }

    const { auditGlossaryData } = require('./lib/auditGlossary');
    await auditGlossaryData();
    process.exit(0);
}

run();
