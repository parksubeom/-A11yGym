# Vercel 배포 가이드

이 문서는 A11yGym 프로젝트를 Vercel에 배포하는 방법을 안내합니다.

---

## 📋 사전 준비

### 1. Vercel 계정 생성

1. [Vercel](https://vercel.com)에 접속
2. GitHub 계정으로 로그인 (권장)

### 2. GitHub 저장소 확인

- 프로젝트가 GitHub에 푸시되어 있어야 합니다
- 저장소가 Public 또는 Vercel 계정에 연결되어 있어야 합니다

---

## 🚀 배포 방법

### 방법 1: Vercel 웹 대시보드 사용 (추천)

#### Step 1: 프로젝트 가져오기

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. **"Add New..."** → **"Project"** 클릭
3. GitHub 저장소 선택 또는 Import

#### Step 2: 프로젝트 설정

**Framework Preset**: Next.js (자동 감지)

**Root Directory**: `./` (기본값)

**Build Command**: `npm run build` (기본값)

**Output Directory**: `.next` (기본값)

**Install Command**: `npm install` (기본값)

#### Step 3: 환경 변수 설정

**Environment Variables** 섹션에서 다음 변수를 추가:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**참고**: 
- `.env.local` 파일의 값들을 복사하여 입력
- Supabase 대시보드에서 확인 가능:
  - Settings → API → Project URL
  - Settings → API → anon public key

#### Step 4: 배포 실행

1. **"Deploy"** 버튼 클릭
2. 배포 진행 상황 확인
3. 배포 완료 후 URL 확인

---

### 방법 2: Vercel CLI 사용

#### Step 1: Vercel CLI 설치

```bash
npm i -g vercel
```

#### Step 2: 로그인

```bash
vercel login
```

#### Step 3: 프로젝트 배포

```bash
# 프로덕션 배포
vercel --prod

# 또는 대화형 모드
vercel
```

#### Step 4: 환경 변수 설정

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

또는 Vercel 대시보드에서 설정할 수 있습니다.

---

## ⚙️ 환경 변수 설정

### 필수 환경 변수

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### 환경 변수 확인 방법

1. **Supabase 대시보드**:
   - Settings → API
   - Project URL 및 anon public key 확인

2. **로컬 `.env.local` 파일**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

---

## 🔧 Vercel 설정 파일 (선택사항)

프로젝트 루트에 `vercel.json` 파일을 생성하여 추가 설정을 할 수 있습니다:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["icn1"]
}
```

**참고**: 대부분의 경우 Vercel이 자동으로 감지하므로 필요하지 않습니다.

---

## 📝 배포 후 확인 사항

### 1. 빌드 로그 확인

- Vercel 대시보드 → Deployments → 해당 배포 클릭
- Build Logs에서 오류 확인

### 2. 런타임 오류 확인

- Functions 탭에서 서버 함수 오류 확인
- Real-time Logs에서 실시간 로그 확인

### 3. 기능 테스트

- [ ] 홈 페이지 로드 확인
- [ ] 챌린지 페이지 접근 확인
- [ ] 코드 에디터 동작 확인
- [ ] PreviewPanel 렌더링 확인
- [ ] Supabase 데이터 로드 확인

---

## 🔄 자동 배포 설정

### GitHub 연동 시

- **자동 배포**: `main` 브랜치에 푸시 시 자동 배포
- **Preview 배포**: Pull Request 생성 시 Preview 배포
- **프로덕션 배포**: `main` 브랜치 머지 시 프로덕션 배포

### 배포 브랜치 설정

Vercel 대시보드 → Settings → Git:
- Production Branch: `main` (기본값)
- Preview Branches: 모든 브랜치 또는 특정 브랜치

---

## 🐛 문제 해결

### 빌드 실패

**문제**: `npm run build` 실패

**해결책**:
1. 로컬에서 빌드 테스트: `npm run build`
2. 빌드 로그에서 오류 확인
3. TypeScript 오류 수정
4. 의존성 문제 확인: `npm install`

### 환경 변수 오류

**문제**: Supabase 연결 실패

**해결책**:
1. 환경 변수가 올바르게 설정되었는지 확인
2. `NEXT_PUBLIC_` 접두사 확인
3. Supabase 프로젝트가 활성화되어 있는지 확인
4. CORS 설정 확인 (Supabase 대시보드)

### 런타임 오류

**문제**: 페이지 로드 시 오류

**해결책**:
1. Vercel Functions 로그 확인
2. 브라우저 콘솔 오류 확인
3. Network 탭에서 API 요청 확인
4. Supabase 연결 상태 확인

---

## 📚 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Supabase 설정 가이드](https://supabase.com/docs/guides/getting-started)

---

## ✅ 체크리스트

배포 전 확인:

- [ ] GitHub에 코드 푸시 완료
- [ ] 로컬에서 `npm run build` 성공
- [ ] Supabase 프로젝트 생성 및 활성화
- [ ] 환경 변수 준비 완료
- [ ] Vercel 계정 생성 완료

배포 후 확인:

- [ ] 빌드 성공 확인
- [ ] 홈 페이지 접근 가능
- [ ] 챌린지 페이지 동작 확인
- [ ] Supabase 데이터 로드 확인
- [ ] 에러 로그 없음 확인

