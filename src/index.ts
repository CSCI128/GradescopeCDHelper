import { get_gradescope_assignment_uploader_url } from "./gradescope";
import * as process from "node:process";
import { run } from "./run";
import { validate } from "./utils";

// load from inputs
const chrome_path = process.argv[2];
const artifact_path = process.argv[3];
const gradescope_assignment_id = process.argv[4];

// Load from secrets
const course_id = process.argv[5];
const gradescope_username = process.env.GS_USERNAME ?? process.argv[6];
const gradescope_password = process.env.GS_PASS ?? process.argv[7];

validate(
  chrome_path,
  artifact_path,
  gradescope_assignment_id,
  course_id,
  gradescope_username,
  gradescope_password,
)
  .then(() => {
    run(
      chrome_path,
      artifact_path,
      gradescope_assignment_id,
      course_id,
      gradescope_username,
      gradescope_password,
    )
      .then(() => {
        console.log(
          `successfully uploaded ${artifact_path} to ${get_gradescope_assignment_uploader_url(course_id, gradescope_assignment_id)}`,
        );

        process.exit(0);
      })
      .catch((e) => {
        console.error(e);
        process.exit(2);
      });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
