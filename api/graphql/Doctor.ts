import { fluentAsync } from '@codibre/fluent-iterable'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import moment from 'moment-timezone'
import { arg, intArg, nonNull, objectType, queryType } from 'nexus'
import * as nexusPrisma from 'nexus-prisma'
import { availableIntervals } from '../utils/availableIntervals'

export const Doctor = objectType({
  name: nexusPrisma.Doctor.$name,
  description: nexusPrisma.Doctor.$description,
  definition(t) {
    t.field(nexusPrisma.Doctor.id)
    t.field(nexusPrisma.Doctor.name)
    t.nullable.field('firstAvailableTime', {
      args: {
        after: nonNull(
          arg({
            type: 'DateTime',
          }),
        ),
        before: nonNull(
          arg({
            type: 'DateTime',
          }),
        ),
        minLength: nonNull(
          arg({
            type: 'Duration',
          }),
        ),
      },
      async resolve(doctor, { after, before, minLength }, { prisma }) {
        return (
          await fluentAsync(
            availableIntervals(prisma, doctor, after, before),
          ).first(
            ({ startDateTime, endDateTime }) =>
              differenceInMilliseconds(endDateTime, startDateTime) >=
              moment.duration(minLength).asMilliseconds(),
          )
        )?.startDateTime
      },
      type: 'DateTime',
    })
    t.nonNull.list.field('availableIntervals', {
      args: {
        after: nonNull(
          arg({
            type: 'DateTime',
          }),
        ),
        before: nonNull(
          arg({
            type: 'DateTime',
          }),
        ),
        minLength: nonNull(
          arg({
            type: 'Duration',
          }),
        ),
      },
      type: objectType({
        name: 'AvailableInterval',
        definition(t) {
          t.dateTime('startDateTime')
          t.dateTime('endDateTime')
        },
      }),
      resolve(doctor, { after, before, minLength }, { prisma }) {
        return fluentAsync(availableIntervals(prisma, doctor, after, before))
          .filter(
            ({ endDateTime, startDateTime }) =>
              differenceInMilliseconds(endDateTime, startDateTime) >=
              moment.duration(minLength).asMilliseconds(),
          )
          .toArray()
      },
    })
  },
})

export const DoctorQuery = queryType({
  definition(t) {
    t.nonNull.list.field('doctor', {
      type: 'Doctor',
      args: {
        id: nonNull(intArg()),
      },
      resolve(_source, { id }, { prisma }) {
        return prisma.doctor.findMany({
          where: { id },
        })
      },
    })
  },
})
