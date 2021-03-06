const https = require('https');

const { ID_PLANILLA, GOOGLE_API_KEY } = process.env

const options = {
  hostname: 'sheets.googleapis.com',
  path: '/v4/spreadsheets/' + ID_PLANILLA + '/values/Senadores!S2:S73?key=' + GOOGLE_API_KEY,
}

const acumuladorDeVotos = {
  aFavor: 0,
  enContra: 0,
  noConfirmado: 0,
  seAbstiene: 0,
  fechaUltimaActualizacion: 0
}

class RecolectorDeVotos {

    obtenerVotos() {
      console.log('Buscando nuevos votos');

      var request = https.request(options, function (res) {
        var data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {

          const votos = JSON.parse(data).values;

          var aFavor = 0;
          var enContra = 0;
          var noConfirmado = 0;
          var seAbstiene = 0;

          if(votos != undefined && votos != null) {
            votos.forEach(voto => {
              const posicion = voto[0];
              if(posicion === 'A Favor') {
                aFavor++;
              } else if(posicion === 'En Contra') {
                enContra++;
              } else if(posicion === 'No confirmado') {
                noConfirmado++;
              } else if(posicion === 'Se Abstiene') {
                seAbstiene++;
              } else {
                console.log('Voto no reconocido ' + voto[0]);
              }
            });

            acumuladorDeVotos.aFavor = aFavor;
            acumuladorDeVotos.enContra = enContra;
            acumuladorDeVotos.noConfirmado = noConfirmado;
            acumuladorDeVotos.seAbstiene = seAbstiene;
            acumuladorDeVotos.fechaUltimaActualizacion = Date.now();
          } else {
            console.log('No hay votos: ' + data);
            console.log(data);
          }
        });
      });
      request.on('error', (e) => {
          console.log('Error accediendo a los datos: ' + e.message);
      });
      request.end();

    }

    votosAcumulados() {
        return acumuladorDeVotos;
    }
}

module.exports = RecolectorDeVotos;