//======================================================
// LocalStore Config
//======================================================

let local_config = localStorage;

if(!local_config.getItem('language')){
    local_config.setItem('language', 'US');
}

if(!local_config.getItem('volume')){
    local_config.setItem('volume', '0.5');
}

if(!local_config.getItem('digivice_maximize')){
    local_config.setItem('digivice_maximize', '0');
}
//======================================================
// General setup
//======================================================

window.addEventListener("load", function(e) {
    change_volume(parseFloat(local_config.getItem('volume')));
    document.querySelector('#flag-position').className = `fflag fflag-${localStorage.getItem('language')} ff-md`
});

//======================================================
// Core functions
//======================================================

let socket = io.connect('//' + window.location.host);
socket.on('duplicatedTab', (data) => {
    alert(data);
    let links = ['https://www.youtube.com/watch?v=UI6jSiSX5AI',
    'https://www.youtube.com/watch?v=VNw5x24G0Nw&list=PLJHmLbOoKdZBekGXhSCqmL9Cphl7eRUfg&index'];
    let lucky = Math.round(Math.random() * (links.length - 1));
    window.location.replace(links[lucky]);
});

socket.on('app_error', (data)=>{
    alert(data);
});

//let alert_time;
socket.on('notify', (data)=>{
    swal({
        icon: data.type,
        text: data.message,
        //timer:3000,
    })
});

let language = language_load();
function language_load(){
  let language_json;
  let language_request =  new XMLHttpRequest();
  language_request.open('GET', `/language/language_${local_config.getItem('language')}.json`);
  language_request.responseType = 'json';
  language_request.send();
  language_request.onload = () => {
    language = language_request.response;
  }
  return language_json;
} 

//======================================================
// Chat
//======================================================
let chat_top = document.querySelector('#chat-top'),
    chat_box = document.querySelector('#chat-box'),
    chat_body = document.querySelector('#chat-body'),
    chat_input = document.querySelector('#chat-input'),
    chat_send = document.querySelector('#chat-send'),
    chat_message = document.querySelector('.chat-message');

if(chat_top){
    chat_top.addEventListener('click',()=>{
        if(chat_box.classList.contains('show')){
          chat_box.classList.remove('show');
        }
        else{
          chat_box.classList.add('show');
        }
    });
    chat_send.addEventListener('submit', (e) => {
        e.preventDefault();
        let message = chat_input.value;
        if(message.length > 0){
            if(message[0] === '@'){
                let cited = message.slice(1, message.indexOf(' '));
                message = message.slice(message.indexOf(' ') + 1);
                socket.emit('privateMessage',{cited: cited, message: message});   
            }else{
                socket.emit('generalMessage',{message: message});
            }
            render_message('Me', message);  
            chat_input.value = '';
        }
    });
}

socket.on('generalMessage', (data) => {
    render_message(data.sender, data.message);
    console.log(socket.id);
});

socket.on('privateMessage', (data) => {
    render_message(data.sender, data.message);
});

function render_message(sender, message){
    chat_message.innerHTML += `<div class = 'chat-message'><strong>${sender}</strong>: ${message}</div>`
    chat_body.scrollTop = chat_body.scrollHeight;
}

//======================================================
// AUDIOS
//======================================================
let AUDIO = {
    battle_music: new Audio('/resources/sounds/battle_music.mp3'),
    bkg_music: new Audio('/resources/sounds/digivice_music.ogg'),
    error: new Audio('/resources/sounds/error.wav'),
    hit: new Audio('/resources/sounds/hit.wav'),
    poop_flush: new Audio('/resources/sounds/flush.wav'),
    pooping: new Audio('/resources/sounds/pooping.wav'),
    use_item: new Audio('/resources/sounds/use_item.wav'),
    lose: new Audio('/resources/sounds/bt_lose.wav'),
    win: new Audio('/resources/sounds/bt_win.wav'),
}
  
function change_volume(volume){
    for(const index in AUDIO){
        AUDIO[index].volume = volume;
    }
    let volume_bar = document.querySelector('#volume-control');
    let volume_ico = document.querySelector('#volume-ico');
    volume_ico.classList.toggle('fa-volume-off', volume == 0);
    volume_ico.classList.toggle('fa-volume-down', volume <= 0.5 && volume != 0);
    volume_ico.classList.toggle('fa-volume-up', volume > 0.5);
    volume_bar.value = volume * 100;
    local_config.setItem('volume', volume);
}

function music_swaper(to_stop, to_play){
    to_stop.pause();
    to_play.play();
}

document.querySelector('#volume-control').addEventListener('input',(e) => {
    change_volume(e.target.value/100);
});

document.querySelector('#volume-ico').addEventListener('click',(e) => {
    let volume;
    if(e.target.classList.contains('fa-volume-up')){
        volume = 0;
    }else if(e.target.classList.contains('fa-volume-down')){
        volume = 1;
    }else{
        volume = 0.5;
    }
    change_volume(volume);
});