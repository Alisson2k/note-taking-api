# Note-taking API #

A simple API to provide basic functionality for note-taking. It will be built in NodeJS with Typescript.

### To do ###

Features that were made

- [X] Create and update tags
- [X] Create, update and list notes
- [X] Check/uncheck checklist items
- [X] Search notes by tags, status or text
- [X] Notes have a title, a color and can have either a description or a checklist
- [X] Notes can be tagged with many tags
- [X] Notes can be archived or deleted

Some additionals too

- [X] GraphQL with playground
- [X] A simple JWT authorization
- [X] Rotate logs

### Additional Info ###

There are two public queries, `createUser` and `login`, obviously the first one should NEVER be public, as it is a unique project in development, it makes it easier to create the user to use the system.

A simple JWT authentication was added, it is necessary to pass the SECRET via .env which must be inside the src/ folder. The desire here was to use a `Consul` to configure properties, I opted for `dotenv` because of the facility at that time.

To make it easier, the application goes up a playground to test GraphQL requests.

Finally, I'd like to point out that when I started with this project I wasn't so familiar with NodeJS and I didn't have a lot of time to dedicate myself, I believe it must have taken about 7-8 hours of development.
