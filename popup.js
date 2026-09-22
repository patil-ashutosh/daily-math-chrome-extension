const questionEl = document.getElementById('question');
const inputEl = document.getElementById('answerInput');
const formEl = document.getElementById('answerForm');
const feedbackEl = document.getElementById('feedback');
const explanationEl = document.getElementById('explanation');
const streakEl = document.getElementById('streakCount');
const difficultyEl = document.getElementById('difficultyBadge');
const progressEl = document.getElementById('progressText');
const checkButton = document.getElementById('checkButton');

function getLocalDateKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(dateKey, amount) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + amount);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

async function getState() {
  const result = await chrome.storage.local.get([
    'dailyProblem',
    'dailyProblemDate',
    'solvedDate',
    'streak',
    'lastSolvedDate'
  ]);
  return result;
}

async function saveState(values) {
  await chrome.storage.local.set(values);
}

function renderSolved(problem, streak) {
  inputEl.value = problem.answer;
  inputEl.disabled = true;
  checkButton.disabled = true;
  feedbackEl.textContent = `✅ Correct! The answer is ${problem.answer}.`;
  feedbackEl.className = 'feedback correct';
  explanationEl.textContent = `Mental tip: ${problem.explanation}`;
  explanationEl.className = 'explanation';
  progressEl.textContent = `Nice work. Your current streak is ${streak} day${streak === 1 ? '' : 's'}. Come back tomorrow for a new challenge.`;
}

function renderProblem(problem, streak) {
  questionEl.textContent = problem.question;
  difficultyEl.textContent = problem.difficulty;
  streakEl.textContent = streak || 0;
}

async function init() {
  const today = getLocalDateKey();
  let state = await getState();
  let problem = state.dailyProblem;

  if (!problem || state.dailyProblemDate !== today) {
    problem = generateDailyProblem(today, 1);
    await saveState({
      dailyProblem: problem,
      dailyProblemDate: today
    });
    state = await getState();
  }

  renderProblem(problem, state.streak || 0);

  if (state.solvedDate === today) {
    renderSolved(problem, state.streak || 0);
  } else {
    inputEl.focus();
  }
}

formEl.addEventListener('submit', async (event) => {
  event.preventDefault();

  const state = await getState();
  const today = getLocalDateKey();
  const problem = state.dailyProblem;
  const userAnswer = Number(inputEl.value);

  if (Number.isNaN(userAnswer)) return;

  if (userAnswer === Number(problem.answer)) {
    let newStreak = 1;
    const yesterday = addDays(today, -1);

    if (state.lastSolvedDate === yesterday) {
      newStreak = (state.streak || 0) + 1;
    } else if (state.lastSolvedDate === today) {
      newStreak = state.streak || 1;
    }

    await saveState({
      solvedDate: today,
      lastSolvedDate: today,
      streak: newStreak
    });

    streakEl.textContent = newStreak;
    renderSolved(problem, newStreak);
  } else {
    feedbackEl.textContent = '❌ Not quite. Try once more.';
    feedbackEl.className = 'feedback wrong';
    explanationEl.className = 'explanation hidden';
    inputEl.select();
  }
});

init();
