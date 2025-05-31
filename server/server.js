const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // Allow frontend to make requests
app.use(express.json()); // Parse incoming JSON

app.use('/api/auth', authRoutes); // Route group for /register and /login

const foodsRoutes = require('./routes/foods');
app.use('/api/foods', foodsRoutes);

app.listen(PORT, () =>  {
    console.log(`Server running on port ${PORT}`);
});


