module.exports = (req, res) => res.format({
    'text/plain': () => res.send(`Distance from ${req.params.from} to ${req.params.to}: 540Km`)
});
