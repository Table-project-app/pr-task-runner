
import * as core from '@actions/core';
import * as github from '@actions/github'
import axios from 'axios'

console.log('it work')

const API_BASE_URL = 'https://api.github.com/repos';
const setReviewers = async(event:any, token:string, reviewers:string[]) =>{
  try {
    await axios({
      method: 'post',
      url: `${API_BASE_URL}/${event.repository.full_name}/pulls/${event.pull_request.number}/requested_reviewers`,
      data: {
        reviewers: reviewers,
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${token}`,
      },
    });
  } catch(e) {
    throw new Error('"github-token" or "reviewers" may not be correct.');
  }
}

const channelId = core.getInput('CHANNEL_ID')
const slackUsers: { "github_username": string, "slack_id": string }[] = JSON.parse(core.getInput("slack-users"));
const assignees= core.getInput('assignees');
const reviewers= core.getInput('reviewers');
const maxNumOfReviewers= core.getInput('max-num-of-reviewers');
const draftKeyword= core.getInput('draft-keyword');
const readyComment= core.getInput('ready-comment');
const mergedComment= core.getInput('merged-comment');
const botAccounts= core.getInput('bot-accounts');
const githubToken= core.getInput('github-token');

const event = github.context.payload
const author:string = event.pull_request?.user.login



const originalReviewers = reviewers.replace(/\s/g, '').split(',').filter(reviewer => reviewer != author);

github