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

// EmailJS 초기화 (여기에 실제 키를 입력하세요)
const EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY', // EmailJS에서 발급받은 Public Key
    serviceId: 'YOUR_SERVICE_ID', // EmailJS Service ID
    templateId: 'YOUR_TEMPLATE_ID' // EmailJS Template ID
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
                submit_time: new Date().toLocaleString('ko-KR')
            };
            
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
        showNotification('전송 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
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
