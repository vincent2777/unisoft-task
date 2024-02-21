#code by Vincent Kalu - For the Role of Backend Engineer and team lead at Unisoft technologies

REQUIREMENTS
1. Apache kafta with zookeeper installed on your PC and path added to environment
2. ScyllaDb installed
3. Node installed

HOW TO USE
To run the code, open the terminal and run 'node install' command, to install all required modules

open two seperate terminals and run these codes

- For zookeeper
/usr/local/Cellar/kafka/3.6.1/libexec/bin/zookeeper-server-start.sh /usr/local/Cellar/kafka/3.6.1/libexec/config/zookeeper.properties

-for kafta
/usr/local/Cellar/kafka/3.6.1/libexec/bin/kafka-server-start.sh /usr/local/Cellar/kafka/3.6.1/libexec/config/server.properties

Once the above services have started, navigate and open this project in a seperate terminal and run 'npm index.js'

Once all connections are successful, open POSTMAN or any API testing software and make a POST request to http://0.0.0.0:3000/product/all, Note that the request body must be in JSON

