module.exports= (req, res, next)=>{
    if(!req.session.isManager){
        return res.status(401).redirect('/')
    }
    next();
}