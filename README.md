# BinghamtonHyperloop

#### Binghamton Hyperloop GNC code necessary to communicate with the Binghamton Hyperloop Pod
##### Server/Client code
  - Node.js
  - C
  ###### Web Service (node modules)
  - Cors
  - Express
  - MongoDB
  - *npm install cors express mongodb*
  ###### Web Server (node modules)
  - Axios
  - Express
  - Multer
  - Mustache
  - *npm install axios express multer mustache*

##### Install MongoDB (Linux package)
  ###### Download MongoDB Package
    sudo apt install mongodb-server-core
  ###### Create data directory
    sudo mkdir ~/data/
    sudo mkdir ~/data/db
  ###### Run MongoDB (local host - port: 27017)
    sudo mongod --dbpath ~/data/db
  ###### Install Mongo client
    sudo apt install mongodb-clients
  ###### Run Mongo console
    mongo console


##### Web service run
    nodejs index.js <PORT> <MongoDB URL>
    nodejs index.js 3001 mongodb://localhost:27017/GNCDatabase
    *Name of the database: GNCDatabase*
    *Collection(s): podTelemetry*

##### Web server run
    nodejs index.js <PORT> <HOST:PORT>  
    nodejs index.js 3002 http://localhost:3001

##### Running on devices connected to the same network
    (dynamicData.js) change PATH variable to the device's network IP that the server is running on (e.g. 192.168.1.23)
    See below how to retrive the ip
##### Windows IPv4 address
  - Go to Windows Settings --> Network & Internet --> Wi-Fi --> Hardware Properties --> IPv4 address  
  - Enter *ipconfig* on command prompt and look for IPv4 address
##### Linux IPv4 address
  - Enter *ifconfig* on bash and look for *inet* address under appropriate wifi
##### Mac IPv4 address
    Google it...

##### Linux Bash - Required dependencies before running after cloning
    - Install nodejs (sudo apt install nodejs)
    - Install node package manager (sudo apt install npm)
    - Install the above node modules in the respective directories
    - Run program using the respective run commands