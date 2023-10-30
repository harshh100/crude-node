const express = require('express');
const app = express();

const admin = require("firebase-admin");
const key = require('./key.json');

admin.initializeApp({
    credential: admin.credential.cert(key)
});

const db = admin.firestore();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

let PORT = process.env.PORT || 5000;


app.post('/create', async (req, res) => {
    try {
        const id = req.body.email;
        const userJson = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
        const response = await db.collection("users").doc(id).set(userJson);
        res.send(response);
    } catch (err) {
        res.send(err);
    }
})

app.get('/read/all', async (req, res) => {
    try {
        const userRef = db.collection("users");
        const dt = await userRef.get();
        let response = [];
        dt.forEach(doc => { response.push(doc.data()) });
        res.send(response);
    } catch (err) {
        res.send(err);
    }
})

app.get('/read/:id', async (req, res) => {
    try {
        const userRef = db.collection("users").doc(req.params.id);
        const response = await userRef.get();
        res.send(response.data());
    } catch (err) {
        res.send(err);
    }
})


app.post('/update', async (req, res) => {
    try {
        const id = req.body.id;
        const newFirstName = "hello"
        const userRef = await db.collection("users").doc(id).update({
            firstName: newFirstName
        });
        res.send(response);
    } catch (err) {
        res.send(err);
    }
})


app.listen(PORT, () => {
    console.log(`Server connected to http://localhost:${PORT}`);
})