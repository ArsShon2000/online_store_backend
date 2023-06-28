// ЗДЕСЬ БУДЕМ РЕАЛИЗОВАТБЬ МОДЕЛИ ДАННЫХ (СХЕМА ТАБЛИЦ И ТД)
const sequelize = require('../db')
const {DataTypes} = require('sequelize')                                // {} ЭТО КЛАССЫ

// ##################### СОЗДАНИЕ МОДЕЛЕЙ (ТАБЛИЦ) #####################
const User = sequelize.define('user', {                                 // TABLE FOR USERS
    id:         {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    email:      {type: DataTypes.STRING, unique:true},
    password:   {type: DataTypes.STRING},
    role:       {type: DataTypes.STRING, defaultValue: "USER"},
})

const Basket = sequelize.define('basket', {
    id:     {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const BasketDevice = sequelize.define('basket_device', {
    id:     {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
})

const Device = sequelize.define('device', {
    id:     {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    name:   {type: DataTypes.STRING, unique: true, allowNull:false},
    price:  {type: DataTypes.INTEGER, allowNull:false},
    rating: {type: DataTypes.INTEGER, defaultValue: 0},
    img:    {type: DataTypes.STRING, allowNull:false},
})

const Type = sequelize.define('type', {
    id:     {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:   {type: DataTypes.STRING, unique:true, allowNull: false},
})

const Brand = sequelize.define('brand', {
    id:     {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    name:   {type: DataTypes.STRING, allowNull: false},
})

const Rating = sequelize.define('rating', {
    id:     {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    name:   {type: DataTypes.INTEGER, allowNull: false},
})

const DeviceInfo = sequelize.define('device_info', {
    id:             {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    title:          {type: DataTypes.STRING, allowNull: false},
    description:    {type: DataTypes.STRING, allowNull:false}
})

const TypeBrand = sequelize.define('type_brand', {
    id:     {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
})


// ОПИСАНИЕ СООТНОШЕНИЙ ТАБЛИЦ
User.hasOne(Basket)                                 // У ОДНОГО ЮЗЕРА ОДНА КОРЗИНА
Basket.belongsTo(User)                              // КОРЗИНА ПРИНАДЛЕЖИТ ЭТОМУ ЮЗЕРУ

User.hasMany(Rating)                                // У ОДНОГО ЮЗЕРА МНОГО РЕЙТИНГОВ
Rating.belongsTo(User)                              // 

Basket.hasMany(BasketDevice)                        // У ОДНОЙ КОРЗИНЫ МНОГО ДЕВАЙСОВ
BasketDevice.belongsTo(Basket)

Type.hasMany(Device)                                // У ОДНОГО ТИПА МНОГО ДЕВАЙСОВ
Device.belongsTo(Type)

Brand.hasMany(Device)                               // У ОДНОГО БРЕНДА МНОГО ДЕВАЙСОВ
Device.belongsTo(Brand)

Device.hasMany(Rating)                              // У ОДНОГО ДЕВАЙСА МНОГО РЕЙТИНГОВ
Rating.belongsTo(Device)

Device.hasMany(BasketDevice)                        // ОДИН ДЕВАЙС МНОГО В КОРЗИНЕ
BasketDevice.belongsTo(Device)

Device.hasMany(DeviceInfo, {as: 'info'});           // У ОДНОГО ДЕВАЙСА МНОГО ИНФОРМАЦИИ
DeviceInfo.belongsTo(Device)

Type.belongsToMany(Brand, {through: TypeBrand})     // У ОДНОГО БРЕНДА МНОГО ТИПОВ
Brand.belongsToMany(Type, {through: TypeBrand})     // У ОДНОГО ТИПА МНОГО БРЕНДОВ

module.exports = {
    User,
    Basket,
    BasketDevice,
    Device,
    Type,
    Brand,
    Rating,
    TypeBrand,
    DeviceInfo
}