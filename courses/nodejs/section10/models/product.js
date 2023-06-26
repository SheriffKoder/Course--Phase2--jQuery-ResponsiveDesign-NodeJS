
//will return a class or constructor function when defined with capital S
const Sequelize = require("sequelize");

//fully configured sqlz environment that also has a connection pool and features of the sqlz package
const sequelize = require("../util/database");


//define a model that will be managed by sqlz
//arguments: modelName, structure of our model and the auto constructed db table
//in the structure we define the fields our product should have
//find more on defining the structure in the official docs/model-definition
const Product = sequelize.define("product", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    //can set the type directly without an object, however can use obj to add allowNull: false
    title: Sequelize.STRING,

    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },

    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },

    description: {
        type: Sequelize.STRING,
        allowNull: false
    }

});

//this is the product model, now we need to export it
module.exports = Product;

