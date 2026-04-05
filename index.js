const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const authRoutes = require('./src/routes/auth.routes');

// Route Sederhana untuk Test
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Kasir Cepat API!' });
});

app.use('/api/auth', authRoutes);

// Server Listening
app.listen(PORT, () => {
    console.log(`Server Kasir Cepat berjalan di http://localhost:${PORT}`);
});