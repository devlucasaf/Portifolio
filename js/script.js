// --- FUNÇÃO PRINCIPAL DO SELETOR DE IDIOMAS CUSTOMIZADO ---
function iniciarSeletorIdiomas() {
    const seletorIdioma = document.getElementById("idiomaSite");
    const seletorCustomizado = document.querySelector(".language-selector-custom");

    if (!seletorCustomizado) {
        console.warn("Seletor de idiomas customizado não encontrado");
        return;
    }

    const idiomaAtual = seletorCustomizado.querySelector(".current-language");
    const bandeiraAtual = seletorCustomizado.querySelector(".current-language .flag-img");
    const textoAtual = seletorCustomizado.querySelector(".current-language .language-text");
    const opcoesIdioma = seletorCustomizado.querySelectorAll(".language-option");
    const iconeSeta = seletorCustomizado.querySelector(".current-language i");
    const menuSuspenso = seletorCustomizado.querySelector(".language-dropdown");

    // --- DADOS DE CADA IDIOMA DISPONÍVEL ---
    const dadosIdiomas = {
        "pt-br": {
            flag: "./assets/flags/br_flag.png",
            name: "Português",
            fullName: "Português (BR)",
            alt: "Bandeira do Brasil"
        },
        "en-us": {
            flag: "./assets/flags/us_flag.png",
            name: "English",
            fullName: "English (US)",
            alt: "Bandeira dos EUA"
        }
    };

    // --- ATUALIZA O IDIOMA ATUAL ---
    function atualizarExibicaoIdiomaAtual(valorSelecionado) {
        const dados = dadosIdiomas[valorSelecionado];

        if (!dados) {
            return;
        }

        bandeiraAtual.src = dados.flag;
        bandeiraAtual.alt = dados.alt;
        textoAtual.textContent = dados.name;

        opcoesIdioma.forEach(opcao => {
            opcao.classList.remove("active");
            if (opcao.dataset.value === valorSelecionado) {
                opcao.classList.add("active");
            }
        });
    }

    // --- EXIBE O MENU SUSPENSO E GIRA A SETA PARA CIMA ---
    function abrirMenuSuspenso() {
        menuSuspenso.style.opacity = "1";
        menuSuspenso.style.visibility = "visible";
        menuSuspenso.style.transform = "translateY(0)";
        iconeSeta.style.transform = "rotate(180deg)";
    }

    // --- OCULTA O MENU SUSPENSO E RETORNA A SETA À POSIÇÃO ORIGINAL ---
    function fecharMenuSuspenso() {
        menuSuspenso.style.opacity = "0";
        menuSuspenso.style.visibility = "hidden";
        menuSuspenso.style.transform = "translateY(-10px)";
        iconeSeta.style.transform = "rotate(0deg)";
    }

    // --- ALTERNA ENTRE ABRIR E FECHAR O MENU SUSPENSO ---
    function alternarMenuSuspenso() {
        if (menuSuspenso.style.opacity === "1") {
            fecharMenuSuspenso();
        } else {
            abrirMenuSuspenso();
        }
    }

    // --- FECHA O MENU QUANDO O CLIQUE OCORRE FORA DO SELETOR ---
    function fecharMenuAoClicarFora(evento) {
        if (!seletorCustomizado.contains(evento.target)) {
            fecharMenuSuspenso();
        }
    }

    // --- REGISTRA TODOS OS OUVINTES DE EVENTOS DO SELETOR DE IDIOMAS ---
    function configurarEventos() {
        idiomaAtual.addEventListener("click", function (e) {
            e.stopPropagation();
            alternarMenuSuspenso();
        });

        opcoesIdioma.forEach(opcao => {
            opcao.addEventListener("click", function (e) {
                e.stopPropagation();
                const valorSelecionado = this.dataset.value;

                if (seletorIdioma) {
                    seletorIdioma.value = valorSelecionado;

                    const eventoMudanca = new Event("change");
                    seletorIdioma.dispatchEvent(eventoMudanca);
                }

                atualizarExibicaoIdiomaAtual(valorSelecionado);

                fecharMenuSuspenso();
            });
        });

        document.addEventListener("click", fecharMenuAoClicarFora);

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                fecharMenuSuspenso();
            }
        });
    }

    // --- INICIALIZA O SELETOR COM O IDIOMA SALVO E CONFIGURA OS EVENTOS ---
    function inicializar() {
        const idiomaSalvo = localStorage.getItem("preferredLanguage") || "pt-br";
        atualizarExibicaoIdiomaAtual(idiomaSalvo);

        configurarEventos();

        fecharMenuSuspenso();

        console.log("Seletor de idiomas customizado inicializado");
    }

    inicializar();
}

