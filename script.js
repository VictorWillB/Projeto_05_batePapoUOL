const nomeUser = prompt("Qual o seu nome de Usuário?");
let input = document.querySelector("input");

function perguntarUsuario(){
    let enviarNome ={name: nomeUser};
    if(!nomeUser){
        alert ("Nome de usuário ínvalido. Por favor, digite algo.");
        window.location.reload();
        return
    }
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", enviarNome);
    promise.then(enviarUser);
    promise.catch(erroEnvio);
    setInterval(manterOnline, 4000, enviarNome);
    buscarMensagem();
    pedirUsuarios()
}
perguntarUsuario()

function manterOnline(usuarioName){
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuarioName);
    promise.then(enviarUser);
}
function enviarUser(){
}

function erroEnvio(erro){
 let code_Status= erro.response.status;
 if(code_Status === 400){
     alert("Nome de usuário indisponível. Tente novamente.");
     window.location.reload();
     return
 }
}
function buscarMensagem(){
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(carregarMensagens);
}

function rebuscarMensagem(){
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(recarregarMensagens);
   
}

function atualizarChat(){
    setInterval(rebuscarMensagem,3000)
    setInterval(pedirUsuarios,10000)
}

function recarregarMensagens(response){
 if(verificarMSG(response)){
     limparChat()
     const mensagemAPI = response.data
     mensagemAPI.map(inserirMensagensChat)
 }
}

function verificarMSG (mensagemnovas){
 
    const arrMsgNovas =mensagemnovas.data;
    const mensagemAtuais = document.querySelectorAll(".tempo");

    if(mensagemAtuais[0].innerHTML === `(${arrMsgNovas[0].time})`){
       
        if(mensagemAtuais[99].innerHTML === `(${arrMsgNovas[arrMsgNovas.length - 1].time})`){
           
            return false
        }
    }else{
        
        return true
    }
}

function limparChat(){
    let caixaMensagem = document.querySelector(".caixa-mensagem");
    caixaMensagem.innerHTML = ``;
}

function carregarMensagens(response){
const mensagemAPI = response.data
mensagemAPI.map(inserirMensagensChat)
atualizarChat()
}

function inserirMensagensChat(mensagem){
    let caixaMensagem = document.querySelector(".caixa-mensagem");
    if(mensagem.type=== "status"){
        caixaMensagem.innerHTML += `<div class="mensagem ${(mensagem.type)}">
        <h5> <span class="tempo">(${(mensagem.time)})</span> <strong>${(mensagem.from)}</strong>  ${(mensagem.text)} </h5>    
        </div>`
    }else{
        caixaMensagem.innerHTML += `<div class="mensagem ${(mensagem.type)}">
                <h5> <span class="tempo">(${(mensagem.time)})</span> <strong> ${(mensagem.from)}</strong> para <strong>${(mensagem.to)}</strong>  ${(mensagem.text)} </h5>    
                </div>`
    }
    caixaMensagem.lastElementChild.scrollIntoView(false)
}


function enviarMensagem(){
    let mensagemEscrita = document.querySelector("input").value;
    if(!mensagemEscrita){
        alert ("Mensagem ínvalida. Por favor, escreva algo!")
        return
    }
    let mensagem;
    if(!usuarioSelec){
            mensagem ={
            from: nomeUser ,
            to: "Todos",
            text: mensagemEscrita,
            type: "message",
        }
    
    } else{
        mensagem ={
        from: nomeUser ,
        to: usuarioSelec,
        text: mensagemEscrita,
        type: visibSelec,
    }
}

    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",mensagem );
   promise.then(mensagemEnviada)
    promise.catch(erroMensagem)
    limparInput()
}

function mensagemEnviada(){
        
usuarioSelec=""
console.log("mensagem Enviada")
limparVisibilidade()
}

function erroMensagem(erro){
    alert("Você foi desconectado. Por favor, re-insira seu nome de usuário!");
    window.location.reload();
}
function limparInput(){
    let input = document.querySelector("input")
    input.value = "";
}
function abrir_BarraLateral(){
    const cover_Batepapo = document.querySelector(".cover-batepapo")
    const barraLateral = document.querySelector(".barra-lateral");
    cover_Batepapo.classList.remove("opacidade-zero")
    barraLateral.classList.add("aberto")
}

input.addEventListener('keydown', function (evento) {
    if (evento.keyCode !== 13) return;
    enviarMensagem()
})

function fechar_BarraLateral(){
    const cover_Batepapo = document.querySelector(".cover-batepapo")
    const barraLateral = document.querySelector(".barra-lateral");
    cover_Batepapo.classList.add("opacidade-zero")
    barraLateral.classList.remove("aberto")
}

function pedirUsuarios(){
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    promise.then(receberUsuarios)

}


function receberUsuarios(usuariosOnline){
    let arrUsuarios = usuariosOnline.data;
    if(!usuarioSelec){
    limparContatos()
    inserirTodos()
    arrUsuarios.map(inserirUsuarios)}
}

function inserirTodos(){
    let listaContatos = document.querySelector(".lista-contatos")
    listaContatos.innerHTML +=`
    <div class="contato " onclick="selecionarContato(this)">   
                    <div class="pointer">
                        <ion-icon class="people" name="people"></ion-icon>
                        <h4>Todos</h4>
                    </div> 
                        <img src="imagens/verificado-Verde.png" class="verificado-verde">
                </div>
    `
}

function limparContatos(){
    let listaContatos= document.querySelector(".lista-contatos")
    listaContatos.innerHTML= ``
}

function inserirUsuarios(usersOnline){
    let nomeUser = usersOnline.name
    let listaContatos = document.querySelector(".lista-contatos")
    listaContatos.innerHTML +=`
    <div class="contato" onclick="selecionarContato(this)">   
    <div class="pointer">
    <ion-icon class="people" name="person-circle-outline"></ion-icon>
    <h4>${nomeUser}</h4>
    </div>
    <img src="imagens/verificado-Verde.png" class="verificado-verde">
</div>
    `
}
let usuarioSelec;
function selecionarContato(contato){
    let verificado = contato.querySelector("img")
    let contatoSelecionado= document.querySelector(".lista-contatos .selecionado") 
    if( contatoSelecionado !== null){
        contatoSelecionado.classList.toggle("selecionado")
    }
    verificado.classList.toggle("selecionado")
    usuarioSelec=contato.querySelector("h4").innerHTML
}

let visibSelec;
function selecionarVisibilidade(tipo){
    let verificado = tipo.querySelector("img")
    let visibilidadeSelecionada= document.querySelector(".lista-visibilidade .selecionado") 
    if( visibilidadeSelecionada !== null){
        visibilidadeSelecionada.classList.remove("selecionado")
    }
    verificado.classList.toggle("selecionado")
    let visibilidadeSelec=tipo.querySelector("h4").innerHTML
    if(visibilidadeSelec === "Reservadamente"){
       visibSelec ="private_message"
       return
    } 
    visibSelec = "message"
   
}

function limparVisibilidade(){
    let visibilidadeSelecionada= document.querySelector(".lista-visibilidade .selecionado") 
    if(!visibilidadeSelecionada){
    visibilidadeSelecionada.classList.remove("selecionado")
    }
}

