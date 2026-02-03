const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Result = require('./models/Result');

async function clearResults() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to DB');

        const deleted = await Result.deleteMany({});
        console.log(`🗑️ Deleted ${deleted.deletedCount} results.`);
        console.log('Leaderboard and History are now clean.');

        process.exit();
    } catch (error) {
        console.error('❌ Failed to clear:', error);
        process.exit(1);
    }
}

clearResults();
