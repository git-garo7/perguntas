const express = require("express");
const app = express();
const bodyparser = require("body-parser")
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
//database
connection
	.authenticate()
	.then(()=>{
		console.log("banco de dados conectado!")
	})
	.catch((msgErro)=> {
		console.log("msgErro");
	})
app.set("view engine","ejs");//dizendo ao express pra usar o ejs apartir do view engine
app.use(express.static('public'));
//bodyparser

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
//rotas
app.get("/",(req,res)=>{
	Pergunta.findAll({raw: true,order:[
		['id','DESC']//DESC=decrescente|ASC=crescente
	]}).then(perguntas => {
		res.render("index",{
			perguntas:perguntas
		});
	});//semelhante ao sql*ALL FROM perguntas*=findALL.
});//rota da pg principal

app.get("/perguntar",(req,res)=>{
	res.render("perguntar");
})

app.post("/salvarpergunta",(req,res)=>{
	var titulo = req.body.titulo;
	var descricao = req.body.descricao;
	Pergunta.create({//salva dados no banco de dados|create = insert into perguntas/pergunta
		titulo: titulo,
		descricao: descricao,
	}).then(()=> {
		res.redirect("/");
	});//envia pra pg inicial.
});

	
	app.get("/pergunta/:id",(req,res) =>{
		var id = req.params.id;
		Pergunta.findOne({
			where: {id:id }			
		}).then(pergunta =>{
			if(pergunta !=undefined ){//perg encontrada	

				Resposta.findAll({
					where: {perguntaId: pergunta.id},
					order: [ 
						['id','DESC'] 
					]
				}).then(respostas=>{
					res.render("pergunta",{
						pergunta : pergunta,
						respostas:respostas
					});
				})


							
			}else{//perg n encontrada
				res.redirect("/");
			}
		})
	});//findOne = pesquisa uma pergunta pelo id no banco de dados|where= pode fazer pelo título,pelo id(que é oq estou usando).

app.post("/responder",(req,res)=>{
	var corpo = req.body.corpo;
	var perguntaId = req.body.pergunta;
	Resposta.create({
		corpo: corpo,
		perguntaId: perguntaId
	}).then(()=>{
		res.redirect("/pergunta/"+perguntaId);
	});
});

app.listen(8080,()=>{console.log("app funfou!");});