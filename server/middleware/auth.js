const { User } = require('../models/User');

let auth = (req, res, next) => {

    // 인증 처리를 하는 곳

    // (1) 클라이언트 cookie에서 token을 가져온다.
    let token = req.cookies.x_auth;

    // (2) token을 복호화 한 후, 유저를 찾는다.
        // -> User model에서 method를 만들어서 하면 됨.
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true})

        req.token = token;
        req.user = user;
        next();
    })

    // (3) 유저가 있으면 인증 Okay! || 유저가 없으면 인증 NO!

}


module.exports = { auth };

