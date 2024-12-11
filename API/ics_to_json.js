const ical = require('node-ical');
const fs = require('fs');

const icsFilePath = 'emploi-du-temps.ics';
const jsonFilePath = 'emploi-du-temps.json';

// Fonction pour nettoyer et structurer les descriptions
function parseDescription(description) {
    const lines = description.trim().split('\n').map(line => line.trim());

    const groups = [];
    const teachers = [];

    lines.forEach(line => {
        if (line.startsWith('TP') || line.startsWith('RT')) {
            groups.push(line); // Groupes (lignes commençant par "TP" ou "RT")
        } else if (!line.includes('(Exporté le:') && line.length > 0) {
            teachers.push(line); // Professeurs
        }
    });

    return {
        groups,
        teachers
    };
}

// Lire et traiter les événements
ical.parseFile(icsFilePath, (err, data) => {
    if (err) {
        console.error('Erreur lors de la lecture du fichier ICS', err);
        return;
    }

    let events = [];
    for (let k in data) {
        if (data.hasOwnProperty(k)) {
            let ev = data[k];
            if (ev.type === 'VEVENT') {
                const parsedDescription = parseDescription(ev.description || '');

                events.push({
                    summary: ev.summary,
                    start: ev.start,
                    end: ev.end,
                    location: ev.location || 'Non précisée',
                    description: parsedDescription,
                    durationMinutes: Math.round((new Date(ev.end) - new Date(ev.start)) / (1000 * 60))
                });
            }
        }
    }

    // Trier les événements par date de début
    events.sort((a, b) => new Date(a.start) - new Date(b.start));

    // Sauvegarder les événements dans un fichier JSON
    fs.writeFile(jsonFilePath, JSON.stringify(events, null, 2), (err) => {
        if (err) {
            console.error('Erreur lors de la sauvegarde du fichier JSON', err);
            return;
        }
        console.log('Fichier JSON sauvegardé avec succès');
    });
});
