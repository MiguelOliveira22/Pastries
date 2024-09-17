// main.js

const mssql = require("mssql");
const express = require("express");
const fs = require("fs");
const prompt = require("prompt-sync")({sigint: true});

let app = express();

var latest = require(__dirname + "/site/Blog/latest");

try{
    var config = require(__dirname + "/config/config.json");
    main(config);
}

catch{
    console.error("Arquivo de configuração Não Encontrado!");
    let cont = prompt("Gerar Arquivo (Ele poderá ser alterado no futuro!)? (S/n) ");

    if(cont != "n"){
        console.log();

        let nomebd = prompt("Insira O User: ");
        let passbd = prompt("Insira A Senha: ");
        let serverbd = prompt("Insira O Servidor: ");
        let dbbd = prompt("Insira O Banco De Dados: ");

        config = '{"user": "' + nomebd + '", "password": "' + passbd + '", "server": "' + serverbd + '", "database": "' + dbbd + '", "options": {"encrypt": true, "trustServerCertificate": true}}';
        if(!fs.existsSync("/config")){
            fs.mkdirSync(__dirname + "/config")
        }
        fs.writeFileSync(__dirname + "/config/config.json", config);

        var config = require(__dirname + "/config/config.json");
        main(config);
    }
}

function main(config){
    mssql.connect(config, (err) => {
        if(err){
            throw err;
        }
        console.log("Logged");
    });

    // Server Sends Files

    app.get("/", (req, res) => {
        res.sendFile(__dirname + "/site/Main/pastries.html", (err) => {
            if(err){
                console.log("Arquivo Deu Rui");
                res.status(404).end();
            }
            else{
                console.log("Arquivo Funfou");
            }
        });
    });

    app.get("/erro/", (req, res) => {
        res.sendFile(__dirname + "/site/Main/error.html", (err) => {
            if(err){
                console.log("Arquivo Deu Rui");
                res.status(404).end();
            }
            else{
                console.log("Arquivo Funfou");
                res.status(404).end();
            }
        });
    });

    app.get("/about/", (req, res) => {
        res.sendFile(__dirname + "/site/Main/about.html", (err) => {
            if(err){
                console.log("Arquivo Deu Rui");
                res.status(404).end();
            }
            else{
                console.log("Arquivo Funfou");
            }
        });
    });

    app.get("/blog/", (req, res) => {
        res.redirect("/blog/" + latest.id + "/" + latest.nome);
    });

    app.get("/blog/:idPost/:namePost", (req, res) => {
        var file = req.params.idPost;
        res.sendFile(__dirname + "/site/Blog/" + file + ".html", (err) => {
            if(err){
                console.log("Arquivo Deu Rui");
                res.redirect("/erro/");
            }
            else{
                console.log("Arquivo Funfou");
            }
        });
    });

    app.get("/image/:idImage", (req, res) => {
        let image = req.params.idImage;
        new mssql.Request().query("SELECT id FROM Pastries.Main WHERE id = " + image, (err, result) => {
            if(err || result.recordset.length == 0){
                res.redirect("/erro/")
            }
            else{
                res.sendFile(__dirname + "/site/image.html", (err) => {
                    if(err){
                        console.log("Arquivo Deu Rui");
                        res.status(404).end();
                    }
                    else{
                        console.log("Arquivo Funfou");
                    }
                });
            }
        });
    });

    app.get("/cdn/:fileName", (req, res) => {
        var file = req.params.fileName;
        res.sendFile(__dirname + "/site-files/" + file, (err) => {
            if(err){
                console.log("Arquivo Deu Rui");
                res.status(404).end();
            }
            else{
                console.log("Arquivo Funfou");
            }
        });
    });

    app.get("/cdn/f/:fileName", (req, res) => {
        var file = req.params.fileName;
        res.sendFile(__dirname + "/site-files/Favicon/" + file, (err) => {
            if(err){
                console.log("Arquivo Deu Rui");
                res.status(404).end();
            }
            else{
                console.log("Arquivo Funfou");
            }
        });
    });

    app.get("/images/:idImage", (req, res) => {
        var id = req.params.idImage;
        new mssql.Request().query("SELECT imagepath FROM Pastries.Main WHERE id = " + id, (err, result) => {
            if(err || result.recordset.length == 0){
                console.log("SQL Deu Rui");
                res.status(404).end();
            }
            else{
                let imagefin = result.recordset[0];
                res.sendFile(__dirname + "/images/" + imagefin.imagepath, (err) => {
                    if(err){
                        console.log("Arquivo Deu Rui");
                        res.status(404).end();
                    }
                    else{
                        console.log("Arquivo Funfou");
                    }
                });
            }
        })
    });

    app.get("/values/:pageNumber", (req, res) => {
        try{
            var page = Number(req.params.pageNumber);
        }
        catch{
            console.log("SQL Deu Rui");
            res.status(404).end();
        }

        new mssql.Request().query("SELECT id, nome FROM Pastries.Main WHERE id = " + page, (err, result) => {
            if(err || result.recordset.length == 0){
                console.log("SQL Deu Rui");
                res.status(404).end();
            }
            else{
                console.log("SQL Deu Bom");
                res.send(result.recordset);
            }
        });
    });

    app.get("/page/:pageNumber", (req, res) => {
        try{
            var page = Number(req.params.pageNumber);
        }
        catch{
            console.log("SQL Deu Rui");
            res.status(404).end();
        }

        new mssql.Request().query("SELECT id, nome FROM Pastries.Main WHERE id >= " + (page * 20) + " and id < " + ((page + 1) * 20) , (err, result) => {
            if(err || result.recordset.length == 0){
                console.log("SQL Deu Rui");
                res.status(404).end();
            }
            else{
                console.log("SQL Deu Bom");
                res.send(result.recordset);
            }
        });
    });

    app.listen(80, "127.0.0.1", () => {
        console.log("Started");
    });
}