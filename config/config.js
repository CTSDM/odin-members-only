const env = {
    database: {
        url: process.env.DATABASE_URL,
        usersTable: process.env.TABLE_USERS_NAME,
        messagesTable: process.env.TABLE_MESSAGES_NAME,
    },
    memberCode: process.env.MEMBER_CODE,
    adminCode: process.env.ADMIN_CODE,
};

module.exports = { env };
