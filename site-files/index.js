var idload = 0;

addEventListener("DOMContentLoaded", reload(idload));

function reload(idlo){
    fetch("http://127.0.0.1/page/" + idlo).then((val) => {
        return val.json();
    })
    .then((valor) => {
        document.querySelector("#photos").replaceChildren();
        let formula = Math.floor(window.innerWidth / 310);
        for(let i = 0; i < (valor.length / formula); i ++){
            let actualdiv = document.createElement("div");
            actualdiv.id = i;
            actualdiv.setAttribute("class", "flex");
            for(let j = 0; j < formula && ((i * formula) + j) < valor.length; j ++){
                let carde = new Foto(valor[(i * formula) + j]);
                let karo = document.head.querySelector("#card").content.children[0];
                let template = karo.cloneNode(true);
                template.querySelector("#imagem").src = carde.image;
                template.querySelector("#nome").innerHTML = carde.value.nome;
                template.setAttribute("href", carde.link);
                actualdiv.append(template);
            }
            document.querySelector("#photos").append(actualdiv);
        }
    });
}

function goback(){
    if(idload - 1 >= 0){
        idload -= 1;
        reload(idload);
    }
}

function gonext(){
    fetch("http://127.0.0.1/page/" + (idload + 1)).then((val) => {
        if(val.status != 404){
            idload += 1;
            reload(idload);
        }
    })
}