const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const TodoModel = require('./Models/Todo');

const app = express()
app.use(cors());
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB", err);
});

app.get('/get', (req, res) => {
    TodoModel.find()
        .then(result => res.json(result))
        .catch(err => {
            console.error("Error fetching tasks:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    TodoModel.findByIdAndUpdate(id, { done: true }, { new: true })
        .then(result => res.json(result))
        .catch(err => {
            console.error("Error updating task:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.delete('/delete/:id', (req, res) =>{
    const {id} = req.params;
    TodoModel.findByIdAndDelete({_id: id})
    .then(result => res.json(result))
    .catch(err => res.json(err))
}) 

app.post('/add', (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ error: 'Task is required' });
    }

    TodoModel.create({ task })
        .then(result => res.status(201).json(result))
        .catch(err => {
            console.error("Error adding task:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.listen(3001, () => {
    console.log("Server is Running on port 3001");
});
