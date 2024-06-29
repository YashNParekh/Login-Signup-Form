const express = require("express")
const path = require("path")
const app = express()
const signupHandler = require("./signupHandler");
const LogInCollection = require("./mongo")
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', publicPath)
app.use(express.static(publicPath));

app.use('/',(req,res)=>{
    res.status(201).render('home')
})


// app.get('/signup', (req, res) => {
//     // Handle GET request for /login
    
//   });


app.get('/signupsetup', (req, res) => {
    // Handle the request (e.g., perform some server-side logic)
    console.log('123')
    res.status(201).end('Server received the button click!');
});





app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    }
    console.log(data)
    try {
        const checking = await LogInCollection.findOne({ name: req.body.name })
        console.log(checking)
        if (checking) {
            if (checking.name === req.body.name && checking.password === req.body.password) {
                res.send("User details already exist")
            } else {
                await LogInCollection.insertMany([data])
                res.status(201).render("home", { naming: req.body.name })
            }
        } else {
            await LogInCollection.insertMany([data])
            res.status(201).render("home", { naming: req.body.name })
        }
    } catch (error) {
        res.status(500).send("An error occurred while processing your request")
    }
})

app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check && check.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` })
        } else {
            res.send("Incorrect password")
        }
    } catch (error) {
        res.send("Wrong details")
    }
})



app.listen(port, () => {
    console.log('Port connected')
})
