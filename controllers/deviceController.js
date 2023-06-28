const uuid = require('uuid')            // ГЕНЕРАТОР УНИКАЛЬНЫХ id
const path = require('path')
const { Device, DeviceInfo } = require('../models/models')
const ApiError = require('../error/ApiError')

class DeviceController {
    async create (req, res, next) {
        try {
            let { name, price, brandId, typeId, info } = req.body
            const { img } = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(            // ПЕРЕНОСИМ ВСЕ ФАЙЛЫ С ПОМОЩЬЮ path
                __dirname,                  // ПАПКА ГДЕ МЫ СТОИМ
                '..',                       // НА ПАПКУ ВЫШЕ
                'static',                   // НАЗВАНИЕ ПАПКИ КУДА НАДО
                fileName))                  // ИМЯ ФАЙЛА

            const device = await Device.create({ name, price, brandId, typeId, img: fileName })

            if (info) {                                 // ИНФОРМАЦИЯ ОБ ОБЪЕКТЕ ПРИДЕТ В ВИДЕ МАССИВА (СТРИНГ)
                info = JSON.parse(info)
                info.forEach(i => 
                    DeviceInfo.create({
                        title: i.title,                 // НАЗВАНИЕ
                        description : i.description,    // ОПИСАНИЕ
                        deviceId: device.id             // И АЙДИ
                    })
                )
            }


            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll (req, res) {
        let { brandId, typeId, limit, page } = req.query // ВОЗВРАЩАЕМ ПО БРЕНДУ ИЛИ ТИПУ
        page = page || 1                    // РАЗБИВАЕМ ПО СТР (ПО УМОЛ СТР 1)
        limit = limit || 9                  // СКОЛЬКО ЭЛ В ПАПКЕ
        let offset = page * limit - limit    // ОТСТУП
        let devices;                        // ВСЕ ДЕВАЙСЫ ИЗ 3АПРОСА
        if (!brandId && !typeId) {          // ИЛИ ВСЕ ДАННЫЕ
            devices = await Device.findAndCountAll({ limit, offset })
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({ where: { brandId }, limit, offset })
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({ where: { typeId }, limit, offset })
        }
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({ where: { typeId, brandId }, limit, offset })
        }
        return res.json(devices)            // В КОНЦЕ ВОЗВРАЩАЕМ ВСЕ ОТФИЛЬТРОВАННЫЕ ДЕВАЙСЫ
    }

    async getOne (req, res) {
        const {id} = req.params
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            },
        )
        return res.json(device)
    }
}

module.exports = new DeviceController()