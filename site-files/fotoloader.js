addEventListener("DOMContentLoaded", () => {
    let parts = window.location.toString();
    let urlnew = parts.split("/").pop() || parts.split("/").pop();
    console.log(urlnew);
    reload(urlnew);
});

function reload(idlo){
    fetch("http://127.0.0.1/values/" + idlo).then((val) => {
        return val.json();
    })
    .then((valor) => {
        let carde = new Foto(valor[0]);
        let karo = document.head.querySelector("#nomeado").content.children[0];
        let template = karo.cloneNode(true);
        template.querySelector("#imagembig").src = carde.image;
        template.querySelector("#nome").innerHTML = carde.value.nome;
        document.querySelector("#photos").append(template);
    });
}