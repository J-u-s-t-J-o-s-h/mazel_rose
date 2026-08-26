export const SAVE_THE_DATE_COOKIE = "save_the_date_completed";
export const SAVE_THE_DATE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const saveTheDateCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SAVE_THE_DATE_COOKIE_MAX_AGE,
};
