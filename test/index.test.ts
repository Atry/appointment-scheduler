import { ApolloServer } from 'apollo-server'
import { context } from '../api/context'
import { schema } from '../api/schema'
import { expect, beforeEach, test } from '@jest/globals'
import { seed } from '../prisma/seed'

beforeEach(async () => {
  await seed()
})

test('Integration test', async () => {
  const testServer = new ApolloServer({
    schema,
    context,
    persistedQueries: false,
  })

  const query = `
    query Doctors {
      doctor1: doctor(id: 1) {
        id
        name
        firstTenHourAvailableTime: firstAvailableTime(
          minLength: "PT10H"
          after: "2023-01-20T00:00:00Z"
          before: "2023-01-27T00:00:00Z"
        )
        firstFourHourAvailableTime: firstAvailableTime(
          minLength: "PT4H"
          after: "2023-01-20T00:00:00Z"
          before: "2023-01-27T00:00:00Z"
        )
        availableFourHourIntervals: availableIntervals(
          minLength: "PT4H"
          after: "2023-01-20T00:00:00Z"
          before: "2023-01-27T00:00:00Z"
        ) {
          startDateTime
          endDateTime
        }
        firstOneHourAvailableTime: firstAvailableTime(
          minLength: "PT1H"
          after: "2023-01-20T00:00:00Z"
          before: "2023-01-27T00:00:00Z"
        )
        availableOneHourIntervals: availableIntervals(
          minLength: "PT1H"
          after: "2023-01-20T00:00:00Z"
          before: "2023-01-27T00:00:00Z"
        ) {
          startDateTime
          endDateTime
        }
        firstThirtyMinuteAvailableTime: firstAvailableTime(
          minLength: "PT1H"
          after: "2023-01-20T00:00:00Z"
          before: "2023-01-27T00:00:00Z"
        )
        availableThirtyMinuteIntervals:  availableIntervals(
          minLength: "PT30M"
          after: "2023-01-20T00:00:00Z"
          before: "2023-01-27T00:00:00Z"
        ) {
          startDateTime
          endDateTime
        }
      }
      doctor2: doctor(id: 2) {
        id
        name
        firstAvailableTime(
          minLength: "PT4H"
          after: "2023-01-20T00:00:00Z"
          before: "2023-01-24T00:00:00Z"
        )
        availableIntervals(
          minLength: "PT4H"
          after: "2023-01-20T00:00:00Z"
          before: "2023-01-24T00:00:00Z"
        ) {
          startDateTime
          endDateTime
        }
      }
    }
  `

  expect(await testServer.executeOperation({ query })).toMatchInlineSnapshot(`
    {
      "data": {
        "doctor1": [
          {
            "availableFourHourIntervals": [
              {
                "endDateTime": 2023-01-21T19:00:00.000Z,
                "startDateTime": 2023-01-21T15:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-22T19:00:00.000Z,
                "startDateTime": 2023-01-22T15:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-23T22:00:00.000Z,
                "startDateTime": 2023-01-23T14:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-24T22:00:00.000Z,
                "startDateTime": 2023-01-24T14:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-25T22:00:00.000Z,
                "startDateTime": 2023-01-25T14:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-26T22:00:00.000Z,
                "startDateTime": 2023-01-26T14:00:00.000Z,
              },
            ],
            "availableOneHourIntervals": [
              {
                "endDateTime": 2023-01-20T18:00:00.000Z,
                "startDateTime": 2023-01-20T16:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-20T22:00:00.000Z,
                "startDateTime": 2023-01-20T19:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-21T19:00:00.000Z,
                "startDateTime": 2023-01-21T15:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-22T19:00:00.000Z,
                "startDateTime": 2023-01-22T15:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-23T22:00:00.000Z,
                "startDateTime": 2023-01-23T14:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-24T22:00:00.000Z,
                "startDateTime": 2023-01-24T14:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-25T22:00:00.000Z,
                "startDateTime": 2023-01-25T14:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-26T22:00:00.000Z,
                "startDateTime": 2023-01-26T14:00:00.000Z,
              },
            ],
            "availableThirtyMinuteIntervals": [
              {
                "endDateTime": 2023-01-20T15:30:00.000Z,
                "startDateTime": 2023-01-20T15:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-20T18:00:00.000Z,
                "startDateTime": 2023-01-20T16:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-20T22:00:00.000Z,
                "startDateTime": 2023-01-20T19:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-21T19:00:00.000Z,
                "startDateTime": 2023-01-21T15:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-22T19:00:00.000Z,
                "startDateTime": 2023-01-22T15:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-23T22:00:00.000Z,
                "startDateTime": 2023-01-23T14:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-24T22:00:00.000Z,
                "startDateTime": 2023-01-24T14:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-25T22:00:00.000Z,
                "startDateTime": 2023-01-25T14:00:00.000Z,
              },
              {
                "endDateTime": 2023-01-26T22:00:00.000Z,
                "startDateTime": 2023-01-26T14:00:00.000Z,
              },
            ],
            "firstFourHourAvailableTime": 2023-01-21T15:00:00.000Z,
            "firstOneHourAvailableTime": 2023-01-20T16:00:00.000Z,
            "firstTenHourAvailableTime": null,
            "firstThirtyMinuteAvailableTime": 2023-01-20T16:00:00.000Z,
            "id": 1,
            "name": "Strange",
          },
        ],
        "doctor2": [
          {
            "availableIntervals": [
              {
                "endDateTime": 2023-01-23T21:00:00.000Z,
                "startDateTime": 2023-01-23T13:00:00.000Z,
              },
            ],
            "firstAvailableTime": 2023-01-23T13:00:00.000Z,
            "id": 2,
            "name": "Who",
          },
        ],
      },
      "errors": undefined,
      "extensions": undefined,
      "http": {
        "headers": Headers {
          Symbol(map): {},
        },
      },
    }
  `)
  const invalidMutation = `
    mutation MakeAppointment {
      makeAppointment(
        doctorId: 2
        startDateTime: "2023-01-23T16:00:00.000Z"
        endDateTime: "2023-01-23T23:00:00.000Z"
      ) {
        startDateTime
        endDateTime
      }
    }
  `
  expect(await testServer.executeOperation({ query: invalidMutation }))
    .toMatchInlineSnapshot(`
      {
        "data": {
          "makeAppointment": null,
        },
        "errors": [
          [GraphQLError: endDateTime should not be before the doctor's working time],
        ],
        "extensions": undefined,
        "http": {
          "headers": Headers {
            Symbol(map): {},
          },
        },
      }
    `)
  const mutation = `
    mutation MakeAppointment {
      makeAppointment(
        doctorId: 2
        startDateTime: "2023-01-23T16:00:00.000Z"
        endDateTime: "2023-01-23T18:00:00.000Z"
      ) {
        startDateTime
        endDateTime
        doctor {
          id
          name
          firstAvailableTime(
            minLength: "PT4H"
            after: "2023-01-20T00:00:00Z"
            before: "2023-01-24T00:00:00Z"
          )
          availableIntervals(
            minLength: "PT4H"
            after: "2023-01-20T00:00:00Z"
            before: "2023-01-24T00:00:00Z"
          ) {
            startDateTime
            endDateTime
          }
        }
      }
    }
  `
  expect(await testServer.executeOperation({ query: mutation }))
    .toMatchInlineSnapshot(`
      {
        "data": {
          "makeAppointment": {
            "doctor": {
              "availableIntervals": [],
              "firstAvailableTime": null,
              "id": 2,
              "name": "Who",
            },
            "endDateTime": 2023-01-23T18:00:00.000Z,
            "startDateTime": 2023-01-23T16:00:00.000Z,
          },
        },
        "errors": undefined,
        "extensions": undefined,
        "http": {
          "headers": Headers {
            Symbol(map): {},
          },
        },
      }
    `)
})
