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
            width: 68px;
            height: 68px;
            border-radius: 50%;
            background: linear-gradient(135deg, #0071e3 0%, #0050c8 100%);
            color: white;
            border: 3px solid rgba(255,255,255,0.3);
            cursor: pointer;
            box-shadow: 0 4px 24px rgba(0, 113, 227, 0.5), 0 0 0 0 rgba(0, 113, 227, 0.4);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s;
            font-size: 24px;
            animation: jeon-glow 2.5s ease-in-out infinite;
        }

        @keyframes jeon-glow {
            0%, 100% { box-shadow: 0 4px 24px rgba(0, 113, 227, 0.5), 0 0 0 0 rgba(0, 113, 227, 0.3); }
            50% { box-shadow: 0 6px 32px rgba(0, 113, 227, 0.6), 0 0 0 10px rgba(0, 113, 227, 0); }
        }

        #jeon-ai-toggle:hover {
            transform: scale(1.12);
            box-shadow: 0 8px 36px rgba(0, 113, 227, 0.6);
            animation: none;
        }

        #jeon-ai-toggle.active {
            transform: scale(0.9) rotate(90deg);
            animation: none;
        }

        #jeon-ai-toggle svg {
            width: 30px;
            height: 30px;
            transition: transform 0.3s;
        }

        #jeon-ai-toggle .close-icon { display: none; }
        #jeon-ai-toggle.active .chat-icon { display: none; }
        #jeon-ai-toggle.active .close-icon { display: block; }

        /* ── 말풍선 툴팁 ── */
        #jeon-ai-tooltip {
            position: fixed;
            bottom: 42px;
            right: 108px;
            background: white;
            color: #1d1d1f;
            padding: 10px 16px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06);
            font-size: 13.5px;
            font-weight: 500;
            font-family: Inter, -apple-system, 'SF Pro Display', sans-serif;
            white-space: nowrap;
            z-index: 99999;
            animation: jeon-tooltip-in 0.5s ease 1.5s both, jeon-tooltip-bounce 3s ease-in-out 2s infinite;
            cursor: pointer;
        }

        #jeon-ai-tooltip::after {
            content: '';
            position: absolute;
            right: -7px;
            top: 50%;
            transform: translateY(-50%);
            border: 7px solid transparent;
            border-left-color: white;
            border-right: none;
        }

        @keyframes jeon-tooltip-in {
            from { opacity: 0; transform: translateX(10px); }
            to { opacity: 1; transform: translateX(0); }
        }

        @keyframes jeon-tooltip-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }

        #jeon-ai-tooltip.hidden {
            display: none !important;
        }

        /* ── 뱃지 (알림) ── */
        #jeon-ai-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            width: 22px;
            height: 22px;
            background: #E91E63;
            border-radius: 50%;
            border: 2.5px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
            color: white;
            animation: jeon-pulse 1.5s infinite;
        }

        @keyframes jeon-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
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
            position: relative;
        }

        #jeon-ai-close {
            position: absolute;
            top: 50%;
            right: 16px;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        #jeon-ai-close:hover {
            background: rgba(255,255,255,0.35);
        }

        #jeon-ai-close svg {
            width: 16px;
            height: 16px;
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

        /* ── 음성 입력 (마이크) 버튼 ── */
        #jeon-ai-mic {
            width: 38px;
            height: 38px;
            background: #e8f0fe;
            color: #0071e3;
            border: 1.5px solid #bfd4f5;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.15s, background 0.2s, color 0.2s;
            flex-shrink: 0;
        }

        #jeon-ai-mic:hover {
            background: #d0e2fc;
            color: #0055b3;
            transform: scale(1.05);
        }

        #jeon-ai-mic.listening {
            background: #ff3b30;
            color: white;
            border-color: #ff3b30;
            animation: jeon-mic-pulse 1.2s ease-in-out infinite;
        }

        #jeon-ai-mic svg {
            width: 18px;
            height: 18px;
        }

        @keyframes jeon-mic-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.5); }
            50% { box-shadow: 0 0 0 8px rgba(255, 59, 48, 0); }
        }

        /* ── TTS 스피커 버튼 ── */
        .jeon-tts-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 26px;
            height: 26px;
            background: #e8f0fe;
            border: 1px solid #bfd4f5;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 8px;
            transition: background 0.2s, color 0.2s;
            color: #0071e3;
            flex-shrink: 0;
        }

        .jeon-tts-btn:hover {
            background: #d0e2fc;
            color: #0055b3;
        }

        .jeon-tts-btn.speaking {
            background: #0071e3;
            border-color: #0071e3;
            color: white;
        }

        .jeon-tts-btn svg {
            width: 14px;
            height: 14px;
        }

        /* ── 피드백 버튼 ── */
        .jeon-feedback {
            display: flex;
            gap: 4px;
            margin-top: 6px;
        }

        .jeon-feedback-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 26px;
            height: 26px;
            background: #f5f5f7;
            border: 1px solid #e8e8ed;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.2s;
            font-size: 13px;
            color: #6e6e73;
            flex-shrink: 0;
            padding: 0;
        }

        .jeon-feedback-btn:hover {
            background: #e8e8ed;
        }

        .jeon-feedback-btn.selected {
            background: #e8f0fe;
            border-color: #0071e3;
            color: #0071e3;
        }

        /* ── 오프라인 배지 ── */
        .jeon-offline-badge {
            display: inline-block;
            font-size: 9.5px;
            color: #ff9500;
            font-weight: 500;
            margin-left: 6px;
        }

        /* ── 건강 위험 평가 ── */
        .jeon-assess-btns {
            display: flex;
            gap: 6px;
            justify-content: center;
            margin-top: 10px;
            flex-wrap: wrap;
        }

        .jeon-assess-btn {
            background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%);
            border: 1px solid #bfd4f5;
            border-radius: 10px;
            padding: 8px 12px;
            font-size: 11.5px;
            font-weight: 600;
            color: #0055b3;
            cursor: pointer;
            transition: all 0.2s;
            font-family: Inter, -apple-system, sans-serif;
        }

        .jeon-assess-btn:hover {
            background: linear-gradient(135deg, #e8f0fe 0%, #d0e2fc 100%);
            border-color: #0071e3;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 113, 227, 0.15);
        }

        .jeon-assess-form {
            background: #f8f9fb;
            border: 1px solid #e8e8ed;
            border-radius: 14px;
            padding: 14px;
            margin: 0;
            max-width: 100%;
        }

        .jeon-assess-form h5 {
            font-size: 13px;
            font-weight: 600;
            color: #1d1d1f;
            margin: 0 0 10px 0;
        }

        .jeon-assess-field {
            margin-bottom: 8px;
        }

        .jeon-assess-field label {
            display: block;
            font-size: 11px;
            font-weight: 500;
            color: #6e6e73;
            margin-bottom: 3px;
        }

        .jeon-assess-field select,
        .jeon-assess-field input {
            width: 100%;
            padding: 7px 10px;
            border: 1px solid #e8e8ed;
            border-radius: 8px;
            font-size: 12.5px;
            font-family: Inter, -apple-system, sans-serif;
            color: #1d1d1f;
            background: white;
            outline: none;
            transition: border-color 0.2s;
            box-sizing: border-box;
        }

        .jeon-assess-field select:focus,
        .jeon-assess-field input:focus {
            border-color: #0071e3;
        }

        .jeon-assess-submit {
            width: 100%;
            padding: 9px;
            background: linear-gradient(135deg, #0071e3, #0055b3);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 4px;
            transition: transform 0.15s, box-shadow 0.15s;
            font-family: Inter, -apple-system, sans-serif;
        }

        .jeon-assess-submit:hover {
            transform: scale(1.02);
            box-shadow: 0 3px 10px rgba(0, 113, 227, 0.3);
        }

        .jeon-risk-result {
            background: white;
            border: 1px solid #e8e8ed;
            border-radius: 14px;
            padding: 14px;
            max-width: 100%;
        }

        .jeon-risk-result h5 {
            font-size: 13px;
            font-weight: 600;
            color: #1d1d1f;
            margin: 0 0 8px 0;
        }

        .jeon-risk-meter {
            background: #f0f0f5;
            border-radius: 8px;
            height: 14px;
            overflow: hidden;
            margin-bottom: 6px;
        }

        .jeon-risk-bar {
            height: 100%;
            border-radius: 8px;
            transition: width 0.6s ease;
        }

        .jeon-risk-label {
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .jeon-risk-score {
            font-size: 11px;
            color: #6e6e73;
            margin-bottom: 10px;
        }

        .jeon-recommend {
            background: #f8f9fb;
            border-radius: 10px;
            padding: 10px 12px;
            margin-top: 8px;
        }

        .jeon-recommend h6 {
            font-size: 11.5px;
            font-weight: 600;
            color: #0055b3;
            margin: 0 0 4px 0;
        }

        .jeon-recommend p {
            font-size: 11.5px;
            color: #1d1d1f;
            margin: 0 0 6px 0;
            line-height: 1.6;
        }

        .jeon-risk-citation {
            font-size: 10px;
            color: #a1a1a6;
            margin-top: 8px;
            line-height: 1.5;
            border-top: 1px solid #f0f0f5;
            padding-top: 8px;
        }

        .jeon-risk-disclaimer {
            font-size: 10px;
            color: #ff9500;
            margin-top: 6px;
            line-height: 1.4;
            font-weight: 500;
        }

        /* ── 모바일 반응형 ── */
        @media (max-width: 480px) {
            #jeon-ai-chat {
                right: 0;
                bottom: 0;
                width: 100%;
                max-height: 100vh;
                max-height: 100dvh;
                border-radius: 0;
            }
            #jeon-ai-toggle {
                bottom: 20px;
                right: 20px;
                width: 62px;
                height: 62px;
            }
            #jeon-ai-tooltip {
                bottom: 34px;
                right: 94px;
                font-size: 12.5px;
                padding: 8px 14px;
            }
            #jeon-ai-chat.open ~ #jeon-ai-toggle,
            #jeon-ai-toggle.active {
                display: none !important;
            }
            #jeon-ai-tooltip.hidden,
            #jeon-ai-chat.open ~ #jeon-ai-tooltip {
                display: none !important;
            }
            #jeon-ai-mic {
                width: 34px;
                height: 34px;
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
        <!-- 말풍선 툴팁 -->
        <div id="jeon-ai-tooltip">운동·건강 궁금증을 물어보세요!</div>

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
                <button id="jeon-ai-close" aria-label="닫기">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
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
                    <div id="jeon-ai-examples"></div>
                    <div class="jeon-assess-btns">
                        <button class="jeon-assess-btn" data-assess="diabetes">🩺 당뇨 위험 평가</button>
                        <button class="jeon-assess-btn" data-assess="ckd">🏥 신부전 위험 평가</button>
                        <button class="jeon-assess-btn" data-assess="cancer">🎗 암 재발 위험 평가</button>
                    </div>
                </div>
            </div>

            <div id="jeon-ai-input-area">
                <textarea id="jeon-ai-input" placeholder="운동과 건강에 대해 물어보세요..." rows="1"></textarea>
                <button id="jeon-ai-mic" aria-label="음성 입력" style="display:none;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="1" width="6" height="11" rx="3"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                        <line x1="12" y1="19" x2="12" y2="23"/>
                        <line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                </button>
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
    // 샘플 질문 풀 (랜덤 5개 표시)
    // ═══════════════════════════════════════════
    const allQuestions = [
        "항암치료 중인데, 운동해도 괜찮을까요?",
        "치매 예방을 위해 어떤 운동을 해야 하나요?",
        "당뇨병 진단을 받았는데, 운동으로 나을 수 있나요?",
        "아이가 ADHD인데, 운동이 도움이 될까요?",
        "잠을 잘 못 자는데, 운동이 수면에 도움이 되나요?",
        "옥시토신이 건강에 어떤 영향을 미치나요?",
        "나이 들면 근육이 왜 줄어드나요? 어떻게 막나요?",
        "살루토제네시스가 뭔가요?",
        "다이어트할 때 운동과 식이 중 뭐가 더 중요한가요?",
        "우울할 때 운동이 약이 될 수 있나요?",
        "도파민과 운동은 어떤 관계가 있나요?",
        "인슐린 저항성이 뭔가요? 운동으로 개선되나요?",
        "심혈관 건강을 지키려면 어떤 운동이 좋을까요?",
        "간헐적 단식이 건강에 도움이 되나요?",
        "스트레스가 몸에 미치는 영향이 궁금해요",
        "뇌섬엽(Insula)이 수면에 어떤 영향을 주나요?",
        "글림파틱 시스템이 뭔가요?",
        "미토콘드리아가 건강에 왜 중요한가요?",
        "P-factor와 E-factor가 뭔가요?",
        "혼자보다 같이 운동하면 정말 더 좋은가요?",
    ];

    function renderQuestions() {
        const container = document.getElementById('jeon-ai-examples');
        if (!container) return;
        const shuffled = allQuestions.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 5);
        container.innerHTML = selected.map(q =>
            `<button class="jeon-example" onclick="jeonAI.ask(this.textContent)">${q}</button>`
        ).join('');
    }
    renderQuestions();

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

    const closeBtn = document.getElementById('jeon-ai-close');
    const tooltip = document.getElementById('jeon-ai-tooltip');

    function openChat() {
        isOpen = true;
        chat.classList.add('open');
        toggle.classList.add('active');
        badge.style.display = 'none';
        tooltip.classList.add('hidden');
        input.focus();
    }

    function closeChat() {
        isOpen = false;
        chat.classList.remove('open');
        toggle.classList.remove('active');
        // TTS 중지
        if (synth && synth.speaking) {
            synth.cancel();
            if (currentTtsBtn) {
                currentTtsBtn.classList.remove('speaking');
                currentTtsBtn = null;
            }
        }
        // STT 중지
        if (recognition && isListening) {
            recognition.stop();
        }
    }

    toggle.addEventListener('click', () => {
        if (isOpen) closeChat();
        else openChat();
    });

    closeBtn.addEventListener('click', closeChat);

    tooltip.addEventListener('click', openChat);

    // API 서버 주소 (로컬 개발 시 localhost, 배포 시 변경)
    const API_URL = window.JEON_AI_API_URL || '/api/chat';
    const sessionId = 'sess_' + Math.random().toString(36).slice(2, 10);

    // 대화 기록 (서버에 전송 + sessionStorage 저장)
    const conversationHistory = [];
    const STORAGE_KEY = 'jeon-ai-chat-ko';

    // ═══════════════════════════════════════════
    // 음성 설정
    // ═══════════════════════════════════════════
    const VOICE_LANG = 'ko-KR';
    const VOICE_LABELS = {
        micStart: '음성 입력 시작',
        micStop: '음성 입력 중지',
        ttsPlay: '읽어주기',
        ttsStop: '읽기 중지',
        micDenied: '마이크 사용이 거부되었습니다. 브라우저 설정에서 마이크 권한을 허용해주세요.'
    };

    // TTS 헬퍼
    const synth = window.speechSynthesis;

    function stripHtmlForTts(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    let currentTtsBtn = null;
    function speakText(text, btn) {
        if (!synth) return;
        // 이미 같은 버튼이 재생 중이면 중지
        if (synth.speaking && currentTtsBtn === btn) {
            synth.cancel();
            btn.classList.remove('speaking');
            currentTtsBtn = null;
            return;
        }
        // 다른 재생 중이면 중지
        if (synth.speaking) {
            synth.cancel();
            if (currentTtsBtn) currentTtsBtn.classList.remove('speaking');
        }
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = VOICE_LANG;
        utter.rate = 1;
        btn.classList.add('speaking');
        currentTtsBtn = btn;
        utter.onend = () => {
            btn.classList.remove('speaking');
            currentTtsBtn = null;
        };
        utter.onerror = () => {
            btn.classList.remove('speaking');
            currentTtsBtn = null;
        };
        synth.speak(utter);
    }

    function createTtsButton() {
        const btn = document.createElement('button');
        btn.className = 'jeon-tts-btn';
        btn.setAttribute('aria-label', VOICE_LABELS.ttsPlay);
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
        return btn;
    }

    function addMsg(text, isUser, isHtml) {
        const welcome = document.getElementById('jeon-ai-welcome');
        if (welcome) welcome.style.display = 'none';

        const div = document.createElement('div');
        div.className = `jeon-msg ${isUser ? 'user' : 'ai'}`;
        if (!isUser) {
            const content = isHtml ? text : formatText(text);
            // 콘텐츠를 별도 span으로 감싸서 TTS가 sender 라벨을 읽지 않도록 함
            const contentSpan = document.createElement('span');
            contentSpan.className = 'jeon-msg-content';
            contentSpan.innerHTML = content;
            div.innerHTML = `<div class="jeon-sender">전용관 AI</div>`;
            div.appendChild(contentSpan);
            // TTS 버튼 (콘텐츠만 읽음)
            if (synth) {
                const ttsBtn = createTtsButton();
                ttsBtn.addEventListener('click', () => {
                    const msgText = stripHtmlForTts(contentSpan.innerHTML);
                    speakText(msgText, ttsBtn);
                });
                div.appendChild(ttsBtn);
            }
            // 피드백 버튼
            const feedback = document.createElement('div');
            feedback.className = 'jeon-feedback';
            feedback.innerHTML = `<button class="jeon-feedback-btn" data-vote="up" aria-label="좋아요">&#128077;</button><button class="jeon-feedback-btn" data-vote="down" aria-label="싫어요">&#128078;</button>`;
            feedback.querySelectorAll('.jeon-feedback-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    feedback.querySelectorAll('.jeon-feedback-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                });
            });
            div.appendChild(feedback);
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
        conversationHistory.push({ role: 'user', content: msg });
        input.value = '';
        input.style.height = 'auto';
        sendBtn.disabled = true;

        showTyping();

        // 30초 타임아웃
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: msg,
                    session_id: sessionId,
                    history: conversationHistory.slice(0, -1) // 현재 메시지 제외한 이전 대화
                }),
                signal: controller.signal
            });

            clearTimeout(timeout);
            hideTyping();

            if (!res.ok) {
                let errMsg = 'Server error';
                try { const err = await res.json(); errMsg = err.error || errMsg; } catch(e) {}
                throw new Error(errMsg);
            }

            const data = await res.json();
            if (data.text) {
                addMsg(data.text, false); // addMsg 내부에서 formatText 처리
                conversationHistory.push({ role: 'assistant', content: data.text });
            } else if (data.error) {
                throw new Error(data.error);
            }

        } catch (err) {
            clearTimeout(timeout);
            hideTyping();
            // API 실패 시 데모 응답으로 폴백 + 오프라인 표시
            const fallback = getResponse(msg);
            const msgDiv = addMsg(fallback, false, true);
            const badge = document.createElement('span');
            badge.className = 'jeon-offline-badge';
            badge.textContent = '(오프라인 모드)';
            const sender = msgDiv.querySelector('.jeon-sender');
            if (sender) sender.appendChild(badge);
            conversationHistory.push({ role: 'assistant', content: fallback });
        }

        // sessionStorage에 저장
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(conversationHistory)); } catch(e) {}

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

    // ═══════════════════════════════════════════
    // 음성 입력 (STT)
    // ═══════════════════════════════════════════
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isListening = false;
    const micBtn = document.getElementById('jeon-ai-mic');

    let silenceTimer = null;
    const SILENCE_TIMEOUT = 5000; // 5초 무음 시 자동 중지

    function resetSilenceTimer() {
        if (silenceTimer) clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
            if (isListening && recognition) recognition.stop();
        }, SILENCE_TIMEOUT);
    }

    if (SpeechRecognition && micBtn) {
        micBtn.style.display = 'flex';
        recognition = new SpeechRecognition();
        recognition.lang = VOICE_LANG;
        recognition.interimResults = true;
        recognition.continuous = true;

        recognition.onstart = () => {
            isListening = true;
            micBtn.classList.add('listening');
            micBtn.setAttribute('aria-label', VOICE_LABELS.micStop);
            resetSilenceTimer();
        };

        recognition.onend = () => {
            isListening = false;
            micBtn.classList.remove('listening');
            micBtn.setAttribute('aria-label', VOICE_LABELS.micStart);
            if (silenceTimer) { clearTimeout(silenceTimer); silenceTimer = null; }
        };

        recognition.onresult = (e) => {
            resetSilenceTimer(); // 음성 인식될 때마다 타이머 리셋
            let finalTranscript = '';
            let interimTranscript = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const t = e.results[i][0].transcript;
                if (e.results[i].isFinal) {
                    finalTranscript += t;
                } else {
                    interimTranscript += t;
                }
            }
            input.value = finalTranscript || interimTranscript;
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 80) + 'px';
        };

        recognition.onerror = (e) => {
            if (e.error === 'not-allowed') {
                alert(VOICE_LABELS.micDenied);
            }
            // 그 외 에러 (aborted, no-speech 등)는 무시
        };

        micBtn.addEventListener('click', () => {
            if (isListening) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });
    }

    // 세션 복원 (새로고침 시 대화 유지)
    try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
            const history = JSON.parse(saved);
            history.forEach(h => {
                if (h.role === 'user') {
                    addMsg(h.content, true);
                } else {
                    addMsg(h.content, false, true); // HTML로 전달
                }
            });
            conversationHistory.push(...history);
        }
    } catch(e) {}

    // ═══════════════════════════════════════════
    // 건강 위험 평가 모델
    // ═══════════════════════════════════════════
    const RISK_MODELS = {
        diabetes: {
            title: '미진단 당뇨 위험 평가',
            citation: 'Park & Jeon (Epid Health 2022); Park et al. (NMCD 2023); Park et al. (KSEP 2020)',
            maxScore: 20,
            levels: [
                { max: 5, label: '낮음', color: '#34c759', emoji: '🟢' },
                { max: 10, label: '보통', color: '#ff9500', emoji: '🟡' },
                { max: 14, label: '높음', color: '#ff6b35', emoji: '🟠' },
                { max: 20, label: '매우 높음', color: '#ff3b30', emoji: '🔴' }
            ],
            fields: [
                { id: 'gender', label: '성별', type: 'select', options: [['male','남성'],['female','여성']] },
                { id: 'age', label: '나이', type: 'number', placeholder: '예: 55', min: 20, max: 100 },
                { id: 'rhr', label: '안정시 심박수 (bpm)', type: 'number', placeholder: '예: 72', min: 40, max: 150 },
                { id: 'wc', label: '허리둘레 (cm)', type: 'number', placeholder: '예: 90', min: 50, max: 160 }
            ],
            calculate: function(v) {
                var score = 0;
                var age = parseInt(v.age);
                if (age >= 70) score += 7;
                else if (age >= 60) score += 6;
                else if (age >= 50) score += 5;
                else if (age >= 40) score += 3;
                else if (age >= 30) score += 1;
                var rhr = parseInt(v.rhr);
                var isMale = v.gender === 'male';
                if (rhr >= 90) score += isMale ? 6 : 5;
                else if (rhr >= 80) score += isMale ? 4 : 3;
                else if (rhr >= 70) score += 2;
                else if (rhr >= 60) score += 1;
                var wc = parseInt(v.wc);
                if (isMale) {
                    if (wc >= 95) score += 6;
                    else if (wc >= 90) score += 4;
                    else if (wc >= 85) score += 2;
                } else {
                    if (wc >= 90) score += 6;
                    else if (wc >= 85) score += 4;
                    else if (wc >= 80) score += 2;
                }
                return score;
            }
        },
        ckd: {
            title: '당뇨 환자 신부전 위험 평가',
            citation: 'Park & Jeon (BMC Public Health 2024)',
            maxScore: 16,
            levels: [
                { max: 4, label: '낮음', color: '#34c759', emoji: '🟢' },
                { max: 8, label: '보통', color: '#ff9500', emoji: '🟡' },
                { max: 12, label: '높음', color: '#ff6b35', emoji: '🟠' },
                { max: 16, label: '매우 높음', color: '#ff3b30', emoji: '🔴' }
            ],
            fields: [
                { id: 'gender', label: '성별', type: 'select', options: [['male','남성'],['female','여성']] },
                { id: 'age', label: '나이', type: 'number', placeholder: '예: 60', min: 20, max: 100 },
                { id: 'rhr', label: '안정시 심박수 (bpm)', type: 'number', placeholder: '예: 75', min: 40, max: 150 },
                { id: 'duration', label: '당뇨 유병기간 (년)', type: 'number', placeholder: '예: 8', min: 0, max: 50 },
                { id: 'hypertension', label: '고혈압 여부', type: 'select', options: [['no','없음'],['yes','있음']] }
            ],
            calculate: function(v) {
                var score = 0;
                var rhr = parseInt(v.rhr);
                if (rhr >= 100) score += 5;
                else if (rhr >= 90) score += 4;
                else if (rhr >= 80) score += 3;
                else if (rhr >= 70) score += 2;
                else if (rhr >= 60) score += 1;
                var age = parseInt(v.age);
                if (age >= 70) score += 4;
                else if (age >= 60) score += 3;
                else if (age >= 50) score += 2;
                else if (age >= 40) score += 1;
                var dur = parseInt(v.duration);
                if (dur >= 15) score += 3;
                else if (dur >= 10) score += 2;
                else if (dur >= 5) score += 1;
                if (v.hypertension === 'yes') score += 2;
                if (v.gender === 'male') score += 2;
                return score;
            }
        },
        cancer: {
            title: '대장암 재발 위험 평가',
            citation: 'Park & Jeon (PLOS ONE 2018); Cho & Jeon (Cancer Epi 2025)',
            maxScore: 14,
            levels: [
                { max: 3, label: '낮음', color: '#34c759', emoji: '🟢' },
                { max: 7, label: '보통', color: '#ff9500', emoji: '🟡' },
                { max: 10, label: '높음', color: '#ff6b35', emoji: '🟠' },
                { max: 14, label: '매우 높음', color: '#ff3b30', emoji: '🔴' }
            ],
            fields: [
                { id: 'rhr', label: '안정시 심박수 (bpm)', type: 'number', placeholder: '예: 72', min: 40, max: 150 },
                { id: 'bodyfat', label: '체지방률 (%)', type: 'select', options: [['normal','정상 (남<20/여<28)'],['over','과체중 (남20-25/여28-33)'],['obese','비만 (남25-30/여33-38)'],['severe','고도비만 (남>30/여>38)']] },
                { id: 'activity', label: '주간 신체활동', type: 'select', options: [['active','활동적 (≥150분/주)'],['moderate','보통 (75-149분/주)'],['low','부족 (1-74분/주)'],['inactive','비활동 (거의 안 함)']] },
                { id: 'stage', label: '대장암 병기', type: 'select', options: [['1','I기'],['2','II기'],['3','III기'],['4','IV기']] }
            ],
            calculate: function(v) {
                var score = 0;
                var rhr = parseInt(v.rhr);
                if (rhr >= 100) score += 5;
                else if (rhr >= 90) score += 4;
                else if (rhr >= 80) score += 3;
                else if (rhr >= 70) score += 2;
                else if (rhr >= 60) score += 1;
                var bf = { normal: 0, over: 1, obese: 2, severe: 3 };
                score += bf[v.bodyfat] || 0;
                var act = { active: 0, moderate: 1, low: 2, inactive: 3 };
                score += act[v.activity] || 0;
                score += (parseInt(v.stage) - 1);
                return score;
            }
        }
    };

    const EXERCISE_RECS = {
        '낮음': '현재 생활습관을 유지하세요. 주 150분 중강도 유산소 운동 + 주 2회 근력 운동을 권장합니다.',
        '보통': '주 150~300분 유산소 운동, 주 2~3회 근력 운동(스쿼트·까치발·허리 젖히기)을 권장합니다. 매일 30분 걷기를 실천하세요.',
        '높음': '전문가 상담 후 점진적으로 시작하세요. 주 5회 30분 걷기, 식후 15분 걷기부터 시작하세요.',
        '매우 높음': '의료진 상담이 필수입니다. 저강도 걷기부터 천천히 시작하고, 반드시 전문가의 관리를 받으세요.'
    };

    const DIET_RECS = {
        diabetes: '시간제한 식이(12시간 내 식사), 정제 탄수화물 제한, 식이섬유 섭취를 늘리세요.',
        ckd: '저단백 식이를 고려하고, 나트륨 섭취를 제한하며, 적절한 수분 관리가 중요합니다.',
        cancer: '항염증 식이를 실천하세요. 채소·과일 섭취를 늘리고, 가공육을 제한하세요.'
    };

    function buildAssessmentForm(modelKey) {
        var model = RISK_MODELS[modelKey];
        var html = '<div class="jeon-assess-form" data-model="' + modelKey + '"><h5>' + model.title + '</h5>';
        model.fields.forEach(function(f) {
            html += '<div class="jeon-assess-field"><label>' + f.label + '</label>';
            if (f.type === 'select') {
                html += '<select data-field="' + f.id + '">';
                f.options.forEach(function(opt) {
                    html += '<option value="' + opt[0] + '">' + opt[1] + '</option>';
                });
                html += '</select>';
            } else {
                html += '<input type="number" data-field="' + f.id + '" placeholder="' + f.placeholder + '" min="' + f.min + '" max="' + f.max + '">';
            }
            html += '</div>';
        });
        html += '<button class="jeon-assess-submit" data-model="' + modelKey + '">평가하기</button></div>';
        return html;
    }

    function getRiskLevel(modelKey, score) {
        var model = RISK_MODELS[modelKey];
        for (var i = 0; i < model.levels.length; i++) {
            if (score <= model.levels[i].max) return model.levels[i];
        }
        return model.levels[model.levels.length - 1];
    }

    function generateResult(modelKey, score) {
        var model = RISK_MODELS[modelKey];
        var level = getRiskLevel(modelKey, score);
        var pct = Math.min(Math.round((score / model.maxScore) * 100), 100);
        var html = '<div class="jeon-risk-result">';
        html += '<h5>' + model.title + ' 결과</h5>';
        html += '<div class="jeon-risk-meter"><div class="jeon-risk-bar" style="width:' + pct + '%;background:' + level.color + ';"></div></div>';
        html += '<div class="jeon-risk-label" style="color:' + level.color + ';">' + level.emoji + ' ' + level.label + ' 위험</div>';
        html += '<div class="jeon-risk-score">점수: ' + score + ' / ' + model.maxScore + '</div>';
        html += '<div class="jeon-recommend"><h6>🏃 운동 권고</h6><p>' + EXERCISE_RECS[level.label] + '</p></div>';
        html += '<div class="jeon-recommend"><h6>🥗 식이 권고</h6><p>' + DIET_RECS[modelKey] + '</p></div>';
        html += '<div class="jeon-risk-citation">📚 근거: ' + model.citation + '</div>';
        html += '<div class="jeon-risk-disclaimer">⚠️ 이 평가는 전용관 교수 연구팀의 논문에 기반한 참고용 도구이며, 의학적 진단을 대체하지 않습니다.</div>';
        html += '</div>';
        return html;
    }

    // 평가 버튼 클릭 핸들러
    document.querySelectorAll('.jeon-assess-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var modelKey = btn.getAttribute('data-assess');
            var welcome = document.getElementById('jeon-ai-welcome');
            if (welcome) welcome.style.display = 'none';
            var div = document.createElement('div');
            div.className = 'jeon-msg ai';
            div.innerHTML = '<div class="jeon-sender">전용관 AI</div>' + buildAssessmentForm(modelKey);
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
            var submitBtn = div.querySelector('.jeon-assess-submit');
            submitBtn.addEventListener('click', function() {
                var form = div.querySelector('.jeon-assess-form');
                var values = {};
                var valid = true;
                form.querySelectorAll('[data-field]').forEach(function(el) {
                    values[el.getAttribute('data-field')] = el.value;
                    if (el.type === 'number' && (!el.value || isNaN(el.value))) valid = false;
                });
                if (!valid) { alert('모든 항목을 입력해주세요.'); return; }
                var score = RISK_MODELS[modelKey].calculate(values);
                var resultDiv = document.createElement('div');
                resultDiv.className = 'jeon-msg ai';
                resultDiv.innerHTML = '<div class="jeon-sender">전용관 AI</div>' + generateResult(modelKey, score);
                messages.appendChild(resultDiv);
                messages.scrollTop = messages.scrollHeight;
            });
        });
    });

    // 외부 API
    window.jeonAI = {
        ask: function(text) {
            if (!isOpen) openChat();
            setTimeout(() => send(text), 300);
        }
    };

})();