// --- FUNÇÃO RESPONSÁVEL POR INICIALIZAR TODA A PÁGINA ---
function inicializarPagina() {
    console.log("Inicializando página...");

    iniciarSeletorIdiomas();

    // --- CONFIGURA O EVENTO DE MUDANÇA DO SELECT DE IDIOMA ---
    const seletorIdioma = document.getElementById("idiomaSite");
    if (seletorIdioma) {
        seletorIdioma.addEventListener("change", function () {
            console.log("Idioma alterado para:", this.value);

            if (typeof applyTranslation === "function") {
                applyTranslation(this.value);
            } else {
                console.error("Função applyTranslation não encontrada");
            }
        });
    } else {
        console.error("Select de idioma não encontrado");
    }

    const idiomaSalvo = localStorage.getItem("preferredLanguage") || "pt-br";
    console.log("Idioma salvo:", idiomaSalvo);

    if (seletorIdioma) {
        seletorIdioma.value = idiomaSalvo;
    }

    if (typeof applyTranslation === "function") {
        applyTranslation(idiomaSalvo);
    }

    // --- EXIBE NO CONSOLE A QUANTIDADE DE TRADUÇÕES DISPONÍVEIS ---
    if (typeof translations !== "undefined") {
        console.log(`Traduções disponíveis: pt-br (${Object.keys(translations["pt-br"]).length} itens), en-us (${Object.keys(translations["en-us"]).length} itens)`);
    }

    console.log("Página inicializada com sucesso!");
}

// --- AGUARDA O CARREGAMENTO DO DOM PARA INICIALIZAR A PÁGINA ---
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM completamente carregado");

    setTimeout(() => {
        inicializarPagina();
    }, 100);
});

// --- VERIFICA VIA REQUISIÇÃO HEAD SE UM ARQUIVO EXISTE ---
function verificarArquivoExiste(url) {
    return fetch(url, { method: "HEAD" })
        .then(resposta => resposta.ok)
        .catch(() => false);
}

// --- CONFERE SE AS IMAGENS DAS BANDEIRAS ESTÃO DISPONÍVEIS ---
function verificarBandeiras() {
    const bandeiras = [
        "./assets/flags/br_flag.png",
        "./assets/flags/us_flag.png"
    ];

    bandeiras.forEach(bandeira => {
        verificarArquivoExiste(bandeira).then(existe => {
            if (!existe) {
                console.warn(`Bandeira não encontrada: ${bandeira}`);
            } else {
                console.log(`Bandeira encontrada: ${bandeira}`);
            }
        });
    });
}

// --- VERIFICA AS BANDEIRAS ---
window.addEventListener("load", function () {
    setTimeout(verificarBandeiras, 500);
});

