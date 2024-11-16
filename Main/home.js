var questions = JSON.parse(localStorage.getItem('questions')) || [];
var latestQuestionsSection = document.getElementById('latest-questions');
var questionList = document.getElementById('question-list');
var paginationDiv = document.getElementById('pagination');
var itemsPerPage = 2; // 페이지당 표시할 질문 수
var currentPage = 1; // 현재 페이지

// 로컬 스토리지에서 질문 데이터 가져오기
var questions = JSON.parse(localStorage.getItem('questions')) || [];

// 최신 질문 섹션에 section을 가져오기
var latestQuestionsSection = document.getElementById('latest-questions');

// 질문 목록을 새로 로드하는 함수
function loadQuestions() {
    // ul id를 불러와 안에 있는 속성을 questionList에 저장
    var questionList = latestQuestionsSection.querySelector('ul');
    questionList.innerHTML = ''; // 기존 질문들을 지웁니다.

    // 페이지에 맞는 데이터만 추출
    var start = (currentPage - 1) * itemsPerPage; // 시작 인덱스
    var end = start + itemsPerPage; // 끝 인덱스
    var pageQuestions = questions.slice().reverse().slice(start, end); // 최신 글부터 페이지에 맞는 질문만

    // 질문과 내용들을 나누고 역순으로 for문을 돌림
    pageQuestions.forEach(function(question, index) {
        // 인덱스를 저장하고 속성을 생성함
        var actualIndex = questions.length - 1 - index - 2 * (currentPage - 1);
        var li = document.createElement('li');
        var a = document.createElement('a');
        var p = document.createElement('p');
        var editButton = document.createElement('button');
        var deleteButton = document.createElement('button');

        // 제목과 내용을 30자로 자릅니다.
        var truncatedTitle = question.title.length > 30 ? question.title.substring(0, 30) + '...' : question.title;
        var truncatedContent = question.content.length > 30 ? question.content.substring(0, 30) + '...' : question.content;

        // a속성에 자른 제목을 저장
        //p속성에 자른 내용을 저장
        a.textContent = truncatedTitle;
        p.textContent = truncatedContent;

        // a 링크를 #으로 설정
        a.href = '#';

        // 제목이 클릭되었을 때 함수 실행
        a.addEventListener('click', () => {
            // 원본 질문 데이터를 로컬 스토리지에 저장
            localStorage.setItem("now_question", JSON.stringify({ title: question.title, content: question.content, image: question.image }));

            // 답변 페이지로 연결
            window.location.href = '../Answer/answer.html';
        });

        // 버튼내용을 수정으로 설정
        editButton.textContent = '수정';

        // 버튼 클릭 시
        editButton.addEventListener('click', function() {
            // 수정 페이지로 이동
            window.location.href = `../Edit/edit.html?index=${actualIndex}`;
        });

        deleteButton.textContent = '삭제';
        deleteButton.addEventListener('click', function() {
            openDeleteConfirm(actualIndex);
        });

        // 각 속성들의 li 하위 객체로 추가
        li.appendChild(a);
        li.appendChild(p);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        // li 속성을 questionList 속성 하위 객체로 추가
        questionList.appendChild(li);
    });

    loadPagination(); // 페이지네이션 버튼 로드
}

// 페이지네이션 버튼을 만드는 함수
function loadPagination() {
    paginationDiv.innerHTML = ''; // 기존 버튼들을 지웁니다.

    var totalPages = Math.ceil(questions.length / itemsPerPage); // 전체 페이지 수

    for (let i = 1; i <= totalPages; i++) {
        let button = document.createElement('button');
        button.textContent = i;
        button.classList.add('pagination-button');
        if (i === currentPage) {
            button.classList.add('active');
        }

        button.addEventListener('click', function() {
            currentPage = i;
            loadQuestions();
        });

        paginationDiv.appendChild(button);
    }
}

// 삭제 확인 폼을 열어 삭제할 수 있게 합니다.
function openDeleteConfirm(index) {
    document.getElementById('delete').setAttribute('data-index', index);
    document.getElementById('delete-confirm').style.display = 'block';
}

// 질문 삭제 함수
function deleteQuestion() {
    // 유저가 입력한 id, password를 저장
    let index = document.getElementById('delete').getAttribute('data-index');
    let inputUserId = document.getElementById('delete-userId').value;
    let inputPassword = document.getElementById('delete-password').value;

    // 질문에 해당하는 index를 이용해 questions의 id와 password를 question에 저장
    let question = questions[index];

    // 아이디와 비밀번호 확인
    if ((inputUserId === question.userId && inputPassword === question.password) ||
        (inputUserId === 'admin' && inputPassword === 'admin')) {
        questions.splice(index, 1);
        localStorage.setItem('questions', JSON.stringify(questions));
        document.getElementById('delete-confirm').style.display = 'none';
        loadQuestions();
    } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
}

// 삭제 확인 폼 버튼 이벤트 처리
document.getElementById('delete').addEventListener('click', function() {
    deleteQuestion();
});

document.getElementById('cancel-delete').addEventListener('click', function() {
    document.getElementById('delete-confirm').style.display = 'none';
});

// 페이지 로드 시 질문 목록 로드
document.addEventListener('DOMContentLoaded', function() {
    loadQuestions();
});