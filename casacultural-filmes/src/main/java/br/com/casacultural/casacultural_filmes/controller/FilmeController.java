// src/main/java/br/com/casacultural/filmes/controller/FilmeController.java
package br.com.casacultural.casacultural_filmes.controller; // Ajuste este pacote se o seu for diferente

import br.com.casacultural.casacultural_filmes.model.Filme;
import br.com.casacultural.casacultural_filmes.service.FilmeService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController // Define esta classe como um controlador REST
@RequestMapping("/api/filmes") // Mapeia todas as requisições que começam com /api/filmes para este controlador
public class FilmeController {

    private final FilmeService filmeService;

     
    public FilmeController(FilmeService filmeService) {
        this.filmeService = filmeService;
    }

    // Endpoint para LISTAR todos os filmes
    // GET /api/filmes
    @GetMapping
    public ResponseEntity<List<Filme>> listarTodosFilmes() {
        List<Filme> filmes = filmeService.listarTodosFilmes();
        if (filmes.isEmpty()) {
            return ResponseEntity.noContent().build(); // Retorna 204 No Content se a lista estiver vazia
        }
        return ResponseEntity.ok(filmes); // Retorna 200 OK com a lista de filmes no corpo
    }

    // Endpoint para BUSCAR um filme pelo ID
    // GET /api/filmes/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Filme> buscarFilmePorId(@PathVariable Integer id) {
        Optional<Filme> filmeOptional = filmeService.buscarFilmePorId(id);
        if (filmeOptional.isPresent()) {
            return ResponseEntity.ok(filmeOptional.get()); // Retorna 200 OK com o filme
        } else {
            return ResponseEntity.notFound().build(); // Retorna 404 Not Found se o filme não existir
        }
    }

    // Endpoint para ADICIONAR um novo filme
    // POST /api/filmes
    @PostMapping
    public ResponseEntity<Filme> adicionarFilme(@RequestBody Filme filme) {
        // @RequestBody indica que o objeto Filme virá do corpo da requisição (JSON)
        try {
            Filme novoFilme = filmeService.adicionarOuAtualizarFilme(filme);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoFilme); // Retorna 201 Created com o novo filme
        } catch (Exception e) {
            // Idealmente, tratar exceções específicas e retornar mensagens de erro apropriadas
            return ResponseEntity.badRequest().build(); // Retorna 400 Bad Request em caso de erro
        }
    }

    // Endpoint para ATUALIZAR um filme existente
    // PUT /api/filmes/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Filme> atualizarFilme(@PathVariable Integer id, @RequestBody Filme filmeDetalhes) {
        Optional<Filme> filmeExistenteOptional = filmeService.buscarFilmePorId(id);
        if (filmeExistenteOptional.isPresent()) {
            Filme filmeExistente = filmeExistenteOptional.get();
            // Atualiza os campos do filme existente com os detalhes fornecidos
            // (Pode-se adicionar mais lógica para quais campos podem ser atualizados)
            filmeExistente.setTitulo(filmeDetalhes.getTitulo());
            filmeExistente.setGenero(filmeDetalhes.getGenero());
            filmeExistente.setDiretor(filmeDetalhes.getDiretor());
            filmeExistente.setAnoLancamento(filmeDetalhes.getAnoLancamento());
            filmeExistente.setDuracao(filmeDetalhes.getDuracao());
            filmeExistente.setDescricaoCurta(filmeDetalhes.getDescricaoCurta());
            filmeExistente.setSinopseCompleta(filmeDetalhes.getSinopseCompleta());
            filmeExistente.setUrlImagemBanner(filmeDetalhes.getUrlImagemBanner());
            filmeExistente.setUrlImagemPoster(filmeDetalhes.getUrlImagemPoster());
            // Não atualizamos o ID nem a data de cadastro aqui

            Filme filmeAtualizado = filmeService.adicionarOuAtualizarFilme(filmeExistente);
            return ResponseEntity.ok(filmeAtualizado);
        } else {
            return ResponseEntity.notFound().build(); // Retorna 404 Not Found se o filme não existir
        }
    }

    // Endpoint para DELETAR um filme
    // DELETE /api/filmes/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarFilme(@PathVariable Integer id) {
        if (filmeService.deletarFilme(id)) {
            return ResponseEntity.noContent().build(); // Retorna 204 No Content se deletado com sucesso
        } else {
            return ResponseEntity.notFound().build(); // Retorna 404 Not Found se o filme não existir
        }
    }
}