const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')                                                    // ДЛЯ ХЭШТОЛВАНИЯ      
const jwt = require('jsonwebtoken') 
const {User, Basket} = require('../models/models')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role}, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
        )
}

class UserController {
    async registration(req, res, next) {                                            // СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ
        const {email, password, role} = req.body
        if(!email || !password){                                                    // ЕСЛИ НЕ ВВЕЛИ ОДИН ИЗ НИХ
            return next(ApiError.badRequest('Некорректный email или password'))
        }

        const condidate = await User.findOne({where: {email}})                            // ПРОВЕРКА НА УНИКАЛЬНОСТЬ
        if(condidate){
            return next(ApiError.badRequest('Такой email уже существует'))
        }
        // ЕСЛИ ВСЕ ХОРОШО
        const hashPassword = await bcrypt.hash(password, 5)                         // ХЭШИРУЕМ ПАРОЛЬ
        const user = await User.create({email, role, password:hashPassword})        // И СОЗДАЕМ ПОЛЬЗОВАТЕЛЯ
        const basket = await Basket.create({userId: user.id})                       // КОРЗИНА
        const token = generateJwt(user.id, user.email, user.role)
        
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body                                          // ИЗ ТЕЛА ЗАПРОСА
        const user = await User.findOne( {where: {email}})
        if(!user){
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword) {
            return next(ApiError.internal('Неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res, next) {           // check ДОЛЖЕН СГЕНЕРИРОВАТЬ НОВЫЙ ТОКЕН И ОБРАТНО ОТПРАВИТЬ В ПОЛЬЗОВАТЕЛЬ
        // const query = req.query         // ПОЛУЧАЮ ПАРАМЕТР СТРОКИ ЗАПРОСА
        // const {id} = req.query          // ДЛЯ ПОЛУЧЕНИЯ ОПРЕДЕЛЕННОГО ПАРАМЕТРА, НАПРИМЕР АЙДИ
        // if(!id) {
        //     return next(ApiError.badRequest('Не задан ID'))
        // }
        // res.json(id)    
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController()