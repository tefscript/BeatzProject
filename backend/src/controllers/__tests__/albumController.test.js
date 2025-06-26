import { afterEach, beforeEach, describe, jest, it, expect } from '@jest/globals';
import {
  getAlbumInfo,
  getMusicsFromAlbum,
  addMusicToAlbum,
  removeMusicFromAlbum,
  setCoverPhoto
} from '../albumController.js';

import { handleError } from '../../utils/handleError.js';

// Mock do módulo db.js (cliente Supabase)
// Definimos os mocks internos aqui para garantir que estejam no escopo correto
// e os exportamos com um prefixo para serem acessíveis nos testes.
jest.mock('../../config/db.js', () => {
  // Mocks para as operações na tabela 'songs'
  const mockSongs = {
    select: jest.fn().mockReturnThis(), // Permite encadeamento .select().eq()
    eq: jest.fn().mockReturnThis(),     // Permite encadeamento .eq().update()
    update: jest.fn().mockReturnThis(), // Permite encadeamento .update().eq()
  };

  // Mocks para as operações na tabela 'albums'
  const mockAlbums = {
    update: jest.fn().mockReturnThis(), // Permite encadeamento .update().eq()
    eq: jest.fn().mockReturnThis(),     // Permite encadeamento .eq().single()
  };

  // Mocks para operações gerais que podem não ser específicas de uma tabela (como .single())
  const mockGeneral = {
    select: jest.fn().mockReturnThis(), // Permite encadeamento .select().eq()
    eq: jest.fn().mockReturnThis(),     // Permite encadeamento .eq().single()
    single: jest.fn(),                  // Para casos onde se espera um único resultado
    update: jest.fn().mockReturnThis(), // Para updates gerais se necessário
  };

  // O objeto que será retornado quando 'db.js' for importado
  return {
    // O método 'from' do Supabase, que direciona para o mock da tabela correta
    from: jest.fn((table) => {
      if (table === 'songs') return mockSongs;
      if (table === 'albums') return mockAlbums;
      // Retorna o mock geral se a tabela não for especificamente mockada
      return mockGeneral;
    }),
    // Exporta os mocks internos para que possamos configurá-los em cada teste
    _mockSongs: mockSongs,
    _mockAlbums: mockAlbums,
    _mockGeneral: mockGeneral,
  };
});

// Mock simples da função handleError para verificar se foi chamada
jest.mock('../../utils/handleError.js', () => ({
  handleError: jest.fn(),
}));

