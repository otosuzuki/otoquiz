import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let a = 1;

const firebaseConfig = {
  apiKey: "AIzaSyCqWRXxBWsd-FdqMenprdncaEZH7NhUOe8",
  authDomain: "quiz-290a0.firebaseapp.com",
  projectId: "quiz-290a0",
  storageBucket: "quiz-290a0.appspot.com",
  messagingSenderId: "426843835533",
  appId: "1:426843835533:web:ea440d68fbb490f8a0a6c4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// クイズデータ
const quizData = [
  {
    question: "おとの色は？",
    choices: ["あか", "きいろ", "あお", "むらさき","みどり","しろ"],
    answer: 2
  },
  {
    question: "おとがハンターハンターで一番好きなとこは？",
    choices: ["ハンター試験", "ゾルディック家", "天空闘技場","幻影旅団","グリードアイランド","キメラアント","選挙","暗黒大陸"],
    answer: 4
  },
  {
    question: "おとのなまえといえば？",
    choices: ["おぽ", "音", "お", "おろ"],
    answer: 0
  },
  {
    question: "おとの一番好きな食べ物は？",
    choices: ["ハンバーガー", "りんご", "ステーキ", "カルボナーラ","ドーナッツ","サラダ","ラーメン","焼肉"],
    answer: 6
  },
  {
    question: "おとの攻撃といえば？",
    choices: ["殴り", "蹴り", "跳び膝蹴り", "石投げ","ピストル","ショットガン"],
    answer: 5
  },
  {
    question: "おとのスマホの写真フォルダの最初にあるのは？",
    choices: ["常生が水をかけられている動画", "せいやがバターを踊る動画", "いとの写真", "風景の写真"],
    answer: 1
  },
  {
    question: "おとには公式ラインがある？",
    choices: ["ある", "ない", "複数ある"],
    answer: 1
  },
  {
    question: "おとの今曲は？？",
    choices: ["怪獣", "bunny girl", "snooze", "undead", "オーバーライド", "overdose"],
    answer: 2
  },
  {
    question: "おとは2023年のカヤックで最後の方どこがかゆくなった？",
    choices: ["手", "頭", "キンタマ", "背中", "おしり", "足"],
    answer: 4
  },
  {
    question: "おとがmvに出演してる曲のコンセプトは？",
    choices: ["未来", "孤独", "高揚", "うんこ"],
    answer: 3
  },
  {
    question: "おとのtシャツの柄といえば？",
    choices: ["無地", "バナナ", "ナイキロゴ", "ゾウ"],
    answer: 1
  },
  {
    question: "おとはニュージーランドでパンツだけで家の周りを走った。何周？",
    choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    answer: 2
  }
];

let currentQuestion = 0;
let score = 0;
let userName = '';

const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const resultEl = document.getElementById('result');
const scoreText = document.getElementById('score-text');
const progressBar = document.getElementById('progress-bar');
const nicknameContainer = document.querySelector('.nickname-container');

const localStorageKey = "quiz_submitted";

// スタート処理
window.onload = () => {
  if (localStorage.getItem(localStorageKey)) {
    showRankingOnly();
  } else {
    nicknameContainer.classList.remove("hidden");
  }
};

window.startQuiz = () => {
  const nicknameInput = document.getElementById('nickname');
  const value = nicknameInput.value.trim();
  if (value === "") {
    alert("ニックネームを入力してください！");
    return;
  }
  userName = value;
  nicknameContainer.classList.add("hidden");
  document.querySelector(".quiz-container").classList.remove("hidden");
  showQuestion();
};

// クイズ表示
function showQuestion() {
  const current = quizData[currentQuestion];
  questionEl.textContent = current.question;
  choicesEl.innerHTML = "";
  current.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.addEventListener("click", () => confirmAnswer(index));
    choicesEl.appendChild(btn);
  });
  updateProgress();
}

// 回答確認
function confirmAnswer(index) {
  if (a == 1) {
    checkAnswer(index === quizData[currentQuestion].answer);
  }
}

// 解答チェック
function checkAnswer(isCorrect) {
  if (isCorrect) score++;
  currentQuestion++;

  choicesEl.innerHTML = "";

  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// 結果表示
function showResult() {
  document.querySelector('.quiz-container').classList.add('hidden');
  resultEl.classList.remove('hidden');
  scoreText.textContent = `${userName}さんの正解数は ${score} / ${quizData.length} です！`;
  saveResult(userName, score);
}

// 進捗バー更新
function updateProgress() {
  const percent = ((currentQuestion) / quizData.length) * 100;
  progressBar.style.width = `${percent}%`;
}

// ランキング保存
async function saveResult(name, score) {
  await addDoc(collection(db, "rankings"), { name, score });
  localStorage.setItem(localStorageKey, "true");
  showRanking();
}

// ランキング表示
async function showRanking() {
  const rankingEl = document.getElementById("ranking");
  rankingEl.innerHTML = "<h3>ランキング</h3>";

  const snapshot = await getDocs(collection(db, "rankings"));
  const scores = [];
  snapshot.forEach(doc => scores.push(doc.data()));
  scores.sort((a, b) => b.score - a.score);

  const top10 = scores.slice(0, 10); // 上位10件に限定

  const list = document.createElement("ol");
  top10.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}：${entry.score}点`;
    list.appendChild(li);
  });
  rankingEl.appendChild(list);
}

// ランキングのみ表示
async function showRankingOnly() {
  document.querySelector(".quiz-container").classList.add("hidden");
  document.querySelector(".progress-container").classList.add("hidden");
  nicknameContainer.classList.add("hidden");
  resultEl.classList.remove("hidden");
  scoreText.textContent = "あなたはすでにプレイ済みです。";
  showRanking();
}
