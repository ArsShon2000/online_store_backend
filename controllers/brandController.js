const {Brand} = require('../models/models')         // БЕРЕМ ТОЛЬКО Brand ИЗ МОДЕЛЕЙ
const ApiError = require('../error/ApiError');

class BrandController {
    async create (req, res) {
        const {name} = req.body                     // ПОЛУЧАЮ name ИЗ ЗАПРОСА 
        const brand = await Brand.create({name})    // С ПОМОЩЬЮ Brand.create МЫ СОЗДАЕМ ЭТОГО ТИПА
        return res.json(brand)
    }

    async getAll (req, res) {
        const brands = await Brand.findAll()        // ВЕРНЕТ ВСЕ ДАННЫЕ ИЗ БД
        return res.json({brands})                   // И ВОЗВРАЩАЕМ В РЕСПОНСЕ
    }
}

module.exports = new BrandController()