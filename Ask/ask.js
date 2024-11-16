// 질문 등록 폼 제출 시 이벤트 리스너 설정
document.getElementById('question-form').addEventListener('submit', async function(event) {
    // 기본 폼 제출 동작을 방지합니다.
    event.preventDefault();
    
    // 각 입력 필드의 값을 가져옵니다.
    var title = document.getElementById('question-title').value.trim();
    var content = document.getElementById('question-content').value.trim();
    var category = document.getElementById('category').value;
    var userId = document.getElementById('userId').value;
    var password = document.getElementById('password').value;

    // 질문 제목과 내용이 비어 있는지 확인합니다.
    if (title === '' || content === '') {
        alert('질문 내용을 입력해 주세요.');
        return; // 폼 제출을 중단합니다.
    }

    // 파일 입력 필드에서 파일을 가져옵니다.
    const fileField = document.getElementById('file');
    const file = fileField.files[0];

    // 파일이 선택되었는지 확인합니다.
    if (file) {
        // 파일 타입이 이미지인지 확인합니다.
        const validImageTypes = [
            'image/jpeg', 
            'image/png', 
            'image/gif', 
            'image/bmp', 
            'image/webp', 
            'image/tiff', 
            'image/jfif',
            'image/jpg'
        ];
        if (!validImageTypes.includes(file.type)) {
            alert('이미지 파일만 업로드할 수 있습니다.');
            fileField.value = ''; // 선택한 파일을 초기화합니다.
            return;
        }

        // 파일을 Base64 형식으로 인코딩하여 로컬 스토리지에 저장합니다.
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64Image = event.target.result;
            saveQuestion(base64Image); // 이미지가 Base64 형식으로 인코딩된 후 질문 저장 함수 호출
        };
        reader.readAsDataURL(file);
    } else {
        saveQuestion(''); // 이미지가 선택되지 않은 경우 빈 문자열을 전달하여 질문 저장 함수 호출
    }
});

function saveQuestion(base64Image) {
    // 각 입력 필드의 값을 가져옵니다.
    var title = document.getElementById('question-title').value.trim();
    var content = document.getElementById('question-content').value.trim();
    var category = document.getElementById('category').value;
    var userId = document.getElementById('userId').value;
    var password = document.getElementById('password').value;

    // 질문 제목과 내용이 비어 있는지 확인합니다.
    if (title === '' || content === '') {
        alert('질문 내용을 입력해 주세요.');
        return; // 폼 제출을 중단합니다.
    }

    // 질문 객체를 생성합니다.
    var question = {
        title: title,
        content: content,
        category: category,
        userId: userId,
        password: password,
        image: base64Image // 이미지 데이터를 포함합니다.
    };

    // 로컬 스토리지에 있는 질문들을 불러옵니다.
    var questions = JSON.parse(localStorage.getItem('questions')) || [];

    // 새로운 질문을 questions 배열에 추가합니다.
    questions.push(question);

    // 업데이트된 questions 배열을 로컬 스토리지에 저장합니다.
    localStorage.setItem('questions', JSON.stringify(questions));

    // 메인 화면으로 돌아갑니다.
    window.location.href = '../Main/index.html';
}