###microservice architecture :
when you separate your application into smaller applications (we will call them services) that work together is called **microservices architecture**.

**microservice-gateway** helps you achieve **microservice architecture** with few line of code. it will help you to forward request from gateway server to microservices. 


**How it's Works :**

1. **Run Gateway Server :**

    Install dependencies for Gateway Server :
    ```
    $ cd GatewayServer
    $ npm install
    ```
    
    Install `microservice-gateway` for Gateway Server :
    ```
    $ npm install microservice-gateway --save
    ```
    
    Start Gateway Server :
    ```
    $ npm start
    ```
    
    Gateway server running on **3000 Port**.
    
    Usages of `microservice-gateway` in Gateway Server :
    ```
    var microServiceConfig = {
        name: "MicroServiceGateway", // gateway name
        
        // sslKeyPath,sslCertPath,sslBundlePath,verifySSL are use for creating secure proxy server object
        sslKeyPath: "files/localhost.key", // ssl key file path
        sslCertPath: "files/localhost.cert", // ssl certificate file path
        sslBundlePath: [], // ssl bundle certificates file path
        verifySSL: false, // true/false, if you want to verify the SSL Certs
        
        // following are the list of micro-services
        microServiceList: [
            {
                name: "MicroService-1", // micro-service name
                url: "http://localhost", // micro-service URL
                serverPort: "3001", // micro-service port
                routePath: "ms1", // route path to identify in gateway server to forward request into corresponding micro-service
                excludeRoutePath: true // if true then it exclude routePath from forwarded request
            },
            {
                name: "MicroService-2",
                url: "http://localhost",
                serverPort: "3002",
                routePath: "ms2",
                excludeRoutePath: true
            }
        ]
    };
    try {
        // Create gateway object [contains micro-services functions]
        var msGateway = require('microservice-gateway').createGateway(microServiceConfig);
        app.all("/ms1/*", msGateway['ms1']); // call micro-service function using corresponding routePath key [no special character allow in routePath]
        app.all("/ms2/*", msGateway['ms2']);
    }
    catch (e) {
        console.log(e.name, e.message);
    }
    ```
    
2. **Run Micro Services :**
    
    Run MicroService1 on port 3001,
    ```
    $ cd MicroService1
    $ npm install
    $ npm start
    ```
    
    Run MicroService2 on port 3002,
    ```
    $ cd MicroService2
    $ npm install
    $ npm start
    ```
    
3. Call microservices using gateway server :
 
 ```
 $ curl http://localhost:3000/ms1/micro-service1
 $ curl http://localhost:3000/ms2/micro-service2
 ```