import * as prismaClient from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds'
import isBefore from 'date-fns/isBefore'
import max from 'date-fns/max'
import moment, { Moment } from 'moment-timezone'

/**
 * Returns the doctor's existing appointments intersecting with the time window
 * specified by `after` and `before`.
 */
function existingAppointments(
  prisma: PrismaClient,
  doctor: prismaClient.Doctor,
  after: Date,
  before: Date,
) {
  return prisma.appointment.findMany({
    where: {
      doctor,
      OR: [
        {
          endDateTime: {
            gt: after,
            lte: before,
          },
        },
        {
          startDateTime: {
            gte: after,
            lt: before,
          },
        },
        {
          startDateTime: {
            lte: after,
          },
          endDateTime: {
            gte: before,
          },
        },
      ],
    },
  })
}

/**
 * Returns the doctor's working time on a certain day in the doctor's time zone,
 * or null if the doctor does not work on that day
 */
async function workingTimeOnDate(
  prisma: PrismaClient,
  doctor: prismaClient.Doctor,
  date: Moment,
): Promise<null | { startDateTime: Date; endDateTime: Date }> {
  const workingTime = await prisma.dailyWorkingTime.findUnique({
    where: {
      doctorId_dayOfWeek: {
        dayOfWeek: date.day(),
        doctorId: doctor.id,
      },
    },
  })
  function parseTime(time: string): Date {
    return moment
      .tz(time, [moment.HTML5_FMT.TIME_MS], doctor.timeZone)
      .year(date.year())
      .dayOfYear(date.dayOfYear())
      .toDate()
  }
  if (workingTime !== null) {
    return {
      startDateTime: parseTime(workingTime.startTime),
      endDateTime: parseTime(workingTime.endTime),
    }
  } else {
    return null
  }
}

/**
 * Returns the doctor's available time slots after a certain time.
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
      var concurrency = 1
      var previousEventDateTime: Date | null = null
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
