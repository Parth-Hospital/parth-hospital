/// <reference types="node" />
import "dotenv/config"

const DATABASE_URL = (process as NodeJS.Process).env.DATABASE_URL || ""

export default {
  schema: "./prisma/schema.prisma",
  datasource: {
    url: DATABASE_URL,
  },
}
