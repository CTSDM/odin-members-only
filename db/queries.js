// let's create a new user jus to test i still know how to do this
const pool = require("./pool.js");
const { env } = require("../config/config.js");

async function createUser(user) {
    await pool.query(
        `INSERT INTO ${env.database.usersTable} (first_name, last_name, username, password, membership_status, admin_status) VALUES ($1,$2,$3,$4, $5, $6)`,
        [
            user.fname,
            user.lname,
            user.username,
            user.pw,
            user.member,
            user.admin,
        ],
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
