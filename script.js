// 전역 변수
let isMenuOpen = false;

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 앱 초기화
function initializeApp() {
    initializeNavigation();
    initializePortfolioFilter();
    initializeContactForm();
    initializeScrollAnimations();
    initializeSmoothScroll();
    initializeHeaderScroll();
    initializeEmailJS();
}

// 네비게이션 초기화
function initializeNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        
        // 네비게이션 링크 클릭 시 모바일 메뉴 닫기
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
}

// 모바일 메뉴 토글
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle i');
    
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        nav.style.display = 'block';
        nav.style.position = 'absolute';
        nav.style.top = '100%';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.background = 'white';
        nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        nav.style.padding = '1rem';
        nav.style.borderRadius = '0 0 8px 8px';
        
        nav.querySelector('ul').style.flexDirection = 'column';
        nav.querySelector('ul').style.gap = '1rem';
        
        mobileMenuToggle.className = 'fas fa-times';
    } else {
        closeMobileMenu();
    }
}

// 모바일 메뉴 닫기
function closeMobileMenu() {
    const nav = document.querySelector('.nav');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle i');
    
    if (window.innerWidth <= 768) {
        nav.style.display = 'none';
        mobileMenuToggle.className = 'fas fa-bars';
        isMenuOpen = false;
    }
}

// 포트폴리오 필터 초기화
function initializePortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // 활성 버튼 변경
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 포트폴리오 아이템 필터링
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// 연락처 폼 초기화
function initializeContactForm() {
    const form = document.getElementById('consultation-form');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // 실시간 폼 유효성 검사
        const requiredFields = form.querySelectorAll('input[required], select[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', validateField);
            field.addEventListener('input', clearFieldError);
        });
        
        // 전화번호 자동 포맷팅
        const phoneField = document.getElementById('phone');
        if (phoneField) {
            phoneField.addEventListener('input', formatPhoneNumber);
        }
    }
}

// EmailJS 초기화 (모든 설정 완료!)
const EMAILJS_CONFIG = {
    publicKey: 'AgrxmQcyLlQD4L_LO', // Account > General에서 확인한 Public Key
    serviceId: 'service_2svsbgs', // 확인된 Service ID  
    templateId: 'template_tgpcymp' // 올바른 Template ID
};

// EmailJS 초기화
function initializeEmailJS() {
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
}

// 폼 제출 처리
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // 폼 유효성 검사
    if (!validateForm(form)) {
        showNotification('필수 항목을 모두 입력해주세요.', 'error');
        return;
    }
    
    // 로딩 상태 표시
    form.classList.add('loading');
    const submitButton = form.querySelector('.btn-submit');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 전송 중...';
    
    try {
        // EmailJS로 이메일 전송
        if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
            const templateParams = {
                customer_name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email') || '미입력',
                space_type: formData.get('space-type'),
                size: formData.get('size') || '미입력',
                budget: formData.get('budget') || '미입력',
                timeline: formData.get('timeline') || '미입력',
                message: formData.get('message') || '없음',
                submit_time: new Date().toLocaleString('ko-KR'),
                to_email: 'hgpark@goldenrabbit.co.kr' // 수신 이메일 주소
            };
            
            // EmailJS 전송 준비 완료!
            
            await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams);
            
            showNotification('견적 요청이 성공적으로 전송되었습니다. 24시간 내에 연락드리겠습니다.', 'success');
            form.reset();
        } else {
            // EmailJS가 설정되지 않은 경우 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 2000));
            showNotification('견적 요청이 접수되었습니다. EmailJS 설정을 완료하면 실제 전송됩니다.', 'success');
            form.reset();
        }
        
        // Google Analytics 이벤트 추적 (선택사항)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'form_name': 'consultation_request'
            });
        }
        
    } catch (error) {
        console.error('EmailJS 전송 오류:', error);
        
        // 템플릿 ID 오류인 경우 구체적인 안내
        if (error.text && error.text.includes('template ID not found')) {
            showNotification('템플릿 설정을 확인해주세요. 관리자에게 문의하시면 빠르게 해결해드리겠습니다.', 'warning');
            
            // 관리자용 정보 콘솔 출력
            console.log('템플릿 ID 확인 필요:', EMAILJS_CONFIG.templateId);
            console.log('고객 정보:', {
                name: formData.get('name'),
                phone: formData.get('phone'),
                space_type: formData.get('space-type'),
                message: formData.get('message')
            });
        } else {
            showNotification('전송 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
        }
    } finally {
        form.classList.remove('loading');
        submitButton.innerHTML = originalText;
    }
}

