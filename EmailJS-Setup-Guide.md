# 📱 EmailJS SMS 알림 설정 가이드

견적 요청이 들어올 때마다 즉시 휴대폰으로 알림을 받을 수 있도록 EmailJS를 설정하는 방법입니다.

## 🚀 1단계: EmailJS 계정 생성

1. [EmailJS 웹사이트](https://www.emailjs.com/)에 접속
2. **Sign Up** 클릭하여 무료 계정 생성
3. 이메일 인증 완료

## 📧 2단계: 이메일 서비스 연결

1. **Dashboard**에서 **Add New Service** 클릭
2. **Gmail** 또는 사용하는 이메일 서비스 선택
3. 계정 연결 및 권한 승인
4. **Service ID** 기록해두기 (예: `service_gmail123`)

## 📝 3단계: 이메일 템플릿 생성

1. **Email Templates** 탭 클릭
2. **Create New Template** 클릭
3. 다음 템플릿 사용:

```
제목: 🏠 새로운 견적 요청 - {{customer_name}}님

내용:
새로운 견적 요청이 접수되었습니다!

📞 고객 정보:
- 성함: {{customer_name}}
- 연락처: {{phone}}
- 이메일: {{email}}

🏠 프로젝트 정보:
- 공간 유형: {{space_type}}
- 평수: {{size}}
- 예산: {{budget}}
- 희망 완공일: {{timeline}}

💬 요청사항:
{{message}}

⏰ 접수 시간: {{submit_time}}

---
프리미엄 인테리어 견적 시스템
```

4. **Save** 클릭
5. **Template ID** 기록해두기 (예: `template_abc123`)

## 🔑 4단계: Public Key 확인

1. **Account** > **General** 탭
2. **Public Key** 복사하여 기록

## ⚙️ 5단계: 웹사이트 설정

`script.js` 파일에서 다음 부분을 수정:

```javascript
const EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY',     // 4단계에서 복사한 키
    serviceId: 'YOUR_SERVICE_ID',     // 2단계에서 기록한 Service ID
    templateId: 'YOUR_TEMPLATE_ID'    // 3단계에서 기록한 Template ID
};
```

예시:
```javascript
const EMAILJS_CONFIG = {
    publicKey: 'user_Xm9K7L2nP1Q8R5S6',
    serviceId: 'service_gmail123',
    templateId: 'template_abc123'
};
```

## 📱 6단계: 휴대폰 알림 설정

### Gmail 사용 시:
1. **Gmail 앱** 설치
2. **설정** > **알림** > **이메일 알림** 켜기
3. **중요** 메일로 분류되도록 필터 설정

### 아이폰 메일 앱 사용 시:
1. **설정** > **메일** > **알림**
2. **푸시 알림** 켜기
3. **소리** 및 **진동** 설정

## 🔔 7단계: 테스트

1. 웹사이트에서 견적 요청 테스트
2. 이메일 수신 확인
3. 휴대폰 알림 확인

## 💰 요금 정보

- **무료 플랜**: 월 200회 전송
- **개인 플랜**: 월 $15 (월 1,000회)
- **비즈니스 플랜**: 월 $50 (월 10,000회)

## 🔄 업그레이드 옵션

### Phase 2: Zapier 자동화 (월 $19.99)
- EmailJS → Zapier → SMS 서비스 연동
- 코딩 없이 설정 가능
- 즉시 SMS 발송

### Phase 3: CoolSMS API (건당 15원)
```javascript
// CoolSMS API 예시
const coolsms = require('coolsms-node-sdk').default;
const messageService = new coolsms(API_KEY, API_SECRET);

await messageService.sendOne({
    to: '01012345678',
    from: '02-1234-5678',
    text: `새 견적요청: ${customer_name}님 (${phone})`
});
```

## 🛠️ 문제 해결

### 이메일이 안 와요
1. **스팸 폴더** 확인
2. EmailJS **Usage** 탭에서 전송 로그 확인
3. 브라우저 **개발자 도구**에서 오류 메시지 확인

### 휴대폰 알림이 안 와요
1. 이메일 앱 **알림 설정** 재확인
2. 방해금지 모드 해제
3. 이메일 **중요도** 설정 확인

## 📞 추가 지원

궁금한 점이 있으시면:
- EmailJS 공식 문서: https://www.emailjs.com/docs/
- 카카오톡 문의: (업체 카카오톡 채널)
- 전화 문의: 02-1234-5678

---
**설정 완료 후 견적 요청이 실시간으로 휴대폰에 알림됩니다! 🎉**
