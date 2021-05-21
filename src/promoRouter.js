const express = require('express')

const promoRoutes = express.Router();

promoRoutes.get('/', (req, res) => {
    res.send('Will send all the promos to you!')
})

promoRoutes.post('/', (req, res, next) => {
    res.send('Will add the promo: ' + req.body.name + ' with details: ' + req.body.description);
});
promoRoutes.put('/', (req, res, next) => {
    res.statusCode = 403;
    res.send('PUT operation not supported on /promos');
});
promoRoutes.delete('/', (req, res, next) => {
    res.send('Deleting all promos');
});

promoRoutes.get('/:promoId', (req, res, next) => {
    res.end('Will send details of the promo: ' + req.params.promoId + ' to you!');
});

promoRoutes.post('/:promoId', (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/' + req.params.promoId);
});

promoRoutes.put('/:promoId', (req, res, next) => {
    res.write('Updating the promo: ' + req.params.promoId + '\n');
    res.end('Will update the promo: ' + req.body.name +
        ' with details: ' + req.body.description);
});

promoRoutes.delete('/:promoId', (req, res, next) => {
    res.end('Deleting promo: ' + req.params.promoId);
});

module.exports = promoRoutes;