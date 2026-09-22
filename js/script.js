// Elementos do DOM
const formulario = document.getElementById('formulario');
const campoUltimaMenstruacao = document.getElementById('ultima-menstruacao');
const selectDuracaoCiclo = document.getElementById('duracao-ciclo');
const mensagemErro = document.getElementById('mensagem-erro');
const secaoResultados = document.getElementById('resultados');

// Elementos de resultado
const elProximaMenstruacao = document.getElementById('proxima-menstruacao');
const elOvulacao = document.getElementById('ovulacao');
const elPeriodoFertil = document.getElementById('periodo-fertil');

// Elementos linha do tempo
const ltMenstruacao = document.getElementById('lt-menstruacao');
const ltFertilInicio = document.getElementById('lt-fertil-inicio');
const ltOvulacao = document.getElementById('lt-ovulacao');
const ltProxima = document.getElementById('lt-proxima');

/**
 * Formata uma data para o padrão brasileiro dd/mm/aaaa
 * @param {Date} data - Objeto Date válido
 * @returns {string} Data formatada
 */
function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

/**
 * Valida os dados do formulário
 * @returns {boolean} Verdadeiro se válido
 */
function validarFormulario() {
    mensagemErro.classList.remove('visivel');

    const dataTexto = campoUltimaMenstruacao.value.trim();
    const cicloValor = selectDuracaoCiclo.value;

    if (!dataTexto) {
        mostrarErro('Por favor, informe a data da última menstruação.');
        return false;
    }

    if (!cicloValor) {
        mostrarErro('Por favor, selecione a duração do ciclo.');
        return false;
    }

    const ciclo = parseInt(cicloValor, 10);

    if (isNaN(ciclo) || ciclo < 21 || ciclo > 45) {
        mostrarErro('Selecione uma duração de ciclo válida (entre 21 e 45 dias).');
        return false;
    }

    return true;
}

/**
 * Exibe mensagem de erro
 * @param {string} texto - Mensagem
 */
function mostrarErro(texto) {
    mensagemErro.textContent = texto;
    mensagemErro.classList.add('visivel');
}

/**
 * Converte valor de input type="date" para Date sem problema de fuso
 * @param {string} valorInput - Data no formato aaaa-mm-dd
 * @returns {Date} Objeto Date
 */
function dataSemFuso(valorInput) {
    const [ano, mes, dia] = valorInput.split('-').map(Number);
    return new Date(ano, mes - 1, dia);
}

/**
 * Calcula a data da próxima menstruação
 * @param {Date} dataUltima - Data da última menstruação
 * @param {number} duracaoCiclo - Dias do ciclo
 * @returns {Date} Data da próxima menstruação
 */
function calcularProximaMenstruacao(dataUltima, duracaoCiclo) {
    const proxima = new Date(dataUltima);
    proxima.setDate(proxima.getDate() + duracaoCiclo);
    return proxima;
}

/**
 * Calcula a data provável da ovulação
 * @param {Date} proximaMenstruacao - Data da próxima menstruação
 * @returns {Date} Data da ovulação
 */
function calcularOvulacao(proximaMenstruacao) {
    const ovulacao = new Date(proximaMenstruacao);
    ovulacao.setDate(ovulacao.getDate() - 14);
    return ovulacao;
}

/**
 * Calcula o início e fim do período fértil
 * @param {Date} dataOvulacao - Data da ovulação
 * @returns {Object} Objeto com dataInicio e dataFim
 */
function calcularPeriodoFertil(dataOvulacao) {
    const inicio = new Date(dataOvulacao);
    inicio.setDate(inicio.getDate() - 5);

    const fim = new Date(dataOvulacao);
    fim.setDate(fim.getDate() + 1);

    return { inicio, fim };
}

/**
 * Exibe todos os resultados na tela
 * @param {Object} dados - Dados calculados
 */
function exibirResultado(dados) {
    const { dataUltima, proximaMenstruacao, ovulacao, fertilInicio, fertilFim } = dados;

    elProximaMenstruacao.textContent = formatarData(proximaMenstruacao);
    elOvulacao.textContent = formatarData(ovulacao);
    elPeriodoFertil.textContent = `${formatarData(fertilInicio)} a ${formatarData(fertilFim)}`;

    ltMenstruacao.textContent = formatarData(dataUltima);
    ltFertilInicio.textContent = `${formatarData(fertilInicio)} até ${formatarData(fertilFim)}`;
    ltOvulacao.textContent = formatarData(ovulacao);
    ltProxima.textContent = formatarData(proximaMenstruacao);

    secaoResultados.classList.remove('oculto');
    secaoResultados.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Realiza todos os cálculos e exibe
 */
function processarCalculo() {
    if (!validarFormulario()) return;

    const dataUltima = dataSemFuso(campoUltimaMenstruacao.value);
    const duracaoCiclo = parseInt(selectDuracaoCiclo.value, 10);

    const proximaMenstruacao = calcularProximaMenstruacao(dataUltima, duracaoCiclo);
    const ovulacao = calcularOvulacao(proximaMenstruacao);
    const { inicio: fertilInicio, fim: fertilFim } = calcularPeriodoFertil(ovulacao);

    exibirResultado({
        dataUltima,
        proximaMenstruacao,
        ovulacao,
        fertilInicio,
        fertilFim
    });
}

// Evento de envio do formulário
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    processarCalculo();
});