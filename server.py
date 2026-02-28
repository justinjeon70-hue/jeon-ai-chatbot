# -*- coding: utf-8 -*-
"""
전용관 AI — Flask API 서버
Claude API를 연결하여 실시간 AI 답변을 제공합니다.
RAG (검색 증강 생성) 기능으로 YouTube/도서 지식을 활용합니다.

실행: python server.py
접속: http://localhost:5000
"""
import os
import json
import math
import re
from collections import Counter
import requests as http_requests
from flask import Flask, request, Response, send_from_directory, stream_with_context
from flask_cors import CORS
from dotenv import load_dotenv

# .env 파일에서 환경변수 로드
load_dotenv()

# ═══════════════════════════════════════════
# 설정
# ═══════════════════════════════════════════
API_KEY = os.environ.get("ANTHROPIC_API_KEY", "").strip().replace("\n", "").replace(" ", "")
MODEL = "claude-sonnet-4-20250514"
MAX_TOKENS = 1024

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app, origins=["https://drjustinjeon.com", "https://www.drjustinjeon.com", "http://localhost:5000"])

# ═══════════════════════════════════════════
# RAG 지식베이스 로드 및 검색 엔진
# ═══════════════════════════════════════════
def load_knowledge_base():
    """knowledge_base.json에서 청크 로드"""
    kb_path = os.path.join(os.path.dirname(__file__), "knowledge_base.json")
    if not os.path.exists(kb_path):
        print("[RAG] knowledge_base.json 파일이 없습니다. RAG 비활성화.")
        return []
    with open(kb_path, "r", encoding="utf-8") as f:
        chunks = json.load(f)
    print(f"[RAG] 지식베이스 로드 완료: {len(chunks)}개 청크")
    return chunks

def tokenize_korean(text):
    """한국어 텍스트를 단어 단위로 분할 (공백 + 2글자 이상)"""
    words = re.findall(r'[가-힣a-zA-Z0-9]{2,}', text.lower())
    return words

def build_idf(chunks):
    """IDF (Inverse Document Frequency) 계산"""
    doc_count = len(chunks)
    df = Counter()
    for chunk in chunks:
        words = set(tokenize_korean(chunk["text"]))
        for word in words:
            df[word] += 1
    idf = {}
    for word, freq in df.items():
        idf[word] = math.log((doc_count + 1) / (freq + 1)) + 1
    return idf

def search_chunks(query, chunks, idf, top_k=5):
    """BM25 스타일 검색으로 관련 청크 찾기"""
    query_words = tokenize_korean(query)
    if not query_words:
        return []

    scores = []
    for chunk in chunks:
        chunk_words = tokenize_korean(chunk["text"])
        if not chunk_words:
            scores.append(0)
            continue

        word_freq = Counter(chunk_words)
        doc_len = len(chunk_words)
        score = 0
        k1 = 1.5
        b = 0.75
        avg_dl = 450  # 평균 청크 길이 (대략)

        for qw in query_words:
            if qw in word_freq:
                tf = word_freq[qw]
                idf_val = idf.get(qw, 1.0)
                tf_norm = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * doc_len / avg_dl))
                score += idf_val * tf_norm

        scores.append(score)

    # 상위 top_k 인덱스
    ranked = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)
    results = []
    for i in ranked[:top_k]:
        if scores[i] > 0:
            results.append(chunks[i])
    return results

# 서버 시작 시 지식베이스 로드
KNOWLEDGE_BASE = load_knowledge_base()
IDF_INDEX = build_idf(KNOWLEDGE_BASE) if KNOWLEDGE_BASE else {}

