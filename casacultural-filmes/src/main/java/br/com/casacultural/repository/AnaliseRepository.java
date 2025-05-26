package br.com.casacultural.repository; // Seu pacote base + .repository

import br.com.casacultural.model.Analise; // Importa sua entidade Analise do pacote model
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository // Marca esta interface como um componente de repositório Spring
public interface AnaliseRepository extends JpaRepository<Analise, Integer> {
    // JpaRepository<Analise, Integer> significa:
    // - Analise: A entidade que este repositório vai gerenciar.
    // - Integer: O tipo da chave primária da entidade Analise (idAnalise é int, usamos Integer).

    // Métodos CRUD básicos já são fornecidos pelo JpaRepository.

    // Método de consulta personalizado para buscar todas as análises de um filme específico.
    // O Spring Data JPA entende o nome deste método e cria a consulta automaticamente:
    // "findBy" + "Filme" (nome do atributo na entidade Analise que referencia Filme) 
    //          + "_" (para navegar em propriedades aninhadas)
    //          + "IdFilme" (nome do atributo 'idFilme' dentro da entidade Filme referenciada)
    List<Analise> findByFilme_IdFilme(int idFilme);

    // Exemplo de outro método de consulta personalizado (descomente e use se precisar):
    /*
    // Para buscar análises por nome de usuário (ignorando maiúsculas/minúsculas)
    List<Analise> findByNomeUsuarioIgnoreCase(String nomeUsuario);
    */
}