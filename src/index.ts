import * as core from "@actions/core";
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
const artifact_path = core.getInput("artifact_path");
const gradescope_assignment_id = core.getInput("gradescope_assignment_id");

// Load from secrets
const course_id = core.getInput("course_id");
const gradescope_username = core.getInput("gradescope_username");
const gradescope_password = core.getInput("gradescope_password");

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
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
    core.setOutput("status", "success");
    console.log(
      `successfully uploaded ${artifact_path} to ${get_gradescope_assignment_uploader_url(course_id, gradescope_assignment_id)}`,
    );
  })
  .catch((e) => {
    core.setOutput("status", "failed");
    core.setFailed(e);
  });
