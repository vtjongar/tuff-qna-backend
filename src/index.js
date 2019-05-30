const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// baby database
const questions = [];

app.use(helmet());

app.use(bodyParser.json());

app.use(cors());

app.use(morgan("combined"));

// this gets all existing questions
app.get("/", (req, res) => {
  const qs = questions.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description,
    answers: q.answers.length
  }));
  res.send(qs);
});

// this posts a new question
app.post("/", (req, res) => {
  const { title, description } = req.body;
  const newQuestion = {
    id: questions.length + 1,
    title,
    description,
    answers: []
  };
  questions.push(newQuestion);
  res.status(200).send();
});

// this posts an answer to a question
app.post("/answer/:id", (req, res) => {
  const { answer } = req.body;

  const question = questions.filter(q => q.id === parseInt(req.params.id));
  if (question.length > 1) return res.status(500).send();
  if (question.length === 0) return res.status(404).send();

  question[0].answers.push({
    answer
  });

  res.status(200).send();
});
