const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const pullRequestNumber = github.context.payload.number;
    const token = core.getInput("github-token");
    const reviewers = JSON.parse(core.getInput("reviewers"));
    
    const reviewer = reviewers[Math.floor(Math.random() * reviewers.length)];
    
    await octokit.pulls.requestReviewers({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: pullRequestNumber,
      reviewers: [reviewer],
    });

    const payload = JSON.stringify(github.context.payload, undefined, 2);
    
    console.log(`DEBUG : ${payload}`);
    core.setOutput("reviewer", reviewer);
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();