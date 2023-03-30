class Cliente {
    constructor(id, mane, dni, phone, address, birth, suscp, card, email, password){
        this.id = id;
        this.name = mane;
        this.dni = dni; 
        this.phone = phone;
        this.address = address;
        this.birth = birth;
        this.suscp = suscp;
        this.card = card;
        this.email = email;
        this.password = password;
        this.suscp_card = this.generatenerateCardNumber(dni);
    }

    //Genera un número de tarjeta de fidelización a partir del dni, quitenado las letras.  
    generateCardNumber(dni){
        const regex = /[A-Za-z]/g;
        return dni.replaceAll(regex, "");
    }
}