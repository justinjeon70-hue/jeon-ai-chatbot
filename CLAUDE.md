# 전용관 AI Chatbot — Project Guide

## Overview
전용관 교수(연세대 ICONS)의 운동의학·살루토제네시스 연구를 기반으로 한 AI 챗봇 위젯.
drjustinjeon.com에 `<script>` 한 줄로 삽입하는 방식.

## Architecture
- **Frontend**: 자체 포함형 위젯 JS (CSS+HTML+JS 올인원 IIFE)
  - `jeon-ai-widget.js` — 한국어 위젯
  - `jeon-ai-widget-en.js` — 영어 위젯
- **Backend**: `server.py` — Flask API 서버 (Claude API + RAG)
  - `knowledge_base.json` — YouTube/도서 기반 RAG 지식베이스
  - Render.com 배포 (`render.yaml`)
- **Demo pages**:
  - `demo-drjustinjeon.html` — 한국어 (widget.js 로드)
  - `demo-drjustinjeon-en.html` — 영어 (widget-en.js 로드)
  - `index.html` — 독립형 데모 + 위젯 포함

## Key Features
- 키워드 기반 오프라인 폴백 응답 (API 실패 시)
- 음성 입출력 (STT/TTS, Web Speech API)
- 건강 위험 예측 계산기 3종 (안정시 심박수 기반):
  1. 미진단 당뇨 위험 평가 (0-20점)
  2. 당뇨 환자 신부전(CKD) 위험 평가 (0-16점)
  3. 대장암 재발 위험 평가 (0-14점)
- 세션 복원 (sessionStorage)
- 피드백 버튼 (좋아요/싫어요)

## Conventions
- 한국어/영어 위젯은 구조가 동일하므로 기능 추가 시 양쪽 모두 수정
- CSS 클래스 접두어: `jeon-` (위젯), `jeon-assess-` / `jeon-risk-` (평가 기능)
- API 엔드포인트: `POST /api/chat` (message, session_id, history, lang)
- Claude 모델: `claude-sonnet-4-20250514`

## Running Locally
```bash
# .env에 ANTHROPIC_API_KEY 설정 후
pip install -r requirements.txt
python server.py
# http://localhost:5000 접속
```

## Sensitive Files
- `.env` — API 키 (커밋 금지, .gitignore에 포함)
