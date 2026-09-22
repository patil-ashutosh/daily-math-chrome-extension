function createSeededRandom(seedString) {
  let seed = 0;
  for (let i = 0; i < seedString.length; i++) {
    seed = (seed * 31 + seedString.charCodeAt(i)) >>> 0;
  }

  return function () {
    seed += 0x6D2B79F5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rand, min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function generateDailyProblem(dateKey, level = 1) {
  const rand = createSeededRandom(`${dateKey}-level-${level}`);
  const type = randInt(rand, 1, 5);

  if (type === 1) {
    const a = randInt(rand, 20, 99);
    const b = randInt(rand, 10, 89);
    return {
      question: `${a} + ${b} = ?`,
      answer: a + b,
      explanation: `${a} + ${b} = ${a + b}. Try splitting ${b} into tens and ones for faster mental addition.`,
      difficulty: "Easy"
    };
  }

  if (type === 2) {
    const b = randInt(rand, 10, 70);
    const result = randInt(rand, 20, 90);
    const a = b + result;
    return {
      question: `${a} − ${b} = ?`,
      answer: result,
      explanation: `${a} − ${b} = ${result}. Subtract tens first, then adjust the remaining ones.`,
      difficulty: "Easy"
    };
  }

  if (type === 3) {
    const a = randInt(rand, 6, 19);
    const b = randInt(rand, 4, 15);
    return {
      question: `${a} × ${b} = ?`,
      answer: a * b,
      explanation: `${a} × ${b} = ${a * b}. Break one number into an easy part, such as ${b} = 10 + ${b - 10 > 0 ? b - 10 : 0}.`,
      difficulty: "Medium"
    };
  }

  if (type === 4) {
    const divisor = randInt(rand, 3, 12);
    const answer = randInt(rand, 4, 15);
    const dividend = divisor * answer;
    return {
      question: `${dividend} ÷ ${divisor} = ?`,
      answer,
      explanation: `${dividend} ÷ ${divisor} = ${answer}, because ${divisor} × ${answer} = ${dividend}.`,
      difficulty: "Easy"
    };
  }

  const percentChoices = [10, 20, 25, 50];
  const percent = percentChoices[randInt(rand, 0, percentChoices.length - 1)];
  const base = randInt(rand, 4, 20) * 20;
  const answer = (percent / 100) * base;
  return {
    question: `${percent}% of ${base} = ?`,
    answer,
    explanation: `${percent}% of ${base} = ${answer}. For example, 10% means divide by 10, 25% means divide by 4, and 50% means take half.`,
    difficulty: "Medium"
  };
}
