import * as puppeteer from "puppeteer";

const LOGIN_EMAIL_BOX_ID = "#session_email";
const LOGIN_PASSWORD_BOX_ID = "#session_password";

export default async function login(
  page: puppeteer.Page,
  gradescope_login_url: string,
  gradescope_username: string,
  gradescope_password: string,
): Promise<boolean> {
  await page.goto(gradescope_login_url, { waitUntil: "networkidle0" });

  await page.type(LOGIN_EMAIL_BOX_ID, gradescope_username);
  await page.type(LOGIN_PASSWORD_BOX_ID, gradescope_password);

  // button is currently name=commit, but no ID :( why gradescope?? just give me a REST api!!!
  await page.waitForSelector("input[name='commit']");
  await Promise.all([
    page.click("input[name='commit']"),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);

  return page.url() != gradescope_login_url;
}
