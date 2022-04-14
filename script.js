const nomeUser = prompt("Qual o seu nome de Usuário?");
function perguntarUsuario(){
    let enviarNome ={name: nomeUser};
    console.log(enviarNome);
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", enviarNome);
    promise.then(enviarUser);
    promise.catch(erroEnvio);
    setInterval(manterOnline, 4000, enviarNome);
    buscarMensagem();
}
perguntarUsuario()

function manterOnline(usuarioName){
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usuarioName);
    promise.then(enviarUser);
}
function enviarUser(){
   console.log("enviei");
}

function erroEnvio(erro){
 let code_Status= erro.response.status;
 console.log(erro.response.data);
 if(code_Status === 400){
     alert("Nome de usuário indisponível. Tente novamente.");
     perguntarUsuario();
 }
}
function buscarMensagem(){
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(carregarChat);
}

function carregarChat(response){
carregarMensagens(response)
atualizarChat()
}

function atualizarChat(){
    setTimeout(buscarMensagem,3000)
}

function limparChat(){
    let caixaMensagem = document.querySelector(".caixa-mensagem");
    caixaMensagem.innerHTML = ``;
}

function carregarMensagens(response){
    const mensagens=response.data;
    let caixaMensagem = document.querySelector(".caixa-mensagem");
    limparChat();
    for(let i = 0; i <mensagens.length; i++){
        if(mensagens[i].type === "status"){
            caixaMensagem.innerHTML += `
    <div class="${mensagens[i].type}">
    <h5>(${mensagens[i].time}) <strong>${mensagens[i].from}</strong> ${mensagens[i].text} </h5>    
</div>
    `
        } else{
             caixaMensagem.innerHTML += `
    <div class="${mensagens[i].type}">
    <h5>(${mensagens[i].time}) <strong>${mensagens[i].from}</strong> para <strong>${mensagens[i].to}</strong>  ${mensagens[i].text} </h5>    
</div>
    `
        }
   
}
const ultimaMensagem = caixaMensagem.lastElementChild;
ultimaMensagem.scrollIntoView()
}

function enviarMensagem(){
    let mensagemEscrita = document.querySelector("input").value;
    let mensagem ={
        from: nomeUser ,
		to: "Todos",
		text: mensagemEscrita,
		type: "message",
    }
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",mensagem );
   }
