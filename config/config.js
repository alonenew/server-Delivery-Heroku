const { Pool } = require('pg');

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

const databaseConfig = {
    'host': 'ec2-34-205-46-149.compute-1.amazonaws.com',
    'port': 5432,
    'database': 'ddu5j2cj0mpq7m',
    'user': 'xcrqlvdjuewpqa',
    'password': 'b47e0a9ded724881ad3f87f310973286bd892642aa61ff663dd79f42bbb49259',
    ssl: {
        rejectUnauthorized: false
    }
};
const db = pgp(databaseConfig);

module.exports = db;