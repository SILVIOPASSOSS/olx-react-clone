const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const clearDatabase = async () => {
  try {
    // Excluindo primeiro as imagens associadas aos anúncios
    await prisma.image.deleteMany();
    // Excluindo os anúncios após excluir as imagens associadas
    await prisma.ads.deleteMany();
    console.log('Todos os registros foram excluídos.');
  } catch (error) {
    console.error('Erro ao excluir registros:', error);
  } finally {
    await prisma.$disconnect();
  }
};

clearDatabase();