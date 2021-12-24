const express = require('express')
// const path = require('path')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/my_database',{useNewUrlParser: true})

const app = new express()
const ejs = require('ejs')
const { resourceUsage } = require('process')

const fileUpload = require('express-fileupload')

// const BlogPost = require('./models/BlogPost')


const newPostController = require('./controllers/newPost')
const homeController = require('./controllers/home')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const newUserController = require('./controllers/newUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')

app.set('view engine','ejs')

// const validateMiddleWare = (req,res,next) =>{
//     if(req.files == null || req.body.title == null){
//         return res.redirect('/posts/new')
//     }
//     next()
// }
const validateMiddleWare =  require('./middleware/validationMiddleware');

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())
app.use(fileUpload())
app.use('/posts/store',validateMiddleWare)

app.listen(4000,()=>{
    console.log('App listening on port 4000')
})

// app.get('/',async (req,res) =>{
//     const blogposts = await BlogPost.find({})
//     console.log(blogposts)
//     res.render('index',{
//         blogposts
//     })
// })


app.get('/about',(req,res) =>{
    res.render('about')
})

app.get('/contact',(req,res) =>{
    res.render('contact')
})

app.get('/post/:id',async (req,res) =>{
    const blogpost = await BlogPost.findById(req.params.id)
    res.render('post',{
        blogpost
    })
})

app.get('/', homeController)

app.get('/post/:id',getPostController);

app.get('/posts/new',newPostController);

app.post('/posts/store', storePostController);

app.post('/users/register', storeUserController);

app.get('/', homeController);

app.get('/auth/register', newUserController);

app.get('/auth/login', loginController);

app.post('/users/login', loginUserController);

// app.get('/posts/new',(req,res) =>{
//     res.render('create')
// })

app.post('/posts/store',async (req,res) =>{    
    let image = req.files.image
    image.mv(path.resolve(__dirname,'public/img',image.name),
        async (error)=>{
            await BlogPost.create({
                ...req.body,
                image:'/img/' + image.name
            })
            res.redirect('/')
        })

})