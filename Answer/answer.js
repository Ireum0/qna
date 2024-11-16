// submitAnswer id를 가진 객체를 불러옴
const Button = document.getElementById("submit");

// button을 눌렀을 때 메인으로 돌아감
/*
Button.addEventListener("click", function () {
    window.location.href = '../Main/index.html'
    console.log('answer button')
})
*/

// local storage에 있는 now_question키 값을 받아와 title, content, image를 저장
const {title, content, image} = JSON.parse(localStorage.getItem("now_question"));

var questions = JSON.parse(localStorage.getItem('questions')) || [];
var Answers = JSON.parse(localStorage.getItem('Answers')) || [];
console.log(questions);

// html의 제목 부분과 내용 부분을 불러옴
const h2 = document.getElementById('theme');
const p = document.getElementById('content');
const img = document.getElementById('question-image');

// 제목과 내용 부분에 title과 content 내용을 추가
h2.innerHTML = title;
p.innerHTML = content;

// 이미지가 존재할 경우 이미지를 표시
if (image) {
    img.src = image;
    img.style.display = 'block';
    console.log('Loaded image:', image);
} else {
    img.style.display = 'none';
}

// answer-form에 있는 버튼에 submitAnswer 이벤트 리스터를 추가
document.getElementById("answer-form").addEventListener('submit', submitAnswer);

// 답변 제출 버튼을 눌렀을 때
function submitAnswer(event) {
    // textarea의 양쪽 공백을 제거하여 answer에 저장
    const answer = document.getElementById("answer-content").value.trim();
    var result = confirm("답변을 제출하시겠습니까?");

    if (result) {
        // Answer json 구성
        var Answer = {
            title: title,
            content: content,
            answer: answer
        };

        // localstorage에 있는 Answers에 Answer json을 추가
        Answers.push(Answer);

        // localstorage에 저장
        localStorage.setItem('Answers', JSON.stringify(Answers));
        alert('답변이 제출되었습니다: ');
    } else {
        event.preventDefault();
    }
}

// 최신 질문 섹션에 section을 가져오기
var latestAnswersSection = document.getElementById('latest-answers');

// 답변 목록을 새로 로드하는 함수
function loadAnswers() {
    // ul id를 불러와 안에 있는 속성을 answerList에 저장
    var answerList = latestAnswersSection.querySelector('ul');
    answerList.innerHTML = ''; // 기존 질문들을 지웁니다.

    // 질문과 내용들을 나누고 역순으로 for문을 돌림
    Answers.slice().reverse().forEach(function(answer, index) {
        // 인덱스를 저장하고 속성을 생성함
        var ul = document.createElement('ul');
        var a = document.createElement('a');

        if (title === answer.title && content === answer.content) {
            // a속성에 자른 제목을 저장
            // p속성에 자른 내용을 저장
            a.textContent = answer.answer;

            // 각 속성들의 li 하위객체로 추가
            ul.appendChild(a);

            // li 속성을 answerList 속성 하위 객체로 추가
            answerList.appendChild(ul);
        } else {
            // 다른 질문에 대한 답변을 무시
        }
    });
}

// answer-box의 class 요소들을 불러와 하나씩 answerBox에 저장
// answerBox의 클릭이벤트가 생겼을 때 질문 탭(부모요소)이 반응하는걸 억제
document.querySelectorAll('.answer-box').forEach(answerBox => {
    answerBox.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});

// 페이지 로드 시 답변 목록 로드 및 질문과 이미지 표시
document.addEventListener('DOMContentLoaded', function() {
    loadAnswers();
    // 질문과 이미지를 로드하여 표시
    displayQuestion();
});

// 질문과 이미지를 로드하여 표시하는 함수
function displayQuestion() {
    const { title, content, image } = JSON.parse(localStorage.getItem('now_question'));

    // html의 제목 부분과 내용 부분을 불러옴
    const h2 = document.getElementById('theme');
    const p = document.getElementById('content');
    const img = document.getElementById('question-image');

    // 제목과 내용 부분에 title과 content 내용을 추가
    h2.innerHTML = title;
    p.innerHTML = content;

    // 이미지가 존재할 경우 이미지를 표시
    if (image) {
        img.src = image;
        img.style.display = 'block';
    } else {
        img.style.display = 'none';
    }
}