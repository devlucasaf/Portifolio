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

    // --- INICIALIZA MODAL E BOTÕES DOS PROJETOS ---
    configurarModal();
    configurarBotoesProjetos();

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

// --- DADOS DOS PROJETOS ---
const projetos = {
    "sgc": {
        titulo: "SGC – Sistema de Gestão Condominial",
        descricao: "Sistema completo para administração de condomínios, permitindo gerenciar moradores, unidades, solicitações de manutenção, reservas de áreas comuns e comunicação interna. O objetivo é facilitar a gestão e melhorar a experiência dos moradores.",
        status: "Concluído",
        tipo: "Projeto pessoal",
        funcionalidades: [
            "Cadastro e gerenciamento de moradores e unidades",
            "Abertura e acompanhamento de solicitações",
            "Reserva de áreas comuns",
            "Envio de comunicados internos",
            "Painel administrativo com relatórios"
        ],
        participacao: "Desenvolvimento full-stack do sistema, desde a modelagem do banco de dados (SQL Server) até a criação da API REST com Spring Boot e a interface com React. Fui responsável por toda a lógica de negócio, autenticação de usuários e geração de relatórios.",
        desafios: "O principal desafio foi gerenciar o relacionamento entre as entidades (moradores, unidades e solicitações) de forma eficiente, evitando problemas de integridade referencial. Utilizei JPA/Hibernate com Spring Data e fiz um planejamento cuidadoso das chaves estrangeiras para garantir a consistência dos dados.",
        tecnologias: ["React", "Spring Boot", "SQL Server"],
        imagem: "", 
        repositorio: "https://github.com/devlucasaf/SGC-Sistema-de-Gestao-De-Condominio",
        demonstracao: ""
    },
    "football-games-11": {
        titulo: "Football Games 11",
        descricao: "Plataforma interativa de minijogos de futebol para entretenimento rápido, desenvolvida totalmente no front-end com mecânicas simples e responsivas.",
        status: "Concluído",
        tipo: "Projeto pessoal",
        funcionalidades: [
            "Minijogos de futebol com interação via teclado/mouse",
            "Sistema de pontuação e recordes",
            "Interface amigável e responsiva"
        ],
        participacao: "Desenvolvimento completo do front-end, utilizando HTML, CSS e JavaScript puro. Criei toda a lógica dos minijogos, sistema de pontuação e a interface responsiva.",
        desafios: "Implementar a lógica de interação dos jogos no navegador sem bibliotecas, gerenciando colisões e estado com JS puro.",
        tecnologias: ["HTML", "CSS", "JavaScript"],
        imagem: "",
        repositorio: "https://github.com/devlucasaf/Football-Games-11",
        demonstracao: ""
    },
    "naka-tattos": {
        titulo: "Naka Tattos",
        descricao: "Site profissional para o tatuador Naka Tattos, com portfólio, informações de contato, agendamento e apresentação dos trabalhos.",
        status: "Concluído",
        tipo: "Projeto profissional",
        funcionalidades: [
            "Galeria de trabalhos com filtros",
            "Página de contato e redes sociais",
            "Formulário para orçamento",
            "Design moderno e responsivo"
        ],
        participacao: "Desenvolvimento do site profissional, incluindo design, portfólio com filtros, formulário de contato e otimização mobile.",
        desafios: "Garantir carregamento rápido da galeria de imagens e navegação intuitiva, otimizando ativos e organizando o CSS.",
        tecnologias: ["HTML", "CSS", "JavaScript"],
        imagem: "",
        repositorio: "https://github.com/devlucasaf/naka-tattos",
        demonstracao: ""
    },
    "money-tracker-control": {
        titulo: "Money Tracker Control",
        descricao: "Aplicação de finanças pessoais para registrar receitas e despesas, categorizar transações, visualizar saldo e gerar relatórios simples para controle orçamentário.",
        status: "Concluído",
        tipo: "Projeto pessoal",
        funcionalidades: [
            "Registro de receitas e despesas",
            "Categorização de transações",
            "Exibição de saldo atual e histórico",
            "Filtros por período e categoria"
        ],
        participacao: "Construção da API Back-End com Spring Boot, definição de rotas, regras de negócio e integração com o front-end JavaScript.",
        desafios: "Criar sistema de categorização e filtros dinâmicos com queries eficientes no SQL Server e tratamento de datas na API.",
        tecnologias: ["JavaScript", "Spring Boot", "SQL Server"],
        imagem: "",
        repositorio: "https://github.com/devlucasaf/money-tracker-control",
    },
    "erp-academic": {
        titulo: "ERP Academic – Sistema Acadêmico",
        descricao: "Sistema de gestão acadêmica para administrar alunos, professores, turmas, disciplinas e matrículas, com controle de notas e frequência, visando otimizar a rotina de instituições de ensino.",
        status: "Em desenvolvimento",
        tipo: "Projeto acadêmico",
        funcionalidades: [
            "Cadastro de alunos, professores e turmas",
            "Matrícula de alunos em disciplinas",
            "Lançamento de notas e frequência",
            "Geração de boletins e relatórios",
            "Painel administrativo completo"
        ],
        participacao: "Desenvolvimento do back-end com Spring Boot, criação das entidades, endpoints REST, modelagem relacional e lógica de matrícula.",
        desafios: "Implementar lógica de matrícula validando conflitos de horário e pré-requisitos, utilizando transações robustas no banco.",
        tecnologias: ["Spring Boot", "SQL Server", "JavaScript"],
        repositorio: "https://github.com/devlucasaf/ERP-Academic-School-System",
    },
    "liveevents-ticket": {
        titulo: "LiveEvents Ticket",
        descricao: "Sistema de gerenciamento de eventos e venda de ingressos online, com funcionalidades para criação de eventos, controle de lotes, pagamentos e emissão de ingressos digitais.",
        status: "Concluído",
        tipo: "Projeto pessoal",
        funcionalidades: [
            "Criação e edição de eventos",
            "Configuração de lotes e preços",
            "Integração com gateway de pagamento (simulado)",
            "Emissão de ingressos com QR Code",
            "Painel do organizador e relatórios"
        ],
        participacao: "Desenvolvimento do back-end com .NET e integração com React, focando na lógica de eventos, lotes e reservas.",
        desafios: "Implementar controle de concorrência para evitar compra duplicada de ingressos, utilizando bloqueios otimistas no banco.",
        tecnologias: [".NET", "React", "SQL Server"],
        repositorio: "https://github.com/devlucasaf/LiveEvents-Ticket",
    }
};

