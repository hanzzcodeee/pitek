const axios = require('axios');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    // Validasi URL TikTok
    const tiktokRegex = /^(https?:\/\/)?(www\.|m\.|vm\.)?(tiktok\.com\/.+|vt\.tiktok\.com\/.+)|https?:\/\/vm\.tiktok\.com\/.+/i;
    if (!tiktokRegex.test(url)) {
      return res.status(400).json({ error: 'URL TikTok tidak valid.' });
    }
    
    // Gunakan API utama
    const apiUrl = `https://apii.baguss.web.id/downloader/ttdl?apikey=bagus&url=${encodeURIComponent(url)}`;
    
    const response = await axios.get(apiUrl, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.data && response.data.success) {
      return res.status(200).json(response.data);
    } else {
      return res.status(500).json({ error: 'Gagal mengambil data dari TikTok' });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({ 
        error: 'API error: ' + error.response.statusText 
      });
    } else if (error.request) {
      return res.status(500).json({ 
        error: 'Tidak dapat terhubung ke server. Silakan coba lagi.' 
      });
    } else {
      return res.status(500).json({ 
        error: 'Terjadi kesalahan internal' 
      });
    }
  }
};