describe('Album Controller', () => {
  let req, res;
  let mockedDb; // Variável para armazenar a referência ao módulo 'db' mockado

  // Executa antes de cada teste
  beforeEach(() => {
    // Obtém o módulo 'db' mockado explicitamente para garantir que está inicializado
    mockedDb = jest.requireMock('../../config/db.js');

    // Reseta os objetos de requisição (req) e resposta (res) para cada teste
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(), // Permite encadeamento res.status().json()
      json: jest.fn(),
    };

    // Limpa e reseta o estado de todos os mocks internos do 'db'
    // Isso é crucial para que os testes sejam independentes
    mockedDb.from.mockClear(); // Limpa as chamadas ao método 'from'

    mockedDb._mockSongs.select.mockClear().mockReturnThis();
    mockedDb._mockSongs.eq.mockClear().mockReturnThis();
    mockedDb._mockSongs.update.mockClear().mockReturnThis();

    mockedDb._mockAlbums.update.mockClear().mockReturnThis();
    mockedDb._mockAlbums.eq.mockClear().mockReturnThis();

    mockedDb._mockGeneral.select.mockClear().mockReturnThis();
    mockedDb._mockGeneral.eq.mockClear().mockReturnThis();
    mockedDb._mockGeneral.single.mockClear();
    mockedDb._mockGeneral.update.mockClear().mockReturnThis();

    // Limpa o mock da função handleError
    handleError.mockClear();
  });

  // Executa depois de cada teste
  afterEach(() => {
    // Limpa todos os mocks (incluindo aqueles definidos com jest.mock)
    jest.clearAllMocks();
  });

  // Grupo de testes para a função getAlbumInfo
  describe('getAlbumInfo', () => {
    it('deve retornar as informações do álbum com sucesso', async () => {
      const albumData = { id: 'album1', title: 'Álbum de Teste', artist_id: 'artist1' };
      // Configura o mock para retornar dados de sucesso para .single()
      mockedDb._mockGeneral.single.mockResolvedValue({ data: albumData, error: null });

      req.params.albumId = 'album1'; // Define o ID do álbum na requisição
      await getAlbumInfo(req, res); // Chama a função do controller

      // Verifica se os mocks foram chamados corretamente
      expect(mockedDb.from).toHaveBeenCalledWith('albums');
      expect(mockedDb._mockGeneral.select).toHaveBeenCalledWith('*');
      expect(mockedDb._mockGeneral.eq).toHaveBeenCalledWith('id', 'album1');
      expect(mockedDb._mockGeneral.single).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(albumData); // Verifica a resposta JSON
      expect(res.status).not.toHaveBeenCalled(); // Verifica que o status 200 (padrão) não foi explicitamente definido
    });

    it('deve chamar handleError se houver um erro no banco de dados', async () => {
      const dbError = { message: 'Erro no banco de dados' };
      // Configura o mock para retornar um erro para .single()
      mockedDb._mockGeneral.single.mockResolvedValue({ data: null, error: dbError });

      req.params.albumId = 'album1';
      await getAlbumInfo(req, res);

      // Verifica se handleError foi chamado com o erro correto
      expect(handleError).toHaveBeenCalledWith(res, dbError);
    });
  });

  // Grupo de testes para a função getMusicsFromAlbum
  describe('getMusicsFromAlbum', () => {
    it('deve retornar uma lista de músicas do álbum', async () => {
      const songsData = [{ id: 's1', title: 'Música 1' }, { id: 's2', title: 'Música 2' }];
      // Configura o mock para retornar dados de sucesso para .select()
      mockedDb._mockSongs.select.mockResolvedValue({ data: songsData, error: null });

      req.params.albumId = 'album123';
      await getMusicsFromAlbum(req, res);

      expect(mockedDb.from).toHaveBeenCalledWith('songs');
      expect(mockedDb._mockSongs.select).toHaveBeenCalledWith('*');
      expect(mockedDb._mockSongs.eq).toHaveBeenCalledWith('album_id', 'album123');
      expect(res.json).toHaveBeenCalledWith(songsData);
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve chamar handleError se houver um erro ao buscar músicas', async () => {
      const dbError = { message: 'Erro ao buscar músicas' };
      // Configura o mock para retornar um erro para .select()
      mockedDb._mockSongs.select.mockResolvedValue({ data: null, error: dbError });

      req.params.albumId = 'album123';
      await getMusicsFromAlbum(req, res);

      expect(handleError).toHaveBeenCalledWith(res, dbError);
    });
  });

  // Grupo de testes para a função addMusicToAlbum
  describe('addMusicToAlbum', () => {
    it('deve retornar 400 se musicId estiver faltando', async () => {
      req.params.albumId = 'album1';
      req.body = {}; // musicId está faltando

      await addMusicToAlbum(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Id da musica é obrigatório' });
    });

    it('deve adicionar música ao álbum com sucesso', async () => {
      // Configura o mock para retornar sucesso para .update()
      mockedDb._mockSongs.update.mockResolvedValue({ error: null });

      req.params.albumId = 'album1';
      req.body.musicId = 'song1';
      await addMusicToAlbum(req, res);

      expect(mockedDb.from).toHaveBeenCalledWith('songs');
      expect(mockedDb._mockSongs.update).toHaveBeenCalledWith({ album_id: 'album1' });
      expect(mockedDb._mockSongs.eq).toHaveBeenCalledWith('id', 'song1');
      expect(res.json).toHaveBeenCalledWith({ message: 'Música adicionada ao album com sucesso!' });
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve chamar handleError se houver um erro ao adicionar música', async () => {
      const dbError = { message: 'Falha ao adicionar música' };
      // Configura o mock para retornar um erro para .update()
      mockedDb._mockSongs.update.mockResolvedValue({ error: dbError });

      req.params.albumId = 'album1';
      req.body.musicId = 'song1';
      await addMusicToAlbum(req, res);

      expect(handleError).toHaveBeenCalledWith(res, dbError);
    });
  });

  // Grupo de testes para a função removeMusicFromAlbum
  describe('removeMusicFromAlbum', () => {
    it('deve retornar 400 se musicId estiver faltando', async () => {
      req.params.albumId = 'album1';
      req.body = {}; // musicId está faltando

      await removeMusicFromAlbum(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Id da musica é obrigatório' });
    });

    it('deve remover música do álbum com sucesso', async () => {
      // Configura o mock para retornar sucesso para .update()
      mockedDb._mockSongs.update.mockResolvedValue({ error: null });

      req.params.albumId = 'album1';
      req.body.musicId = 'song1';
      await removeMusicFromAlbum(req, res);

      expect(mockedDb.from).toHaveBeenCalledWith('songs');
      expect(mockedDb._mockSongs.update).toHaveBeenCalledWith({ album_id: null });
      // A função do controller faz duas chamadas .eq() encadeadas
      expect(mockedDb._mockSongs.eq).toHaveBeenCalledWith('id', 'song1');
      expect(mockedDb._mockSongs.eq).toHaveBeenCalledWith('album_id', 'album1');
      expect(res.json).toHaveBeenCalledWith({ message: 'Música removida do album com sucesso!' });
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve chamar handleError se houver um erro ao remover música', async () => {
      const dbError = { message: 'Falha ao remover música' };
      // Configura o mock para retornar um erro para .update()
      mockedDb._mockSongs.update.mockResolvedValue({ error: dbError });

      req.params.albumId = 'album1';
      req.body.musicId = 'song1';
      await removeMusicFromAlbum(req, res);

      expect(handleError).toHaveBeenCalledWith(res, dbError);
    });
  });

  // Grupo de testes para a função setCoverPhoto
  describe('setCoverPhoto', () => {
    it('deve retornar 400 se a URL da imagem estiver faltando', async () => {
      req.params.albumId = 'album1';
      req.body = {}; // url está faltando

      await setCoverPhoto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Imagem é obrigatória.' });
    });

    it('deve atualizar a capa do álbum com sucesso', async () => {
      // Configura o mock para retornar sucesso para .update()
      mockedDb._mockAlbums.update.mockResolvedValue({ error: null });

      req.params.albumId = 'album1';
      req.body.url = 'http://nova-capa.jpg';
      await setCoverPhoto(req, res);

      expect(mockedDb.from).toHaveBeenCalledWith('albums');
      expect(mockedDb._mockAlbums.update).toHaveBeenCalledWith({ cover_url: 'http://nova-capa.jpg' });
      expect(mockedDb._mockAlbums.eq).toHaveBeenCalledWith('id', 'album1');
      expect(res.json).toHaveBeenCalledWith({ message: 'Capa do álbum atualizada com sucesso!' });
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve chamar handleError se houver um erro ao atualizar a capa', async () => {
      const dbError = { message: 'Falha ao atualizar a capa' };
      // Configura o mock para retornar um erro para .update()
      mockedDb._mockAlbums.update.mockResolvedValue({ error: dbError });

      req.params.albumId = 'album1';
      req.body.url = 'http://nova-capa.jpg';''
      await setCoverPhoto(req, res);

      expect(handleError).toHaveBeenCalledWith(res, dbError);
    });
  });
});
