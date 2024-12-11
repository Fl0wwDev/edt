const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.get('/edt', (req, res) => {
    const jsonFilePath = 'emploi-du-temps.json';

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier JSON', err);
            return res.status(500).json({ error: 'Impossible de lire les données.' });
        }

        const events = JSON.parse(data);
        res.json(events);
    });
});

app.get('/edt/cours/:date', (req, res) => {
    const jsonFilePath = 'emploi-du-temps.json';
    const dateParam = req.params.date;

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier JSON', err);
            return res.status(500).json({ error: 'Impossible de lire les données.' });
        }

        const events = JSON.parse(data);
        const filteredEvents = events.filter(event => {
            const eventDate = new Date(event.start).toISOString().split('T')[0];
            return eventDate === dateParam;
        });

        res.json(filteredEvents);
    });
});


app.get('/edt/cours/teacher/:name', (req, res) => {
    const jsonFilePath = 'emploi-du-temps.json';
    const teacherName = req.params.name.toLowerCase();

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier JSON', err);
            return res.status(500).json({ error: 'Impossible de lire les données.' });
        }

        const events = JSON.parse(data);

        // Filtrer les événements où le nom du professeur correspond
        const filteredEvents = events.filter(event => {
            const teachers = event.description.teachers || [];
            return teachers.some(teacher => teacher.toLowerCase().includes(teacherName));
        });

        res.json(filteredEvents);
    });
});


// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur API en cours d'exécution sur http://localhost:${PORT}`);
});