# ═══════════════════════════════════════════
# System Prompt (전용관 AI v1.1)
# ═══════════════════════════════════════════
SYSTEM_PROMPT = """너는 "전용관 AI"이다. 연세대학교 전용관 교수의 30년간의 연구, 임상 경험, 철학을 바탕으로 만들어진 근거 기반 운동건강 AI 어드바이저이다.

전용관 교수는 연세대학교 스포츠응용산업학과 교수이자, 하버드 의과대학(Joslin Diabetes Center, Dana Farber Cancer Institute), 캠브리지 대학교에서 연구한 운동의학 및 운동종양학 전문가이다. Nature Medicine, JAMA Surgery, Annals of Oncology 등 300여 편의 국제 학술 논문을 발표했으며, 연세 운동의학 및 살루토제네시스 센터(ICONS)를 이끌고 있다. 저서로 『옥시토신 이야기』가 있다.

너는 전용관 교수의 철학적 관점을 토대로, 운동의학과 건강과학 분야의 폭넓은 과학적 근거를 종합하여 전달하는 역할을 한다. 특정인의 연구만을 반복 인용하지 않으며, 해당 분야의 대표적인 연구, 가이드라인, 메타분석 등을 균형 있게 활용한다.

## 핵심 철학

### 1. 살루토제네시스 (Salutogenesis)
- 건강은 단순히 질병이 없는 상태가 아니라, 신체적·정신적·사회적으로 완전히 안녕한 상태이다.
- "왜 아픈가"가 아닌 "왜 건강한가"를 묻는다.
- 우리 모두는 Ease(편안함)와 Dis-ease(불편함)의 연속선 위에 있다.
- Germ Theory에서 Terrain Theory로의 패러다임 전환이 필요하다.

### 2. 만성질환의 4기사 (Four Horsemen)
- 당뇨병(인슐린 저항성), 심혈관질환, 암, 퇴행성 뇌질환(치매)
- 공통 뿌리: 미토콘드리아 기능 저하와 인슐린 저항성
- 운동은 이 네 가지 모두에 효과적인 유일한 중재이다.

### 3. P-factor와 E-factor
- P-factor: ADHD, 우울증, 치매 등의 공통 요인. 핵심은 미토콘드리아 기능 이상과 브레인 인슐린 저항성.
- E-factor (Exercise/Energy/Engagement): 운동은 미토콘드리아 기능을 회복시키고 신경가소성을 촉진한다.

### 4. 운동이 약이다 (Exercise is Medicine)
- 당뇨병: 생활습관 개선은 발병 위험 58% 감소 (약물 31% 대비 우월)
- 암: 대장암 재발 39% 감소, 생존율 37% 증가
- 배변기능: 대장암 수술 후 배변장애 예방 효과 6.54배
- 치매: 해마 크기 2% 증가, 인지기능 개선

### 5. 근육이 약이다 (Muscle is Medicine)
- 근육량 상위 33%는 심혈관 위험 81% 낮음
- 근육량 하위 25%는 당뇨 위험 3.5배 높음
- 항노화 운동 3종: 스쿼트, 까치발 들기, 허리 뒤로 젖히기

### 6. 옥시토신 — 사랑이 약이다 (Love is a Polypill)
- 사회적 관계와 성격이 수명의 68%에 영향
- 옥시토신: 암세포 억제, 치매 개선, 우울 감소, 면역력 증가
- 옥시토신 증가 방법: 함께 밥 먹기, 스킨십, 운동, 반려동물, 합창, 수다, 자원봉사

### 7. 생존이 아닌 성장
- "나의 건강의 목적은 생존인가, 성장인가?"
- 게르솜(결핍의 내러티브)에서 엘리에셀(감사의 내러티브)로의 전환

## 인용 원칙
- 국제 가이드라인 & 대규모 연구를 우선 인용 (WHO, ACSM, Lancet, NEJM, JAMA 등)
- 분야 대표 연구를 자주 인용 (Cochrane Review, landmark RCT)
- 전용관 교수의 연구는 관련될 때 자연스럽게, 다른 연구와 함께 배치
- 교수님의 고유 개념(살루토제네시스, P-factor, E-factor)은 철학적 해석으로 활용
- 인용 비율: 국제 근거 60% / 대표 연구 25% / 교수님 연구 10% / 고유 철학 5%

## 대화 방식
- 친근하지만 신뢰감 있는 존댓말 사용
- 전문 용어는 반드시 쉬운 설명 병행 (예: "미토콘드리아(세포 속 에너지 발전소)")
- 답변 구조: 공감 → 핵심 메시지 → 근거 제시 → 실천 방법 → 동기 부여
- 답변 길이: 챗봇이므로 간결하게. 핵심 내용을 300-500자 내외로 전달. 필요 시 글머리 기호 활용.

## 금지 사항
1. 의학적 진단 ("당신은 ~병입니다" 금지)
2. 약물 처방/변경 권고 금지
3. 근거 없는 주장, 민간요법, 건강식품 추천 금지
4. 급성기 질환/수술 직후에는 반드시 "의료진 상담" 안내
5. 다른 전문가 비하 금지
6. 정치적/종교적 발언 금지 (건강 내러티브 맥락의 비유는 가능)
7. 건강과 무관한 질문에는 정중히 "운동과 건강 관련 질문에 답변드립니다"라고 안내

## 관련 콘텐츠 안내
- 유튜브: "운동이 이긴다" 채널
- 저서: 『옥시토신 이야기』
- 홈페이지: drjustinjeon.com"""

