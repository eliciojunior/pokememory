//Variáveis Globais
var imagens = []
let fundo = './card-background.jpg'

var cartas
var maxpoint

let cliquesTravados = false
let temCartaVirada = false
let posicaoCartaVirada = -1
let valorCartaVirada = 0
let pontos = 0

//Criação do Timer
const timer = new Timer('#timer')

//-------------------------------------------------
// Configurações iniciais do carregamento do jogo
//-------------------------------------------------
onload = () => {
  document.querySelector('#timer').style.display = 'none'
  const buttons = document.querySelectorAll('#buttons .btn')
  buttons.forEach(function(button){
    button.addEventListener('click', configuraJogo)
  })
  document.querySelector('#btInicio').onclick = iniciaJogo
}

//-------------------------------------------------
// Configura o jogo
//-------------------------------------------------
const configuraJogo = (event) => {
  clearBoard()
  let collumns
  let rows
  switch(event.target.id){
    case 'btnX4':
      collumns = 4
      rows = collumns
      maxpoint = (rows * rows) / 2
      cartas = setCartasArray(maxpoint)
      break
    case 'btnX6':
      collumns = 6
      rows = collumns
      maxpoint = (rows * rows) / 2
      cartas = setCartasArray(maxpoint)
      break
  }
  if(rows == 4){
    document.querySelector('#imagens').style.marginLeft= '6%'
    document.querySelector('#btInicio').disabled = false
  } 
  if(rows == 6){
    document.querySelector('#imagens').style.marginLeft = '2%'
    document.querySelector('#btInicio').disabled = false
  }
  let imgID = 0
  for(let row = 1; row <= rows; row++){
    let odiv = document.createElement('div')
    odiv.className = 'row'
    
    for(let collumn = 1; collumn <= collumns; collumn++){
      let idiv = document.createElement('div')
      if(rows == 4){
        idiv.className = 'col-3'
      }
      if(rows == 6){
        idiv.className = 'col-2'
      }
      idiv.innerHTML = `<img class="img${collumn}" id="i${imgID}" src="${fundo}" />`
      odiv.appendChild(idiv)
      imgID++
    }
    document.querySelector('#imagens').appendChild(odiv)
  }
  let elementImagens = document.querySelectorAll('#memoria img')
  elementImagens.forEach(function(img, i){
    img.src = fundo
    img.setAttribute('data-valor', i)
    img.setAttribute('crossorigin', 'anonymous')
    img.style.opacity = 0.4
  })
}
//-------------------------------------------------
// Cria array de posições das cartas
//-------------------------------------------------
function setCartasArray(maxLength){
  let cartas = []
  for(let i = 1; i <= maxLength; i++){
    cartas.push(i)
    cartas.push(i)
  }
  return cartas
}
//-------------------------------------------------
// Inicia as imagens das cartas
//-------------------------------------------------
function getCartasBackground(total) {
  imagens = []
  //Imagem das cartas
  for(let i = 0; i <= total; i++){
    const id = Math.floor(Math.random() * 151)
    imagens.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`)
  }
}
//-------------------------------------------------
// Limpa o jogo
//-------------------------------------------------
function clearBoard() {
  const rows = document.querySelectorAll('#imagens .row')
  rows.forEach((row) => {
    row.remove()
  })
}
//-------------------------------------------------
// Inicia o jogo
//-------------------------------------------------
const iniciaJogo = () => {
  getCartasBackground(maxpoint)
  document.querySelector('#result').style.display = 'none'
  for(let i = 0; i < cartas.length; i++){
    let p = Math.trunc(Math.random() * cartas.length)
    let aux = cartas[p]
    cartas[p] = cartas[i]
    cartas[i] = aux
  }
  let elementImagens = document.querySelectorAll('#memoria img')
  elementImagens.forEach(function(img, i){
    img.onclick = trataCliqueImagem
    img.style.opacity = 1
    img.src = fundo
  })
  cliquesTravados = false
  temCartaVirada = false
  posicaoCartaVirada = -1 
  valorCartaVirada = 0
  pontos = 0

  document.querySelector('#btInicio').disabled = true
  document.querySelector('.grid-selection').style.display = 'none'
  document.querySelector('#timer').style.display = 'block'
  document.querySelector('#timer').style.backgroundColor = 'orange'
  timer.start()
}
//-------------------------------------------------
// Trata as imagens
//-------------------------------------------------
const trataCliqueImagem = (event) => {
  if(cliquesTravados) return
  const p = +event.target.getAttribute('data-valor')
  const valor = cartas[p]
  event.target.src = imagens[valor-1]
  event.target.onclick = null

  if(!temCartaVirada){
    temCartaVirada = true
    posicaoCartaVirada = p
    valorCartaVirada = valor
  } else {
    if(valor == valorCartaVirada){
      pontos++
    } else {
      const p0 = posicaoCartaVirada
      cliquesTravados = true
      setTimeout(() => {
        event.target.src = fundo
        event.target.onclick = trataCliqueImagem
        let img = document.querySelector(`#memoria #i${p0}`)
        img.src = fundo
        img.onclick = trataCliqueImagem
        cliquesTravados = false
      }, 1000)
    }
    temCartaVirada = false
    posicaoCartaVirada = -1
    valorCartaVirada = 0
  }
  if(pontos == maxpoint){
    document.querySelector('.grid-selection').style.display = 'flex'
    document.querySelector('#result').style.display = 'block'
    document.querySelector('#result').innerHTML = `
      <div class="alert alert-success" role="alert">
      <span>Parabéns, você venceu!</span>
      </div>
    `
    document.querySelector('#timer').style.backgroundColor = 'lightgreen'
    timer.stop()
  }
}
//-------------------------------------------------
// Timer
//-------------------------------------------------
function Timer(element){
  this.element = element
  this.time = 0
  this.control = null
  
  this.start = () => {
    this.time = 0
    this.control = setInterval(() => {
      this.time++
      const minutes = Math.trunc(this.time / 60)
      const seconds = this.time % 60
      document.querySelector(this.element).innerHTML = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
    }, 1000)
  }
  this.stop = () => {
    clearInterval(this.control)
    this.control = null
  }
}