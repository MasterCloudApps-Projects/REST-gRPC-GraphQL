module.exports = {
    Query: {
        distance: (_, {from, to}) => ({from, to, km: 540})
    }
};
