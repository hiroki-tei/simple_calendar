/* 課題1 */

// 基準日を設定
// NOTE:Dateとして先月や来月の日付を指定することも可能
let baseDate = new Date();
let currentMonth = baseDate.getMonth();
let currentYear = baseDate.getFullYear();

let calendarHeader = document.getElementById("calendar-header");
let calendarBody = document.getElementById("calendar-body");

initCalendar();

// カレンダーの初期化
function initCalendar() {
  createCalendar(currentMonth, currentYear);
}

// カレンダーを作成する
async function createCalendar(month, year) {
  createCalendarHeader(month, year);
  createCalendarBody(month, year);
}

// カレンダーのヘッダーを作成
function createCalendarHeader(month, year) {
  let div = document.createElement("div");
  let h2 = document.createElement("h2");
  h2.textContent = `${year}年${month+1}月`;
  div.appendChild(h2);
  calendarHeader.appendChild(div);
}

// カレンダーのボディ(日付部分)を作成
function createCalendarBody(month, year) {
  let weeks = calculateWeeksInMonth(month, year);
  createWeeks(weeks);
  displayDays(month, year);
}

// td要素に日付を表示する
function displayDays(month, year) {
  let firstDayOfMonth = new Date(year, month, 1);
  let lastDayOfMonth = new Date(year, month+1, 0);
  let firstDayOfWeek = firstDayOfMonth.getDay();
  let daysInMonth = lastDayOfMonth.getDate();
  let days = 1;
  let rows = calendarBody.children;
  for (let i = 0; i < rows.length; i++) {
    let cells = rows[i].children;
    for (let j = 0; j < cells.length; j++) {
      if (i === 0 && j < firstDayOfWeek) {
        cells[j].innerText = "";
      } else if (days > daysInMonth) {
        cells[j].innerText = "";
      } else {
        cells[j].innerText = days;
        if (baseDate.getDate() === days) {
          cells[j].classList.add("base-date");
        }
        days++;
      }
    }
  }
}

// 基準日が属する月に、何週間存在するかを計算する
function calculateWeeksInMonth(month, year) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month+1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const lastDayOfWeek = lastDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  const weeksInMonth = Math.ceil((firstDayOfWeek + daysInMonth + (6 - lastDayOfWeek)) / 7);
  return weeksInMonth;
}

// 週間数分だけカレンダーのtr要素を作成する
function createWeeks(weeks) {
  for (let i = 0; i < weeks; i++) {
    let tr = document.createElement("tr");
    // 週のtd要素を作成
    createDaysInWeek(tr);
    calendarBody.appendChild(tr);
  }
}

// 週のtd要素を作成する
function createDaysInWeek(week) {
  for (let i = 0; i < 7; i++) {
    let td = document.createElement("td");
    td.classList.add("calendar-date")
    week.appendChild(td);
  }
}


/* 課題2 */

// 日付要素のイベント動作を定義
const dates = document.querySelectorAll(".calendar-date")
dates.forEach(date => {
  //クリック時
  date.addEventListener("click", (e) => {
    runClickEvent(e.currentTarget);
  })
})

let checkInDate = 0;
let checkOutDate = 0;

let checkInDateElement = document.getElementById("checkin-date")
let checkOutDateElement = document.getElementById("checkout-date")
let stayDaysElement = document.getElementById("stay-days")

function runClickEvent(dateTdElement) {
  const clickedDate = dateTdElement.innerText;

  // 1回目のクリック時の処理
  if (!isCheckInDateSelected()) {
    // 日付クリック時の強調
    // WARNING: 同じ日付をクリックした場合、#start-dateが無限に増えてしまう
    dateTdElement.classList.add("start-date");
    checkInDate = new Date(currentYear, currentMonth, clickedDate)
  } else if (!isCheckOutDateSelected()) {
    dateTdElement.classList.add("end-date");
    checkOutDate = new Date(currentYear, currentMonth, clickedDate);

    if (!checkDateValidity()) {
      addErrorMessage("チェックアウト日はチェックイン日より後の日付を選択してください");
    }
    renderDetailInfo();
  } else {
    // ３回目のクリックで初期状態へ戻す
    clearClickedState();
  }
}

// チェックイン日とチェックアウト日の前後関係チェック
function checkDateValidity() {
  return checkOutDate - checkInDate > 0;
}

// 詳細情報欄への反映
function renderDetailInfo() {
  checkInDateElement.textContent = checkInDate.toLocaleDateString("ja-JP");
  checkOutDateElement.textContent = checkOutDate.toLocaleDateString("ja-JP");
  stayDaysElement.textContent = checkOutDate.getDate() - checkInDate.getDate();
}

function isCheckInDateSelected() {
  return !!document.querySelector(".calendar-date.start-date")
}

function isCheckOutDateSelected() {
  return !!document.querySelector(".calendar-date.end-date")
}

function addErrorMessage(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
}

function clearClickedState() {
  const startDate = document.querySelector(".start-date");
  const endDate = document.querySelector(".end-date");
  startDate.classList.remove("start-date");
  endDate.classList.remove("end-date");
  document.getElementById("error-message").textContent = "";
}
