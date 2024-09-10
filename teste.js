class Motor {
  ligar() {
    console.log('Motor ligado');
  }
}

class Carro {
  constructor(motor) {
    this.motor = motor; // Não há `private` em JavaScript, então a propriedade é pública
  }

  dirigir() {
    this.motor.ligar();
    console.log('Carro em movimento');
  }
}

const motor = new Motor();
const carro = new Carro(motor); // A dependência é injetada
carro.dirigir();
