// signupHandler.js

const express = require('express');
const router = express.Router();
const LogInCollection = require('./mongo'); // Assuming this is where your MongoDB model is defined




router.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };

    try {
        const checking = await LogInCollection.findOne({ name: req.body.name });

        if (checking) {
            if (checking.name === req.body.name && checking.password === req.body.password) {
                res.send("User details already exist");
            } else {
                await LogInCollection.insertMany([data]);
                res.status(201).render("home", { naming: req.body.name });
            }
        } else {
            await LogInCollection.insertMany([data]);
            res.status(201).render("home", { naming: req.body.name });
        }
    } catch (error) {
        res.status(500).send("An error occurred while processing your request");
    }
});


router.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name });

        if (check && check.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` });
        } else {
            res.send("Incorrect password");
        }
    } catch (error) {
        res.send("Wrong details");
    }
});



module.exports = router;