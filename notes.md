08:20:  Updating & setting up WSL, Docker, VSCode. Creating a new repository. Letting the task soak in.

09:00: Creating a plan and drink coffee:
Chose technology: 

**NodeJS** with **Express** Webframework: NodeJS is my favorite language. It is also very fast for IO (contrary to computational tasks), there a a lot of packages like the AWS-SDK. Express is lightweight and suits the task. There would be other web frameworks like Fastify, Restify that are faster if needed.

Language: I like vanilla JS and **TypeScript**. But let's use TypeScript. Should not be much more hassle.

Database: I did mostly PostgreSQL the last 3 years so will choose something else. I will need to research this as I am not up to date what kind of DBs AWS is offering today.
https://docs.aws.amazon.com/whitepapers/latest/aws-overview/database.html
So, there are DynamoDB and DocumentDB as NOSQL databases. I will go with **DocumentDB** as it is fast (enough) and scalable. The low latency and throughput of DynamoDB is not needed for a file service.

File storage: I will use a separate file storage. I could store them in the DocumentDB but as the files can be of any size and unknown type it is safer, better for maintainability and performance to use a dedicated file storage. The choice is then of course **AWS S3**.

Architecture: The service will be containerized with Docker and I will try to host it with **AWS ECS**. No experience with ECS but I hope it is fairly simple as it is with other cloud providers (Digital Ocean is usually my choice for small projects). The database will be the AWS managed thing and they will be directly connected.
I will build the API as HTTP RESTful API (i.e. no FTP for file transfer). There will be a POST route for the upload, a GET route to search and retrieve a list of files and maybe another GET to download the file. Not sure yet whether the file should pass the API on download or the client gets the AWS S3 url to download.

Code quality: ESLint and Prettier will help to write clean and consistent code. I usually try to do TDD but there is not much unit testable logic in here. Let's see if I will write some kind of E2E test, setting that up could be a bit time consuming. I will do a TDD with manual testing via Postman.

CI/CD: I will not build or include scripts and tools for automated CI/CD to focus on the code first. Also no git hooks etc. But that should be in every other project. 

Risks: As of now, the biggest risk I see is with the AWS deployment. That's something I did not do in the past. Also, as I did not code on my private laptop since the last formatting, there could be issues with the setup like missing ssh keys, software I need to install etc.

10:00: more setup, install Node LTS 18.16.0, gitmoji, more coffee

10:20: install express, TS, node & express types, docker, d-c .... setup everything

19:50: It is getting late and I am done for today. Currently working on deploying the service in AWS ECS. It's tricky as I have never done this

A few things held me back: 
  - Not coding since February, things just don't work as smooth as usually and my private laptop was not prepared for this (my fault).
  - Project setup from scratch cost me quite some time.
  - There was a compatibility issue with S3client and minio (solved)
  
So, AWS still says: "scalara-api deployment is in progress. It takes a few minutes." So I end for today.