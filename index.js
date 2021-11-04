const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require("@octokit/rest");

async function run() {
  try {
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`DEBUG : ${payload}`);
    const pullRequestNumber = github.context.payload.number;
    const token = core.getInput("github-token");
    const octokit = new Octokit({auth:token})
    let reviewers = JSON.parse(core.getInput("reviewers"));
    
    console.log(`reviewers ${core.getInput("reviewers")}`)
    const author = github.context.payload.sender.login
    console.log(`author ${github.context.payload.sender.login}`);
    reviewers = reviewers.filter(r=>r!==author)
    const reviewer = reviewers[Math.floor(Math.random() * reviewers.length)];

    await octokit.pulls.requestReviewers({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: pullRequestNumber,
      reviewers: [reviewer],
    });

    
    core.setOutput("reviewer", reviewer);
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
