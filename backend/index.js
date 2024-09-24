const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const adsRoutes = require('./routes/adsRoutes');
const authRoutes = require('./routes/authRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const statesRoutes = require('./routes/statesRoutes');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/ads', adsRoutes);
app.use('/auth', authRoutes);
app.use('/categories', categoriesRoutes);
app.use('/states', statesRoutes);
app.use('/user', userRoutes);

// Arquivos estáticos
app.use('/uploads', express.static('uploads'));
app.use('/media', express.static('media'));

// Tratamento básico de erro 404 para rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Tratamento de erros gerais
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(3001, () => {
  console.log('Server rodando na porta 3001');
});
