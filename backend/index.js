require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 9090;
const dbURL = require('./config/mongoConnection');

dbURL();

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});