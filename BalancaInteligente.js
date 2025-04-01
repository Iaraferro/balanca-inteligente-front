// Dados mockados (substituir por chamadas à API quando estiver pronta)
const animais = [
    { id: 1, nome: "Boi 1", raca: "Nelore", dataNascimento: "2020-01-15" },
    { id: 2, nome: "Boi 2", raca: "Angus", dataNascimento: "2019-05-20" }
];

const pesagens = [
    { animalId: 1, peso: 450, data: "2025-03-01T10:00:00" },
    { animalId: 1, peso: 455, data: "2025-03-08T10:00:00" },
    { animalId: 1, peso: 460, data: "2025-03-15T10:00:00" },
    { animalId: 2, peso: 520, data: "2025-03-01T11:00:00" },
    { animalId: 2, peso: 525, data: "2025-03-08T11:00:00" },
    { animalId: 2, peso: 530, data: "2025-03-15T11:00:00" }
];

// Elementos da página
const conteudoPrincipal = document.getElementById("conteudo-principal");
const totalAnimaisElement = document.getElementById("total-animais");
const ultimaPesagemElement = document.getElementById("ultima-pesagem");

// Atualizar dashboard
function atualizarDashboard() {
    totalAnimaisElement.textContent = animais.length;
    
    if (pesagens.length > 0) {
        const ultima = pesagens[pesagens.length - 1];
        const animal = animais.find(a => a.id === ultima.animalId);
        ultimaPesagemElement.textContent = `${animal.nome}: ${ultima.peso} kg em ${new Date(ultima.data).toLocaleDateString()}`;
    }
    
    renderizarGrafico();
}

