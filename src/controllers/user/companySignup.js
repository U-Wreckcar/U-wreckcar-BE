export async function signupForCompany(req, res, next) {
    try {
        const { name, email, phone, password, companyName } = req.body;

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}
