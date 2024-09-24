const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    
    // Verifica se a resposta da API é bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro na resposta da API: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Verifica se os dados estão no formato esperado
    if (!Array.isArray(data)) {
      throw new Error('Dados retornados não são uma lista de estados');
    }

    const states = data.map(state => state.nome);

    res.json(states);
  } catch (error) {
    console.error('Erro ao buscar estados:', error);
    res.status(500).json({ error: 'Failed to fetch states' });
  }
});

module.exports = router;
