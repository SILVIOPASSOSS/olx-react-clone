const prisma = require('../prisma');
const bcrypt = require('bcrypt');

const getUser = async (req, res) => {
  const {id} = req.user; // ID está no token JWT

  try {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if(!user) {
    return res.status(404).json({error: 'Usuário não encontrado'});
  }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário'})
  };

};
const updateUser = async (req, res) => {
  const {id} = req.user;
  const {name, email, state, password} = req.body;

  try {
    const updateData = { name, email, state };

    // Se a senha for fornecida, encripta antes de salvar
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Encript a senha
      updateData.password = hashedPassword;
    }

    const user = await prisma.user.update({
      where: {id},
      data: updateData,
    });

    res.status(200).json(user);

  } catch (error) {
    console.error('Erro ao atualizar usuario', error); // log detalhado do servidor
    res.status(500).json({ error: 'Erro ao atualizar dados' })
  };
};
  
  module.exports = {
  getUser,
  updateUser,
};