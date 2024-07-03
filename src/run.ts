import * as puppeteer from "puppeteer";
import login from "./auth";
import {
  get_gradescope_assignment_form_id,
  get_gradescope_assignment_uploader_url,
  get_gradescope_login_url,
} from "./gradescope";
import {
  navigate_to_uploader_page,
  upload_zip_file,
} from "./gradescope_assignment_uploader";

export async function run(
  chrome_path: string,
  artifact_path: string,
  gradescope_assignment_id: string,
  course_id: string,
  gradescope_username: string,
  gradescope_password: string,
) {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: chrome_path,
    args: [
      // `--no-sandbox`,
      // `--headless`,
      `--disable-gpu`,
      `--disable-dev-shm-usage`,
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ height: 800, width: 1200 });

  if (
    !(await login(
      page,
      get_gradescope_login_url(),
      gradescope_username,
      gradescope_password,
    ))
  ) {
    throw new Error("Failed to login!");
  }

  if (
    !(await navigate_to_uploader_page(
      page,
      get_gradescope_assignment_uploader_url(
        course_id,
        gradescope_assignment_id,
      ),
    ))
  ) {
    throw new Error("Failed to navigate to uploader page!");
  }

  if (
    !(await upload_zip_file(
      page,
      get_gradescope_assignment_form_id(gradescope_assignment_id),
      artifact_path,
    ))
  ) {
    throw new Error("Failed to upload zip file!");
  }

  await browser.close();
}
