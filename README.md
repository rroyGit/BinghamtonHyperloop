# BinghamtonHyperloop

#### Binghamton Hyperloop GNC code necessary to communicate with the Binghamton Hyperloop Pod
##### Server/Client code
  - JavaScript
  - Node.js
  - C
  - HTML
  - CSS
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
  - Chart.js
  - Browserify
  - *npm install axios express multer mustache chart.js browserify*

##### Browserify
  - Create bundle: *npx browserify <chartData.js> bundle.js*
  - Add script tag including *bundle.js* in your HTML

##### Install MongoDB (Linux package)
  ###### Download MongoDB Package
    sudo apt install mongodb-server-core
  ###### Create data directory
    sudo mkdir ~/data/
    sudo mkdir ~/data/db
  ###### Run MongoDB server (local host - port: 27017)
    sudo mongod --dbpath ~/data/db
  ###### Install Mongo client
    sudo apt install mongodb-clients
  ###### Run Mongo console
    mongo console

##### Web service run
    nodejs index.js <PORT> <MongoDB URL>
    nodejs index.js 3001 mongodb://localhost:27017/GNCDatabase
  ###### Name of the database: *GNCDatabase*  
  ###### Collection(s): *Temperature*

##### Web server run
    nodejs index.js <PORT> <HOST:PORT>  
    nodejs index.js 3002 http://localhost:3001

##### Windows IPv4 address
  - Go to Windows Settings --> Network & Internet --> Wi-Fi --> Hardware Properties --> IPv4 address  
  - Enter *ipconfig* on command prompt and look for IPv4 address
##### Linux IPv4 address
  - Enter *ifconfig* on bash and look for *inet* address under appropriate wifi
##### Mac IPv4 address
    Google it...

##### Linux Bash - Required dependencies before running but after cloning
  - Install nodejs (sudo apt install nodejs)
  - Install node package manager (sudo apt install npm)
  - Install the above node modules in the respective directory
    - *CD* to directory containing *package.json* and enter *npm install*

##### Steps (ordered) to run application properly
  - Update PATH variable (if NOT running on localhost)
  - Run MongoDB server
  - Run Web service
  - Run Web server
  - Open application

##### Open Application
  - Open browser (ideally Google Chrome) and enter either:
    - http://<Device Physical IP>:3002/
    - http://<Device Physical IP>:3002/home/
    - http://<Device Physical IP>:3002/home/model

##### Update PATH variable
  - For dynamicData.js & chartData.js 
    - Change PATH variable to the Device's Network IP that the server/service is running on (e.g. 192.168.1.23)
    - See above how to retrive the device's IP Addrress

##### Reminders
  - Shutdown Web service via Ctrl+C to automatically clear and close database connection
    - You will still have to manually shutdown MangoDB server using *use admin* & *db.shutdownServer* on mongo console

##### MongoDB client tips
  - *show dbs* : list all found databases
  - *use <name_of_database>* : select database where keyword *db* refers to selected database
  - *show collections* : once a database is selected, this will show collections that exist in the database
  - *use admin* & *db.shutdownServer()* : shutdown MongoDB server