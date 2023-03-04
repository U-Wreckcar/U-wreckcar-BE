export function getUserProfile(req, res, next) {
    try {
        console.log(req.headers);
        res.status(200).send({
            nickname: req.user.kakao_account.profile.nickname,
            profile_img: req.user.kakao_account.profile.profile_image_url,
            email: req.user.kakao_account.email,
        });
    } catch (err) {
        console.error(err);
        return next(err);
    }
}
