# scalara
Solution for the Scalara dev challange

---
## Prerequisites for development

* [Docker](https://www.docker.com/products/docker-desktop) and [docker-compose](https://docs.docker.com/compose/)
* [NodeJS](https://nodejs.org/en/) and [npm](https://www.npmjs.com/)

## Start locally for development

1. Clone the repo

    ```bash
    git clone https://github.com/noveb/scalara.git
    ```

2. Install development dependencies

    Most things can be done in/with Docker but it is still useful to install the dependencies. 
    
    ```bash
    npm install
    ```

3. Build Docker image for development

    ```bash
    docker-compose build
    ```

4. Run the Docker container for development

    ```bash
    docker-compose up
    ```

---
