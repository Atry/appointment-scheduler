import { PrismaClient } from '@prisma/client'

export async function seed() {
  const prisma = new PrismaClient()
  try {
    const newYorkTimeZoneOffset = -5
    await prisma.doctor.deleteMany({
      where: {
        id: {
          in: [1, 2],
        },
      },
    })
    const strange = await prisma.doctor.create({
      data: {
        id: 1,
        name: 'Strange',
        timeZone: 'America/New_York',
        workingTime: {
          create: Array.from({ length: 7 }, (_, dayOfWeek) => ({
            dayOfWeek,
            startTime:
              dayOfWeek === 0 || dayOfWeek === 6
                ? '10:00:00.000'
                : '09:00:00.000',
            endTime:
              dayOfWeek === 0 || dayOfWeek === 6
                ? '14:00:00.000'
                : '17:00:00.000',
          })),
        },
        appointments: {
          create: [
            {
              startDateTime: new Date(
                Date.UTC(2023, 0, 20, 9 - newYorkTimeZoneOffset),
              ),
              endDateTime: new Date(
                Date.UTC(2023, 0, 20, 10 - newYorkTimeZoneOffset),
              ),
            },
            {
              startDateTime: new Date(
                Date.UTC(2023, 0, 20, 10 - newYorkTimeZoneOffset, 30),
              ),
              endDateTime: new Date(
                Date.UTC(2023, 0, 20, 11 - newYorkTimeZoneOffset),
              ),
            },
            {
              startDateTime: new Date(
                Date.UTC(2023, 0, 20, 13 - newYorkTimeZoneOffset),
              ),
              endDateTime: new Date(
                Date.UTC(2023, 0, 20, 14 - newYorkTimeZoneOffset),
              ),
            },
          ],
        },
      },
    })
    const who = await prisma.doctor.create({
      data: {
        id: 2,
        name: 'Who',
        timeZone: 'America/New_York',
        workingTime: {
          create: [1, 2, 3, 4, 5].map((dayOfWeek) => ({
            dayOfWeek,
            startTime: '08:00:00.000',
            endTime: '16:00:00.000',
          })),
        },
        appointments: {
          create: [
            {
              startDateTime: new Date(
                Date.UTC(2023, 0, 20, 8 - newYorkTimeZoneOffset),
              ),
              endDateTime: new Date(
                Date.UTC(2023, 0, 20, 10 - newYorkTimeZoneOffset),
              ),
            },
            {
              startDateTime: new Date(
                Date.UTC(2023, 0, 20, 12 - newYorkTimeZoneOffset),
              ),
              endDateTime: new Date(
                Date.UTC(2023, 0, 20, 13 - newYorkTimeZoneOffset),
              ),
            },
          ],
        },
      },
    })
    console.log({ strange, who })
  } finally {
    await prisma.$disconnect()
  }
}

// This file can be either used as a ts-node script or a module.
// If this file is executed as a script, performs `seed()` immediately.
if (require.main === module) {
  seed();
}
