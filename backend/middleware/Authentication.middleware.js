const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.send({ message: "Please Login First !!" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
        if (error) {
            return res.send({ message: "Please Login First !!" });
        } else {
            console.log(decoded);
            const { userId } = decoded;
            req.userId = userId;
            next();
        }
    });
}

module.exports = {
    authentication
};
