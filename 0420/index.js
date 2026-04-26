// 요소들의 페이드인 효과를 위한 Intersection Observer 설정
document.addEventListener("DOMContentLoaded", () => {
    // 1. 스크롤 시 페이드인 애니메이션
    const fadeElements = document.querySelectorAll(".fade-in");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
    
    // 2. 네비게이션 링크를 위한 부드러운 스크롤 효과 + 모바일 메뉴 닫기
    const menuToggle = document.getElementById("mobile-menu");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            menuToggle.classList.toggle("active");
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // 모바일 메뉴가 열려있다면 닫기
            if (navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
                menuToggle.classList.remove("active");
            }

            const targetId = this.getAttribute('href').substring(1);
            const targetElem = document.getElementById(targetId);
            if (targetElem) {
                const headerOffset = 80;
                const elementPosition = targetElem.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 3. 타임라인 카드 호버 시 배경 변경
    const timelineCards = document.querySelectorAll(".timeline-card");
    const bgOverlay = document.getElementById("bootcamp-bg");

    timelineCards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            // data-id 속성에서 ID 추출
            const bgId = card.getAttribute("data-id");
            if (bgId) {
                // 기존 배경 클래스 제거
                bgOverlay.className = "bootcamp-bg";
                // 새로운 배경 클래스 추가
                bgOverlay.classList.add(`bg-${bgId}`);
                bgOverlay.classList.add("active");
                
            }
        });

        card.addEventListener("mouseleave", () => {
            bgOverlay.classList.remove("active");
        });
    });

    // 4. 모달 바깥 영역 클릭 시 모달 닫기
    window.onclick = function(event) {
        const academicModal = document.getElementById("academic-modal");
        if (event.target == academicModal) {
            closeAcademicModal();
        }
    }

    // 5. 홈 배경 슬라이더 로직
    const homeSlides = document.querySelectorAll(".home-bg-slider .slide");
    if (homeSlides.length > 0) {
        let currentSlide = 0;
        
        // 초기 슬라이드 활성화
        homeSlides[0].classList.add("active");
        
        function nextSlide() {
            // 현재 슬라이드를 prev로 변경 (왼쪽으로 퇴장)
            homeSlides[currentSlide].classList.remove("active");
            homeSlides[currentSlide].classList.add("prev");
            
            const prevIndex = currentSlide;
            currentSlide = (currentSlide + 1) % homeSlides.length;
            
            // 다음 슬라이드를 active로 변경 (오른쪽에서 등장)
            homeSlides[currentSlide].classList.remove("prev");
            homeSlides[currentSlide].classList.add("active");
            
            // 퇴장한 슬라이드가 다시 오른쪽 대기 상태로 돌아가도록 일정 시간 후 초기화
            setTimeout(() => {
                homeSlides[prevIndex].classList.remove("prev");
            }, 1500); // CSS transition 시간과 동일하게 설정
        }
        
        // 3초 간격으로 실행
        setInterval(nextSlide, 3000);
    }
});

// 부트캠프 타임라인 모달을 위한 데이터 로직
const modalData = {
    'python': {
        title: "파이썬 프로그래밍",
        desc: "판다스(Pandas)와 시각화 툴을 활용하여 센서 및 공정 로그 데이터를 수집하고 이상 징후를 판별하는 자동화 스크립트를 구현했습니다. 이 역량은 장비 Parameter 분석을 획기적으로 단축시킵니다."
    },
    'plc': {
        title: "PLC 제어",
        desc: "미쓰비시(Mitsubishi) 및 LS산전 PLC를 다루며 각종 센서 및 액추에이터의 래더 프로그래밍(Ladder Programming)을 수행했습니다. 장비 시퀀스의 최적화와 에러 검출 로직을 직접 세팅할 수 있습니다."
    },
    'pc': {
        title: "PC 기반 제어",
        desc: "비전 시스템과 모터를 연동하여 고정밀 타겟팅을 수행하고 HMI 기반의 직관적인 사용자 조작 패널을 설계했습니다. C#과 C++을 활용한 강력한 실시간 제어 경험입니다."
    },
    'micro-beg': {
        title: "반도체 소자 및 공정 기초",
        desc: "반도체 8대 공정의 시작부터 집적 회로가 완성되기까지의 물리/화학적 원리를 학습했습니다. 단순히 기계를 돌리는 것이 아닌, '어떤 공정이 이루어지는가'를 이해하고 장비 이슈에 접근합니다."
    },
    'micro-int': {
        title: "반도체 설비 유지보수 실무",
        desc: "기계, 전자, 소프트웨어 지식을 총동원하여 가상의 장비 에러 시나리오를 해결하는 Troubleshooting 훈련입니다. 장비 다운타임을 최소화하는 핵심 실무 능력을 갖췄습니다."
    },
    'micro-adv': {
        title: "반도체 장비 S/W 운용",
        desc: "Big Data 분석과 예방 보전(Predictive Maintenance) 모델링 기법을 학습했습니다. 부품의 교체 주기를 정확히 짚어내고 팹(Fab) 운영 효율을 극대화하는 솔루션을 도출합니다."
    }
};



// 학업 로드맵 상세 모달 열기/닫기
function showAcademicDetail(id) {
    const modal = document.getElementById("academic-modal");
    const title = document.getElementById("modal-title");
    const desc = document.getElementById("modal-desc");

    if (modalData[id]) {
        title.innerText = modalData[id].title;
        desc.innerText = modalData[id].desc;
        modal.style.display = "flex";
    }
}