// --- DESTAQUE AUTOMÁTICO DO LINK DE NAVEGAÇÃO CONFORME A SEÇÃO VISÍVEL ---
document.addEventListener("DOMContentLoaded", () => {
    const linksNavegacao = document.querySelectorAll(".nav-link");
    const secoes = document.querySelectorAll("section[id]");

    function ativarLink(idSecao) {
        linksNavegacao.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${idSecao}`) {
                link.classList.add("active");
            }
        });
    }

    // --- OBSERVADOR QUE DETECTA QUAL SEÇÃO ESTÁ VISÍVEL NA TELA ---
    const observador = new IntersectionObserver(
        (entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    ativarLink(entrada.target.id);
                }
            });
        },
        {
            root: null,
            threshold: 0.2,
            rootMargin: "-100px 0px 0px 0px"
        }
    );

    secoes.forEach(secao => observador.observe(secao));
});

// --- ENVIO DO FORMULÁRIO DE CONTATO VIA EMAILJS ---
document.addEventListener("DOMContentLoaded", () => {
    emailjs.init("Ky9cHPuZRfL3lS1jY");

    const formularioContato = document.getElementById("contact-form");

    if (formularioContato) {
        formularioContato.addEventListener("submit", async (e) => {
            e.preventDefault();

            const campoNome = document.getElementById("name");
            const campoEmail = document.getElementById("email");
            const campoMensagem = document.getElementById("message");
            const botaoEnviar = formularioContato.querySelector('button[type="submit"]');

            if (!campoNome.value.trim() || !campoEmail.value.trim() || !campoMensagem.value.trim()) {
                alert("Por favor, preencha todos os campos!");
                return;
            }

            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(campoEmail.value)) {
                alert("Por favor, insira um email válido!");
                return;
            }

            const textoOriginal = botaoEnviar.textContent;
            botaoEnviar.disabled = true;
            botaoEnviar.textContent = "Enviando...";

            try {
                const resposta = await emailjs.send("service_portifolio_lucas", "template_contact_form", {
                    from_name: campoNome.value,
                    from_email: campoEmail.value,
                    message: campoMensagem.value,
                    to_email: "freitas.lucasaf@gmail.com"
                });

                if (resposta.status === 200) {
                    alert("Mensagem enviada com sucesso! Obrigado pelo contato!");
                    formularioContato.reset();
                    botaoEnviar.textContent = "Mensagem Enviada! ✓";

                    setTimeout(() => {
                        botaoEnviar.textContent = textoOriginal;
                        botaoEnviar.disabled = false;
                    }, 3000);
                } else {
                    throw new Error("Erro ao enviar mensagem");
                }
            } catch (erro) {
                console.error("Erro:", erro);
                alert("Erro ao enviar mensagem. Por favor, tente novamente!");
                botaoEnviar.textContent = textoOriginal;
                botaoEnviar.disabled = false;
            }
        });
    }
});


// --- ANIMAÇÕES DE ENTRADA AO ROLAR A PÁGINA ---
document.addEventListener("DOMContentLoaded", () => {
    const observadorRevelar = new IntersectionObserver(
        (entradas, observador) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visible");
                    observador.unobserve(entrada.target);
                }
            });
        },
        {
            root: null,
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    document.querySelectorAll(".reveal").forEach(el => observadorRevelar.observe(el));
});


// --- BOTÃO VOLTAR AO TOPO ---
document.addEventListener("DOMContentLoaded", () => {
    const botaoTopo = document.getElementById("back-to-top");

    if (!botaoTopo) {
        return;
    }

    // --- MOSTRA OU OCULTA O BOTÃO CONFORME O SCROLL ---
    function alternarVisibilidade() {
        if (window.scrollY > 400) {
            botaoTopo.classList.add("visible");
        } else {
            botaoTopo.classList.remove("visible");
        }
    }

    window.addEventListener("scroll", alternarVisibilidade, { passive: true });
    alternarVisibilidade();

    // --- ROLA SUAVEMENTE ATÉ O TOPO AO CLICAR ---
    botaoTopo.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});

// --- FILTRO DE PROJETOS POR TECNOLOGIA ---
document.addEventListener("DOMContentLoaded", () => {
    const barraFiltro = document.getElementById("projects-filter");
    const cardsProjeto = document.querySelectorAll(".projects-grid .project-card");
    const mensagemVazio = document.getElementById("projects-empty");

    if (!barraFiltro || cardsProjeto.length === 0) {
        return;
    }

    const botoesFiltro = barraFiltro.querySelectorAll(".filter-btn");

    // --- APLICA O FILTRO E ANIMA OS CARDS ---
    function aplicarFiltro(tecnologia) {
        let visiveis = 0;

        cardsProjeto.forEach(card => {
            const tecnologias = (card.dataset.tech || "").split(" ");
            const combina = tecnologia === "all" || tecnologias.includes(tecnologia);

            card.classList.remove("filter-enter");
            card.style.animationDelay = "";

            if (!combina) {
                card.classList.add("hidden");
                return;
            }

            card.classList.remove("hidden");

            card.style.animationDelay = `${visiveis * 100}ms`;

            void card.offsetWidth;

            card.classList.add("filter-enter");

            card.addEventListener("animationend", () => {
                card.classList.remove("filter-enter");
                card.style.animationDelay = "";
            },
            { 
                once: true 
            });

            visiveis++;
        });

        if (mensagemVazio) {
            mensagemVazio.hidden = visiveis !== 0;
        }
    }

    // --- CONFIGURA OS BOTÕES DO FILTRO ---
    botoesFiltro.forEach(botao => {
        botao.addEventListener("click", () => {
            botoesFiltro.forEach(outroBotao => {
                outroBotao.classList.remove("active");
            });

            botao.classList.add("active");
            aplicarFiltro(botao.dataset.filter);
        });
    });
});

