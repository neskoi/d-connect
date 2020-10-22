module.exports = (io, socket, tamer)=>{
//chat
socket.on('generalMessage', (data) => {
  socket.broadcast.emit('generalMessage', {sender:  tamer.login, message: data.message});
  choosed_lang = 'pt';
});

//to do, melhorar o sistema de menssagem
socket.on('privateMessage', (data) => {      
  if(TAMER_LIST[data.cited] && data.cited != tamer.login){
    io.to(TAMER_LIST[data.cited].socket_id).emit('privateMessage', {sender: tamer.login, message: data.message});
  }else{
    io.to(TAMER_LIST[tamer.login].socket_id).emit('generalMessage', {sender:  'Notification', message: 'Something goes wrong'});
  }
});
}