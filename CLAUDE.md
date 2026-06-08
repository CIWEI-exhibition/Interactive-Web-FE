# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 프로젝트 개요

**AQUAURORE 프론트엔드** — 인터랙티브 웹 전시 프로젝트의 React 클라이언트.
백엔드 레포: `C:\Users\hansb\Desktop\Interactive-Web` (Spring Boot, `localhost:8080`)

현재 Phase 1 완료, Phase 2(백엔드 API) 진행 후 Phase 3(컴포넌트 전환)으로 이어짐.

---

## 개발 명령어

```bash
npm run dev      # http://localhost:5173 (백엔드 8080 동시 실행 필요)
npm run build    # tsc + vite build
npm run preview
```

> Node 17 환경이라 Vite 4 사용 중 (Vite 5는 Node 18+ 필요)

---

## 아키텍처

### 기술 스택
- React 18 + TypeScript / Vite 4
- Tailwind CSS — 기본 배경 `#0a0a0a` (다크)
- Zustand — 전역 클라이언트 상태
- React Query v3 — 서버 상태, API 캐싱
- Framer Motion — 전시 인터랙션 애니메이션
- Axios (`src/api/client.ts`) — API 클라이언트

### API 클라이언트
`src/api/client.ts` 단일 Axios 인스턴스 사용. JWT 토큰은 `localStorage('token')`에서 자동으로 `Authorization: Bearer` 헤더에 주입됨. 401 응답 시 토큰 자동 삭제.

로컬 dev에서는 Vite 프록시로 `/api` → `http://localhost:8080` 자동 포워딩 (CORS 없음). 프로덕션에서는 `VITE_API_URL` 환경변수로 백엔드 URL 지정.

### 디렉토리 구조 (목표)
```
src/
├── api/        # Axios 인스턴스 + API 함수 (도메인별 파일 분리)
├── components/ # 재사용 컴포넌트
├── pages/      # 라우트별 페이지 컴포넌트
├── store/      # Zustand 스토어
├── types/      # TypeScript 타입 정의 (API 응답 타입 포함)
└── hooks/      # 커스텀 훅
```

### 라우트 계획
| 경로 | 페이지 |
|------|--------|
| `/` | 메인 전시장 |
| `/artwork/:id` | 작품 상세 |
| `/artist/:id` | 작가 개인전 (chaewon, jiyoung, yena) |
| `/goods` | 굿즈샵 |
| `/memo` | 포스트잇 게시판 |
| `/admin` | 관리자 (JWT 보호) |

### API 응답 타입
백엔드의 모든 응답은 다음 형태:
```typescript
{ success: boolean; data: T | null; error: string | null }
```

### Phaser.js 게임 씬
기존 `Exhibition_Page/page3/`의 Phaser 게임을 React로 가져올 때:
`useEffect`로 마운트/언마운트 관리하거나 `public/`에 두고 `<iframe>`으로 임베드. 결정 전 논의 필요.
