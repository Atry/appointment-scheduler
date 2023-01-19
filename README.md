# Appointment Scheduler

A simple toy project of a GraphQL API for scheduling appointments with doctors.

## Tech Stack

This project is based on [Nexus Example With Prisma](https://github.com/graphql-nexus/nexus/tree/main/examples/with-prisma). In addition to the template project, the following libraries are introduced:

- [graphql-scalars](https://github.com/Urigo/graphql-scalars) is used to validate duration types in GraphQL;
- [date-fns](https://date-fns.org/) is used to manipulate UTC timestamps;
- [moment-timezone](https://momentjs.com/timezone/) is used to handle date time in a certain timezone;
- [nexus-prisma](https://github.com/graphql-nexus/nexus-prisma) is used to generate GraphQL fields from Prisma schema;
- [fluent-iterable](https://github.com/codibre/fluent-iterable) is used to incrementally perform asynchronous operations;
- [jest](https://jestjs.io/) and [ts-jest](https://github.com/kulshekhar/ts-jest) are used to run tests.

Note that multiple time libraries are introduced, because:

- ECMAScript's `Date` is used because it's the date time type supported by Nexus and Prisma.
- `date-fns` is the most light-weight solution to manipulate `Date`.
- We need a library to handle timezone, because a doctor might in a timezone different from the server's timezone. However, `date-fns` does not support timezone well.
  - `date-fns`'s sibling, `date-fns-tz`, is buggy for handling daylight saving time.
  - `moment-timezone` is good for timezone handling, but the cost is that we have to use different API for manipulating local time and UTC time, respectively.

## Directory layout

- `api` includes the source code for the GraphQL server, including GraphQL types and resolvers
  - `utils` includes the helper function to find available time slot for scheduling an appointment.
- `prisma` includes O/R mapping schema, migration scripts, and seeding data.
- `test` includes the test suite for the GraphQL API
## Available scripts

### Set up the development environment

```
nodenv install && npm install --global yarn && yarn install
```

It will set up a Sqlite database for development purpose.

### Start the GraphQL server in development mode

```
yarn dev
```

Then you can open http://localhost:4000 to explore the GraphQL API.

### Build

```
yarn build
```

### Test

```
yarn test
```

Then check out `dist` directory for the compiled JavaScript files.

### Start the GraphQL server in production mode

```
yarn start
```
