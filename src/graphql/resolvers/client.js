const Client = require("../../models/client")

function assertUserLogIn(user) {
    if (user == undefined || user.username == undefined) {
        throw new Error("Access restricted. Please, provide a valid access token");
    }
}

module.exports = {
    Query: {
        client: async (_, {dni}, context) => {
            assertUserLogIn(context.user);
            const client = await Client.findOne({dni});
            if (client) {
                return client;
            }
        },
    }
};
