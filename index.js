const vision = require('@google-cloud/vision')
const fs = require('fs')

// importante visualizar que essa API esta em beta (v1p2beta1)
const client = new vision.v1p2beta1.ImageAnnotatorClient()

// url da imagem que vamos processar
const imageUri = 'http://dotstore.s3-sa-east-1.amazonaws.com/575/templates/desktop/arquivos/nota-fiscal3-300x275.png'


// estrutura de como deve ser feita a request para o vision
const request = {
  requests: [
    {
      image: {
        source: {
          imageUri: imageUri
        }
      },
      features: [
        {
          // Referência - https://cloud.google.com/nodejs/docs/reference/vision/0.18.x/google.cloud.vision.v1p1beta1#.Type
          type: "TEXT_DETECTION"
        }
      ]
    }
  ]
}

// https://cloud.google.com/nodejs/docs/reference/vision/0.18.x/google.cloud.vision.v1p1beta1.html#.BatchAnnotateImagesRequest
client
  .batchAnnotateImages(request)
  .then(r => {
    // aqui temos todo o texto que foi extraido da imagem
    const text = r[0].responses[0].fullTextAnnotation.text

    // salvando o retorno em algum ligar para fins de log mesmo
    fs.writeFileSync('./output.json', JSON.stringify(r))

    // salvando o texto da imagem no lugar desejado
    fs.writeFileSync('./image-text.txt', text)

  })
  .catch(err => {
    console.error(err)
  })
