# BinghamtonHyperloop

#### Binghamton Hyperloop GNC code necessary to communicate with the Binghamton Hyperloop Pod
##### Server/Client code
  - JavaScript
  - NodeJS
  - C
  - HTML
  - CSS
  ###### Web Service (node modules)
  - Cors
  - Express
  - MongoDB
  - *npm install cors express mongodb --save*
  ###### Web Server (node modules)
  - Axios
  - Express
  - Multer
  - Mustache
  - Chart.js
  - Browserify
  - *npm install axios express multer mustache chart.js browserify --save*

##### Browserify (web server)
  - Create bundle by going into respective web page directory
      - *npx browserify chartData.js > bundle.js*
      - *npx browserify statusData.js > bundle.js*
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
  ###### Collection(s): *Temperature Distance  Speed*

##### Web server run
    nodejs index.js <PORT> <HOST:PORT>  
    nodejs index.js 3002 http://localhost:3001

##### Windows IPv4 address
  - Go to Windows Settings --> Network & Internet --> Wi-Fi --> Hardware Properties --> IPv4 address  
  - Enter *ipconfig* on command prompt and look for IPv4 address
##### Mac/Linux IPv4 address
  - Enter *ifconfig* on bash terminal and look for *inet* address under appropriate wifi

##### Linux Bash - Install required dependencies before running
  - Install nodejs (sudo apt install nodejs)
  - Install node package manager (sudo apt install npm)
  - Install the above node modules in the respective directory
    - *CD* to directory containing *package.json* and enter *npm install*
    
##### Update PATH variable
  - For statusData.js & chartData.js in web server (required to make AJAX calls work)
    - Change PATH variable to the Device's Network IP that the server/service is running on (e.g. 192.168.1.23)
    - See above how to retrive the device's IP Addrress
    
##### Run application (not using bash script)
  - Update PATH variable 
    - only if NOT running on localhost to to access app on another device
  - Install node modules 
    - enter *npm install* on terminal under service and server dirs
  - Run MongoDB server
  - Run Web service
  - Run Web server
  - Ensure two node processes for above programs are allowed through Firewall 
    - only if Arduino(s) wants to make web requests to web service & user wants access the web server (web page)
  - Open application
  
##### Run application (using bash script & unix machine)
  - Install node modules 
    - enter *npm install* on terminal under *web service* and *web server* dirs
  - On a Unix machine like Ubuntu (no Cygwin, Windows Subsystem for Linux, etc.) run script *./runApp.sh*  
      Follow instructions on terminal... 

##### Open Application
  - Open browser (ideally Google Chrome) and enter either:
    - http://<Device Physical IP>:3002/
    - http://<Device Physical IP>:3002/home/
    - http://<Device Physical IP>:3002/home/model

##### REST API
  - Send data (GET):  
    /temp?sensorId=\<ID>&value=\<V>&seqNum=\<S>  
    /dist?sensorId=\<ID>&value=\<V>&seqNum=\<S>  
    /speed?sensorId=\<ID>&value=\<V>&seqNum=\<S>  
  - Get data (GET):  
    /temp/\<ID>  
    /dist/\<ID>    
    /speed/\<ID>   
    *ID = sensor ID*  
    *V = sensor value*  
    *S = sequence number, basically alternating 0 and 1 for request sent*  
  
##### API usage example
  - Send sensor data
    - \<Device Physical IP>:3001/temp?sensorId=1&value=45&seqNum=0
  - Get sensor data
    - \<Device Physical IP>:3001/temp/1  
    
##### Live web version (Heroku)
  - (Front-end) https://bing-gnc.herokuapp.com/  
  - (Back-end)  https://bing-gnc-service.herokuapp.com/  
    *Example: https://bing-gnc-service.herokuapp.com/temp?sensorId=1&value=45&seqNum=0*  
    
    NOTE - Due to the usage of free dyno service an idled process of 30+ minutes is stopped. Therefore, expect delay for the first                time accessing web server and service. There are also request limits per month set forth by Heroku; take caution when making            large number of requests.  

##### Helpful reminders
  - Shutdown Web service via Ctrl+C to automatically clear and close database connection
    - You will still have to manually shutdown MangoDB server using *use admin* & *db.shutdownServer* on mongo console

##### MongoDB client (mongo console) tips
  - *show dbs* : list all found databases
  - *use \<name_of_database>* : select database where keyword *db* refers to selected database
  - *show collections* : once a database is selected, this will show collections that exist in the database
  - *use admin* & *db.shutdownServer()* : shutdown MongoDB server
