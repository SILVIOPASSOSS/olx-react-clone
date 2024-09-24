const prisma = require('../prisma');

const createAd = async (req, res) => {
  console.log('Arquivos recebidos', req.files);
  
  const { title, description, price, categoryId, priceNegotiable, stateName } = req.body;
  const userId = req.user.id; // Pegando o userId do usuário logado
  const files = req.files || [];

  console.log('Dados recebidos:', { title, description, price, categoryId, priceNegotiable, stateName });
  console.log('UserID:', userId);
  console.log('Arquivos:', files);

  try {
    // Verificação dos campos obrigatórios
    if (!title || !description || !price || !userId || files.length === 0) {
      console.error('Campos faltando:', { title, description, price, stateName, files });
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Verificar o campo preço
    const priceValue = parseFloat(price);
    console.log('Preço convertido:', priceValue);
    if (isNaN(priceValue)) {
      return res.status(400).json({ error: 'Preço deve ser um valor numérico' });
    }

    // Mapeamento das imagens
    const imageArray = files.map(file => ({ url: file.filename }));

    // Criação do novo anúncio
    const newAd = await prisma.ads.create({
      data: {
        title,
        description,
        price: priceValue,
        priceNegotiable: priceNegotiable === 'true',
        userId: parseInt(userId, 10),
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
        stateName,
        images: {
          create: imageArray // Adicione suas imagens aqui, se houver
        }
      },
      include: {
        user: true,
        images: true,
        category: true
      }
    });

    res.status(201).json(newAd);
  } catch (error) {
    console.error('Erro ao criar o Anúncio:', error);
    res.status(500).json({ error: 'Erro ao criar o Anúncio', details: error.message });
  }
};

const getAds = async (req, res) => {
  const { q, cat, state, limit } = req.query;

  try {
    const ads = await prisma.ads.findMany({
      where: {
        ...(q && {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } }
          ]
        }),
        ...(cat && { category: { slug: cat } }),
        //...(state && { stateName: state})
        ...(state &&  {user: { state: { equals: state  } } }),
      },
      include: {
        images: true,
        //category: true,
        
        user: {
          select: {
            state: true,
          },
        }, 
        category: true,
      },
      take: Number(limit) || 3,
    });

    
    // Verifica se a resposta é um array
    if (!Array.isArray(ads)) {
      console.error('Resposta da API não é um array:', ads);
      return res.status(500).json({ error: 'Erro interno' });
    }

    res.json(ads);
  } catch (error) {
    console.error('Erro ao buscar anúncios:', error);
    res.status(500).json({ error: 'Erro interno ao buscar anúncios' });
  }
};

// Função no backend para buscar o anúncio
const getAdById = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica se o ID é válido
    if (!id) {
      return res.status(400).json({ error: 'ID não fornecido' });
    }

    // Recupera o anúncio pelo ID
    const ad = await prisma.ads.findUnique({
      where: { id: Number(id) },
      include: { images: true, user: true, category: true} // incluindo img
    });

    if (!ad) {
      return res.status(404).json({ error: 'Anúncio não encontrado' });
    }

    /* res.json(ad);
  } catch (error) {
    console.error('Erro ao buscar anúncio:', error);
    res.status(500).json({ error: 'Erro ao buscar anúncio' });
  } */
 // Buscar outros anúncios do mesmo usuário
  const otherAds = await prisma.ads.findMany({
    where: {
      userId: ad.userId,
      id: { not: Number(id) }, // Exclui o anúncio atual
    },
    include: { images: true },
  });

    res.json({ ...ad, others: otherAds });
  } catch (error) {
    console.error('Erro ao buscar anúncio:', error);
    res.status(500).json({ error: 'Erro ao buscar anúncio' });
  }
};

const incrementAdViews = async (req, res) => {
  const { id } = req.params;
  try {
    const ad = await prisma.ads.update({
      where: { id: parseInt(id, 10) },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        images: true,
      },
    });

    if (!ad) {
      return res.status(404).json({ error: 'Anúncio não encontrado' });
    }

    res.json(ad);
  } catch (error) {
    console.error('Erro ao incrementar views:', error);
    res.status(500).json({ error: 'Erro ao incrementar views' });
  }
};

const getAdsByUser = async (req, res) => {
  const { userId} = req.params;

  try {
    const ads = await prisma.ads.findMany({
      where: {
        userId: parseInt(userId, 10),
      },
      include: { images: true },
    });

    if (ads.length === 0) {
      return res.status(404).json({error: 'Nenhum anúncio encontrado'})
    }
    res.status(200).json(ads);
  } catch (error) {
    console.error('Erro ao buscar anúncios do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar anúncios' });
  }
};

const updateAd = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, categoryId, priceNegotiable, stateName, removedImages } = req.body;
  const files = req.files || [];
  console.log('Files:', req.files);
  console.log('Body:', req.body);

  try {

    // Parse removedImages como um array de inteiros
    const removedImagesArray = JSON.parse(removedImages).map(Number);

    // Encontrar o anúncio existente
    const ad = await prisma.ads.findUnique({
      where: { id: parseInt(id) },
      include: { images: true }
    });

    if (!ad) {
      return res.status(404).json({ error: "Ad not found" });
    }

    // Verificar o campo preço
    const priceValue = parseFloat(price);
    if (isNaN(priceValue)) {
      return res.status(400).json({ error: 'Preço deve ser um valor numérico' });
    }

    // Mapeamento das novas imagens
    const newImages = files.map(file => ({ url: file.filename, adId: ad.id }));

    // Atualizar o anúncio sem as imagens
    const updateData = {
      title,
      description,
      price: priceValue,
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
      priceNegotiable: priceNegotiable === 'true',
      stateName
    };

    // Atualizar o anúncio sem alterar as imagens ainda
    const updatedAd = await prisma.ads.update({
      where: { id: Number(id) },
      data: updateData,
      include: { images: true }
    });

   // Se houver imagens para remover, remover as imagens
    if (removedImagesArray.length > 0) {
      await prisma.image.deleteMany({
        where: { id: { in: removedImagesArray }, adId: ad.id }
      });
    };
  
    // Se houver novas imagens para adicionar, adicionar as imagens
    if (newImages.length > 0) {
      await prisma.image.createMany({
        data: newImages
      });
    }

    // Retornar o anúncio atualizado
    res.status(200).json(updatedAd);

  } catch (error) {
    console.error('Erro ao atualizar o anúncio:', error);
    res.status(500).json({ error: 'Erro ao atualizar o anúncio', details: error.message });
  }
};


const deleteAd = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar se o anúncio existe
    const ad = await prisma.ads.findUnique({
      where: { id: parseInt(id) }
    });

    if (!ad) {
      console.log(`Ad with ID: ${id} not found.`);
      return res.status(404).json({ error: "Ad not found" });
    }

    // Excluir imagens associadas
    await prisma.image.deleteMany({
      where: { adId: parseInt(id) }
    });

    // Excluir o anúncio
    await prisma.ads.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error) {
    console.error("Error deleting ad:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createAd,
  getAds,
  //getFilteredAds,
  getAdById,
  getAdsByUser,
  incrementAdViews,
  updateAd,
  deleteAd,
};
