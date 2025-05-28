const token = process.env.TOKEN_MELHORENVIO;

console.log('API acessada')

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const token = process.env.TOKEN_MELHORENVIO;
  if (!token) {
    return res.status(500).json({ error: 'Token não configurado' });
  }

  try {
    const body = req.body;
    const { cep_origem, cep_destino } = req.query;
    if(!cep_origem || !cep_destino){
      return;
    }

    const response = await fetch('https://melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Aplicação gabrielambe13@gmail.com'
      },
      body: JSON.stringify({
        from: {postal_code: cep_origem},
        to: {postal_code: cep_destino},
        package: {height: 4, width: 12, length: 17, weight: 0.3},
        services: "1,2"
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Erro interno no servidor', details: err.message });
  }
}