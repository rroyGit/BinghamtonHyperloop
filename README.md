# BinghamtonHyperloop

#### Binghamton Hyperloop GNC code necessary to communicate with the Binghamton Hyperloop Pod
##### Server/Client code
  - Node.js
  - C
  ###### Web Service (node modules)
  - Cors
  - Express
  - *npm install cors express*
  ###### Web Server (node modules)
  - Axios
  - Express
  - Multer
  - Mustache
  - *npm install axios express multer mustache*
  
##### Web service run
    nodejs index.js <PORT>  
    nodejs index.js 3001

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