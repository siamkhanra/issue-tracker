document.getElementById('issueInputForm').addEventListener('submit', submitIssue);

function submitIssue(e) {
  e.preventDefault();

  const getInputValue = id => document.getElementById(id).value;
  const description = getInputValue('issueDescription');
  const severity = getInputValue('issueSeverity');
  const assignedTo = getInputValue('issueAssignedTo');
  const id = Math.floor(Math.random() * 100000000);
  const status = 'Open';

  const issue = { id, description, severity, assignedTo, status };
  let issues = [];
  if (localStorage.getItem('issues')) {
    issues = JSON.parse(localStorage.getItem('issues'));
  }
  issues.push(issue);
  localStorage.setItem('issues', JSON.stringify(issues));

  document.getElementById('issueInputForm').reset();
  fetchIssues();
}

const toggleStatus = (id, event) => {
  const issues = JSON.parse(localStorage.getItem('issues'));
  const currentIssue = issues.find(issue => issue.id === id);

  if (currentIssue.status === 'Open') {
    currentIssue.status = 'Closed';
  } else {
    currentIssue.status = 'Open';
  }

  localStorage.setItem('issues', JSON.stringify(issues));
  fetchIssues();
  event.stopPropagation();
};

const deleteIssue = (id, event) => {
  const issues = JSON.parse(localStorage.getItem('issues'));
  const remainingIssues = issues.filter(issue => issue.id !== id);
  localStorage.setItem('issues', JSON.stringify(remainingIssues));
  fetchIssues();
  event.stopPropagation();
};

const fetchIssues = () => {
  const issues = JSON.parse(localStorage.getItem('issues'));
  const issuesList = document.getElementById('issuesList');
  const issueCountElement = document.getElementById('issueCount');
  issuesList.innerHTML = '';

  let openIssueCount = 0;

  if (issues) {
    for (var i = 0; i < issues.length; i++) {
      const { id, description, severity, assignedTo, status } = issues[i];

      const issueContainer = document.createElement('div');
      issueContainer.className = 'well';
      issueContainer.innerHTML = `<h6>Issue ID: ${id}</h6>
                                  <p><span class="label label-info">${status}</span></p>
                                  <h3>${description}</h3>
                                  <p><span class="glyphicon glyphicon-time"></span> ${severity}</p>
                                  <p><span class="glyphicon glyphicon-user"></span> ${assignedTo}</p>`;

      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'button-container';

      const closeButton = document.createElement('a');
      closeButton.href = '#';
      closeButton.className = 'btn btn-warning';
      closeButton.innerHTML = '<span class="glyphicon glyphicon-remove"></span> Close';
      closeButton.addEventListener('click', (event) => toggleStatus(id, event));
      buttonContainer.appendChild(closeButton);

      const deleteButton = document.createElement('a');
      deleteButton.href = '#';
      deleteButton.className = 'btn btn-danger';
      deleteButton.innerHTML = `<span class="glyphicon glyphicon-trash"></span> Delete`;
      deleteButton.addEventListener('click', (event) => deleteIssue(id, event));
      buttonContainer.appendChild(deleteButton);

      issueContainer.appendChild(buttonContainer);

      if (status === 'Closed') {
        closeButton.innerHTML = '<span class="glyphicon glyphicon-ok"></span> Problem Solved';
        closeButton.className = 'btn btn-success';
      } else {
        openIssueCount++;
      }

      issuesList.appendChild(issueContainer);
    }
  }

  issueCountElement.textContent = `${openIssueCount} (${issues ? issues.length : 0})`;
};

fetchIssues();
