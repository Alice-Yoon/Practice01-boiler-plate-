const express = require('express');
const app = express();
const port = 5000;

const { User } = require('./models/User');
const { Favorite } = require('./models/Favorite');
const { auth } = require('./middleware/auth');
const config = require('./config/key');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// application/json
app.use(bodyParser.json());

app.use(cookieParser())

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...')).catch( err => console.log(err))



// Example Route
app.get('/', (req, res) => res.send('Hello World!! 안뇽안뇽! backend 잘 되나?'));


// 회원가입 Route
app.post('/api/users/register', (req, res) => {

    // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.

    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})


// 로그인 Route
app.post('/api/users/login', (req, res) => {

    // (1) 요청된 이메일을 데이터베이스에서 있는지 찾는다.
        // User 모델을 가져온 후 -> findOne이라는 mongoDB method를 이용.
    User.findOne({email: req.body.email}, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        // (2) 요청된 이메일이 데이터베이스에 있다면, 비밀번호가 맞는지 확인.
            // comparePassword라는 method를 User model에서 만듬!
        user.comparePassword(req.body.password, (err, isMatch) => {

            if(!isMatch)
                return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})

            // (3) 비밀번호까지 맞다면, 토큰을 생성.
                // 토큰을 생성하는 method도 따로 만들어야 함!
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 등
                    // cookie-parser를 install하고, 이용한다(app.use)!
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({loginSuccess: true, userId: user._id})

            })
        })
    })
})


// 인증 Route
app.get('/api/users/auth', auth, (req, res) => {

    // 여기까지 미들웨어를 통과해 왔다는 얘기는, Authentication이 True라는 말.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })

    // 이렇게 auth 이후의 정보를 전달해주면, 어떤 페이지에서든지 이걸 이용해서 이것저것 할수 있게됨.
})


// 로그아웃 Route
app.get('/api/users/logout', auth, (req, res) => {


    User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err, user) => {
        if(err) return res.json({success: false, err});
        return res.status(200).send({
            success: true
        })
    })

})


// -----------<< Favorite >>------------
// Favorite Number 가져오기 Route
app.get('/api/favorite/favoriteNumber', (req, res) => {

    // (1) mongoDB에서 favorite 숫자를 가져오기
    Favorite.find({ "movieId": req.body.movieId })
        .exec((err, info) => {
            if (err) return res.status(400).send(err)

            // 'info'에 favorite 속 저 movieId로 등록된 것들의 array가 담겨 옴.

            // (2) 그 다음에 프론트에 다시 숫자 정보 보내주기
            res.status(200).json({ success: true, favoriteNumber: info.length })
        })
})

// 내가 해당 영화를 Favorite 했는지 여부 가져오기 Route
app.get('/api/favorite/favorited', (req, res) => {

    Favorite.find({"userFrom": req.body.userFrom, "movieId": req.body.movieId})
        .exec((err, info) => {
            if(err) return res.status(400).send(err)

            const favorited = info.length !== 0 ? true : false;

            res.status(200).json({success: true, favorited})
        })

})

// Add Favorite
app.post('/api/favorite/addFavorite', (req, res) => {

    const favorite = new Favorite(req.body);

    favorite.save((err, info) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({
            success: true
        })
    })
})


// Remove from Favorite
app.post('/api/favorite/removeFromFavorite', (req, res) => {

    Favorite.findOneAndDelete({userFrom: req.body.userFrom, movieId: req.body.movieId})
        .exec((err, info) => {
            if(err) return res.status(400).send(err)
            return res.status(200).json({success: true, info})
        })


})


// Get Favored Movies
app.post('/api/favorite/getFavoredMovie', (req, res) => {

    Favorite.find({userFrom: req.body.userFrom})
        .exec((err, info) => {
            if (err) return res.status(400).send(err)
            return res.status(200).json({
                success: true,
                favoredMovies: info
            })
        })


})



app.listen(port, () => console.log(`Example app listening on port ${port}`));


