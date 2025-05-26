
package br.com.casacultural.casacultural_filmes.model;

import com.fasterxml.jackson.annotation.JsonBackReference; // <<< ADICIONE ESTE IMPORT
import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "analises")
public class Analise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_analise")
    private int idAnalise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_filme_fk", nullable = false)
    @JsonBackReference // <<< ANOTAÇÃO ADICIONADA AQUI
    private Filme filme;

    @Column(name = "nome_usuario", length = 100)
    private String nomeUsuario;

    @Column(nullable = false)
    private int nota;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "data_analise", insertable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp dataAnalise;

    // Construtores
    public Analise() {
    }

    // Getters e Setters
    public int getIdAnalise() {
        return idAnalise;
    }

    public void setIdAnalise(int idAnalise) {
        this.idAnalise = idAnalise;
    }

    public Filme getFilme() {
        return filme;
    }

    public void setFilme(Filme filme) {
        this.filme = filme;
    }

    public String getNomeUsuario() {
        return nomeUsuario;
    }

    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }

    public int getNota() {
        return nota;
    }

    public void setNota(int nota) {
        this.nota = nota;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public Timestamp getDataAnalise() {
        return dataAnalise;
    }

    public void setDataAnalise(Timestamp dataAnalise) {
        this.dataAnalise = dataAnalise;
    }
    
    @Override
    public String toString() {
        return "Analise{" +
               "idAnalise=" + idAnalise +
               ", nota=" + nota +
               ", usuario='" + nomeUsuario + '\'' +
               '}';
    }
}