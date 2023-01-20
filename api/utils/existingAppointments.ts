import * as prismaClient from '@prisma/client'
import { PrismaClient } from '@prisma/client'

/**
 * Returns the doctor's existing appointments intersecting with the time window
 * specified by `after` and `before`.
 */
export function existingAppointments(
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
