require('dotenv').config();
console.log('Current directory:', process.cwd());
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL)
    .then(() => {
        console.log('DB connection successful');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('DB Connection failed', err);
    });
