const express = require('express')

const leaderRouters = express.Router();

leaderRouters.get('/', (req, res) => {
    res.send('Will send all the leaders to you!')
})

leaderRouters.post('/', (req, res, next) => {
    res.send('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
});
leaderRouters.put('/', (req, res, next) => {
    res.statusCode = 403;
    res.send('PUT operation not supported on /leaders');
});
leaderRouters.delete('/', (req, res, next) => {
    res.send('Deleting all leaders');
});

leaderRouters.get('/:leaderId', (req, res, next) => {
    res.end('Will send details of the leader: ' + req.params.leaderId + ' to you!');
});

leaderRouters.post('/:leaderId', (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/' + req.params.leaderId);
});

leaderRouters.put('/:leaderId', (req, res, next) => {
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('Will update the leader: ' + req.body.name +
        ' with details: ' + req.body.description);
});

leaderRouters.delete('/:leaderId', (req, res, next) => {
    res.end('Deleting leader: ' + req.params.leaderId);
});

module.exports = leaderRouters;