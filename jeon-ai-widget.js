/**
 * 전용관 AI 챗봇 위젯 v1.1
 * drjustinjeon.com 전용
 *
 * 사용법: <script src="jeon-ai-widget.js"></script> 를 </body> 앞에 추가
 */
(function() {
    'use strict';

    // ═══════════════════════════════════════════
    // CSS 삽입
    // ═══════════════════════════════════════════
    const style = document.createElement('style');
    style.textContent = `
        /* ── 챗봇 토글 버튼 ── */
        #jeon-ai-toggle {
            position: fixed;
            bottom: 28px;
            right: 28px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #0071e3 0%, #0055b3 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0, 113, 227, 0.4);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s;
            font-size: 24px;
        }

        #jeon-ai-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 28px rgba(0, 113, 227, 0.5);
        }

        #jeon-ai-toggle.active {
            transform: scale(0.9) rotate(90deg);
        }

        #jeon-ai-toggle svg {
            width: 28px;
            height: 28px;
            transition: transform 0.3s;
        }

        #jeon-ai-toggle .close-icon { display: none; }
        #jeon-ai-toggle.active .chat-icon { display: none; }
        #jeon-ai-toggle.active .close-icon { display: block; }

        /* ── 뱃지 (알림) ── */
        #jeon-ai-badge {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 18px;
            height: 18px;
            background: #E91E63;
            border-radius: 50%;
            border: 2px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 700;
            color: white;
            animation: jeon-pulse 2s infinite;
        }

        @keyframes jeon-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
        }

        /* ── 챗봇 창 ── */
        #jeon-ai-chat {
            position: fixed;
            bottom: 100px;
            right: 28px;
            width: 400px;
            max-height: 580px;
            background: #fbfbfd;
            border-radius: 20px;
            box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
            z-index: 99998;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            pointer-events: none;
            transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        #jeon-ai-chat.open {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: all;
        }

        /* ── 헤더 ── */
        #jeon-ai-header {
            background: linear-gradient(135deg, #0071e3 0%, #0055b3 100%);
            color: white;
            padding: 18px 20px;
            display: flex;
            align-items: center;
            gap: 14px;
            flex-shrink: 0;
        }

        #jeon-ai-avatar {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 16px;
            letter-spacing: -0.5px;
        }

        #jeon-ai-header-text h3 {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
            letter-spacing: -0.3px;
        }

        #jeon-ai-header-text p {
            font-size: 11.5px;
            opacity: 0.85;
            margin: 2px 0 0 0;
        }

        /* ── 메시지 영역 ── */
        #jeon-ai-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            min-height: 300px;
            max-height: 380px;
        }

        #jeon-ai-messages::-webkit-scrollbar {
            width: 4px;
        }
        #jeon-ai-messages::-webkit-scrollbar-thumb {
            background: #c5c5c7;
            border-radius: 2px;
        }

        .jeon-msg {
            max-width: 88%;
            padding: 12px 16px;
            border-radius: 16px;
            line-height: 1.65;
            font-size: 13.5px;
            font-family: Inter, -apple-system, 'SF Pro Display', sans-serif;
            animation: jeon-fadeIn 0.3s ease;
        }

        @keyframes jeon-fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .jeon-msg.ai {
            align-self: flex-start;
            background: white;
            color: #1d1d1f;
            border: 1px solid #e8e8ed;
            border-radius: 4px 16px 16px 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .jeon-msg.user {
            align-self: flex-end;
            background: linear-gradient(135deg, #0071e3, #0055b3);
            color: white;
            border-radius: 16px 4px 16px 16px;
        }

        .jeon-msg.ai .jeon-sender {
            font-size: 10.5px;
            font-weight: 600;
            color: #0071e3;
            margin-bottom: 5px;
        }

        .jeon-msg.ai strong {
            color: #0055b3;
        }

        .jeon-msg.ai em {
            color: #0071e3;
            font-style: normal;
            font-weight: 500;
        }

        /* ── 웰컴 카드 ── */
        #jeon-ai-welcome {
            text-align: center;
            padding: 8px 4px;
        }

        #jeon-ai-welcome h4 {
            color: #1d1d1f;
            font-size: 15px;
            margin: 0 0 4px 0;
        }

        #jeon-ai-welcome p {
            color: #6e6e73;
            font-size: 12px;
            margin: 0 0 14px 0;
            line-height: 1.5;
        }

        .jeon-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            justify-content: center;
            margin-bottom: 14px;
        }

        .jeon-tag {
            background: #f0f4ff;
            color: #0055b3;
            font-size: 10.5px;
            font-weight: 500;
            padding: 3px 9px;
            border-radius: 6px;
        }

        .jeon-example {
            display: block;
            width: 100%;
            text-align: left;
            background: #f5f5f7;
            border: 1px solid #e8e8ed;
            border-radius: 10px;
            padding: 9px 13px;
            font-size: 12.5px;
            color: #0071e3;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 6px;
            font-family: Inter, -apple-system, sans-serif;
        }

        .jeon-example:hover {
            background: #e8f0fe;
            border-color: #bfd4f5;
            transform: translateX(3px);
        }

        /* ── 타이핑 인디케이터 ── */
        .jeon-typing {
            display: flex;
            gap: 4px;
            padding: 4px 0;
        }

        .jeon-typing span {
            width: 7px;
            height: 7px;
            background: #c5c5c7;
            border-radius: 50%;
            animation: jeon-bounce 1.4s infinite;
        }

        .jeon-typing span:nth-child(2) { animation-delay: 0.2s; }
        .jeon-typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes jeon-bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-5px); }
        }

        /* ── 입력 영역 ── */
        #jeon-ai-input-area {
            padding: 12px 16px;
            border-top: 1px solid #e8e8ed;
            display: flex;
            gap: 10px;
            align-items: flex-end;
            background: white;
            border-radius: 0 0 20px 20px;
        }

        #jeon-ai-input {
            flex: 1;
            padding: 10px 14px;
            border: 1.5px solid #e8e8ed;
            border-radius: 12px;
            font-family: Inter, -apple-system, 'SF Pro Display', sans-serif;
            font-size: 13.5px;
            resize: none;
            outline: none;
            transition: border-color 0.2s;
            max-height: 80px;
            line-height: 1.4;
            color: #1d1d1f;
            background: #f5f5f7;
        }

        #jeon-ai-input:focus {
            border-color: #0071e3;
            background: white;
        }

        #jeon-ai-input::placeholder {
            color: #a1a1a6;
        }

        #jeon-ai-send {
            width: 38px;
            height: 38px;
            background: linear-gradient(135deg, #0071e3, #0055b3);
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.15s, box-shadow 0.15s;
            flex-shrink: 0;
        }

        #jeon-ai-send:hover {
            transform: scale(1.05);
            box-shadow: 0 3px 10px rgba(0, 113, 227, 0.3);
        }

        #jeon-ai-send:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            transform: none;
        }

        #jeon-ai-send svg {
            width: 18px;
            height: 18px;
        }

        #jeon-ai-disclaimer {
            text-align: center;
            font-size: 10px;
            color: #a1a1a6;
            padding: 6px 16px 10px;
            background: white;
            border-radius: 0 0 20px 20px;
        }

        /* ── 모바일 반응형 ── */
        @media (max-width: 480px) {
            #jeon-ai-chat {
                right: 0;
                bottom: 0;
                width: 100%;
                max-height: 100vh;
                border-radius: 0;
            }
            #jeon-ai-toggle {
                bottom: 20px;
                right: 20px;
            }
        }
    `;
    document.head.appendChild(style);

    // ═══════════════════════════════════════════
    // HTML 삽입
    // ═══════════════════════════════════════════
    const widget = document.createElement('div');
    widget.id = 'jeon-ai-widget';
    widget.innerHTML = `
        <!-- 토글 버튼 -->
        <button id="jeon-ai-toggle" aria-label="AI 상담 열기">
            <svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            <span id="jeon-ai-badge">1</span>
        </button>

        <!-- 챗봇 창 -->
        <div id="jeon-ai-chat">
            <div id="jeon-ai-header">
                <div id="jeon-ai-avatar">JY</div>
                <div id="jeon-ai-header-text">
                    <h3>전용관 AI</h3>
                    <p>Evidence-based Exercise & Health Advisor</p>
                </div>
            </div>

            <div id="jeon-ai-messages">
                <div id="jeon-ai-welcome">
                    <h4>무엇이든 물어보세요</h4>
                    <p>근거 기반 운동의학과 살루토제네시스 관점의<br>운동건강 AI 어드바이저입니다</p>
                    <div class="jeon-tags">
                        <span class="jeon-tag">살루토제네시스</span>
                        <span class="jeon-tag">운동이 약이다</span>
                        <span class="jeon-tag">근육이 약이다</span>
                        <span class="jeon-tag">옥시토신</span>
                        <span class="jeon-tag">E-factor</span>
                    </div>
                    <button class="jeon-example" onclick="jeonAI.ask(this.textContent)">항암치료 중인데, 운동해도 괜찮을까요?</button>
                    <button class="jeon-example" onclick="jeonAI.ask(this.textContent)">치매 예방을 위해 어떤 운동을 해야 하나요?</button>
                    <button class="jeon-example" onclick="jeonAI.ask(this.textContent)">당뇨병 진단을 받았는데, 운동으로 나을 수 있나요?</button>
                    <button class="jeon-example" onclick="jeonAI.ask(this.textContent)">아이가 ADHD인데, 운동이 도움이 될까요?</button>
                </div>
            </div>

            <div id="jeon-ai-input-area">
                <textarea id="jeon-ai-input" placeholder="운동과 건강에 대해 물어보세요..." rows="1"></textarea>
                <button id="jeon-ai-send">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"/>
                    </svg>
                </button>
            </div>
            <div id="jeon-ai-disclaimer">
                의학적 진단이나 치료를 대체하지 않습니다. 전문 의료진과 상담하세요.
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    // ═══════════════════════════════════════════
    // 데모 응답 데이터 (v1.1 — 균형 잡힌 인용)
    // ═══════════════════════════════════════════
    const responses = {
        "항암": `많이 걱정되시죠. "암 환자는 쉬어야 한다"는 말을 자주 들으셨을 겁니다.\n\n결론부터 말씀드리면, <strong>운동은 암 환자에게 가장 강력한 약 중 하나입니다.</strong> 미국스포츠의학회(ACSM)는 2019년 합의문에서 암 환자에게 주 150분 이상의 중강도 운동을 권고하고 있습니다.\n\n대규모 연구들이 이를 뒷받침합니다:\n• 대장암 환자의 재발 위험 <em>약 30-40% 감소</em> (JAMA, 2005)\n• 유방암 환자의 암 사망률 유의한 감소 (Holmes et al.)\n• 국내 연구에서도 수술 후 배변기능 장애 예방 효과 6.54배 확인\n\n살루토제네시스 관점에서, 운동은 '좋은 스트레스'로서 우리 몸을 더 강하게 만듭니다.\n\n<strong>주의사항:</strong>\n• 혈소판·백혈구 수치 확인 후 강도 조절\n• 항암 당일보다 컨디션 좋은 날 시작\n• 가벼운 걷기부터 점차 늘리기\n\n"쉬세요"가 아니라 <strong>"움직이세요"</strong>입니다. 구체적인 계획은 의료진과 상의하세요.`,

        "치매": `좋은 질문입니다. <em>Lancet Commission(2020)</em>에서도 신체활동 부족을 치매의 12가지 수정 가능 위험요인 중 하나로 선정했습니다.\n\n최근 의학계에서는 치매를 <strong>'3형 당뇨병'</strong>으로 보는 관점이 주목받고 있습니다. 핵심은 <strong>브레인 인슐린 저항성</strong> — 뇌의 에너지 공장(미토콘드리아)이 제대로 작동하지 않는 것입니다.\n\n<strong>운동의 효과 (연구 근거):</strong>\n• Erickson 등(PNAS, 2011): 유산소 운동이 해마 크기를 <em>2% 증가</em>\n• 핀란드 코호트 연구: 체력이 높을수록 치매 발병률 감소\n• Cochrane Review: 운동의 인지기능 개선 효과 확인\n\n<strong>추천 운동:</strong>\n1. <strong>걷기</strong> — 주 5회, 30분 이상 (WHO 기준)\n2. <strong>스쿼트, 까치발, 허리 젖히기</strong> — 항노화 근력 3종\n3. <strong>함께 운동하기</strong> — 옥시토신 분비 시너지\n\n혼자보다 친구·가족과 함께! 운동도 약이고, 함께하는 것도 약입니다.`,

        "당뇨": `걱정이 많으시겠지만, 희망적인 연구 결과들이 있습니다.\n\n미국 DPP 연구(NEJM, 2002)에서 <strong>생활습관 개선이 당뇨 발병 위험을 58% 감소</strong>시켰습니다. 약물(메트포민)의 31%보다 거의 두 배입니다.\n\n당뇨병 <em>'관해'</em>도 가능합니다:\n• UK DiRECT(Lancet, 2018): <strong>46%가 관해</strong>\n• DIADEM-I(Lancet, 2020): <strong>61%가 관해</strong>\n\n국내에서도 12주 운동+생활습관 프로그램 후 HbA1c가 7.5%→6.5%로 감소한 결과가 확인되었습니다.\n\n<strong>왜 운동이 약보다 강력한가?</strong>\n약은 혈당만 조절하지만, 운동은 인슐린 저항성의 근본 원인인 미토콘드리아 기능을 개선합니다. 이것이 살루토제네시스 관점의 '원인 치료'입니다.\n\n담당 의료진과 상의하여 약물+운동을 병행하세요. 운동은 가장 강력한 약입니다.`,

        "ADHD": `걱정이 크시겠습니다. 최신 연구들을 바탕으로 말씀드릴게요.\n\n메타분석(Cerrillo-Urbina, 2015; Vysniauske, 2020)에서 <strong>운동이 ADHD 아동의 주의력·충동 억제·실행기능을 유의하게 개선</strong>하는 것이 확인되었습니다.\n\n뇌 에너지 관점(P-factor)에서 보면:\n• <strong>DMN</strong> — ADHD에서 과다 활성 → 산만\n• <strong>SN</strong> — 약화 → 집중 실패\n• <strong>CEN</strong> — 약화 → 계획·조직 저하\n\n운동은 미토콘드리아 기능을 개선하여 이 네트워크 균형을 회복시킵니다.\n\n<strong>실천 방법:</strong>\n• <strong>운동 후 공부</strong>하면 집중력 향상 (Hillman, Pediatrics, 2014)\n• 심폐체력은 수학·독해 능력과 상관 (Castelli, 2007)\n• 달리기·수영·자전거 주 3-5회 권장\n\n"심장을 뛰게 하라, 똑똑해지리라." 약물과 운동 병행 시 시너지 효과를 기대할 수 있습니다.`,

        "수면": `수면과 운동의 관계를 과학적 근거로 설명드리겠습니다.\n\n핵심 기전은 <strong>아데노신</strong>입니다. 낮 동안 활동하면 뇌에 아데노신이 쌓이고, 이것이 자연스러운 수면 압력을 만듭니다.\n\n운동은 ATP 소모를 통해 아데노신 생성을 높입니다:\n• 중강도 운동: <em>약 5배 증가</em>\n• 고강도 운동: <em>10-20배 증가</em>\n\n메타분석(Kovacevic, Sleep Med Rev, 2018)에서도 규칙적 운동이 수면의 질을 유의하게 개선했습니다.\n\n<strong>추가 근거:</strong>\n• 수면 부족 → 인슐린 저항성 16-32% 증가 (Spiegel, Lancet)\n• 시간제한 식이 → 수면 질 23% 개선\n• 정제 탄수화물·설탕 과다 → 불면증 위험 증가 (Gangwisch, AJCN)\n\n<strong>실천 팁:</strong>\n1. 낮에 중강도 이상 운동 (저녁 늦은 운동은 피하기)\n2. 시간제한 식이 (12시간 내 식사)\n3. 오후 2시 이후 카페인 제한 (아데노신 차단 방지)\n\n잠도 약이고, 운동도 약입니다.`,

        "근육": `근육의 중요성은 최근 의학계에서 점점 더 주목받고 있습니다.\n\n근육은 단순한 운동기관이 아닙니다. <strong>마이오카인(myokine)</strong>이라는 물질을 분비하는 내분비 기관입니다 (Pedersen, Nature Rev Endocrinology, 2012).\n\n<strong>연구 근거:</strong>\n• 근육량 상위 33% → 심혈관 위험 <em>81% 감소</em> (Srikanthan, AJCN)\n• 근육량 하위 25% → 당뇨 위험 <em>3.5배 증가</em>\n• EWGSOP2(2019)에서 근감소증을 질병으로 분류\n\n<strong>항노화 핵심 운동 3가지</strong> (Danneskiold, 2009):\n1. <strong>스쿼트</strong> — 무릎 신전근, 노화 시 ~20% 감소\n2. <strong>까치발 들기</strong> — 발목 신전근, 낙상 예방\n3. <strong>허리 젖히기</strong> — 몸통 신전근, 자세 유지\n\n근골격 문제를 구조적(MRI·수술) 접근만이 아닌 <em>기능적(근력 균형) 접근</em>으로 보는 것이 최신 트렌드입니다.\n\n"노화되어서 근육이 주는 걸까, 근육이 줄어서 노화가 진행되는 걸까?"\n<strong>근육을 지키는 것이 곧 젊음을 지키는 것입니다.</strong>`,

        "옥시토신": `사회적 관계가 건강에 미치는 영향은 과학적으로 잘 입증되어 있습니다.\n\nHolt-Lunstad 등의 메타분석(PLOS Medicine, 2010)에 따르면, <em>강한 사회적 관계를 가진 사람은 생존율이 50% 높았습니다.</em> 이 효과는 금연에 필적합니다.\n\n이 연결의 생물학적 매개체가 <strong>옥시토신</strong>입니다.\n\n<strong>효과 (연구 근거):</strong>\n• 암세포 증식 억제 — 세포 실험 연구\n• 치매 증상 개선 — 동물 모델\n• 혈압 감소 — Light et al., Biol Psych (2005)\n• 상처 회복 촉진 — Kiecolt-Glaser (2005)\n• 반려동물 교감 — Nagasawa et al., Science (2015)\n\n<strong>옥시토신을 높이는 방법:</strong>\n1. 함께 밥 먹기\n2. 스킨십·허그\n3. 함께 운동하기\n4. 반려동물과 교감\n5. 합창·노래\n6. 친구와 수다\n7. 자원봉사\n\n이 내용은 『옥시토신 이야기』에서 더 깊이 다루고 있습니다.\n\n<strong>운동도 약이고, 사랑도 약입니다.</strong>`
    };

    function getResponse(msg) {
        const lower = msg.toLowerCase();
        for (const [kw, resp] of Object.entries(responses)) {
            if (lower.includes(kw)) return resp;
        }
        return `좋은 질문입니다. 근거 기반 운동의학과 살루토제네시스 관점에서 답변드리겠습니다.\n\n건강은 단순히 질병이 없는 상태가 아닙니다. WHO 정의에 따르면, 우리 모두는 Ease와 Dis-ease의 연속선 위에 있습니다. <strong>운동, 영양, 수면, 사회적 관계</strong>를 통해 Ease 쪽으로 이동할 수 있습니다.\n\n더 구체적으로 답변드리기 위해, 어떤 주제에 관심이 있으신지 알려주세요:\n\n• 암과 운동 (ACSM 가이드라인)\n• 당뇨병과 생활습관 (DPP, DiRECT 연구)\n• 치매 예방 (Lancet Commission)\n• 근력과 노화 (근감소증)\n• 수면 건강\n• 옥시토신과 관계\n• 아동·청소년 (ADHD, ASD)`;
    }

    // ═══════════════════════════════════════════
    // 인터랙션 로직
    // ═══════════════════════════════════════════
    const toggle = document.getElementById('jeon-ai-toggle');
    const chat = document.getElementById('jeon-ai-chat');
    const messages = document.getElementById('jeon-ai-messages');
    const input = document.getElementById('jeon-ai-input');
    const sendBtn = document.getElementById('jeon-ai-send');
    const badge = document.getElementById('jeon-ai-badge');
    let isOpen = false;

    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        chat.classList.toggle('open', isOpen);
        toggle.classList.toggle('active', isOpen);
        if (isOpen) {
            badge.style.display = 'none';
            input.focus();
        }
    });

    // API 서버 주소 (로컬 개발 시 localhost, 배포 시 변경)
    const API_URL = window.JEON_AI_API_URL || '/api/chat';
    const sessionId = 'sess_' + Math.random().toString(36).slice(2, 10);

    function addMsg(text, isUser) {
        const welcome = document.getElementById('jeon-ai-welcome');
        if (welcome) welcome.style.display = 'none';

        const div = document.createElement('div');
        div.className = `jeon-msg ${isUser ? 'user' : 'ai'}`;
        if (!isUser) {
            div.innerHTML = `<div class="jeon-sender">전용관 AI</div>${formatText(text)}`;
        } else {
            div.textContent = text;
        }
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    }

    // 스트리밍용: AI 메시지 div 생성
    function addStreamMsg() {
        const welcome = document.getElementById('jeon-ai-welcome');
        if (welcome) welcome.style.display = 'none';

        const div = document.createElement('div');
        div.className = 'jeon-msg ai';
        div.innerHTML = `<div class="jeon-sender">전용관 AI</div><span class="jeon-stream-text"></span>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    }

    // 마크다운 간이 변환
    function formatText(text) {
        return text
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'jeon-msg ai';
        div.id = 'jeon-typing';
        div.innerHTML = `<div class="jeon-sender">전용관 AI</div><div class="jeon-typing"><span></span><span></span><span></span></div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function hideTyping() {
        const t = document.getElementById('jeon-typing');
        if (t) t.remove();
    }

    async function send(text) {
        if (!text || !text.trim()) return;
        const msg = text.trim();
        addMsg(msg, true);
        input.value = '';
        input.style.height = 'auto';
        sendBtn.disabled = true;

        showTyping();

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, session_id: sessionId })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Server error');
            }

            hideTyping();

            // 스트리밍 응답 처리
            const streamDiv = addStreamMsg();
            const textSpan = streamDiv.querySelector('.jeon-stream-text');
            let fullText = '';

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.text) {
                                fullText += data.text;
                                textSpan.innerHTML = formatText(fullText);
                                messages.scrollTop = messages.scrollHeight;
                            }
                        } catch(e) {}
                    }
                }
            }

            // 최종 렌더링
            textSpan.innerHTML = formatText(fullText);

        } catch (err) {
            hideTyping();
            // API 실패 시 데모 응답으로 폴백
            addMsg(getResponse(msg), false);
        }

        sendBtn.disabled = false;
    }

    sendBtn.addEventListener('click', () => send(input.value));

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send(input.value);
        }
    });

    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 80) + 'px';
    });

    // 외부 API
    window.jeonAI = {
        ask: function(text) {
            if (!isOpen) {
                isOpen = true;
                chat.classList.add('open');
                toggle.classList.add('active');
                badge.style.display = 'none';
            }
            setTimeout(() => send(text), 300);
        }
    };

})();
