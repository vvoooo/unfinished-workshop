# 미완성 수선소, 작은 작업실

기존 캐릭터와 세계관을 작은 3D 웹 공간으로 확장한 수업용 예제입니다. Three.js로 만든 1인 체험이며, 브라우저에서 이동하고 친구와 대화하며 깃발을 수선합니다.

**[바로 체험하기](https://vvoooo.github.io/unfinished-workshop/)**

이 저장소는 수선소 웹 체험을 위한 독립 프로젝트입니다. ChatGPT/Codex로 제작한 예제이며, 학생은 Google AI Studio에서 자기 캐릭터와 세계관으로 새 프로젝트를 만들거나 이 코드를 참고해 수정할 수 있습니다. AI Studio 안에서 직접 생성·불러오기까지 검증한 프로젝트는 아닙니다.

## 조작

- 바닥 클릭 또는 WASD, 방향키: 이동
- 화면 끌기, 마우스 휠: 시점 회전, 확대와 축소
- 사물과 친구 클릭 또는 가까이에서 E: 대화와 상호작용
- 천 서랍 → 두곰 → 세람 → 작업대: 함께 깃발 수선하기
- 내 3D 소품: GLB 불러오기, 크기와 방향 조절
- 오후/저녁 조명, 손 인사, PNG 사진 저장, 다시 시작

휴대폰에서는 화면의 이동 버튼을 사용할 수 있습니다. 두곰과 세람은 NPC이며 다른 접속자가 아닙니다. 새로고침하면 활동과 불러온 소품이 초기화됩니다.

## 설치 없이 실행

체험 링크를 열거나, 저장소에서 `index.html`을 다운로드해 Chrome/Edge에서 엽니다. Three.js까지 묶인 단일 HTML이므로 별도 API 키와 CDN 연결이 필요 없습니다. 학교 PC에서 로컬 HTML 실행을 제한한다면 체험 링크를 사용합니다. WebGL 지원 브라우저가 필요합니다.

## Google AI Studio에서 활용

처음 배우는 학생은 [Google AI Studio Build](https://aistudio.google.com/apps)에서 **새 프로젝트**로 시작합니다. 자기 세계관 설명과 기존 캐릭터 이미지를 준비하고 공간, 이동, 사물 반응, GLB, 작은 활동 순서로 하나씩 요청합니다.

소스를 가져올 때는 공식 안내의 **Add files (+) → Import from GitHub**에서 이 저장소를 선택합니다. 계정에 표시되는 가져오기·연결 메뉴를 확인합니다. 가져온 후 다음처럼 요청할 수 있습니다.

```text
이 저장소는 Three.js로 만든 1인 웹 체험이야.
AI Studio의 현재 실행 환경에 맞춰 미리보기가 열리도록 연결해 줘.
필요하면 개발 서버의 포트와 바인딩을 환경에 맞게 조정해 줘.
이동, 길찾기, 대화, 수선 활동, GLB 불러오기를 유지해 줘.
src/index.html과 src/main.js가 원본이고, 루트 index.html과
 dist/index.html은 npm run build로 생성하는 결과야.
수정은 원본에 하고 생성 결과를 다시 만들어 줘.
생성형 AI API, 로그인, 데이터베이스, 결제는 필요 없어.
먼저 실행을 확인하고 한 번에 한 가지 기능만 수정하자.
```

코드를 새 프로젝트로 가져오는 것과 기존 저장소에 변경사항을 동기화하는 것은 다릅니다. 학생은 자기 저장소에 저장합니다.

## 무료로 진행하는 수업 경로

2026-11-15 공식 안내 기준입니다. 실제 계정의 이용 가능 여부와 남은 한도를 확인합니다.

- Google AI Studio는 무료로 시작할 수 있으며 모델과 사용량 제한이 있습니다. 모든 모델이나 무제한 제작이 무료라는 뜻은 아닙니다.
- 이 예제의 실행은 Gemini 등 생성형 AI API를 호출하지 않습니다. 방문자가 이동하거나 수선할 때 AI API 요금이 발생하지 않습니다.
- GitHub 공개 저장소와 GitHub Pages로 이 정적 웹앱을 공개할 수 있습니다. 서버·실시간 다중 접속 기능을 추가하면 별도 구성이 필요합니다.
- AI Studio 자체 게시의 Starter Tier는 자격이 있는 계정에 한해 최대 2개 앱입니다. 학교 Workspace for Education 계정 등은 이 배포 경로 대상이 아닐 수 있으므로 학생 전원의 무료 배포를 보장하지 않습니다.
- Meshy의 무료 생성과 다운로드 조건은 별도입니다. 무료 다운로드 대상 모델을 먼저 확인하고, 막히면 동봉한 GLB로 불러오기 실습을 진행합니다. 유료 가입을 공통 실습의 조건으로 삼지 않습니다.

## GLB 소품

`assets/practice_spool.glb`는 코드로 제작한 연습용 실타래이며 Meshy 생성물이 아닙니다. 파일을 내려받아 체험 화면의 `내 3D 소품 → GLB 파일 고르기`에서 선택합니다.

25MB 이하, 외부 텍스처와 별도 압축 디코더가 필요 없는 GLB를 권장합니다. 파일은 브라우저에서 읽으며 서버에 저장하지 않습니다. 소품을 프로젝트에 영구 포함하려면 자산 경로를 연결하는 코드 수정이 필요합니다.

## 코드 수정과 재배포

Node.js를 설치한 개발 환경에서 실행합니다.

```sh
npm ci
npm run dev
```

`npm run dev`는 먼저 빌드한 다음 `http://127.0.0.1:4173`에서 미리보기를 엽니다. 종료는 Ctrl+C입니다.

| 파일 | 역할 |
|---|---|
| `src/index.html` | 화면, 안내, 버튼, 팝업, CSS |
| `src/main.js` | Three.js 공간, 이동, 상호작용, GLB 처리 |
| `build.mjs` | 소스와 Three.js를 단일 HTML로 묶기 |
| `index.html` | GitHub Pages에서 실행하는 생성 결과 |
| `dist/index.html` | 로컬 실행용 생성 결과, Git에서 제외 |
| `server.mjs` | 로컬 미리보기 서버 |
| `assets/practice_spool.glb` | 연습용 3D 소품 |
| `make-sample.mjs` | 연습용 GLB 생성 코드 |
| `THREE_LICENSE.txt` | Three.js MIT 라이선스 고지 |

소스 수정 후 `npm run build`를 실행하고 소스와 루트 `index.html`을 함께 커밋합니다. Pages는 `main` 브랜치의 `/(root)`를 게시합니다. `node_modules`, 개인 환경변수, API 키는 저장소에 넣지 않습니다.

## 자료와 권리

캐릭터는 원작의 특징을 단순 도형으로 표현한 학습용 대역입니다. 원작의 최종 3D 모델이나 완성 에피소드가 아닙니다. 미완성 수선소의 이름, 캐릭터, 세계관에 대한 권리는 원작자에게 있으며, 이 저장소 공개가 해당 IP의 자유로운 이용 허락을 뜻하지 않습니다. 학생은 자신의 IP로 바꾸어 실습합니다. Three.js의 MIT 고지는 보존합니다. Meshy 등 외부 에셋을 추가할 때는 해당 에셋의 출처와 라이선스를 별도로 확인합니다.

## 공식 참고

- [Google AI Studio Build](https://aistudio.google.com/docs/aistudio-build-mode)
- [Google AI Studio 요금 안내](https://aistudio.google.com/docs/pricing)
- [Google AI Studio 게시 조건](https://aistudio.google.com/docs/aistudio-deploying)
- [GitHub Pages 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)
- [Three.js](https://threejs.org/)
- [Meshy 무료 플랜](https://help.meshy.ai/en/articles/15696428-what-is-included-on-the-free-plan)
