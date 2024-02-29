require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')

const users = [];
const exercises = [];

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req, res) => {
  const { username } = req.body;

  const user = {
    username,
    _id: 'user-' + Date.now()
  };

  users.unshift(user);

  res.json(user);
});

app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration } = req.body;
  let { date } = req.body;

  if (!date) {
    date = new Date().toDateString();
  } else {
    date = new Date(date).toDateString()
  }

  const user = users.find((user) => user._id === _id);

  const exercise = {
    username: user.username,
    description,
    duration: Number(duration),
    date,
    _id
  }

  exercises.unshift(exercise);

  res.json(exercise);
});

app.get('/api/users/:_id/logs', (req, res) => {
  const { from, to, limit } = req.query;
  const { _id } = req.params;
  const user = users.find((user) => user._id === _id);

  let log = exercises.filter((exercise) => exercise._id === _id);

  if (from) {
    console.log({ from });
    const dateFrom = new Date(from).getTime();

    log = log.filter((exercise) => new Date(exercise.date).getTime() >= dateFrom);
  }

  if (to) {
    console.log({ to });
    const dateTo = new Date(to).getTime();

    log = log.filter((exercise) => new Date(exercise.date).getTime() <= dateTo);
  }

  if (limit) {
    console.log({ limit });
    log = log.slice(0, Number(limit));
  }

  log = log.map((el) => ({
    description: el.description,
    duration: el.duration,
    date: el.date
  }));

  const response = {
    username: user.username,
    count: log.length,
    _id: 'log-'+ Date.now(),
    log
  };

  res.json(response);
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