// Renderizar gráfico de evolução de peso
function renderizarGrafico() {
    const ctx = document.getElementById('peso-chart').getContext('2d');
    
    // Agrupar pesagens por animal
    const dadosPorAnimal = {};
    animais.forEach(animal => {
        dadosPorAnimal[animal.id] = {
            nome: animal.nome,
            dados: pesagens
                .filter(p => p.animalId === animal.id)
                .sort((a, b) => new Date(a.data) - new Date(b.data))
                .map(p => ({
                    x: new Date(p.data),
                    y: p.peso
                }))
        };
    });
    
    const datasets = Object.values(dadosPorAnimal).map(animal => ({
        label: animal.nome,
        data: animal.dados,
        borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        tension: 0.1,
        fill: false
    }));
    
    new Chart(ctx, {
        type: 'line',
        data: { datasets },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Navegação entre páginas
document.getElementById("inicio-link").addEventListener("click", (e) => {
    e.preventDefault();
    conteudoPrincipal.innerHTML = `
        <section class="dashboard">
            <h2><i class="fas fa-tachometer-alt icon"></i>Dashboard</h2>
            <div class="cards-container">
                <div class="card">
                    <h3><i class="fas fa-cow icon"></i>Total de Animais</h3>
                    <p id="total-animais">0</p>
                </div>
                <div class="card">
                    <h3><i class="fas fa-weight-hanging icon"></i>Última Pesagem</h3>
                    <p id="ultima-pesagem">Nenhuma pesagem registrada</p>
                </div>
            </div>
            <div class="grafico-container">
                <canvas id="peso-chart"></canvas>
            </div>
        </section>
    `;
    atualizarDashboard();
});

document.getElementById("pesagem-link").addEventListener("click", (e) => {
    e.preventDefault();
    conteudoPrincipal.innerHTML = `
        <section class="pesagem">
            <h2>Pesagem em Tempo Real</h2>
            <div id="pesagem-atual">
                <p>Aguardando pesagem...</p>
            </div>
            <h3>Últimas Pesagens</h3>
            <table>
                <thead>
                    <tr>
                        <th>Animal</th>
                        <th>Peso (kg)</th>
                        <th>Data/Hora</th>
                    </tr>
                </thead>
                <tbody id="tabela-pesagens">
                    <!-- Preenchido por JavaScript -->
                </tbody>
            </table>
        </section>
    `;
    
    // Simular conexão com a balança (substituir por WebSocket/API real)
    setInterval(() => {
        // Em produção, isso seria substituído por uma conexão real com a balança
    }, 5000);
    
    atualizarTabelaPesagens();
});

document.getElementById("historico-link").addEventListener("click", (e) => {
    e.preventDefault();
    conteudoPrincipal.innerHTML = `
        <section class="historico">
            <h2>Histórico de Pesagens</h2>
            <div class="filtros">
                <select id="filtro-animal">
                    <option value="">Todos os animais</option>
                    ${animais.map(a => `<option value="${a.id}">${a.nome}</option>`).join('')}
                </select>
                <input type="date" id="filtro-data">
                <button id="aplicar-filtros">Aplicar Filtros</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Animal</th>
                        <th>Peso (kg)</th>
                        <th>Data/Hora</th>
                    </tr>
                </thead>
                <tbody id="tabela-historico">
                    <!-- Preenchido por JavaScript -->
                </tbody>
            </table>
        </section>
    `;
    
    document.getElementById("aplicar-filtros").addEventListener("click", atualizarHistorico);
    atualizarHistorico();
});


    

    
    document.getElementById("cadastro-link").addEventListener("click", function(e) {
        e.preventDefault();
        conteudoPrincipal.innerHTML = `
            <section class="form-cadastro">
                <h2><i class="fas fa-paw icon"></i> Cadastrar Novo Animal</h2>
                <form id="form-animal">
                    <div class="form-group">
                        <label for="nome">Nome:</label>
                        <input type="text" id="nome" required>
                    </div>
                    <div class="form-group">
                        <label for="raca">Raça:</label>
                        <input type="text" id="raca" required>
                    </div>
                    <div class="form-group">
                        <label for="data-nascimento">Data de Nascimento:</label>
                        <input type="date" id="data-nascimento" required>
                    </div>
                    <button type="submit"><i class="fas fa-save icon"></i> Cadastrar Animal</button>
                </form>
            </section>
        `;
        
        // Lógica de submit (a mesma já existente)
        document.getElementById("form-animal").addEventListener("submit", function(e) {
            e.preventDefault();
            const nome = document.getElementById("nome").value;
            const raca = document.getElementById("raca").value;
            const dataNascimento = document.getElementById("data-nascimento").value;
            
            const novoAnimal = {
                id: animais.length + 1,
                nome,
                raca,
                dataNascimento
            };
            animais.push(novoAnimal);
            alert("Animal cadastrado com sucesso!");
            document.getElementById("inicio-link").click(); // Volta para o dashboard
        });
    });

    
    document.getElementById("form-animal").addEventListener("submit", function(e) {
        e.preventDefault();
        const nome = document.getElementById("nome").value;
        const raca = document.getElementById("raca").value;
        const dataNascimento = document.getElementById("data-nascimento").value;
        
        // Em produção, enviar para a API
        const novoAnimal = {
            id: animais.length > 0 ? Math.max(...animais.map(a => a.id)) + 1 : 1,
            nome,
            raca,
            dataNascimento
        };
        
        animais.push(novoAnimal);
        alert("Animal cadastrado com sucesso!");
        document.getElementById("inicio-link").click();
    });


function atualizarTabelaPesagens() {
    const tbody = document.getElementById("tabela-pesagens");
    tbody.innerHTML = pesagens
        .slice(-5) // Últimas 5 pesagens
        .reverse() // Mais recente primeiro
        .map(p => {
            const animal = animais.find(a => a.id === p.animalId);
            return `
                <tr>
                    <td>${animal.nome}</td>
                    <td>${p.peso} kg</td>
                    <td>${new Date(p.data).toLocaleString()}</td>
                </tr>
            `;
        })
        .join('');
}

function atualizarHistorico() {
    const tbody = document.getElementById("tabela-historico");
    const animalId = document.getElementById("filtro-animal").value;
    const dataFiltro = document.getElementById("filtro-data").value;
    
    let pesagensFiltradas = [...pesagens];
    
    if (animalId) {
        pesagensFiltradas = pesagensFiltradas.filter(p => p.animalId == animalId);
    }
    
    if (dataFiltro) {
        const data = new Date(dataFiltro);
        pesagensFiltradas = pesagensFiltradas.filter(p => {
            const pesagemDate = new Date(p.data);
            return pesagemDate.toDateString() === data.toDateString();
        });
    }
    
    tbody.innerHTML = pesagensFiltradas
        .map(p => {
            const animal = animais.find(a => a.id === p.animalId);
            return `
                <tr>
                    <td>${animal.nome}</td>
                    <td>${p.peso} kg</td>
                    <td>${new Date(p.data).toLocaleString()}</td>
                </tr>
            `;
        })
        .join('');

       
        document.getElementById("contato-link").addEventListener("click", (e) => {
            e.preventDefault();
            conteudoPrincipal.innerHTML = `
                <section class="contato">
                    <h2><i class="fas fa-envelope icon"></i> Contato</h2>
                    <div class="card">
                        <h3>Entre em contato conosco</h3>
                        <p><i class="fas fa-phone icon"></i> (63) 99999-9999</p>
                        <p><i class="fas fa-envelope icon"></i> contato@balancainteligente.com.br</p>
                        <p><i class="fas fa-map-marker-alt icon"></i> Agrotins - Palmas/TO</p>
                    </div>
                </section>
            `;
        });

}

// Inicializar a página
document.getElementById("inicio-link").click();