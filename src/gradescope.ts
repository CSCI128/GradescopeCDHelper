const GRADESCOPE_BASE_URL = "https://www.gradescope.com";

export const get_gradescope_login_url: Function = (): string =>
  `${GRADESCOPE_BASE_URL}/login`;

export const get_gradescope_assignment_uploader_url: Function = (
  course_id: string,
  assignment_id: string,
): string =>
  `${GRADESCOPE_BASE_URL}/courses/${course_id}/assignments/${assignment_id}/configure_autograder`;

export const get_gradescope_assignment_form_id: Function = (
  assignment_id: string,
): string => `edit_assignment_${assignment_id}`;
