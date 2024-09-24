const prisma = require('../prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Login e senha são obrigatórios' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verifica se a senha fornecida corresponde à senha armazenada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Gera um token JWT
    const token = generateToken(user.id);

    // Retorna o token ao cliente
    res.status(200).json({ token });

  } catch (error) {
    console.error('Erro ao tentar fazer login:', error);
    res.status(500).json({ error: 'Falha ao logar' });
  }
};

const register = async (req, res) => {
  const { email, password, name, state } = req.body;

  if (!email || !password || !name || !state) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Verifique o hash gerado
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        state,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Falha ao registrar usuário' });
  }
};

module.exports = {
  signIn,
  register,
};
