import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
if (fs.existsSync('.env.local')) {
    const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

import { getGlossaryLinks } from '../lib/actions/glossary';

async function run() {
    const links = await getGlossaryLinks();
    console.log("getGlossaryLinks returned count:", links.length);
    console.log("links:", links);
    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
