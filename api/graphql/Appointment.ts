import { UserInputError } from 'apollo-server'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import moment from 'moment-timezone'
import { arg, intArg, mutationType, nonNull, objectType } from 'nexus'
import * as nexusPrisma from 'nexus-prisma'
import { existingAppointments } from '../utils/existingAppointments'
import { workingTimeOnDate } from '../utils/workingTimeOnDate'

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
        const doctor = await prisma.doctor.findUniqueOrThrow({
          where: { id: doctorId },
        })
        const date = moment.tz(startDateTime, doctor.timeZone).startOf('day')
        const workingTime = await workingTimeOnDate(prisma, doctor, date)
        if (workingTime === null) {
          throw new UserInputError('The doctor does not work on that day')
        }
        if (!isBefore(startDateTime, endDateTime)) {
          throw new UserInputError('startDateTime should be before endDateTime')
        }
        if (isBefore(startDateTime, workingTime.startDateTime)) {
          throw new UserInputError(
            "startDateTime should not be before the doctor's working time",
          )
        }
        if (isAfter(endDateTime, workingTime.endDateTime)) {
          throw new UserInputError(
            "endDateTime should not be before the doctor's working time",
          )
        }
        if (
          (
            await existingAppointments(
              prisma,
              doctor,
              startDateTime,
              endDateTime,
            )
          ).length !== 0
        ) {
          throw new UserInputError(
            'the doctor is not available on the time slot',
          )
        }
        return prisma.appointment.create({
          data: {
            doctorId,
            startDateTime,
            endDateTime,
          },
        })
      },
    })
  },
})