// --- MODAL REUTILIZÁVEL ---
let currentModalTrigger = null;

function abrirModalProjeto(projectId) {
    const projeto = projetos[projectId];
    if (!projeto) {
        console.warn(`Projeto com ID "${projectId}" não encontrado.`);
        return;
    }

    const modal = document.getElementById("project-modal");
    if (!modal) {
        return;
    }

    const titulo = document.getElementById("modal-title");
    const descricao = document.getElementById("modal-description");
    const status = document.getElementById("modal-status");
    const tipo = document.getElementById("modal-type");
    const features = document.getElementById("modal-features");
    const participation = document.getElementById("modal-participation");
    const challenges = document.getElementById("modal-challenges");
    const techContainer = document.getElementById("modal-tech");
    const repoLink = document.getElementById("modal-repo-link");
    const demoLink = document.getElementById("modal-demo-link");
    const imageWrapper = document.getElementById("modal-image-wrapper");
    const image = document.getElementById("modal-image");

    titulo.textContent = projeto.titulo;
    descricao.textContent = projeto.descricao;

    status.textContent = projeto.status;
    status.className = "modal-status";
    const statusClass = `status-${projeto.status.toLowerCase().replace(/ /g, "-")}`;
    status.classList.add(statusClass);

    tipo.textContent = projeto.tipo;
    tipo.className = "modal-type";

    features.innerHTML = "";
    if (projeto.funcionalidades && projeto.funcionalidades.length) {
        projeto.funcionalidades.forEach(f => {
            const li = document.createElement("li");
            li.textContent = f;
            features.appendChild(li);
        });
    } else {
        features.innerHTML = "<li data-key='no-features'>[PREENCHER FUNCIONALIDADES]</li>";
    }

    participation.textContent = projeto.participacao || "[PREENCHER PARTICIPAÇÃO]";
    challenges.textContent = projeto.desafios || "[PREENCHER DESAFIOS]";

    techContainer.innerHTML = "";
    if (projeto.tecnologias && projeto.tecnologias.length) {
        projeto.tecnologias.forEach(tech => {
            const span = document.createElement("span");
            span.className = "tech-tag";
            span.textContent = tech;
            techContainer.appendChild(span);
        });
    }

    if (projeto.imagem && projeto.imagem.trim() !== "") {
        image.src = projeto.imagem;
        image.alt = `Imagem do projeto ${projeto.titulo}`;
        imageWrapper.hidden = false;
    } else {
        imageWrapper.hidden = true;
    }

    repoLink.href = projeto.repositorio;
    if (projeto.demonstracao && projeto.demonstracao.trim() !== "") {
        demoLink.href = projeto.demonstracao;
        demoLink.hidden = false;
    } else {
        demoLink.hidden = true;
    }

    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const firstFocusable = modal.querySelector(".modal-close");
    if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
    }

    currentModalTrigger = document.activeElement;
}

function fecharModalProjeto() {
    const modal = document.getElementById("project-modal");
    if (!modal) {
        return;
    }

    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (currentModalTrigger) {
        currentModalTrigger.focus();
        currentModalTrigger = null;
    }
}

// --- CONFIGURAR EVENTOS DO MODAL ---
function configurarModal() {
    const modal = document.getElementById("project-modal");
    if (!modal) {
        return;
    }

    const closeBtn = modal.querySelector(".modal-close");
    const backdrop = modal.querySelector(".modal-backdrop");

    if (closeBtn) {
        closeBtn.addEventListener("click", fecharModalProjeto);
    }

    if (backdrop) {
        backdrop.addEventListener("click", fecharModalProjeto);
    }

    // --- FECHAR COM ESCAPE ---
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
            e.preventDefault();
            fecharModalProjeto();
        }
    });

    const content = modal.querySelector(".modal-content");
    if (content) {
        content.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }
}

// --- INICIALIZAR EVENTOS DOS BOTÕES "SAIBA MAIS"
function configurarBotoesProjetos() {
    const botoes = document.querySelectorAll(".project-details-btn");
    botoes.forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.stopPropagation();
            const projectId = this.dataset.project;
            if (projectId) {
                abrirModalProjeto(projectId);
            } else {
                console.warn("Botão 'Saiba mais' sem data-project");
            }
        });
    });
}

function toggleTheme() {
    const body = document.body;
    const isLight = body.classList.contains('light-theme');
    const newTheme = isLight ? 'dark' : 'light';
    
    body.classList.toggle('light-theme');
    
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        const icon = btn.querySelector('i');
        if (newTheme === 'light') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
    
    localStorage.setItem('theme', newTheme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const btn = document.getElementById('theme-toggle');
    
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        if (btn) {
            const icon = btn.querySelector('i');
            icon.className = 'fas fa-sun';
        }
    } else {
        body.classList.remove('light-theme');
        if (btn) {
            const icon = btn.querySelector('i');
            icon.className = 'fas fa-moon';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Carrega o tema salvo
    loadTheme();
});