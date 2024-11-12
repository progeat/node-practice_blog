const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {
  register,
  login,
  getUsers,
  updateUser,
  deleteUser,
} = require('./controllers/user');
const mapUser = require('./helpers/mapUser');
const authenticated = require('./middlewares/authenticated');
const hasRole = require('./middlewares/hasRole');
const ROLES = require('./constants/role');

const port = 3005;
const app = express();

app.use(cookieParser());
app.use(express.json());

app.post('/register', async (req, res) => {
  try {
    const { user, token } = await register(req.body.login, req.body.password);

    res
      .cookie('token', token, { httpOnly: true })
      .send({ error: null, user: mapUser(user) });
  } catch (e) {
    res.send({ error: e.message || 'Unknown error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { user, token } = await login(req.body.login, req.body.password);

    res
      .cookie('token', token, { httpOnly: true })
      .send({ error: null, user: mapUser(user) });
  } catch (e) {
    res.send({ error: e.message || 'Unknown error' });
  }
});

app.post('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true }).send({});
});

app.use(authenticated);

app.get('/users', hasRole([ROLES.ADMIN]), async (req, res) => {
  const users = await getUsers();

  res.send({ data: users.map(mapUser) });
});

app.get('/users/roles', hasRole([ROLES.ADMIN]), async (req, res) => {
  const roles = await getRoles();

  res.send({ data: roles });
});

app.patch('/users/:id', hasRole([ROLES.ADMIN]), async (req, res) => {
  const newUser = await updateUser(req.params.id, {
    role: req.body.roleId,
  });

  res.send({ data: mapUser(newUser) });
});

app.delete('/users/:id', hasRole([ROLES.ADMIN]), async (req, res) => {
  await deleteUser(req.params.id);

  res.send({ error: null });
});

mongoose
  .connect(
    'mongodb+srv://progeat:silviaS2000@clustertest.vfynt.mongodb.net/blog?retryWrites=true&w=majority&appName=ClusterTest'
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  });
