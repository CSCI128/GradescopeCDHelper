# Gradescope CD Helper

This action deploys autograders to Gradescope using the default zip file upload for the ubuntu base image.

Per the terms of service, usage of a bot similar to this one is permissible as it acts as a human would when accessing 
the service. https://www.gradescope.com/tos.
Please refer to the terms of service for Gradescope prior to using this.
By using this, you are accepting the inherent risks of using automated ui tools on Gradescope.

This may stop working at any time (especially if Gradescope change its UI / obscuration techniques).


This should be run by a separate 'service user' that has TA permissions **only** for the class that this workflow is 
deployed for.

SSO accounts are not currently supported, and it is unlikely that they will be.

If Gradescope implements MFA (which they should), this will stop working.

This workflow does not attempt to access any scores or grading information and does not store any data.

If you feel dubious about that claim, please check out the code and inspect it yourself. 
It is under 200 lines, so it should be easy to verify.

Under the hood, puppeteer (a JavaScript UI testing framework), is used to interact with Gradescope.


## Inputs

### `course_id`

**Required** Set the course id for which this action is deployed. 

Can be found in the URI after 'courses' 

This should be set as a repository variable. 
It is highly recommended **not** to hard code this in the workflow.

### `gradescope_username`

**Required** Set the gradescope service user's username. 

This should be set as a repository secret.

It is highly recommended **not** to hard code this in the workflow.
If you hard code it, you risk a malicious user (or GitHub action) modifying scores in your course.
For the love of all things holy, store this as a secret.

### `gradescope_password`

**Required** Set the gradescope service user's password.

This should be set as a repository secret.

It is highly recommended **not** to hard code this in the workflow.
If you hard code it, you risk a malicious user (or GitHub action) modifying scores in your course.
For the love of all things holy, store this as a secret.

### `gradescope_assignment_id`

**Required** Set the gradescope assignment id. 

This should be derived from the artifacts produced during the CI pipeline

### `artifact_path`

**Required** The path the artifact was produced on.

This should be derived from the artifacts produced during the CI pipeline

If running as a separate job (which it probably should be), you may need to run the `actions/download-artifact` action 
to get pull it into this job.

## Outputs

### `status`

The workflow status.

Can either be `success` or `failed` You can safely ignore this output.

## Example usage

```yaml
uses: CSCI128/GradescopeCDHelper@v1
with:
  course_id: ${{ vars.COURSE_ID }}
  gradescope_username: ${{ secrets.GRADESCOPE_SERVICE_USER }}
  gradescope_password: ${{ secrets.GRADESCOPE_SERVICE_USER_PASSWORD }}
  gradescope_assignment_id: ${{ matrix.assignments.assignment_id }}
  artifact_path: "${{ github.workspace }}/${{ matrix.assignments.assignment_path }}"
  
```