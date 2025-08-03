const mongoose = require('mongoose');

const dbURL = process.env.ATLAS_DB_URL; 

main().then(() => {
    console.log('Mongodb connected successfully');
}).catch((err) => {
    console.log(err);
});

async function main() {
    mongoose.connect(dbURL);
}

module.exports = main;