export function middleware(req, res, next) {
    const token = req.headers.token;
    console.log(token)
    if (token) {
        next()
    } else {
        res.json({ msg: "user is not auth..." })
    }
}