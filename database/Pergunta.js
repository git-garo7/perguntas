const Sequelize = require("sequelize");//biblioteca
const connection = require("./database");//conecção com database

const Pergunta = connection.define('pergunta',{
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },//string=texto curto
    descricao:{
        type: Sequelize.TEXT,
        allowNull: false
    }//text= textos longos
});//poderia colocar o termo "pergunta"no plural"perguntas"mas estou apenas testando,quase 3 da manhã

Pergunta.sync({force: false}).then(()=>{
    console.log("tabela  criada!")
})//sync|force|false:se a tabela já existir não força a criação dela.

module.exports = Pergunta;