document.addEventListener('DOMContentLoaded', function() {
    // URL에서 index 값을 추출
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('index');
    
    // 로컬 스토리지에서 'questions' 데이터를 가져오고, 데이터가 없을 경우 빈 배열을 반환
    const questions = JSON.parse(localStorage.getItem('questions')) || [];
    
    // index가 유효한 경우
    if (index !== null && index >= 0 && index < questions.length) {
        const question = questions[index];

        // 질문의 제목, 내용, 카테고리 정보를 수정 폼에 미리 채워 넣음
        document.getElementById('edit-index').value = index; // 수정할 질문의 인덱스
        document.getElementById('edit-title').value = question.title; // 질문 제목
        document.getElementById('edit-content').value = question.content; // 질문 내용
        document.getElementById('edit-category').value = question.category || ''; // 카테고리 (없으면 빈 문자열)

        // 원래 이미지를 표시
        if (question.image && question.image.trim() !== '') {
            const imgElement = document.createElement('img');
            imgElement.src = question.image;
            imgElement.style.maxWidth = '100%';
            document.getElementById('original-image').appendChild(imgElement);
        } else {
            const noImageText = document.createElement('p');
            noImageText.textContent = '없음';
            document.getElementById('original-image').appendChild(noImageText);
        }


        // 파일 선택 시 알림창 표시
        document.getElementById('edit-file').addEventListener('change', function() {
            if (question.image) {
                const confirmChange = confirm('새 이미지를 선택하시겠습니까? 수정 시 기존 이미지는 덮어씌워집니다.');
                if (!confirmChange) {
                    this.value = ''; // 선택된 파일 초기화
                }
            }
        });
    }

    // 수정 폼 제출 시 발생하는 이벤트 처리
    document.getElementById('edit-form').addEventListener('submit', function(event) {
        event.preventDefault(); // 폼의 기본 제출 동작을 방지

        // 수정하려는 질문의 index를 다시 가져옴
        const editIndex = document.getElementById('edit-index').value;

        // 유저가 입력한 제목, 내용, 아이디와 비밀번호를 가져옴
        const inputTitle = document.getElementById('edit-title').value.trim(); // 제목 공백 제거
        const inputContent = document.getElementById('edit-content').value.trim(); // 내용 공백 제거
        const inputUserId = document.getElementById('edit-userId').value;
        const inputPassword = document.getElementById('edit-password').value;

        // 파일 입력 필드에서 파일을 가져옵니다.
        const fileField = document.getElementById('edit-file');
        const file = fileField.files[0];
        
        // 질문 데이터 가져오기
        const question = questions[editIndex];

        // 제목과 내용이 비어있는지 확인
        if (inputTitle === '' || inputContent === '') {
            alert('제목과 내용은 빈 칸으로 두면 안 됩니다.');
            return; // 폼 제출을 중단
        }

        // 아이디와 비밀번호가 질문을 작성한 사람과 일치하는지 확인
        if (inputUserId === question.userId && inputPassword === question.password) {
            // 파일이 있는 경우
            if (file) {
                handleFileInput(file, editIndex, inputTitle, inputContent, inputUserId, inputPassword);
            } else {
                // 파일이 없는 경우
                saveEditedQuestion(editIndex, inputTitle, inputContent, question.image, inputUserId, inputPassword);
            }
        } else {
            // 아이디 또는 비밀번호가 일치하지 않으면 경고 메시지 출력
            alert('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    });
});

// 파일 입력을 처리하는 함수
function handleFileInput(file, editIndex, inputTitle, inputContent, inputUserId, inputPassword) {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/tiff', 'image/jfif', 'image/jpg'];
    if (!validImageTypes.includes(file.type)) {
        alert('이미지 파일만 업로드할 수 있습니다.');
        document.getElementById('edit-file').value = ''; // 선택한 파일을 초기화합니다.
        return;
    }
    
    // 파일을 Base64 형식으로 인코딩하여 질문 수정 함수 호출
    const reader = new FileReader();
    reader.onload = function(event) {
        const base64Image = event.target.result;
        saveEditedQuestion(editIndex, inputTitle, inputContent, base64Image, inputUserId, inputPassword);
    };
    reader.readAsDataURL(file);
}

// 질문을 저장하는 함수
function saveEditedQuestion(index, title, content, image, userId, password) {
    // 질문 수정 : 새로 입력된 제목, 내용, 카테고리, 이미지로 값을 덮어씌움
    const questions = JSON.parse(localStorage.getItem('questions')) || [];
    questions[index] = {
        title: title,
        content: content,
        category: document.getElementById('edit-category').value,
        userId: userId,
        password: password,
        image: image // 업데이트된 이미지 포함
    };

    // 수정된 questions 배열을 다시 로컬 스토리지에 저장
    localStorage.setItem('questions', JSON.stringify(questions));

    // 수정 완료 알림 메시지
    alert('질문이 수정되었습니다.');

    // 수정 후 메인 페이지로 이동
    window.location.href = '../Main/index.html';
}