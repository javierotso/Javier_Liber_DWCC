class Cliente {
    constructor(id, name, dni, phone, address, birth, suscp, card, email, password){
        this.id = id;
        this.name = name;
        this.dni = dni; 
        this.phone = phone;
        this.address = address;
        this.birth = birth;
        this.suscp = suscp;
        this.card = card;
        this.email = email;
        this.password = password;
        this.img = "Prototipo/img/user.png";
        this.suscp_card = this.generateCardNumber(dni);
    }

    //Genera un número de tarjeta de fidelización a partir del dni, quitenado las letras.  
    generateCardNumber(dni){
        const regex = /[A-Za-z]/g;
        return dni.replaceAll(regex, "");
    }
}