import * as puppeteer from "puppeteer";

const GRADESCOPE_AUTOGRADER_SUBMIT_BUTTON_CLASS = ".js-submitAutograder";
const GRADESCOPE_AUTOGRADER_FILE_UPLOAD = "input[type='file']";
const GRADESCOPE_AUTOGRADER_ERRORS_CLASS = ".js-autograderZipErrors";

export async function navigate_to_uploader_page(
  page: puppeteer.Page,
  uploader_page_url: string,
): Promise<boolean> {
  await page.goto(uploader_page_url, { waitUntil: "networkidle0" });

  return page.url() == uploader_page_url;
}

export async function upload_zip_file(
  page: puppeteer.Page,
  gradescope_form_id: string,
  path_to_zip: string,
): Promise<boolean> {
  const upload_form = await page.$(`#${gradescope_form_id}`);

  if (upload_form === null) {
    console.error("Failed to get upload form: " + gradescope_form_id);
    return false;
  }

  const upload_input = await upload_form.$(GRADESCOPE_AUTOGRADER_FILE_UPLOAD);

  if (upload_input === null) {
    console.error(
      "Failed to get upload input: " + GRADESCOPE_AUTOGRADER_FILE_UPLOAD,
    );
    return false;
  }

  await upload_input.uploadFile(path_to_zip);

  const uploader_errors = await upload_form.$(
    GRADESCOPE_AUTOGRADER_ERRORS_CLASS,
  );
  if (uploader_errors === null) {
    console.error("Failed to check for errors!");
    return false;
  }

  if (await uploader_errors.isVisible()) {
    console.error(await uploader_errors.evaluate((el) => el.textContent));
    return false;
  }

  const upload_btn = await upload_form.$(
    GRADESCOPE_AUTOGRADER_SUBMIT_BUTTON_CLASS,
  );

  if (upload_btn === null) {
    console.error(
      "Failed to get upload button: " +
        GRADESCOPE_AUTOGRADER_SUBMIT_BUTTON_CLASS,
    );
    return false;
  }

  await upload_btn.click();

  return true;
}
