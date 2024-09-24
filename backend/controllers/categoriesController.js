const prisma = require('../prisma');

const createCategory = async (req, res) => {
  const { slug, name } = req.body;  
  
    //verifica se todos os campos estão presentes
    if(!slug || !name || !req.file){
      return res.status(400).json({ error: 'Todos os campos são obrigatórios'});
    }
    const img = req.file.filename; // Caminho do arquivo salvo
    try {
    const newCategory = await prisma.category.create({
      data: { slug, name, img },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar a categoria' });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch(error) {
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
};

module.exports = {
  createCategory,
  getCategories,
};