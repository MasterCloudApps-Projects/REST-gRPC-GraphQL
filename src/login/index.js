const jwt = require('jsonwebtoken');

users = [
    {
        username: "pepe",
        password: "secret"
    }
]

module.exports = (req, res) => {
    // Read username and password from request body
    const { username, password } = req.body;

    // Filter user from the users array by username and password
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {
        const accessToken = jwt.sign({ username: user.username,  role: user.role }, process.env.ACCESS_TOKEN_SECRET);
        res.json({accessToken});
    } else {
        res.status(401);
        res.send('Username or password incorrect');
    }
};
