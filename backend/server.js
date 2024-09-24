const express = require('express');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
//middleware para o json
app.use(express.json());


const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Diretório para armazenar arquivos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para o arquivo
  },
});

const uploadCategory = multer({ storage: categoryStorage });

const adsStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'media/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadAds = multer({ storage: adsStorage});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ 
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encotrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Dados para acesso invalidos' });
    }

    res.status(200).json({ message: 'Login feito com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Falha ao logar' });
  }
});

app.post('/register', async (req, res) => {
  const { email, password, name, state } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
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
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.get('/states', async (req, res) => {
  try {
    const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    const data = await response.json();
    const states = data.map(state => state.nome);
    res.json(states);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch states' });
  }
});

// Endpoint for new Category
app.post('/categories', uploadCategory.single('img'), async (req, res) => {
  try {
    //verifica se todos os campos estão presentes
    const { slug, name } = req.body;
    if(!slug || !name || !req.file){
      return res.status(400).json({ error: 'Todos os campos são obrigatórios'});
    }

    const img = req.file.filename; // Caminho do arquivo salvo

    const newCategory = await prisma.category.create({
      data: {
        slug,
        name,
        img,
      },
    });
    
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar a categoria' });
  }
});

app.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch(error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// Endpoint for new Ads
app.post('/ads', uploadAds.array('images', 10), async (req, res) => {
  try {
    //Verifica se todos os campos estão presentes
    const { title, description, price, userId } = req.body;
    if(!title || !description || !price || !userId || req.files) {
      console.error('Campos faltando:', { title, description, price, file: req.files });
      return res.status(400).json({ error: 'Todos os campos são obrigatórios'});
    }
    const images = req.files.map(file => ({ url: file.filename }));// Caminho do arquivo salvo
    const newAd = await prisma.ads.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        userId: parseInt(useId),
        images: {
          create: images,
        },
      },
        include: {
          user: true,
          images: true
        },
    });
  
    res.status(201).json(newAd);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o Anúncio '});
  }
});

app.get('/ad/list', async (req, res) => {
  try {
    const ads = await prisma.ads.findMany({
      include: {
        images: true,
      },
    });
    res.json(ads);
  } catch(error) {
    console.error('Erro ao buscar anuncios', error);
    res.status(500).json({ error: 'Erro ao buscar anuncios' });
  }
});

app.get('/ad/item', async (req, res) => {
  const { id } = req.query;
  try {
    const ad = await prisma.ads.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        images: true,
        user: true
      }
    });
    if (!ad) {
      return res.status(404).json({ error: 'Anúncio não encontrado' });
    }

    res.json({...ad,
      userInfo: {
        name: ad.user.name,
        email: ad.user.email,
        stateName: stateName
      }
    });
  } catch(error) {
    console.error('Erro ao abrir anúncio', error);
    res.status(500).json({ error: 'Erro ao abrir' });
  }
})

app.get('/ad/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await prisma.ads.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        images: true
      }
    });
    if (!ad) {
      return res.status(404).json({ error: 'Anúncio não encontrado' });
    }
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o anúncio' });
  }
});

app.get('/ad/item/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const ad = await prisma.ads.update({
      where: {
        id: parseInt(id, 10),
      },
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
      return res.status(404).json({ error: 'Anúncio não encontrado'});
    }
    
    res.json(ad);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao abrir'});
  }
});

// Endpoint para atualizar um anúncio existente
app.put('/ads/:id', uploadAds.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;
    
    if (!title || !description || !price) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const images = req.files ? req.files.map(file => ({ url: file.filename })) : [];

    const updatedAd = await prisma.ads.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        price: parseFloat(price),
        images: {
          // Atualiza as imagens (ajuste conforme seu modelo Prisma)
          upsert: images.map(image => ({
            where: { url: image.url },
            update: image,
            create: image,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    res.status(200).json(updatedAd);
  } catch (error) {
    console.error('Erro ao atualizar o anúncio:', error);
    res.status(500).json({ error: 'Erro ao atualizar o anúncio' });
  }
});

app.use('/uploads', express.static('uploads'));
app.use('/media', express.static('media'));

app.listen(3001, () => {
  console.log('Server running on port 3001');
});