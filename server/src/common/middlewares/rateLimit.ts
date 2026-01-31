import { Injectable, NestMiddleware } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "24 h"),
  analytics: true,
});

function getClientIp(req: Request): string {
  const xff = req.headers["x-forwarded-for"];
  const ipFromHeader =
    typeof xff === "string" ? xff.split(",")[0].trim() :
    Array.isArray(xff) ? xff[0] :
    "";

  return ipFromHeader || req.ip || "unknown";
}

@Injectable()
export class IpRateLimitMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const ip = getClientIp(req);

    const key = `ip:${ip}:route:${req.path}`;

    const { success, remaining, reset } = await ratelimit.limit(key);

    res.setHeader("X-RateLimit-Limit", "3");
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    res.setHeader("X-RateLimit-Reset", String(reset));

    if (!success) {
      return res.status(429).json({
        message: "Límite alcanzado (máx 3 por 24h por IP)",
      });
    }

    next();
  }
}
