require('dotenv').config()                                                          // ДЛЯ КОНФИГУРАЦИИ В ФАЙЛЕ .env
const express = require('express')                                                  // ФРЕЙМВОРК ДЛЯ СЕРВЕРА
const sequelize = require('./db')                                                   // ИМПОРТ ОБЪЕКТА ДБ ЖС
const models = require('./models/models')                                           // ТАБЛИЦЫ
const cors = require('cors')                                      
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorMiddler = require('./middleware/ErrorHandlingMiddleware')                // MIDDLEWARE
const path = require('path')

const PORT = process.env.PORT || 5000                                               // ПОРТ 

const app = express()
app.use(cors())
app.use(express.json())                                                             // ЧТОБЫ ПАРСИТЬ JSON
app.use(express.static(path.resolve(__dirname, 'static')))                                                           // ЧТОБЫ МОЖНО БЫЛО ПОСМОТРЕТЬ ФАЙЛЫ ИЗ ПАПКИ static
app.use(fileUpload({}))                                                             // ДЛЯ РАБОТЫ С ФАЙЛАМИ
// ############### АПИ РЕСТЫ ############### 
app.use('/api', router)

// ############### ОБРАБОТКА ОШИБОК, ПОСЛЕДНИЙ МИДЛВЭЙР ############### 
app.use(errorMiddler)                                                               // нужно регистрировать последним так как является замыкающим


const start = async () => {                                                         // ФУНКЦИЯ ДЛЯ ПОДКЛЮЧЕНИЯ К БД
    try{
        await sequelize.authenticate()                                              // С ПОМОЩЬЮ НЕГО ПОДКЛЮЧАЕМСЯ К БД
        await sequelize.sync()                                                      // это функция сверяет состояние бд СО СХЕМОЙ (СВЯЗКА)
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))       // ПОДКЛЮЧЕНИЕ К ЭТОМУ ПОРТУ
    } catch (e) {
        console.log(e)
    }
}


start();