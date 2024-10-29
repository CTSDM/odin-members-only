// let's create a new user jus to test i still know how to do this
const pool = require("./pool.js");
const { env } = require("../config/config.js");
const assert = require("assert");

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

async function getUserID(username) {
    const { rows } = await pool.query(
        `SELECT * FROM ${env.database.usersTable} WHERE username= $1`,
        [username],
    );
    assert.strictEqual(rows.length > 0, true);
    return rows[0].id;
}

async function getMessagesWithUsers() {
    const messagesTable = env.database.messagesTable;
    const usersTable = env.database.usersTable;
    const { rows } = await pool.query(
        `SELECT ${messagesTable}.id, ${messagesTable}.title, ${messagesTable}.content, ${messagesTable}.added_time, ${usersTable}.username FROM ${messagesTable}
        JOIN users ON ${usersTable}.id = ${messagesTable}.user_id
        ORDER BY ${messagesTable}.id;`,
    );
    return rows;
}

async function addMessage(msg) {
    const userID = await getUserID(msg.author);
    assert.strictEqual(typeof userID, "number");
    const { rows } = await pool.query(
        `INSERT INTO ${env.database.messagesTable} (title, content, added_time, user_id) VALUES($1,$2,to_timestamp($3),$4)`,
        [msg.title, msg.content, msg.added, userID],
    );
    return rows[0];
}

async function upgradeMemberStatus(username) {
    await pool.query(
        `UPDATE ${env.database.usersTable} SET membership_status = TRUE WHERE username = $1`,
        [username],
    );
}

async function deleteMessage(messageID) {
    await pool.query(
        `DELETE FROM ${env.database.messagesTable} WHERE id = $1`,
        [messageID],
    );
}

module.exports = {
    createUser,
    getUser,
    addMessage,
    getMessagesWithUsers,
    upgradeMemberStatus,
    deleteMessage,
};
