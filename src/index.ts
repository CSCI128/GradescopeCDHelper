import {
  get_gradescope_login_url,
  get_gradescope_assignment_uploader_url,
  get_gradescope_assignment_form_id,
} from "./gradescope";
import login from "./auth";
import * as puppeteer from "puppeteer";
import {
  navigate_to_uploader_page,
  upload_zip_file,
} from "./gradescope_assignment_uploader";

// load from inputs
const artifact_path = process.argv[1]
const gradescope_assignment_id = process.argv[2]

// Load from secrets
const course_id = process.argv[3]
const gradescope_username = process.argv[4]
const gradescope_password = process.argv[5]

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: `/usr/bin/google-chrome`,
    args: [`--no-sandbox`, `--headless`, `--disable-gpu`, `--disable-dev-shm-usage`],
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
}

run()
  .then(() => {
    console.log(
      `successfully uploaded ${artifact_path} to ${get_gradescope_assignment_uploader_url(course_id, gradescope_assignment_id)}`,
    );
  })
  .catch((e) => {
    console.log(e)
    process.exit(1);
  });
