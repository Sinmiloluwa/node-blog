// Initialize express
const express = require('express');
const Blog = require('./models/blog');
const app = express();

// require db modules
const {connectDb} = require('./db');

// View engine
app.set('view engine', 'ejs');

// initialize app and middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended : true}))


// db connection
if (connectDb) {
    app.listen(3000)
}



// routes
app.get('/', (req,res) => {
    res.redirect('/blogs');
})

app.get('/add-blog', async (req, res) => {
    const blog = new Blog({
        title : 'Fullstack Developer Roadmap',
        snippet : 'This is my new Blog using mongoose',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
        tags : ['tech','programming']
    })
    try {
       let result = await blog.save()
            res.send(result)
    }
    catch(err) {
        console.log(err)
    }
})

app.get('/blogs', async (req, res) => {
    try{
        let result = await Blog.find()
        .sort({createdAt: -1})
        res.render('index', {title: 'All posts', blogs: result})
    }catch(err) {
        console.log(err)
    }
})

app.get('/blog/:item', async (req, res) => {
    try {
       let result = await Blog.find({tags: req.params.item})
        res.render('tags', {title : "Blog", blogs : result})
    }
    catch(err) {
        console.log(err)
    }
})

app.delete('/blog/:id', async (req, res) => {
    const id = req.params.id
    try{
        let result = await Blog.findByIdAndDelete(id)
        res.json({redirect : '/blogs'})
    }catch(err) {
        console.log(err)
    }
})

app.get('/blog/:id', async (req, res) => {
    try {
        let result = await Blog.findById(req.params.id)
        res.render('blogpost', {title: 'Single Post', blog: result})
    }catch(err) {
        res.send(err)
    }
}) 

app.get('/blogs/create', (req, res) => {
   res.render('newpost', {title: 'New Blog Post'})
})

app.post('/blog', async (req, res) => {
    const blog = new Blog(req.body)
    try{
        await blog.save()
        res.redirect('/blogs')
    }catch(err) {
        console.log(err)
    }
    
})

// middleware
app.use((req,res) => {
    res.status(404).render('404')
})
