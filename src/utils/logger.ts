import winston from "winston";
import moment from "moment-timezone";
import "winston-daily-rotate-file";
import stripAnsi from "strip-ansi";
import { inspect } from "util";
import { join } from "path";

export const transports = {
  console: new winston.transports.Console(),
  rotate: new winston.transports.DailyRotateFile({
    filename: `note-taking-%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: process.env.MAX_LOG_FILE_SIZE || "10g",
    maxFiles: process.env.MAX_LOG_HISTORY || "30d",
    dirname: process.env.LOG_PATH || join(__dirname, "..", "..", "logs"),
  }),
};

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.printf((inf) => {
      const { timestamp, level, message, ...args } = inf;
      const timestampM = moment(timestamp)
        .tz(process.env.TZ || "America/Sao_Paulo")
        .format("YYYY-MM-DD HH:mm:ss z");
      const strArgs = (Object.keys(args) || [])
        .map((arg) =>
          inspect(args[arg], {
            colors: true,
          })
        )
        .join(" ");
      return stripAnsi(
        `[${timestampM}] - [${level}] --> ${message} ${strArgs}`
      );
    })
  ),
  transports: [transports.rotate, transports.console],
});
