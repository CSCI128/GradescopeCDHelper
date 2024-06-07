import * as puppeteer from "puppeteer";

const GRADESCOPE_AUTOGRADER_SUBMIT_BUTTON_CLASS = ".js_submitAutograder";

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
  const upload_form = await page.$(gradescope_form_id);

  if (upload_form === null) {
    return false;
  }

  const upload_input = await upload_form.$("input[type='upload']");

  if (upload_input === null) {
    return false;
  }

  await upload_input.uploadFile(path_to_zip);

  const upload_btn = await upload_form.$(
    GRADESCOPE_AUTOGRADER_SUBMIT_BUTTON_CLASS,
  );

  if (upload_btn === null) {
    return false;
  }

  upload_btn.click();

  return true;
}
