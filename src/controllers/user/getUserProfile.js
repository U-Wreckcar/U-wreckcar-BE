export function getUserProfile(req, res, next) {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        console.error(err);
        return next(err);
    }
}
