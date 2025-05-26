// src/main/java/br/com/casacultural/filmes/service/FilmeService.java
package br.com.casacultural.casacultural_filmes.service; // Ajuste este pacote se o seu for diferente

import br.com.casacultural.casacultural_filmes.model.Filme;
import br.com.casacultural.casacultural_filmes.repository.FilmeRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Para gerenciamento de transações

import java.util.List;
import java.util.Optional;

@Service // Marca esta classe como um componente de serviço Spring
public class FilmeService {

    private final FilmeRepository filmeRepository;

    // Injeção de dependência do FilmeRepository via construtor (recomendado)
    
    public FilmeService(FilmeRepository filmeRepository) {
        this.filmeRepository = filmeRepository;
    }

    @Transactional(readOnly = true) // Transação apenas para leitura, otimiza a performance
    public List<Filme> listarTodosFilmes() {
        return filmeRepository.findAll(); // O JpaRepository já fornece este método
    }

    @Transactional(readOnly = true)
    public Optional<Filme> buscarFilmePorId(Integer id) {
        // findById retorna um Optional, que é uma forma de lidar com valores que podem ser nulos
        return filmeRepository.findById(id);
    }

    @Transactional // Transação de escrita (padrão)
    public Filme adicionarOuAtualizarFilme(Filme filme) {
        // O método save() do JpaRepository serve tanto para criar (se o ID for nulo/novo)
        // quanto para atualizar (se o ID já existir no banco)
        return filmeRepository.save(filme);
    }

    @Transactional
    public boolean deletarFilme(Integer id) {
        if (filmeRepository.existsById(id)) {
            filmeRepository.deleteById(id);
            return true; // Filme existia e foi deletado
        }
        return false; // Filme não encontrado para deletar
    }

    // Você pode adicionar mais métodos de lógica de negócios aqui.
    // Por exemplo, se precisasse calcular a avaliação média de um filme:
    /*
    @Transactional(readOnly = true)
    public double calcularAvaliacaoMedia(Integer idFilme) {
        Filme filme = buscarFilmePorId(idFilme).orElse(null);
        if (filme != null && filme.getAvaliacoes() != null && !filme.getAvaliacoes().isEmpty()) {
            return filme.getAvaliacoes().stream()
                        .mapToInt(Analise::getNota)
                        .average()
                        .orElse(0.0);
        }
        return 0.0;
    }
    */
    // Nota: Para o cálculo acima funcionar bem, o carregamento das avaliações na entidade Filme
    // precisaria ser EAGER ou a transação precisaria abranger o acesso a filme.getAvaliacoes().
    // Por enquanto, vamos manter simples. A lógica de avaliação média pode ser tratada
    // quando formos exibir os dados no front-end ou em uma camada de DTO.
}