// Quiz / Assessment Engine

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startQuiz() {
  const nameInput = document.getElementById('userFullName');
  const userName = nameInput?.value.trim();

  if (!userName) {
    alert("Please enter your full name before starting the assessment.\nThis name will appear on your certificate.");
    nameInput?.focus();
    return;
  }

  localStorage.setItem('currentUserNameForCertificate', userName);

  if (!currentModule || !sampleQuizzes[currentModule]) {
    alert("No assessment available for this module.");
    return;
  }

  currentQuiz = shuffleArray(sampleQuizzes[currentModule].q || []);
  questionIndex = 0;
  correctAnswers = 0;
  quizStartTime = Date.now();
  showQuestion();
  showScreen('quizScreen');
}

function showQuestion() {
  const optionsContainer = document.getElementById('optionsContainer');
  const feedback = document.getElementById('feedback');
  const nextBtn = document.getElementById('nextBtn');
  const questionText = document.getElementById('questionText');

  optionsContainer.innerHTML = '';
  feedback.innerHTML = '';
  nextBtn.classList.add('d-none');

  if (questionIndex >= currentQuiz.length) {
    finishQuiz();
    return;
  }

  const q = currentQuiz[questionIndex];
  const originalOptions = q.options || [];
  const correctAnswerText = originalOptions[q.correct];

  let shuffledOptions = shuffleArray([...originalOptions]);
  const newCorrectIndex = shuffledOptions.indexOf(correctAnswerText);

  questionText.textContent = q.question || "Question text missing";

  shuffledOptions.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'col-12';
    div.innerHTML = `
      <div class="quiz-option btn btn-outline-secondary w-100 text-start py-3">
        ${opt || 'Option'}
      </div>
    `;
    const button = div.querySelector('.quiz-option');
    button.addEventListener('click', () => selectAnswer(i, newCorrectIndex));
    optionsContainer.appendChild(div);
  });

  optionsContainer.dataset.correct = newCorrectIndex;
}

function selectAnswer(selectedIndex, correctIndex) {
  const options = document.querySelectorAll('#optionsContainer .quiz-option');
  const feedback = document.getElementById('feedback');
  const nextBtn = document.getElementById('nextBtn');

  options.forEach((opt, i) => {
    opt.classList.remove('btn-outline-secondary');
    if (i === correctIndex) opt.classList.add('btn-success');
    else if (i === selectedIndex) opt.classList.add('btn-danger');
    opt.style.pointerEvents = 'none';
  });

  const q = currentQuiz[questionIndex] || {};
  feedback.textContent = q.explanation || '';
  feedback.classList.remove('text-success', 'text-danger');
  feedback.classList.add(selectedIndex === correctIndex ? 'text-success' : 'text-danger');

  if (selectedIndex === correctIndex) correctAnswers++;
  nextBtn.classList.remove('d-none');
}

function nextQuestion() {
  questionIndex++;
  showQuestion();
}

function finishQuiz() {
  const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
  const percentage = currentQuiz.length > 0 ? Math.round((correctAnswers / currentQuiz.length) * 100) : 0;
  const passed = percentage >= 70;
  const timestamp = new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' });

  scores[currentModule] = {
    percentage,
    passed,
    timestamp,
    correct: correctAnswers,
    total: currentQuiz.length
  };
  localStorage.setItem('miningScores', JSON.stringify(scores));

  document.getElementById('resultTitle').textContent = passed ? 'Congratulations! You Passed' : 'Assessment Not Passed';
  const progressBar = document.getElementById('progressBar');
  progressBar.style.width = percentage + '%';
  progressBar.textContent = percentage + '%';
  progressBar.className = `progress-bar progress-bar-striped fs-4 fw-bold ${passed ? 'bg-success' : 'bg-danger'}`;

  document.getElementById('scorePercent').textContent = percentage + '%';
  document.getElementById('correctCount').textContent = correctAnswers + ' / ' + (currentQuiz.length || 0);
  document.getElementById('timeDisplay').textContent =
    Math.floor(timeTaken / 60) + ':' + (timeTaken % 60).toString().padStart(2, '0');

  document.getElementById('passMessage').textContent = passed
    ? 'You have successfully completed this module and demonstrated competency.'
    : 'A minimum of 70% is required to pass. Please review the material and try again.';
  document.getElementById('completionTimestamp').textContent = `Completed: ${timestamp}`;

  document.getElementById('certificateSection').classList.toggle('d-none', !passed);

  showScreen('resultsScreen');
  updateProgress();
  renderModules();
  renderCompletedModules();
}

function restartQuiz() {
  startQuiz();
}
