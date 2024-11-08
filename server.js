const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const Club = require('./models/club');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

sequelize.authenticate()
    .then(() => console.log('Connected to the MySQL database.'))
    .catch(err => console.error('Unable to connect to the database:', err));

// Serve React App
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API route to fetch all clubs with basic details
app.get('/api/clubs', async (req, res) => {
    try {
        const clubs = await Club.findAll({
            attributes: ['club_name', 'club_description']
        });
        res.json(clubs);
    } catch (error) {
        console.error('Error fetching clubs:', error);
        res.status(500).send('Error fetching clubs');
    }
});

// API route to fetch a specific club by name
app.get('/api/clubs/:name', async (req, res) => {
    const clubName = req.params.name.replace(/-/g, ' ');
    try {
        const club = await Club.findOne({ where: { club_name: clubName } });
        if (club) {
            res.json(club);
        } else {
            res.status(404).json({ message: 'Club not found' });
        }
    } catch (error) {
        console.error('Error fetching club data:', error);
        res.status(500).send('Error fetching club data');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
