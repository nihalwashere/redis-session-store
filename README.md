# Redis as a Session Store

This example demonstrates how we can setup Redis as a session store in Node.js using JWT tokens for authentication.

## Redis

Redis is an open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker. It supports data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes with radius queries and streams. Redis has built-in replication, Lua scripting, LRU eviction, transactions and different levels of on-disk persistence, and provides high availability via Redis Sentinel and automatic partitioning with Redis Cluster.

## An applicatoin of Redis as a Session Store

https://redislabs.com/blog/cache-vs-session-store/

## Using JWT tokens for authentication

JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.

### When should you use JSON Web Tokens?
Here are some scenarios where JSON Web Tokens are useful:

#### Authorization
This is the most common scenario for using JWT. Once the user is logged in, each subsequent request will include the JWT, allowing the user to access routes, services, and resources that are permitted with that token. Single Sign On is a feature that widely uses JWT nowadays, because of its small overhead and its ability to be easily used across different domains.

##### Information Exchange
JSON Web Tokens are a good way of securely transmitting information between parties. Because JWTs can be signed—for example, using public/private key pairs—you can be sure the senders are who they say they are. Additionally, as the signature is calculated using the header and the payload, you can also verify that the content hasn't been tampered with.

### What is the JSON Web Token structure?
In its compact form, JSON Web Tokens consist of three parts separated by dots (.), which are:

#### Header
#### Payload
#### Signature

Therefore, a JWT typically looks like the following.

xxxxx.yyyyy.zzzzz

## Implementation

Whenever a user logins in after verification of the email and password we create a JWT token using a Header, Payload and Signature where the Payload comprises of the email (you can add more fields to the payload depending on what info you need to access quite frequently).

Once the JWT token is signed we save it to Redis in the form of [key:value] pair, where `key` is the `userId` and value will be the JWT token. This key (userId) is returned back to the cliend as response. On successfull login, the client can cache this `userId` and send it in `Authorization` header of all the subsequent requests. The server can then parse the `Authorization` header and extract the `userId` to query Redis to find the JWT token. On decoding the JWT token we get the user's email which we had wrapped inside the Payload, hence we can understand that the user is authorized to make these requests and is a legitimate user of our system.

A lot of requests may came in from the client but because Redis is an in-memory database i.e it stores all its data in RAM and not on disk, the reads and writes are way faster. If we had to implement this kind of a system using MongoDB, the performance would drastically decrease as MongoDB stores data in disk. Hence, Redis is a good option to be used as a session store.

For all the requests that need to be authorized, we simply need to pass in the `userId` inside `Authorization` header, if there's no `Authorization` header, that means the request is not coming from a trusted source and the server should reject it.

If there is no `userId` passed inside `Authorization` header, reject it too.

After querying Redis with `userId` as the key, the JWT token has expired then reject the request and throw relevant error message so that the client can redirect the user back to login or alternatively, create a new session token for that user and let the request complete.

We are setting the session in Redis with `EXPIRY`. The expiration duration for a key in Redis and that of the JWT token should be same. In this case we have set the expiration duration to 12 hours. After 12 hours the JWT token will expire and Redis will automatically delete that session token from the store.

If the user keeps loggin in simultaneously within 12 hours, then we check if a valid session token for that user already exists, if it does, then don't create a new session token, if it doesn't only then create a new session token. This way we won't duplicate sessions for a single user.

#### Steps to run

1) `npm install` : To install all dependencies.
2) `npm run docker-up` : To spin up the docker containers for Redis and MongoDB.
3) `npm run start:local` : To run the server on local system.