# 대화 히스토리 (세션별 - 간단한 메모리 구현)
conversations = {}

# ═══════════════════════════════════════════
# 라우트
# ═══════════════════════════════════════════
@app.route("/")
def index():
    return send_from_directory(".", "demo-drjustinjeon.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    if not API_KEY:
        return json.dumps({"error": "API key not configured"}), 500, {"Content-Type": "application/json"}

    try:
        data = request.get_json(force=True)
    except Exception as e:
        return json.dumps({"error": f"Invalid JSON: {str(e)}"}), 400, {"Content-Type": "application/json"}

    user_message = data.get("message", "").strip()
    session_id = data.get("session_id", "default")

    if not user_message:
        return json.dumps({"error": "Empty message"}), 400, {"Content-Type": "application/json"}

    # 대화 히스토리 관리
    if session_id not in conversations:
        conversations[session_id] = []

    conversations[session_id].append({
        "role": "user",
        "content": user_message
    })

    # 최근 10개 메시지만 유지 (컨텍스트 관리)
    history = conversations[session_id][-10:]

    try:
        # RAG: 사용자 질문으로 관련 지식 검색
        rag_context = ""
        if KNOWLEDGE_BASE:
            relevant_chunks = search_chunks(user_message, KNOWLEDGE_BASE, IDF_INDEX, top_k=5)
            if relevant_chunks:
                rag_context = "\n\n## 참고 자료 (전용관 교수의 YouTube 강의 및 저서에서 발췌)\n"
                for i, chunk in enumerate(relevant_chunks, 1):
                    rag_context += f"\n### 참고 {i} ({chunk['source']})\n{chunk['text']}\n"
                rag_context += "\n위 참고 자료를 활용하되, 자연스럽게 답변에 녹여서 전달하세요. 출처를 직접 언급하지 않아도 됩니다.\n"

        system_with_rag = SYSTEM_PROMPT + rag_context

        api_response = http_requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            },
            json={
                "model": MODEL,
                "max_tokens": MAX_TOKENS,
                "system": system_with_rag,
                "messages": history
            },
            timeout=60
        )

        if api_response.status_code != 200:
            error_body = api_response.text
            return json.dumps({"error": f"Anthropic API error: {error_body}"}), 500, {"Content-Type": "application/json"}

        result = api_response.json()
        assistant_text = result["content"][0]["text"]

        # 응답을 히스토리에 추가
        conversations[session_id].append({
            "role": "assistant",
            "content": assistant_text
        })

        result = json.dumps({"text": assistant_text, "done": True}, ensure_ascii=False)
        return result, 200, {"Content-Type": "application/json"}

    except Exception as e:
        import traceback
        err_detail = traceback.format_exc()
        return json.dumps({"error": str(e), "detail": err_detail}), 500, {"Content-Type": "application/json"}


@app.route("/api/health")
def health():
    return {"status": "ok", "api_key_set": bool(API_KEY), "rag_chunks": len(KNOWLEDGE_BASE)}


@app.route("/jeon-ai-widget.js")
def serve_widget():
    return send_from_directory(".", "jeon-ai-widget.js", mimetype="application/javascript")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    is_production = os.environ.get("RENDER", False)

    if not API_KEY:
        print("\n" + "=" * 60)
        print("  ANTHROPIC_API_KEY 가 설정되지 않았습니다!")
        print("  .env 파일에 키를 설정 후 다시 실행하세요")
        print("=" * 60 + "\n")
    else:
        print("\n" + "=" * 60)
        print("  전용관 AI 서버 시작!")
        print(f"  http://localhost:{port} 에서 확인하세요")
        print("=" * 60 + "\n")

    app.run(host="0.0.0.0", port=port, debug=not is_production)
