# Firebase 배포 가이드

## 사전 준비

### 1. Firebase 프로젝트 생성
- [Firebase Console](https://console.firebase.google.com)에 접속
- 새 프로젝트 생성 또는 기존 프로젝트 사용
- 프로젝트 ID 확인: `gen-lang-client-0926456275`

### 2. Firebase CLI 로그인
```bash
firebase login
```

### 3. Firebase 프로젝트 초기화
```bash
firebase init hosting --project gen-lang-client-0926456275
```

## 배포 단계

### 1. 프로젝트 빌드
```bash
npm install
npm run build
```

### 2. Firebase에 배포
```bash
firebase deploy --project gen-lang-client-0926456275
```

## 배포 후 확인

배포 완료 후 다음 URL에서 사이트 확인:
- `https://gen-lang-client-0926456275.web.app`
- `https://gen-lang-client-0926456275.firebaseapp.com`

## Firebase 설정 정보

현재 프로젝트의 Firebase 설정:
```javascript
{
  apiKey: "AIzaSyAgs8tKVhz2n3_Zp78ST9E881uWnnUsJ9k",
  authDomain: "gen-lang-client-0926456275.firebaseapp.com",
  projectId: "gen-lang-client-0926456275",
  storageBucket: "gen-lang-client-0926456275.firebasestorage.app",
  messagingSenderId: "1086476485627",
  appId: "1:1086476485627:web:6273a8142ba3da1827015e"
}
```

## 주의사항

- `firebase.json` 파일은 배포 설정을 정의합니다
- `dist` 폴더가 호스팅 대상입니다
- 모든 라우트는 `index.html`로 리다이렉트됩니다 (SPA 지원)

## 문제 해결

### Firebase CLI 재설치
```bash
npm install -g firebase-tools@latest
```

### 캐시 초기화
```bash
rm -rf dist node_modules
npm install
npm run build
```

### 배포 상태 확인
```bash
firebase hosting:channel:list --project gen-lang-client-0926456275
```
