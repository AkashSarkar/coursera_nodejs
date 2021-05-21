const express = require('express')

const dishRoutes = express.Router();

dishRoutes.get('/', (req, res) => {
    res.send('Will send all the dishes to you!')
})

dishRoutes.post('/', (req, res, next) => {
    res.send('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
});
dishRoutes.put('/', (req, res, next) => {
    res.statusCode = 403;
    res.send('PUT operation not supported on /dishes');
});
dishRoutes.delete('/', (req, res, next) => {
    res.send('Deleting all dishes');
});

dishRoutes.get('/:dishId', (req, res, next) => {
    res.end('Will send details of the dish: ' + req.params.dishId + ' to you!');
});

dishRoutes.post('/:dishId', (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId);
});

dishRoutes.put('/:dishId', (req, res, next) => {
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name +
        ' with details: ' + req.body.description);
});

dishRoutes.delete('/:dishId', (req, res, next) => {
    res.end('Deleting dish: ' + req.params.dishId);
});

module.exports = dishRoutes;