# Fullstack JWT authorization web app

---

Concept of fullstack implementation of secure JWT authorization using email verification

---

# Used stack:

## Client Side:

- React.js + Typescript
- Webpack
- Mobx

## Server side: 

- Express.js
- Mongo
- Jwt payload gen

---

# Architecture

## Server side

### Services

The server part is subdivided into components such as:

- Service for users, responsible for registration, activation, logging out of the account, as well as updating tokens

- Mail service for email verification

- Token service which is responsible for generating validation and sharing pairs of JWTs

### Router

Router is responsible to explicitly label the paths like "/login", "/logout" which we can use for calling developed api

### Models 

In this project was implemented some models for mongo database for writing user data correctly. 

- Token model includes Schema of token which includes structure of pair of JWTs

- User model includes Schema of user with information about email, password (hashed), activation marker and email verification link

### Exceptions

Api-error exceptions contains constructor of class with 401 (unauthorized) and 400 errors

### Middleware

Middleware just throws some errors from written exceptions

## Client side

Client side was developed by React TypeScript template
