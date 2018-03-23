var currency = require('./currency');

// 使用 currency 模块的 canadianToUS 函数
console.log('50 Canadian dollars equals this amount of US dollars.');
console.log(currency.canadianToUS(50));

// 使用 currency 模块的 USToCanadian 函数
console.log('30 US dollars equals this amount of Canadian dollars.');
console.log(currency.USToCanadian(30));

