// let's create a new user jus to test i still know how to do this
const pool = require("./pool.js");
const { env } = require("../config/config.js");

async function createUser(newUser) {
    pool.query(
        `INSERT INTO ${env.database.usersTable} (first_name, last_name, username, password, membership_status) VALUES ($1,$2,$3,$4, false)`,
        [newUser.fname, newUser.lname, newUser.username, newUser.pw],
    );
}

async function getUser(param, paramValue) {
    const { rows } = await pool.query(
        `SELECT * FROM ${env.database.usersTable} WHERE ${param} = $1`,
        [paramValue],
    );
    return rows[0];
}

module.exports = { createUser, getUser };
