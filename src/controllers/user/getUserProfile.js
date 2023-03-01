export function getUserProfile(req, res, next) {
    try {
        console.log(req.body)
        res.status(200).send({
            message : 'Test Ok.'
        })
    } catch (err) {
        console.error(err)
        return next(err)
    }
}