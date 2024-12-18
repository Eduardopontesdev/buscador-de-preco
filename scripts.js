const api = "https://api.mercadolibre.com/sites/MLB/search?q=";
const formBusca = document.querySelector(".form-busca");
const produtoLista = document.querySelector(".lista-produtos");
const graficoPrecos = document.querySelector(".grafico-precos");

let meuGrafico = "";

formBusca.addEventListener("submit", async function (event) {
  event.preventDefault();
  const inputValue = event.target[0].value;

  const dados = await fetch(api + inputValue);
  const produto = (await dados.json()).results.slice(0, 12);

  mostrarPordutos(produto);
  atualizaGraficoPrecos(produto);
  graficoPrecos.classList.add('ativo');
  formBusca.reset();
});

function mostrarPordutos(produtos) {
  produtoLista.innerHTML = produtos
    .map(
      (produto) => `
        <div class="cartao-produto">
            <img src="${produto.thumbnail.replace(
              /\w\.jpg/gi,
              "W.jpg"
            )}" alt="${produto.title}">
            <h3>${produto.title}</h3>
            <p>Loja: ${produto.seller.nickname}</p>
            <p class="estoque">Estoque: <span>${
              produto.available_quantity
            }</span></p>
            <p class="p">Preço: ${produto.price.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}</p>
            <a href="${
              produto.permalink
            }" target="_blank" class="link-comprar">Comprar</a>

        </div>

        `
    )
    .join("");
}

function atualizaGraficoPrecos(produtos) {
  const ctx = graficoPrecos.getContext('2d');

  if (meuGrafico) {
    meuGrafico.destroy();
  }

meuGrafico = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: produtos.map( produto => produto.title.substring(0, 25) + '...'),
    datasets: [{
      label: 'preço (R$)',
      data: produtos.map( produto => produto.price),
      backgroundColor: 'rgba(46, 204, 113, 0.6)',
      borderColor: 'rgba(46, 204, 113, 1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'R$' + value.toFixed(2)
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Comparação de preços',
            font: {
              size: 18
            }
          }
        }
      }
    }
  }
})

}
