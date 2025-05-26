package br.com.casacultural.casacultural_filmes.model;

import com.fasterxml.jackson.annotation.JsonManagedReference; // <<< ADICIONE ESTE IMPORT
import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "filmes")
public class Filme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_filme")
    private int idFilme;

    @Column(nullable = false, length = 255)
    private String titulo;

    @Column(length = 255)
    private String genero;

    @Column(length = 150)
    private String diretor;

    @Column(name = "ano_lancamento")
    private Integer anoLancamento;

    @Column(length = 50)
    private String duracao;

    @Lob
    @Column(name = "descricao_curta", columnDefinition = "TEXT")
    private String descricaoCurta;

    @Lob
    @Column(name = "sinopse_completa", columnDefinition = "TEXT")
    private String sinopseCompleta;

    @Column(name = "url_imagem_banner", length = 255)
    private String urlImagemBanner;

    @Column(name = "url_imagem_poster", length = 255)
    private String urlImagemPoster;

    @Column(name = "data_cadastro", insertable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp dataCadastro;

    @OneToMany(mappedBy = "filme", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference // <<< ANOTAÇÃO ADICIONADA AQUI
    private List<Analise> avaliacoes = new ArrayList<>();

    // Construtores
    public Filme() {
    }

    // Getters e Setters
    public int getIdFilme() {
        return idFilme;
    }

    public void setIdFilme(int idFilme) {
        this.idFilme = idFilme;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getDiretor() {
        return diretor;
    }

    public void setDiretor(String diretor) {
        this.diretor = diretor;
    }

    public Integer getAnoLancamento() {
        return anoLancamento;
    }

    public void setAnoLancamento(Integer anoLancamento) {
        this.anoLancamento = anoLancamento;
    }

    public String getDuracao() {
        return duracao;
    }

    public void setDuracao(String duracao) {
        this.duracao = duracao;
    }

    public String getDescricaoCurta() {
        return descricaoCurta;
    }

    public void setDescricaoCurta(String descricaoCurta) {
        this.descricaoCurta = descricaoCurta;
    }

    public String getSinopseCompleta() {
        return sinopseCompleta;
    }

    public void setSinopseCompleta(String sinopseCompleta) {
        this.sinopseCompleta = sinopseCompleta;
    }

    public String getUrlImagemBanner() {
        return urlImagemBanner;
    }

    public void setUrlImagemBanner(String urlImagemBanner) {
        this.urlImagemBanner = urlImagemBanner;
    }

    public String getUrlImagemPoster() {
        return urlImagemPoster;
    }

    public void setUrlImagemPoster(String urlImagemPoster) {
        this.urlImagemPoster = urlImagemPoster;
    }

    public Timestamp getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(Timestamp dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public List<Analise> getAvaliacoes() {
        return avaliacoes;
    }

    public void setAvaliacoes(List<Analise> avaliacoes) {
        this.avaliacoes = avaliacoes;
    }

    public void addAnalise(Analise analise) {
        this.avaliacoes.add(analise);
        analise.setFilme(this);
    }

    @Override
    public String toString() {
        return "Filme{" +
               "idFilme=" + idFilme +
               ", titulo='" + titulo + '\'' +
               '}';
    }
}