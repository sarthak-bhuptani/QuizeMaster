const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const localUri = 'mongodb://localhost:27017/onlinequiz';
const cloudUri = 'mongodb+srv://mrsarthak825_db_user:2knJ5dgk5PXHqtUa@cluster0.bmulmyy.mongodb.net/onlinequiz?appName=Cluster0';

const newContent = `MONGO_URI=${localUri}
# CLOUD_URI=${cloudUri}
PORT=5001`;

fs.writeFileSync(envPath, newContent);
console.log('✅ Successfully switched to LOCAL Database.');
console.log('PLEASE RESTART YOUR SERVER: Run "node server.js" again.');
