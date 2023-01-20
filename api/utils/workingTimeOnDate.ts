import * as prismaClient from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import moment, { Moment } from 'moment-timezone'

/**
 * Returns the doctor's working time on a certain day in the doctor's time zone,
 * or null if the doctor does not work on that day
 */
export async function workingTimeOnDate(
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
