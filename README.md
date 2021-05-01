<h1 align="center">
    🔗 Desafio Quero Delivery
</h1>
<p align="center">
🚀 Api que recebe imagens e as classifica em 5 categorias [Person , Landscape, Animal, Object, Text]
</p>
Tabela de conteúdos
<p align="center">
 <a href="#instalacao">Instalação</a> •
 <a href="#objetivo">Objetivo</a> •
 <a href="#features">Features</a> •
 <a href="#tecnologias">Tecnologias</a> • 
 <a href="#autor">Autor</a>
</p>

### Instalação
# Clone este repositório
$ git clone <https://github.com/paulochagass/desafioQueroDelivery->

# Acesse a pasta do projeto no terminal/cmd
$ cd desafioQueroDelivery 

# Instale as dependências
$ npm install

# Renomeie o arquivo .env-sample para .env
$ mv .env-sample .env

# Edite o arquivo .env

# Inicie a api
$ node src/app 

### Objetivo
Receber e identificar imagens utilizando AI (Artificial Intelligence);

### Features

- [x] Salvar imagens em um Bucket s3
- [x] Salvar referencia da imagem no MongoDB
- [x] Classificar as imagens nas categorias [Person, Landscape, Animal, Object, Text]
- [x] Incluso OCR (Optical Character Recognition) 

### Tecnologias

- [x] NodeJS
- [x] ExpressJS 
- [x] AWS Rekognition 
- [x] AWS S3 
- [x] AWS Textract 
- [x] MongoDB 
- [x] Mongoose 
- [x] Cors 
- [x] Multer 

### Autor
João Paulo Chagas Da Cruz
