import api from "@/config/api";

// Cache para armazenar as capas dos álbuns
const albumCache = new Map();

/**
 * Busca a capa de um álbum pelo ID, usando cache para evitar requisições duplicadas
 * @param {number} albumId - ID do álbum
 * @returns {Promise<string|null>} URL da capa do álbum ou null se não encontrado
 */
export const getAlbumCover = async (albumId) => {
  if (!albumId) return null;
  
  // Verifica se já está no cache
  if (albumCache.has(albumId)) {
    return albumCache.get(albumId);
  }
  
  try {
    const response = await api.get(`/api/albums/${albumId}`);
    const coverUrl = response.data.cover_url;
    
    // Armazena no cache (mesmo que seja null)
    albumCache.set(albumId, coverUrl);
    
    return coverUrl;
  } catch (error) {
    console.warn(`Erro ao buscar capa do álbum ${albumId}:`, error);
    // Armazena null no cache para evitar tentativas repetidas
    albumCache.set(albumId, null);
    return null;
  }
};

/**
 * Busca as capas de múltiplos álbuns de uma vez
 * @param {number[]} albumIds - Array de IDs dos álbuns
 * @returns {Promise<Map<number, string|null>>} Map com albumId -> coverUrl
 */
export const getMultipleAlbumCovers = async (albumIds) => {
  const results = new Map();
  const uncachedIds = [];
  
  // Verifica quais IDs não estão no cache
  for (const albumId of albumIds) {
    if (albumId && !albumCache.has(albumId)) {
      uncachedIds.push(albumId);
    } else if (albumId) {
      results.set(albumId, albumCache.get(albumId));
    }
  }
  
  // Busca os que não estão no cache
  if (uncachedIds.length > 0) {
    const promises = uncachedIds.map(async (albumId) => {
      const coverUrl = await getAlbumCover(albumId);
      results.set(albumId, coverUrl);
    });
    
    await Promise.allSettled(promises);
  }
  
  return results;
};

/**
 * Limpa o cache (útil para testes ou quando necessário)
 */
export const clearAlbumCache = () => {
  albumCache.clear();
}; 