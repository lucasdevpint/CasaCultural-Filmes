// src/main/java/br/com/casacultural/filmes/service/AnaliseService.java
package br.com.casacultural.casacultural_filmes.service; // Ajuste este pacote se o seu for diferente

import br.com.casacultural.casacultural_filmes.model.Analise;
import br.com.casacultural.casacultural_filmes.model.Filme;
import br.com.casacultural.casacultural_filmes.repository.AnaliseRepository;
import br.com.casacultural.casacultural_filmes.repository.FilmeRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class AnaliseService {

    private final AnaliseRepository analiseRepository;
    private final FilmeRepository filmeRepository; // Precisamos para associar a análise a um filme

    
    public AnaliseService(AnaliseRepository analiseRepository, FilmeRepository filmeRepository) {
        this.analiseRepository = analiseRepository;
        this.filmeRepository = filmeRepository;
    }

    @Transactional(readOnly = true)
    public List<Analise> listarAnalisesPorFilmeId(Integer idFilme) {
        return analiseRepository.findByFilme_IdFilme(idFilme);
    }

    @Transactional(readOnly = true)
    public Optional<Analise> buscarAnalisePorId(Integer idAnalise) {
        return analiseRepository.findById(idAnalise);
    }

    @Transactional
    public Analise adicionarAnalise(Integer idFilme, Analise analise) {
        // Busca o filme ao qual esta análise pertencerá
        Optional<Filme> filmeOptional = filmeRepository.findById(idFilme);
        if (filmeOptional.isPresent()) {
            Filme filme = filmeOptional.get();
            analise.setFilme(filme); // Associa a análise ao filme
            
            // Define a data da análise se não estiver definida
            if (analise.getDataAnalise() == null) {
                analise.setDataAnalise(new Timestamp(System.currentTimeMillis()));
            }
            
            Analise analiseSalva = analiseRepository.save(analise);
            // Aqui você poderia adicionar lógica para recalcular e salvar a avaliação média do filme
            // Ex: atualizarAvaliacaoMediaFilme(filme);
            return analiseSalva;
        } else {
            // Lançar uma exceção ou retornar null/erro se o filme não for encontrado
            // Por simplicidade, vamos apenas logar e retornar null por enquanto
            System.err.println("Erro: Filme com ID " + idFilme + " não encontrado ao tentar adicionar análise.");
            return null; 
        }
    }

    @Transactional
    public Optional<Analise> atualizarAnalise(Integer idAnalise, Analise analiseDetalhes) {
        Optional<Analise> analiseExistenteOptional = analiseRepository.findById(idAnalise);
        if (analiseExistenteOptional.isPresent()) {
            Analise analiseExistente = analiseExistenteOptional.get();
            // Atualiza apenas os campos que podem ser modificados
            if (analiseDetalhes.getNomeUsuario() != null) {
                analiseExistente.setNomeUsuario(analiseDetalhes.getNomeUsuario());
            }
            if (analiseDetalhes.getNota() > 0) { // Assume que nota 0 não é uma atualização válida
                analiseExistente.setNota(analiseDetalhes.getNota());
            }
            if (analiseDetalhes.getComentario() != null) {
                analiseExistente.setComentario(analiseDetalhes.getComentario());
            }
            // A data da análise pode ser atualizada para o momento da edição
            analiseExistente.setDataAnalise(new Timestamp(System.currentTimeMillis()));
            
            Analise analiseAtualizada = analiseRepository.save(analiseExistente);
            // Aqui você também poderia recalcular a avaliação média do filme associado
            // Ex: atualizarAvaliacaoMediaFilme(analiseAtualizada.getFilme());
            return Optional.of(analiseAtualizada);
        }
        return Optional.empty(); // Análise não encontrada
    }

    @Transactional
    public boolean deletarAnalise(Integer idAnalise) {
        Optional<Analise> analiseOptional = analiseRepository.findById(idAnalise);
        if (analiseOptional.isPresent()) {
            analiseRepository.deleteById(idAnalise);
            
            // Aqui você poderia recalcular a avaliação média do filme associado
            // Ex: if (filmeAssociado != null) atualizarAvaliacaoMediaFilme(filmeAssociado);
            return true;
        }
        return false;
    }

    // Método privado de exemplo para atualizar a avaliação média de um filme
    // Este método seria chamado após adicionar, atualizar ou deletar uma análise.
    /*
    private void atualizarAvaliacaoMediaFilme(Filme filme) {
        if (filme == null) return;

        List<Analise> analisesDoFilme = analiseRepository.findByFilme_IdFilme(filme.getIdFilme());
        if (analisesDoFilme.isEmpty()) {
            // Se não houver mais análises, você pode definir a média como 0 ou outro valor padrão
            // e o total de avaliações como 0.
            // filme.setAvaliacaoMedia(0.0); 
            // filme.setTotalAvaliacoes(0);
        } else {
            double media = analisesDoFilme.stream().mapToInt(Analise::getNota).average().orElse(0.0);
            // filme.setAvaliacaoMedia(media);
            // filme.setTotalAvaliacoes(analisesDoFilme.size());
        }
        // filmeRepository.save(filme); // Salva o filme com a avaliação média atualizada
        // CUIDADO: Esta abordagem de salvar o filme aqui pode causar problemas de concorrência
        // ou ciclos se não for bem gerenciada. Uma abordagem mais robusta para avaliação média
        // pode envolver campos calculados no banco, DTOs, ou uma lógica mais sofisticada.
        // Por agora, o front-end pode calcular/mostrar isso com base nas análises recebidas.
    }
    */
}