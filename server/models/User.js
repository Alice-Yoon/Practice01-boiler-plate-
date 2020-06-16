const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})


// User model에 유저 정보를 저장하기 전에, 뭔가 한다!는 뜻.
    // 이 처리가 다 끝나면 "next()"을 통해 다시 'save'하는 곳으로 돌아가는 것!
userSchema.pre('save', function(next) {
    var user = this;

    if(user.isModified('password')) {

        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }


})


// 로그인 시, 비밀번호 확인하는 method 만들기
userSchema.methods.comparePassword = function(plainPassword, cb) {

    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })

}

// 로그인 시, token을 생성하는 method 만들기
    // 토큰을 생셩하려면 "jsonwebtoken"이라는 라이브러리를 이용해야 함!
userSchema.methods.generateToken = function(cb) {

    var user = this;

    // jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
        // user._id + 'secretToken' = token
        // 'secretToken' -> user._id

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}


// auth 인증의 findByToken 메소드
userSchema.statics.findByToken = function(token, cb) {

    var user = this;

    // token을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {

        // 유저 아이디(decoded)를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인.
        user.findOne({"_id": decoded, "token": token}, function(err, user){

            if (err) return cb(err)
            cb(null, user)

        })

    })


}



const User = mongoose.model('User', userSchema);

module.exports = { User }