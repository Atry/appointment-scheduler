import * as prismaClient from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import isBefore from 'date-fns/isBefore'
import max from 'date-fns/max'
import moment from 'moment-timezone'
import { existingAppointments } from './existingAppointments'
import { workingTimeOnDate } from './workingTimeOnDate'

/**
 * Returns the doctor's available time slots after a certain time.
 *
 * Note that the return type is an infinite asynchronous iterable.
 * The user of this function must not try to visit all its elements.
 */
export async function* availableIntervals(
  prisma: PrismaClient,
  doctor: prismaClient.Doctor,
  after: Date,
): AsyncIterable<{
  startDateTime: Date
  endDateTime: Date
}> {
  for (
    const date = moment.tz(after, doctor.timeZone).startOf('day');
    ;
    date.add(1, 'day')
  ) {
    const workingTime = await workingTimeOnDate(prisma, doctor, date)
    if (workingTime !== null) {
      const minEventDateTime = max([after, workingTime.startDateTime])
      const maxEventDateTime = workingTime.endDateTime
      const unavailableIntervals = await existingAppointments(
        prisma,
        doctor,
        minEventDateTime,
        maxEventDateTime,
      )
      const events = [
        ...unavailableIntervals.map(({ startDateTime }) => ({
          dateTime: startDateTime,
          deltaConcurrency: 1,
        })),
        ...unavailableIntervals.map(({ endDateTime }) => ({
          dateTime: endDateTime,
          deltaConcurrency: -1,
        })),
        {
          dateTime: minEventDateTime,
          deltaConcurrency: -1,
        },
        {
          dateTime: maxEventDateTime,
          deltaConcurrency: 1,
        },
      ].sort((a, b) => differenceInMilliseconds(a.dateTime, b.dateTime))
      let concurrency = 1
      let previousEventDateTime: Date | null = null
      for (const { dateTime, deltaConcurrency } of events) {
        if (concurrency === 0) {
          if (isBefore(previousEventDateTime!, dateTime)) {
            yield {
              startDateTime: previousEventDateTime!,
              endDateTime: dateTime,
            }
          }
        }
        concurrency += deltaConcurrency
        previousEventDateTime = dateTime
      }
    }
  }
}
