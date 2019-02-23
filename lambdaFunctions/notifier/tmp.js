const UnicornQueryService = require('./UnicornQueryService')

let qs = new UnicornQueryService({
    tableName: 'UnicornedMeDev-Table-1FMLPSQVRFLOW',
    
});

qs.getCount('attacker', 'victim').then(count => {
    console.log(count);
});

qs.getTotalAttacks('attacker').then(count => {
    console.log(count);
});

qs.getTotalVictimizations('victim').then(count => {
    console.log(count);
});