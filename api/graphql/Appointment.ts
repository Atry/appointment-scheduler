import { fluentAsync } from '@codibre/fluent-iterable'
import { UserInputError } from 'apollo-server'
import isBefore from 'date-fns/isBefore'
import isEqual from 'date-fns/isEqual'
import { arg, intArg, mutationType, nonNull, objectType } from 'nexus'
import * as nexusPrisma from 'nexus-prisma'
import { availableIntervals } from '../utils/availableIntervals'

export const Appointment = objectType({
  name: nexusPrisma.Appointment.$name,
  description: nexusPrisma.Appointment.$description,
  definition(t) {
    t.field(nexusPrisma.Appointment.id)
    t.field(nexusPrisma.Appointment.startDateTime)
    t.field(nexusPrisma.Appointment.endDateTime)
    t.field(nexusPrisma.Appointment.doctor)
  },
})

export const MakeAppointment = mutationType({
  definition(t) {
    t.field('makeAppointment', {
      type: 'Appointment',
      args: {
        doctorId: nonNull(intArg()),
        startDateTime: nonNull(arg({ type: 'DateTime' })),
        endDateTime: nonNull(arg({ type: 'DateTime' })),
      },
      async resolve(
        _source,
        { doctorId, startDateTime, endDateTime },
        { prisma },
      ) {
        const firstInterval = await fluentAsync(
          availableIntervals(
            prisma,
            await prisma.doctor.findUniqueOrThrow({
              where: { id: doctorId },
            }),
            startDateTime,
          ),
        ).first()
        if (
          firstInterval !== undefined &&
          isEqual(firstInterval.startDateTime, startDateTime) &&
          !isBefore(firstInterval.endDateTime, endDateTime)
        ) {
          return prisma.appointment.create({
            data: {
              doctorId,
              startDateTime,
              endDateTime,
            },
          })
        } else {
          throw new UserInputError('the time slot is not available')
        }
      },
    })
  },
})
