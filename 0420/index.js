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
    
    // 2. 네비게이션 링크를 위한 부드러운 스크롤 효과
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElem = document.getElementById(targetId);
            if (targetElem) {
                targetElem.scrollIntoView({
                    behavior: 'smooth'
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
        
        // 5초 간격으로 실행
        setInterval(nextSlide, 5000);
    }

    // 6. 성장 과정 버튼 호버 기능 (이미지 전환)
    const growthBtns = document.querySelectorAll(".growth-btn");
    const growthImg = document.getElementById("growth-main-img");
    const growthDetailImg = document.getElementById("growth-detail-img");

    const yearImages = {
        '1': 'bg/year1.png',
        '2': 'bg/year2.png',
        '3': 'bg/year3.png'
    };

    growthBtns.forEach(btn => {
        btn.addEventListener("mouseenter", () => {
            const year = btn.getAttribute("data-year");
            if (growthImg && growthDetailImg && yearImages[year]) {
                growthDetailImg.src = yearImages[year];
                growthImg.classList.add("fade-hide");
                growthDetailImg.classList.remove("fade-hide");
            }
        });
        btn.addEventListener("mouseleave", () => {
            if (growthImg && growthDetailImg) {
                growthImg.classList.remove("fade-hide");
                growthDetailImg.classList.add("fade-hide");
            }
        });
    });
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

function closeAcademicModal() {
    const modal = document.getElementById("academic-modal");
    if (modal) {
        modal.style.display = "none";
    }
}
