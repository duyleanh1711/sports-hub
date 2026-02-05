export async function getCaptchaToken(
  executeRecaptcha?: (action: string) => Promise<string | null>,
) {
  if (!executeRecaptcha) {
    throw new Error("RECAPTCHA_NOT_READY");
  }

  let token = await executeRecaptcha("login");

  if (!token) {
    token = await executeRecaptcha("login");
  }

  if (!token) {
    throw new Error("CAPTCHA_FAILED");
  }

  return token;
}
