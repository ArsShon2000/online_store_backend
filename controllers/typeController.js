const {Type} = require('../models/models')      // БЕРЕМ ТОЛЬКО Type ИЗ МОДЕЛЕЙ
const ApiError = require('../error/ApiError');

class TypeController {
    async create (req, res) {
        const {name} = req.body                 // ПОЛУЧАЮ name ИЗ ЗАПРОСА 
        const type = await Type.create({name})  // С ПОМОЩЬЮ Type.create МЫ СОЗДАЕМ ЭТОГО ТИПА
        return res.json(type)
    }
     
    async getAll (req, res) {
        const types = await Type.findAll()      // ВЕРНЕТ ВСЕ ДАННЫЕ ИЗ БД
        return res.json(types)                  // И ВОЗВРАЩАЕМ В РЕСПОНСЕ
    }
}

module.exports = new TypeController()