// 폼 유효성 검사
function validateForm(form) {
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

// 개별 필드 유효성 검사
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    // 기존 에러 메시지 제거
    clearFieldError(e);
    
    let isValid = true;
    let errorMessage = '';
    
    // 필수 필드 검사
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = '필수 입력 항목입니다.';
    }
    
    // 이메일 형식 검사
    if (fieldType === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = '올바른 이메일 형식을 입력해주세요.';
    }
    
    // 전화번호 형식 검사
    if (fieldName === 'phone' && value && !isValidPhoneNumber(value)) {
        isValid = false;
        errorMessage = '올바른 전화번호를 입력해주세요.';
    }
    
    // 에러 표시
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// 필드 에러 표시
function showFieldError(field, message) {
    field.style.borderColor = '#e74c3c';
    
    // 에러 메시지 요소 생성 또는 업데이트
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.9rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.display = 'block';
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

// 필드 에러 제거
function clearFieldError(e) {
    const field = e.target;
    field.style.borderColor = '#e9ecef';
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 전화번호 유효성 검사
function isValidPhoneNumber(phone) {
    const phoneRegex = /^[0-9-]{10,13}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

// 전화번호 자동 포맷팅
function formatPhoneNumber(e) {
    const field = e.target;
    let value = field.value.replace(/[^0-9]/g, '');
    
    if (value.length >= 11) {
        value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (value.length >= 7) {
        value = value.replace(/(\d{3})(\d{4})/, '$1-$2');
    }
    
    field.value = value;
}

// 스크롤 애니메이션 초기화
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들
    const animationElements = document.querySelectorAll(
        '.feature, .service-card, .portfolio-item, .contact-item, .stat'
    );
    
    animationElements.forEach(element => {
        observer.observe(element);
    });
}

// 부드러운 스크롤 초기화
function initializeSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 모바일 메뉴가 열려있다면 닫기
                closeMobileMenu();
            }
        });
    });
}

// 헤더 스크롤 효과 초기화
function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#ffffff';
            header.style.backdropFilter = 'none';
        }
        
        // 스크롤 방향에 따른 헤더 숨김/표시
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// 알림 표시
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // 스타일 적용
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: getNotificationColor(type),
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        zIndex: '10000',
        maxWidth: '400px',
        animation: 'slideInRight 0.3s ease forwards'
    });
    
    // 알림 내용 스타일
    const content = notification.querySelector('.notification-content');
    Object.assign(content.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    });
    
    // 닫기 버튼 스타일
    const closeButton = notification.querySelector('.notification-close');
    Object.assign(closeButton.style, {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        marginLeft: 'auto',
        padding: '0.25rem'
    });
    
    // 이벤트 리스너
    closeButton.addEventListener('click', () => {
        notification.remove();
    });
    
    // DOM에 추가
    document.body.appendChild(notification);
    
    // 5초 후 자동 제거
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// 알림 아이콘 반환
function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// 알림 색상 반환
function getNotificationColor(type) {
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    return colors[type] || colors.info;
}

// 윈도우 리사이즈 이벤트
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const nav = document.querySelector('.nav');
        nav.style.display = 'flex';
        nav.style.position = 'static';
        nav.style.background = 'none';
        nav.style.boxShadow = 'none';
        nav.style.padding = '0';
        
        nav.querySelector('ul').style.flexDirection = 'row';
        nav.querySelector('ul').style.gap = '2rem';
        
        isMenuOpen = false;
    } else {
        closeMobileMenu();
    }
});

