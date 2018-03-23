
/* ====================== 将消息和昵称/房间变更请求传给服务器  ========================== */

var Chat = function(socket) {
  this.socket = socket;
};

/**
 * 发送聊天消息
 * @param {*} room 
 * @param {*} text 
 */
Chat.prototype.sendMessage = function(room, text) {
  var message = {
    room: room,
    text: text
  }
}

/**
 * 变更房间
 * @param {*} room 
 */
Chat.prototype.changeRoom = function(room) {
  this.socket.emit('join', {
    newRoom: room
  });
}

/**
 * 处理聊天命令
 * @param {*} command 
 */
Chat.prototype.processCommand = function(command) {
  var words = command.split(' ');
  // 从第一个单词开始解析命令
  var command = words[0]
                  .substring(1, words[0].length)
                  .toLowerCase();
  var message = false;
  switch(command) {
    case 'join':
      words.shift();
      var room = words.join(' ');
      // 处理房间的变换/创建
      this.changeRoom(room);
      break;
    case 'nick':
      words.shift();
      var name = words.join(' ');
      // 处理更名尝试
      this.socket.emit('nameAttempt', name);
      break;
    default: 
      // 如果命令无法识别返回错误信息
      message = 'Unrecognized command.';
      break;
  }
  return message;
}


