const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require("@octokit/rest");

async function run() {
  try {
    const pullRequestNumber = github.context.payload.number;
    const author = github.context.payload.sender.login
    const token = core.getInput("github-token");
    let reviewers = JSON.parse(core.getInput("reviewers"));
    const octokit = new Octokit({auth:token})
    
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
