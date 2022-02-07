const promise = require('bluebird');
const options = {
    promiseLib: promise,
    query: (e) => {}
}

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114, function(stringValue) {
    return stringValue;
});

const DATABASE_URL = 'postgres://xcrqlvdjuewpqa:b47e0a9ded724881ad3f87f310973286bd892642aa61ff663dd79f42bbb49259@ec2-34-205-46-149.compute-1.amazonaws.com:5432/ddu5j2cj0mpq7m';

const databaseConfig = {
    'host': 'localhost',
    'port': 5432,
    'database': 'delivery_db',
    'user': 'postgres',
    'password': 'Plusomega01'
};


const db = pgp(databaseConfig);
// const db = pgp(DATABASE_URL);

module.exports = db;