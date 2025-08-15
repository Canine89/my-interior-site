# 인테리어 업체 랜딩 페이지

전문적이고 세련된 인테리어 업체를 위한 반응형 웹사이트입니다.

## 주요 기능

### 🏠 메인 기능
- **전문적인 히어로 섹션**: 강력한 첫인상과 명확한 콜투액션
- **회사 소개**: 신뢰도를 높이는 통계 및 특징 섹션
- **포트폴리오 갤러리**: 시공 사례를 카테고리별로 필터링
- **서비스 소개**: 제공하는 서비스를 명확하게 설명
- **견적 문의 폼**: 고객 정보 수집 및 견적 요청 기능

### 📱 반응형 디자인
- 모바일, 태블릿, 데스크톱 모든 기기에 최적화
- 터치 친화적인 인터페이스
- 모바일 전용 햄버거 메뉴

### ⚡ 성능 최적화
- 부드러운 스크롤 애니메이션
- 지연 로딩 (Lazy Loading)
- 디바운스 적용으로 성능 향상
- 웹 표준 준수

### 🎨 디자인 특징
- 모던하고 깔끔한 UI/UX
- 브랜드 일관성 있는 색상 체계
- 전문성을 강조하는 타이포그래피
- 고급스러운 호버 효과 및 애니메이션

## 파일 구조

```
my-paint-site/
├── index.html          # 메인 HTML 파일
├── styles.css          # CSS 스타일시트
├── script.js           # JavaScript 기능
└── README.md           # 프로젝트 설명서
```

## 사용 방법

### 1. 파일 다운로드
모든 파일을 같은 폴더에 저장합니다.

### 2. 웹 브라우저에서 실행
`index.html` 파일을 더블클릭하거나 웹 브라우저로 드래그하여 실행합니다.

### 3. 로컬 서버 실행 (권장)
더 나은 성능을 위해 로컬 서버를 사용하는 것을 권장합니다:

```bash
# Python 3가 설치된 경우
python -m http.server 8000

# Node.js가 설치된 경우
npx http-server

# Live Server VSCode 확장프로그램 사용
```

## 커스터마이징 가이드

### 회사 정보 변경
`index.html` 파일에서 다음 정보를 수정하세요:

1. **회사명**: `<h1>` 태그의 "프리미엄 인테리어" 부분
2. **연락처**: 전화번호, 이메일, 주소 정보
3. **회사 소개**: about 섹션의 내용

### 색상 변경
`styles.css` 파일의 `:root` 섹션에서 색상 변수를 수정하세요:

```css
:root {
    --primary-color: #2c3e50;    /* 주 색상 */
    --secondary-color: #3498db;  /* 보조 색상 */
    --accent-color: #e74c3c;     /* 강조 색상 */
    --gold-color: #f39c12;       /* 골드 색상 */
}
```

### 이미지 교체
포트폴리오 이미지를 교체하려면:

1. `index.html`에서 Unsplash URL을 실제 이미지 경로로 변경
2. 권장 이미지 크기: 500x300px 이상
3. 웹 최적화 포맷 (WebP, JPEG) 사용 권장

### 폰트 변경
Google Fonts에서 다른 폰트를 사용하려면:

1. `index.html`의 `<head>` 섹션에서 폰트 링크 변경
2. `styles.css`의 `font-family` 속성 수정

## 견적 폼 설정

현재 견적 폼은 클라이언트 사이드에서만 작동합니다. 실제 운영을 위해서는:

### 1. 백엔드 서버 연동
```javascript
// script.js의 handleFormSubmit 함수 수정
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showNotification('견적 요청이 전송되었습니다.', 'success');
        }
    } catch (error) {
        showNotification('전송 중 오류가 발생했습니다.', 'error');
    }
}
```

### 2. 이메일 서비스 연동
- [EmailJS](https://www.emailjs.com/) - 클라이언트 사이드 이메일 전송
- [Formspree](https://formspree.io/) - 폼 데이터 수집 서비스
- [Netlify Forms](https://www.netlify.com/products/forms/) - Netlify 호스팅 시 무료 폼 처리

### 3. Google Analytics 연동
```html
<!-- index.html <head> 섹션에 추가 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 배포 방법

### 1. GitHub Pages
1. GitHub 저장소에 파일 업로드
2. Settings > Pages에서 배포 설정
3. 무료 호스팅 제공

### 2. Netlify
1. [Netlify](https://www.netlify.com/)에 회원가입
2. 파일 드래그 앤 드롭으로 즉시 배포
3. 자동 HTTPS 및 CDN 제공

### 3. Vercel
1. [Vercel](https://vercel.com/)에 회원가입
2. GitHub 연동 또는 직접 파일 업로드
3. 전 세계 CDN을 통한 빠른 로딩

## SEO 최적화 팁

### 1. 메타 태그 추가
```html
<meta name="keywords" content="인테리어, 리모델링, 인테리어업체, 인테리어시공">
<meta property="og:title" content="프리미엄 인테리어 - 전문 인테리어 업체">
<meta property="og:description" content="15년 경력의 전문 인테리어로 꿈꾸던 공간을 현실로">
<meta property="og:image" content="/images/og-image.jpg">
```

### 2. 구조화된 데이터 추가
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "프리미엄 인테리어",
  "telephone": "02-1234-5678",
  "address": "서울시 강남구 테헤란로 123"
}
</script>
```

### 3. 사이트맵 생성
검색 엔진 최적화를 위해 sitemap.xml 파일을 생성하세요.

## 추가 기능 아이디어

- **온라인 견적 계산기**: 평수와 옵션에 따른 예상 견적 제공
- **3D 갤러리**: 360도 파노라마 시공 사례
- **고객 후기 섹션**: 실제 고객 리뷰 및 평점
- **블로그/팁 섹션**: 인테리어 관련 유용한 정보 제공
- **실시간 채팅**: 고객 상담 지원
- **예약 시스템**: 상담 일정 예약 기능

## 브라우저 지원

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- 모바일 브라우저 지원

## 라이선스

이 프로젝트는 개인 및 상업적 용도로 자유롭게 사용 가능합니다.

## 지원

프로젝트 관련 문의사항이나 버그 리포트가 있으시면 GitHub Issues를 통해 연락해주세요.

---

**제작**: AI Assistant  
**버전**: 1.0.0  
**최종 업데이트**: 2024년
