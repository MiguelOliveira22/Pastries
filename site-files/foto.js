class Foto{
    constructor(value){
        this.value = value;
        this.image = "http://192.168.1.226/images/" + value.id;
        this.link = "http://192.168.1.226/image/" + value.id;
    }
}