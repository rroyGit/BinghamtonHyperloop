# BinghamtonHyperloop

#### Binghamton Hyperloop GNC code necessary to communicate with the Binghamton Hyperloop Pod
##### Server/Client code
  - Node.js
  - Express
##### Socket code
  - C



##### Web service run
  nodejs index.js \<PORT\>  
  nodejs index.js 3001

##### Web server run
  nodejs index.js \<PORT\> \<HOST:PORT\>  
  nodejs index.js 3002 http://localhost:3001

##### running on devices connect to the same network
  (dynamicData.js) change PATH variable to the device's network IP that the server is running (e.g. 192.168.1.23)
  See below how to retrive the ip
##### Windows IPv4 address
  Go to Windows Settings --> Network & Internet --> Wi-Fi --> Hardware Properties --> IPv4 address
##### Linux IPv4 address
  Google it...
##### Mac IPv4 address
   Google it...