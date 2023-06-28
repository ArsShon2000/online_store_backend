const ApiError = require('../error/ApiError');

module.exports = function (err, req, res, next) {   // ЭТО ФУНКИЯ И ЕСТЬ АПИЕРРОР
    if (err instanceof ApiError) {                  // ЕСЛИ КЛАСС В ОШИБКЕ АПИ ЕРРОР    
        return res.status(err.status).json( {message: err.message} )    // ТО ТОГДА НА КЛИЕНТ ВОЗВРАЩАЕМ ОТВЕТ СО СТАТУС КОДОМ КОТОРЫЙ БУДЕМ ПОЛУЧАТЬ ИЗ ОШИБКИ
    }
    return res.status(500).json( { message: "Непредвиденная ошибка!" } )
}
