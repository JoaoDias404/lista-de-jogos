const botao = document.querySelector('#adicionar')
const botaoLimpar = document.querySelector('#limpar')
const input = document.querySelector('input')
const erro = document.querySelector('#erro')
const lista = document.querySelector('#lista')
const listas = ['quero jogar', 'jogando', 'terminado']

let filtroAtivo = 'todos'

//Busca os jogos salvos no localStorage. Se tiver, usa eles. Se não tiver, começa com uma lista vazia.
let jogos = JSON.parse(localStorage.getItem('jogos')) || []

function toggleDark() {
    document.body.classList.toggle('dark')
}

function filtrar(filtro) {
    filtroAtivo = filtro
    renderizar()
}

//Limpa a lista, depois para cada jogo do array, cria um item de lista com o nome dele e adiciona na tela.
function renderizar() {
    lista.innerHTML = ''

    // para cada lista (quero jogar, jogando, terminado)
    listas.forEach(function (nomeLista) {

        // filtra os jogos que pertencem a essa lista e respeitam o filtro ativo
        const jogosDaLista = jogos.filter(function (jogo) {
            return jogo.lista === nomeLista && (filtroAtivo === 'todos' || jogo.status === filtroAtivo)
        })

        // adiciona o título da lista na tela
        lista.innerHTML += '<h2>' + nomeLista + '</h2>'

        // para cada jogo dentro dessa lista
        jogosDaLista.forEach(function (jogo, indice) {

            // pega a posição real do jogo no array original
            const indiceReal = jogos.indexOf(jogo)

            // define o símbolo do botão de status baseado no status do jogo
            const statusBtn = jogo.status === 'none' ? '▶' : jogo.status === 'jogando' ? '⏸' : '✓'

            // adiciona o item na tela com os botões de status e excluir
            lista.innerHTML += '<li class="' + jogo.status + '">' + jogo.nome + ' <button onclick="alterarStatus(' + indiceReal + ')">' + statusBtn + '</button> <button onclick="excluir(' + indiceReal + ')">X</button></li>'
        })
    })
}

function atualizarContadores() {
    document.querySelector('#total').innerHTML = jogos.length
    document.querySelector('#contJogando').innerHTML = jogos.filter(function (jogo) {
        return jogo.status === 'jogando'
    }).length
    document.querySelector('#contTerminado').innerHTML = jogos.filter(function (jogo) {
        return jogo.status === 'terminado'
    }).length
    const porcentagem = jogos.length === 0 ? 0 : Math.round(jogos.filter(function (jogo) {
        return jogo.status === 'terminado'
    }).length / jogos.length * 100)
    document.querySelector('#barra').value = porcentagem
    document.querySelector('#pct').innerHTML = porcentagem + '%'
}

function alterarStatus(indice) {
    const status = jogos[indice].status
    if (status === 'none') {
        jogos[indice].status = 'jogando'
        jogos[indice].lista = 'jogando'
    } else if (status === 'jogando') {
        jogos[indice].status = 'terminado'
        jogos[indice].lista = 'terminado'
    } else {
        jogos[indice].status = 'none'
        jogos[indice].lista = 'quero jogar'
    }
    localStorage.setItem('jogos', JSON.stringify(jogos))
    renderizar()
    atualizarContadores()
}

function excluir(indice) {
    jogos.splice(indice, 1)
    localStorage.setItem('jogos', JSON.stringify(jogos))
    renderizar()
    atualizarContadores()
}

function adicionar() {
    if (input.value === '') {
        erro.innerHTML = 'Campo necessário!'
        return
    }
    erro.innerHTML = ''
    // cria uma variavel tarefa com o valor do que foi escrito no input
    const tarefa = input.value
    // adiciona a tarefa no inicio do array jogos
    jogos.unshift({ nome: tarefa, status: 'none', lista: 'quero jogar' })
    // salva o array jogos no localStorage convertendo de array pra texto
    localStorage.setItem('jogos', JSON.stringify(jogos))
    // chama a função renderizar pra mostrar o jogo na tela
    renderizar()
    atualizarContadores()
    // deixa o campo do input vazio
    input.value = ''
}

botao.addEventListener('click', function () {
    adicionar()
})

input.addEventListener('keydown', function (evento) {
    if (evento.key === 'Enter') {
        adicionar()
    }
})

botaoLimpar.addEventListener('click', function () {
    // deixa o array jogos vazio
    jogos = []
    // remove o item com a chave 'jogos' do localStorage
    localStorage.removeItem('jogos')
    // renderiza a lista vazia na tela
    renderizar()
    atualizarContadores()
})

renderizar()
atualizarContadores()