// CSS 키프레임 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 페이지 로드 완료 후 초기 애니메이션
window.addEventListener('load', function() {
    // 히어로 섹션 애니메이션
    const heroContent = document.querySelector('.hero-content');
    const heroBadge = document.querySelector('.hero-badge');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroStats = document.querySelector('.hero-stats');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroFeatures = document.querySelector('.hero-features');
    
    // 순차적 애니메이션
    const animationDelay = 200;
    const elements = [heroBadge, heroTitle, heroSubtitle, heroStats, heroButtons, heroFeatures];
    
    elements.forEach((element, index) => {
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * animationDelay);
        }
    });
    
    // 배경 이미지 부드러운 로딩
    const heroBackground = document.querySelector('.hero-background img');
    if (heroBackground) {
        heroBackground.style.opacity = '0';
        heroBackground.style.transition = 'opacity 1s ease';
        
        setTimeout(() => {
            heroBackground.style.opacity = '1';
        }, 100);
    }
});

// 성능 최적화: 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 스크롤 이벤트 디바운스 적용
const debouncedScrollHandler = debounce(function() {
    // 스크롤 관련 추가 기능이 필요한 경우 여기에 구현
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// 포트폴리오 상세 데이터
const portfolioData = {
    living1: {
        title: "모던 거실 리모델링",
        images: [
            "https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        location: "서울시 강남구",
        size: "32평",
        duration: "3주",
        budget: "2,800만원",
        description: "기존의 답답했던 거실을 개방감 있는 모던한 공간으로 완전히 탈바꿈시킨 프로젝트입니다. 천장을 높이고 대형 창문을 활용하여 자연광이 풍부하게 들어오도록 설계했으며, 미니멀한 가구와 중성톤 컬러로 세련된 분위기를 연출했습니다.",
        features: [
            "천장 높이 확장으로 개방감 극대화",
            "대형 슬라이딩 도어로 베란다와 연결",
            "숨겨진 LED 조명으로 간접조명 연출",
            "맞춤 제작 TV 벽면 및 수납공간",
            "바닥난방 시스템 전면 교체"
        ],
        materials: [
            { name: "바닥재", brand: "독일산 프리미엄 LVT" },
            { name: "벽지", brand: "이태리 수입 벽지" },
            { name: "조명", brand: "필립스 스마트 LED" },
            { name: "가구", brand: "맞춤 제작 원목가구" }
        ],
        rating: 5,
        review: "기대했던 것보다 훨씬 더 멋진 공간이 되었어요. 특히 조명 디자인이 정말 예술적이고, 가족들이 모두 만족해합니다. 시공 기간도 약속을 잘 지켜주셨고, 깔끔하게 마무리해주셔서 감사합니다.",
        author: "김○○님 (강남구)"
    },
    
    kitchen1: {
        title: "럭셔리 주방 인테리어",
        images: [
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        location: "서울시 서초구",
        size: "주방 12평",
        duration: "4주",
        budget: "4,200만원",
        description: "요리를 사랑하는 고객을 위해 기능성과 미학을 완벽하게 조화시킨 럭셔리 주방입니다. 프리미엄 가전제품과 인조대리석 상판, 맞춤 제작 수납장으로 최고급 주방을 완성했습니다.",
        features: [
            "아일랜드형 주방으로 공간 활용 극대화",
            "독일산 프리미엄 가전제품 설치",
            "인조대리석 일체형 상판 시공",
            "LED 라인조명으로 작업공간 밝기 확보",
            "팬트리 공간 별도 설계"
        ],
        materials: [
            { name: "상판", brand: "듀폰 코리안 인조대리석" },
            { name: "싱크대", brand: "독일 BLANCO" },
            { name: "가전", brand: "밀레(Miele) 빌트인" },
            { name: "수납장", brand: "맞춤 제작 우드" }
        ],
        rating: 5,
        review: "요리하는 것이 이렇게 즐거울 줄 몰랐어요! 동선도 완벽하고 수납공간도 충분해서 정말 만족스럽습니다. 친구들이 와서 모두 부러워해요.",
        author: "박○○님 (서초구)"
    },
    
    bedroom1: {
        title: "모던 침실 인테리어",
        images: [
            "images/bedroom.jpeg",
            "https://images.unsplash.com/photo-1571508601495-98ba5f622dbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        location: "경기도 분당구",
        size: "침실 10평",
        duration: "2주",
        budget: "1,800만원",
        description: "현재 시공 중인 모던 침실 프로젝트입니다. 따뜻한 우드톤과 세련된 조명으로 편안하면서도 고급스러운 휴식 공간을 만들어가고 있습니다. 트랙 조명과 펜던트 조명의 조화로 다양한 분위기 연출이 가능합니다.",
        features: [
            "트랙 조명 시스템으로 분위기 조절",
            "맞춤 제작 헤드보드 및 수납공간",
            "우드 포인트 벽면 시공",
            "블랙아웃 커튼으로 완벽한 차광",
            "바닥 간접조명 설치"
        ],
        materials: [
            { name: "바닥재", brand: "천연 오크 원목" },
            { name: "벽면", brand: "친환경 수성페인트" },
            { name: "조명", brand: "북유럽 디자인 조명" },
            { name: "가구", brand: "이태리 수입 침구" }
        ],
        rating: 5,
        review: "아직 시공 중이지만 벌써부터 너무 만족스러워요. 조명 디자인이 정말 예술 같고, 세심한 부분까지 신경써주셔서 감사합니다.",
        author: "이○○님 (분당구)"
    },
    
    bathroom1: {
        title: "스파 같은 욕실",
        images: [
            "https://images.unsplash.com/photo-1571508601655-26ba9d4aec0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        location: "서울시 용산구",
        size: "욕실 5평",
        duration: "3주",
        budget: "3,500만원",
        description: "호텔 스파를 연상시키는 럭셔리 욕실로 리모델링했습니다. 대리석 패턴의 타일과 레인샤워, 욕조가 조화를 이루어 매일 스파에 온 듯한 느낌을 선사합니다.",
        features: [
            "대형 레인샤워 시스템 설치",
            "독립형 욕조로 휴식공간 연출",
            "대리석 패턴 포셀린 타일 시공",
            "스마트 거울 및 조명 시스템",
            "바닥 및 거울 열선 설치"
        ],
        materials: [
            { name: "타일", brand: "이태리 포셀린 타일" },
            { name: "욕조", brand: "독일 Kaldewei" },
            { name: "샤워기", brand: "한스그로에 레인샤워" },
            { name: "조명", brand: "방수 LED 조명" }
        ],
        rating: 5,
        review: "정말 집에서 스파를 즐기는 기분이에요. 욕조에서 바라보는 뷰도 좋고, 샤워할 때 기분이 너무 좋아져요. 최고의 선택이었습니다!",
        author: "최○○님 (용산구)"
    },
    
    office1: {
        title: "모던 오피스 공간",
        images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        location: "서울시 강남구",
        size: "사무실 25평",
        duration: "2주",
        budget: "2,200만원",
        description: "효율적이고 세련된 업무 환경을 위한 모던 오피스 인테리어입니다. 개방형 구조와 스마트 조명, ergonomic 가구로 직원들의 업무 효율성과 만족도를 높였습니다.",
        features: [
            "개방형 업무공간 설계",
            "회의실 유리 파티션 설치",
            "스마트 조명 제어 시스템",
            "에르고노믹 업무용 가구",
            "브랜드 컬러 포인트 디자인"
        ],
        materials: [
            { name: "바닥재", brand: "상업용 LVT 타일" },
            { name: "파티션", brand: "강화유리 시스템" },
            { name: "가구", brand: "Herman Miller" },
            { name: "조명", brand: "Philips 스마트 LED" }
        ],
        rating: 5,
        review: "직원들 모두 새로운 사무실을 정말 좋아해요. 업무 효율도 높아지고 분위기도 밝아졌습니다. 클라이언트들도 사무실을 보고 깜짝 놀라요.",
        author: "김○○님 (IT회사 대표)"
    },
    
    bedroom2: {
        title: "프리미엄 침실 조명 시공",
        images: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        location: "서울시 마포구",
        size: "침실 12평",
        duration: "10일",
        budget: "1,200만원",
        description: "트랙 조명과 펜던트 조명을 활용한 프리미엄 침실 조명 시공 프로젝트입니다. 다양한 상황에 맞는 조명 연출로 침실의 분위기를 극대화했습니다.",
        features: [
            "트랙 조명으로 spotlight 연출",
            "베드사이드 펜던트 조명",
            "디밍 기능으로 밝기 조절",
            "간접조명으로 부드러운 분위기",
            "스마트 스위치 시스템"
        ],
        materials: [
            { name: "트랙조명", brand: "독일 SLV 브랜드" },
            { name: "펜던트", brand: "북유럽 디자인" },
            { name: "LED전구", brand: "Philips Hue" },
            { name: "스위치", brand: "정전식 터치스위치" }
        ],
        rating: 5,
        review: "조명만 바꿨는데 완전히 다른 공간이 된 것 같아요. 책 읽을 때, 잠들 때 등 상황에 맞게 조명을 조절할 수 있어서 너무 만족해요.",
        author: "정○○님 (마포구)"
    },
    
    living2: {
        title: "클래식 거실 디자인",
        images: [
            "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        location: "서울시 송파구",
        size: "거실 28평",
        duration: "4주",
        budget: "3,800만원",
        description: "클래식의 우아함을 현대적으로 재해석한 고급스러운 거실 공간입니다. 고급 원목 가구와 앤틱 소품, 샹들리에가 어우러져 품격 있는 공간을 연출했습니다.",
        features: [
            "클래식 몰딩 천장 시공",
            "원목 맞춤 가구 제작",
            "크리스탈 샹들리에 설치",
            "페르시안 러그 및 커튼 코디",
            "벽난로 스타일 포인트 벽면"
        ],
        materials: [
            { name: "가구", brand: "유럽산 원목 앤틱" },
            { name: "조명", brand: "크리스탈 샹들리에" },
            { name: "러그", brand: "페르시안 핸드메이드" },
            { name: "커튼", brand: "실크 블렌드 원단" }
        ],
        rating: 5,
        review: "정말 궁전에 온 것 같은 기분이에요. 클래식한 느낌을 원했는데 과하지 않게 세련되게 해주셔서 감사합니다. 손님들이 오면 모두 감탄해요.",
        author: "윤○○님 (송파구)"
    }
};

// 포트폴리오 모달 열기
function openPortfolioModal(projectId) {
    const project = portfolioData[projectId];
    if (!project) return;
    
    const modal = document.getElementById('portfolioModal');
    
    // 모달 내용 업데이트
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalMainImage').src = project.images[0];
    document.getElementById('modalLocation').textContent = project.location;
    document.getElementById('modalSize').textContent = project.size;
    document.getElementById('modalDuration').textContent = project.duration;
    document.getElementById('modalBudget').textContent = project.budget;
    document.getElementById('modalDescription').textContent = project.description;
    
    // 썸네일 이미지 생성
    const thumbnailContainer = document.getElementById('modalThumbnails');
    thumbnailContainer.innerHTML = '';
    project.images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.className = 'thumbnail';
        if (index === 0) thumbnail.classList.add('active');
        thumbnail.onclick = () => changeMainImage(image, thumbnail);
        thumbnailContainer.appendChild(thumbnail);
    });
    
    // 특징 목록 생성
    const featuresList = document.getElementById('modalFeatures');
    featuresList.innerHTML = '';
    project.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
    
    // 자재 정보 생성
    const materialsGrid = document.getElementById('modalMaterials');
    materialsGrid.innerHTML = '';
    project.materials.forEach(material => {
        const materialDiv = document.createElement('div');
        materialDiv.className = 'material-item';
        materialDiv.innerHTML = `
            <div class="material-name">${material.name}</div>
            <div class="material-brand">${material.brand}</div>
        `;
        materialsGrid.appendChild(materialDiv);
    });
    
    // 별점 생성
    const ratingContainer = document.getElementById('modalRating');
    ratingContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.innerHTML = i < project.rating ? '★' : '☆';
        ratingContainer.appendChild(star);
    }
    
    document.getElementById('modalReview').textContent = project.review;
    document.getElementById('modalAuthor').textContent = project.author;
    
    // 모달 표시
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 스크롤 방지
}

// 포트폴리오 모달 닫기
function closePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // 스크롤 복원
}

// 메인 이미지 변경
function changeMainImage(src, thumbnail) {
    document.getElementById('modalMainImage').src = src;
    
    // 썸네일 active 상태 변경
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnail.classList.add('active');
}

// 견적 문의로 스크롤
function scrollToContact() {
    closePortfolioModal();
    
    setTimeout(() => {
        const contactSection = document.getElementById('contact');
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = contactSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }, 300);
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('portfolioModal');
    if (event.target === modal) {
        closePortfolioModal();
    }
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePortfolioModal();
    }
});
