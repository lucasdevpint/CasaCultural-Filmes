package br.com.casacultural.casacultural_filmes.repository; // Seu pacote base + .repository

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.casacultural.casacultural_filmes.model.Filme;

// import java.util.List; // Descomente se for adicionar métodos de consulta personalizados que retornam List

@Repository // Marca esta interface como um componente de repositório Spring
public interface FilmeRepository extends JpaRepository<Filme, Integer> {
    // JpaRepository<Filme, Integer> significa:
    // - Filme: A entidade que este repositório vai gerenciar.
    // - Integer: O tipo da chave primária da entidade Filme (idFilme é int, então usamos a classe wrapper Integer).

    // O Spring Data JPA já fornece automaticamente métodos CRUD como:
    // save(Filme filme)                -> para salvar um novo filme ou atualizar um existente
    // findById(Integer id)             -> para buscar um filme pelo ID
    // findAll()                        -> para listar todos os filmes
    // deleteById(Integer id)           -> para deletar um filme pelo ID
    // count()                          -> para contar o número de filmes
    // existsById(Integer id)           -> para verificar se um filme existe pelo ID
    // ... e muitos outros!

    // Exemplos de métodos de consulta personalizados (descomente e use se precisar):
    /*
    // Para buscar filmes por título (ignorando maiúsculas/minúsculas e contendo a string)
    List<Filme> findByTituloContainingIgnoreCase(String titulo);

    // Para buscar filmes por gênero (ignorando maiúsculas/minúsculas e contendo a string)
    List<Filme> findByGeneroContainingIgnoreCase(String genero);
    */
}