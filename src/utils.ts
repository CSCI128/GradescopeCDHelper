import { existsSync } from "node:fs";
import which from "which";

const is_path_valid = (path: string) => existsSync(path);

const is_gs_id_valid = (id: string) => /\d+/g.test(id);

const are_credentials_valid = (username: string, password: string) =>
  /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(username) && password.length > 0;

export async function validate(
  chrome_path: string,
  artifact_path: string,
  gradescope_assignment_id: string,
  course_id: string,
  gradescope_username: string,
  gradescope_password: string,
): Promise<void> {
  if (!is_path_valid(chrome_path)) {
    throw new Error("Invalid chrome path: " + chrome_path);
  }
  if (!is_path_valid(artifact_path)) {
    throw new Error("Invalid artifact path: " + artifact_path);
  }

  if (!is_gs_id_valid(gradescope_assignment_id)) {
    throw new Error(
      "Invalid Gradescope Assignment ID: " + gradescope_assignment_id,
    );
  }

  if (!is_gs_id_valid(course_id)) {
    throw new Error("Invalid Gradescope Course ID: " + course_id);
  }

  if (!are_credentials_valid(gradescope_username, gradescope_password)) {
    throw new Error("Invalid Gradescope Credentials");
  }
}
