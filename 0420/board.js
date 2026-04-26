// --- Firebase Config 및 초기화 ---
const firebaseConfig = {
  apiKey: "AIzaSyAwbYGmJxOSQ5Hk76SEVmWngK7dL3HUxzI",
  authDomain: "ppt-e24a8.firebaseapp.com",
  projectId: "ppt-e24a8",
  storageBucket: "ppt-e24a8.firebasestorage.app",
  messagingSenderId: "448447445954",
  appId: "1:448447445954:web:1794a0e48edd4a2af5745b",
  measurementId: "G-7Z9VQG3J4S"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const boardCol = db.collection('boardPosts');

let currentPostId = null;
let allPosts = [];

// --- 게시판 로직 ---

document.addEventListener("DOMContentLoaded", () => {
    // 실시간 게시판 리스너 연결
    listenToPosts();

    // 게시판 폼 제출 핸들러
    const boardForm = document.getElementById("board-form");
    if (boardForm) {
        boardForm.addEventListener("submit", savePost);
    }
});

// 실시간 데이터 수신 및 렌더링
function listenToPosts() {
    boardCol.orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
        allPosts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        renderPosts(allPosts);
    }, (error) => {
        console.error("Firebase Error:", error);
        alert("데이터를 불러오는 중 오류가 발생했습니다. Firestore 규칙을 확인해주세요.");
    });
}

// 게시글 목록 렌더링
function renderPosts(posts) {
    const boardBody = document.getElementById('board-body');
    if (!boardBody) return;

    boardBody.innerHTML = '';

    if (posts.length === 0) {
        boardBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:3rem; color:#b0b0b0;">등록된 게시글이 없습니다. 첫 글을 남겨보세요!</td></tr>';
        return;
    }

    posts.forEach((post, index) => {
        const tr = document.createElement('tr');
        tr.onclick = () => readPost(post.id);
        tr.innerHTML = `
            <td>${posts.length - index}</td>
            <td>${post.title}</td>
            <td>${post.author}</td>
            <td>${post.date}</td>
        `;
        boardBody.appendChild(tr);
    });
}

// 뷰 전환 함수들
function showBoardList() {
    document.getElementById('board-list-view').style.display = 'block';
    document.getElementById('board-write-view').style.display = 'none';
    document.getElementById('board-read-view').style.display = 'none';
    window.scrollTo(0, 0);
}

function showBoardWrite(isEdit = false) {
    document.getElementById('board-list-view').style.display = 'none';
    document.getElementById('board-write-view').style.display = 'block';
    document.getElementById('board-read-view').style.display = 'none';
    window.scrollTo(0, 0);
    
    const formTitle = document.getElementById('board-form-title');
    if (!isEdit) {
        formTitle.innerText = '게시글 작성';
        document.getElementById('board-form').reset();
        document.getElementById('edit-id').value = '';
        document.getElementById('board-password').readOnly = false;
        document.getElementById('board-password').placeholder = '수정/삭제 시 필요';
    } else {
        formTitle.innerText = '게시글 수정';
        document.getElementById('board-password').readOnly = true; 
        document.getElementById('board-password').placeholder = '패스워드는 수정할 수 없습니다';
    }
}

function readPost(id) {
    const post = allPosts.find(p => p.id === id);
    if (!post) return;

    currentPostId = id;
    document.getElementById('read-title').innerText = post.title;
    document.getElementById('read-author').innerText = post.author;
    document.getElementById('read-date').innerText = post.date;
    document.getElementById('read-content').innerText = post.content;

    document.getElementById('board-list-view').style.display = 'none';
    document.getElementById('board-write-view').style.display = 'none';
    document.getElementById('board-read-view').style.display = 'block';
    window.scrollTo(0, 0);
}

// 게시글 저장 (Firebase 연동)
async function savePost(e) {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const author = document.getElementById('board-author').value;
    const title = document.getElementById('board-title').value;
    const password = document.getElementById('board-password').value;
    const content = document.getElementById('board-content').value;
    const date = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });

    try {
        if (id) {
            // 수정
            await boardCol.doc(id).update({
                author,
                title,
                content,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                date: date + ' (수정됨)'
            });
        } else {
            // 신규 작성
            await boardCol.add({
                author,
                title,
                password,
                content,
                date,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        alert('저장되었습니다.');
        showBoardList();
    } catch (error) {
        console.error("Save Error:", error);
        alert('저장에 실패했습니다. 관리자에게 문의하세요.');
    }
}

// 수정 모드 진입
function editPost() {
    const post = allPosts.find(p => p.id === currentPostId);
    if (!post) return;

    const inputPw = prompt('게시글 비밀번호를 입력해주세요:');
    if (inputPw !== post.password) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    document.getElementById('edit-id').value = post.id;
    document.getElementById('board-author').value = post.author;
    document.getElementById('board-title').value = post.title;
    document.getElementById('board-password').value = post.password;
    document.getElementById('board-content').value = post.content;

    showBoardWrite(true);
}

// 게시글 삭제
async function deletePost() {
    const post = allPosts.find(p => p.id === currentPostId);
    if (!post) return;

    const inputPw = prompt('게시글 비밀번호를 입력해주세요:');
    if (inputPw !== post.password) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    if (!confirm('정말로 이 글을 삭제하시겠습니까?')) return;

    try {
        await boardCol.doc(currentPostId).delete();
        alert('삭제되었습니다.');
        showBoardList();
    } catch (error) {
        console.error("Delete Error:", error);
        alert('삭제에 실패했습니다.');
    }
}

// 전역 함수 등록 (onclick 핸들러 대응)
window.showBoardWrite = showBoardWrite;
window.showBoardList = showBoardList;
window.readPost = readPost;
window.editPost = editPost;
window.deletePost = deletePost;
