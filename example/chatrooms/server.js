// 内置的 http 模块提供了 HTTP 服务器和客户端功能
var http  = require('http');
// 内置的 fs 提供了与文件系统相关的功能
var fs    = require('fs');
// 内置 path 模块提供了与文件系统路径相关的功能
var path  = require('path'); 
// 附加的 mime 模块有根据文件扩展名得出 MIME 类型的能力
var mime  = require('mime');
// cache 是用来缓存文件内容的对象
var cache = {};


/* =========== 发送文件数据及错误响应 ======== */

/**
 * 在所请求的文件不存在时发送404错误
 * @param {*} response 
 */
function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found');
  response.end();
}

/**
 * 提供文件数据服务
 * @param {*} response 
 * @param {*} filePath 
 * @param {*} fileContents 
 */
function sendFile(response, filePath, fileContents) {
  response.writeHead(200, 
    {"content": mime.lookup(path.basename(filePath))});
  response.end(fileContents);
}

/**
 * 提供静态文件服务
 * @param {*} response 
 * @param {*} cache 
 * @param {*} absPath 
 */
function serveStatic(response, cache, absPath) {
  // 检查文件是否缓存在内存中
  if (cache[absPath]) {
    // 从内存中返回文件
    sendFile(response, absPath, cache[absPath]);
  } else {
    // 检查文件是否存在
    fs.exists(absPath, function(exists) {
      if (exists) {
        // 从硬盘中读取文件
        fs.readFile(absPath, function(err, data) {
          if (err) {
            send404(response);
          } else {
            // 从硬盘中读取文件并返回
            cache[absPath] = data;
            sendFile(response, absPath, data);
          }
        });
      } else {
        // 发送 HTTP 404响应
        send404(response);
      }
    })
  }
}

/* ==================== 创建 HTTP 服务器 ========================= */
// 创建 HTTP 服务器，用匿名函数定义对每个请求的处理行为
var server = http.createServer(function(request, response) {
  var filePath = false;
  
  if (request.url == '/') {
    // 确定返回的默认 HTML 文件
    filePath = 'public/index.html';
  } else {
    // 将 URL 路径转为文件的相对路径
    filePath = 'public' + request.url;
  }

  var absPath = './' + filePath;
  serveStatic(response, cache, absPath);
});

/* ======================= 启动 HTTP 服务器 =========================== */
server.listen(3000, function() {
  console.log('Server listening on port 3000');
});


/* ======================= 设置 Socket.Io 服务器 ================================== */ 
var chatServer = require('./lib/chat_server');
chatServer.listen(server);