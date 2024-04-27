let blocked = require('../blocked.json');
const config = require('../config.json');

const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.get('/blocked', (req: any, res: any) => {
    res.json(blocked);
    return res.status(200);
});

app.post('/blocked/add', (req: any, res: any) => {
    if (!req.headers.authorization || req.headers.authorization !== config.auth) {
        return res.status(401).send('Unauthorized');
    }

    const { domains, TLDs, IPv4 } = req.body;
    const newBlocked = {
        domains: [...blocked.domains, ...domains],
        TLDs: [...blocked.TLDs, ...TLDs],
        IPv4: [...blocked.IPv4, ...(IPv4 || [])] // Why
    };
    blocked = newBlocked;

    fs.writeFile(__dirname + '/../blocked.json', JSON.stringify(blocked), (err: any) => { // Stupid hacky shit
        if (err) {
            console.error(err);
            return res.status(500).send('Error writing to blocked.json');
        }
        res.send('Updated Block List');
    });
});

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });