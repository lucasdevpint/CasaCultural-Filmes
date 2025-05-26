// src/main/java/br/com/casacultural/filmes/controller/AnaliseController.java
package br.com.casacultural.casacultural_filmes.controller; // Ajuste este pacote se o seu for diferente

import br.com.casacultural.casacultural_filmes.model.Analise;
import br.com.casacultural.casacultural_filmes.service.AnaliseService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api") // Define um prefixo base para os endpoints de análise
public class AnaliseController {

    private final AnaliseService analiseService;

    
    public AnaliseController(AnaliseService analiseService) {
        this.analiseService = analiseService;
    }

    // Endpoint para LISTAR todas as análises de um FILME específico
    // GET /api/filmes/{filmeId}/analises
    @GetMapping("/filmes/{filmeId}/analises")
    public ResponseEntity<List<Analise>> listarAnalisesPorFilme(@PathVariable Integer filmeId) {
        List<Analise> analises = analiseService.listarAnalisesPorFilmeId(filmeId);
        if (analises.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(analises);
    }

    // Endpoint para ADICIONAR uma nova análise a um FILME específico
    // POST /api/filmes/{filmeId}/analises
    @PostMapping("/filmes/{filmeId}/analises")
    public ResponseEntity<Analise> adicionarAnalise(@PathVariable Integer filmeId, @RequestBody Analise analise) {
        try {
            Analise novaAnalise = analiseService.adicionarAnalise(filmeId, analise);
            if (novaAnalise != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(novaAnalise);
            } else {
                // Isso pode acontecer se o filme com filmeId não for encontrado
                return ResponseEntity.notFound().build(); 
            }
        } catch (Exception e) {
            // Logar o erro e retornar uma resposta apropriada
            System.err.println("Erro ao adicionar análise: " + e.getMessage());
            return ResponseEntity.badRequest().build(); // Ou Internal Server Error dependendo da causa
        }
    }

    // Endpoint para BUSCAR uma análise específica pelo SEU PRÓPRIO ID
    // GET /api/analises/{idAnalise}
    @GetMapping("/analises/{idAnalise}")
    public ResponseEntity<Analise> buscarAnalisePorId(@PathVariable Integer idAnalise) {
        Optional<Analise> analiseOptional = analiseService.buscarAnalisePorId(idAnalise);
        return analiseOptional.map(ResponseEntity::ok)
                              .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint para ATUALIZAR uma análise existente
    // PUT /api/analises/{idAnalise}
    @PutMapping("/analises/{idAnalise}")
    public ResponseEntity<Analise> atualizarAnalise(@PathVariable Integer idAnalise, @RequestBody Analise analiseDetalhes) {
        Optional<Analise> analiseAtualizada = analiseService.atualizarAnalise(idAnalise, analiseDetalhes);
        return analiseAtualizada.map(ResponseEntity::ok)
                                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint para DELETAR uma análise
    // DELETE /api/analises/{idAnalise}
    @DeleteMapping("/analises/{idAnalise}")
    public ResponseEntity<Void> deletarAnalise(@PathVariable Integer idAnalise) {
        if (analiseService.deletarAnalise(idAnalise)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}