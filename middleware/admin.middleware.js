const admin = (req,res,next) => {
    try {
        const adminToken = req.body.adminToken;
        if(adminToken!==process.env.ADMIN_TOKEN){
            return res.status(403).json({
                error: "Forbidden",
                message:"You are not an admin !"
            });
        }
        next();
    } catch (err) {
        res.status(401).json({ errorMessage: "Unauthorized" });
    }
}

module.exports = admin;