// 자격증 상세 모달 데이터
const certData = {
    'semicon': {
        title: "반도체설비보전기능사",
        icon: "fa-wrench",
        info: "반도체 제조 공정의 핵심 장비인 노광, 식각, 증착, 이온주입 장비 등을 최상의 컨디션으로 유지하기 위한 전문 자격입니다. 설비의 기계적 메커니즘 분석, 유공압 제어, 전기회로 구성 및 트러블슈팅 능력을 검증합니다.",
        industry: "삼성전자, SK하이닉스 등 반도체 제조사(Fab) 및 ASML, AMAT, TEL 등 글로벌 반도체 장비사의 메인터넌스 및 CS 엔지니어 직무에서 필수적으로 활용됩니다.",
        tags: ["#설비보전", "#트러블슈팅", "#8대공정장비", "#유공압제어"]
    },
    'sw': {
        title: "CSWA / CSWP (SOLIDWORKS)",
        icon: "fa-cube",
        info: "다쏘시스템에서 주관하는 글로벌 공인 국제 자격증으로, 3D CAD 소프트웨어인 솔리드웍스 활용 능력을 증명합니다. 파트 모델링, 복잡한 어셈블리 설계, 도면 생성 및 엔지니어링 분석 역량을 평가합니다.",
        industry: "로봇 기구 설계, 반도체 장비 파츠 역설계, 자동차 및 정밀 기계 부품 설계 분야에서 광범위하게 활용됩니다. 특히 장비의 유지보수 시 부품 개선 및 커스텀 파츠 제작에 핵심적인 역할을 합니다.",
        tags: ["#3D_CAD", "#기구설계", "#역설계", "#기계제도"]
    },
    'safety': {
        title: "산업안전산업기사",
        icon: "fa-shield-halved",
        info: "산업 현장의 유해·위험 요인을 파악하고 안전 대책을 수립하는 전문 인력임을 증명합니다. 안전 규정 준수, 위험성 평가, 보호구 관리 및 비상 대응 시스템 구축 능력을 갖추고 있음을 나타냅니다.",
        industry: "클린룸 내 화학 물질 및 고전압 설비를 다루는 반도체 라인에서 '안전 최우선' 원칙을 실현하는 데 필수적입니다. 모든 제조 기업의 안전관리자 선임 및 현장 엔지니어의 안전 역량으로 높게 평가받습니다.",
        tags: ["#현장안전", "#위험성평가", "#안전관리", "#법규준수"]
    }
};

function showCertDetail(id) {
    const modal = document.getElementById("cert-modal");
    const title = document.getElementById("cert-title");
    const icon = document.getElementById("cert-icon");
    const info = document.getElementById("cert-info");
    const industry = document.getElementById("cert-industry");
    const tagsContainer = document.getElementById("cert-tags");

    if (certData[id]) {
        title.innerText = certData[id].title;
        icon.className = `fa-solid ${certData[id].icon}`;
        info.innerText = certData[id].info;
        industry.innerText = certData[id].industry;
        
        // 태그 초기화 및 추가
        tagsContainer.innerHTML = '';
        certData[id].tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag accent';
            span.innerText = tag;
            tagsContainer.appendChild(span);
        });

        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
}

function closeCertModal() {
    const modal = document.getElementById("cert-modal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// 전역 등록
window.showCertDetail = showCertDetail;
window.closeCertModal = closeCertModal;

// 학업 로드맵 상세 모달 열기/닫기
function closeAcademicModal() {
    const modal = document.getElementById("academic-modal");
    if (modal) {
        modal.style.display = "none";
    }
}
window.closeAcademicModal = closeAcademicModal;

// 이미지 상세 모달 열기/닫기
function openImageModal(src) {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    if (modal && modalImg) {
        modalImg.src = src;
        modal.style.display = "flex";
        document.body.style.overflow = "hidden"; // 스크롤 방지
    }
}

function closeImageModal() {
    const modal = document.getElementById("image-modal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // 스크롤 다시 허용
    }
}

// 성장 과정 학년별 전환 함수 (개선된 크로스페이드 버전)
function switchGrowthYear(index) {
    const buttons = document.querySelectorAll(".growth-btn");
    const mainImg = document.getElementById("growth-main-img");
    const detailImg = document.getElementById("growth-detail-img");

    // 이미 활성화된 버튼을 또 누르면 무시
    if (buttons[index].classList.contains("active")) return;

    // 버튼 활성화 상태 변경
    buttons.forEach((btn, i) => {
        btn.classList.toggle("active", i === index);
    });

    // 이미지 경로 설정
    let imagePath = (index === 0) ? "bg/growth_path.jpg" : `bg/year${index}.png`;

    // 크로스페이드 로직
    // 1. 새 이미지를 뒤쪽(detailImg)에 로드
    detailImg.src = imagePath;
    
    // 2. 이미지가 로드되면 실행 (캐시된 경우 즉시 실행될 수도 있음)
    detailImg.onload = () => {
        // 3. 앞쪽 이미지(mainImg)를 페이드 아웃
        mainImg.style.opacity = "0";
        
        // 4. 페이드 아웃이 완료되면 이미지를 교체하고 다시 페이드 인
        setTimeout(() => {
            mainImg.src = imagePath;
            mainImg.style.opacity = "1";
        }, 300); // CSS transition 시간보다 약간 짧게
    };
}
