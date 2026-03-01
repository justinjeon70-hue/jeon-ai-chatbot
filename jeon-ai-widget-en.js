/**
 * Dr. Justin Jeon AI Chatbot Widget (English) v1.1
 * For drjustinjeon.com
 *
 * Usage: <script src="jeon-ai-widget-en.js"></script> before </body>
 */
(function() {
    'use strict';

    // ═══════════════════════════════════════════
    // CSS
    // ═══════════════════════════════════════════
    const style = document.createElement('style');
    style.textContent = `
        /* ── Toggle Button ── */
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

        /* ── Tooltip Bubble ── */
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

        /* ── Badge ── */
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

        /* ── Chat Window ── */
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

        /* ── Header ── */
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

        /* ── Messages ── */
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

        /* ── Welcome Card ── */
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

        /* ── Typing Indicator ── */
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

        /* ── Input Area ── */
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

        /* ── Voice Input (Mic) Button ── */
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

        /* ── TTS Speaker Button ── */
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

        /* ── Feedback Buttons ── */
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

        /* ── Offline Badge ── */
        .jeon-offline-badge {
            display: inline-block;
            font-size: 9.5px;
            color: #ff9500;
            font-weight: 500;
            margin-left: 6px;
        }

        /* ── Health Risk Assessment ── */
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

        /* ── Mobile Responsive ── */
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
    // HTML
    // ═══════════════════════════════════════════
    const widget = document.createElement('div');
    widget.id = 'jeon-ai-widget';
    widget.innerHTML = `
        <!-- Tooltip Bubble -->
        <div id="jeon-ai-tooltip">Ask me about exercise & health!</div>

        <!-- Toggle Button -->
        <button id="jeon-ai-toggle" aria-label="Open AI Chat">
            <svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            <span id="jeon-ai-badge">1</span>
        </button>

        <!-- Chat Window -->
        <div id="jeon-ai-chat">
            <div id="jeon-ai-header">
                <div id="jeon-ai-avatar">JY</div>
                <div id="jeon-ai-header-text">
                    <h3>Dr. Justin Jeon AI</h3>
                    <p>Evidence-based Exercise & Health Advisor</p>
                </div>
                <button id="jeon-ai-close" aria-label="Close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>

            <div id="jeon-ai-messages">
                <div id="jeon-ai-welcome">
                    <h4>Ask me anything</h4>
                    <p>Evidence-based exercise medicine &<br>salutogenesis health AI advisor</p>
                    <div class="jeon-tags">
                        <span class="jeon-tag">Salutogenesis</span>
                        <span class="jeon-tag">Exercise is Medicine</span>
                        <span class="jeon-tag">Muscle is Medicine</span>
                        <span class="jeon-tag">Oxytocin</span>
                        <span class="jeon-tag">E-factor</span>
                    </div>
                    <div id="jeon-ai-examples"></div>
                    <div class="jeon-assess-btns">
                        <button class="jeon-assess-btn" data-assess="diabetes">🩺 Diabetes Risk</button>
                        <button class="jeon-assess-btn" data-assess="ckd">🏥 CKD Risk</button>
                        <button class="jeon-assess-btn" data-assess="cancer">🎗 Cancer Recurrence</button>
                    </div>
                </div>
            </div>

            <div id="jeon-ai-input-area">
                <textarea id="jeon-ai-input" placeholder="Ask about exercise and health..." rows="1"></textarea>
                <button id="jeon-ai-mic" aria-label="Voice input" style="display:none;">
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
                This does not replace medical diagnosis or treatment. Please consult your doctor.
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    // ═══════════════════════════════════════════
    // Fallback Responses (English)
    // ═══════════════════════════════════════════
    const responses = {
        "cancer": `Great question. The ACSM's 2019 consensus statement recommends <strong>at least 150 minutes of moderate-intensity exercise per week</strong> for cancer patients.\n\nKey evidence:\n• Colorectal cancer recurrence reduced by <em>30-40%</em> (JAMA, 2005)\n• Significant reduction in breast cancer mortality (Holmes et al.)\n• Post-surgical bowel function improved 6.54x in clinical studies\n\nFrom a salutogenesis perspective, exercise is a form of 'positive stress' that strengthens the body.\n\n<strong>Important:</strong> Always coordinate with your oncology team regarding exercise intensity and timing around treatments.\n\n<strong>"Don't rest — move."</strong> Exercise is one of the most powerful medicines for cancer patients.`,

        "dementia": `The <em>Lancet Commission (2020)</em> identified physical inactivity as one of 12 modifiable risk factors for dementia.\n\nRecent research views dementia as <strong>'Type 3 Diabetes'</strong> — driven by brain insulin resistance and mitochondrial dysfunction.\n\n<strong>Evidence:</strong>\n• Erickson et al. (PNAS, 2011): Aerobic exercise increased hippocampal volume by <em>2%</em>\n• Finnish cohort study: Higher fitness = lower dementia incidence\n• Cochrane Review: Exercise improves cognitive function\n\n<strong>Recommended exercises:</strong>\n1. <strong>Walking</strong> — 5x/week, 30+ minutes (WHO guidelines)\n2. <strong>Squats, calf raises, back extensions</strong> — the 3 anti-aging exercises\n3. <strong>Exercise with others</strong> — oxytocin synergy\n\n<strong>Exercise is medicine, and togetherness is medicine too.</strong>`,

        "diabetes": `There's strong evidence for hope.\n\nThe US DPP study (NEJM, 2002) showed <strong>lifestyle intervention reduced diabetes risk by 58%</strong> — nearly double the 31% from medication alone.\n\nDiabetes <em>remission</em> is possible:\n• UK DiRECT (Lancet, 2018): <strong>46% achieved remission</strong>\n• DIADEM-I (Lancet, 2020): <strong>61% achieved remission</strong>\n\n<strong>Why is exercise more powerful than medication?</strong>\nMedication controls blood sugar, but exercise addresses the root cause — mitochondrial dysfunction and insulin resistance. This is the salutogenesis approach: treating the cause, not just the symptom.\n\nWork with your healthcare team to combine medication + exercise. <strong>Exercise is the most powerful medicine.</strong>`,

        "adhd": `Meta-analyses (Cerrillo-Urbina, 2015; Vysniauske, 2020) confirm that <strong>exercise significantly improves attention, impulse control, and executive function</strong> in children with ADHD.\n\nFrom the brain energy perspective (P-factor):\n• <strong>DMN</strong> — overactive in ADHD → distraction\n• <strong>SN</strong> — weakened → focus failure\n• <strong>CEN</strong> — weakened → planning deficits\n\nExercise improves mitochondrial function to restore network balance.\n\n<strong>Practical tips:</strong>\n• <strong>Exercise before study</strong> improves focus (Hillman, Pediatrics, 2014)\n• Cardio fitness correlates with math & reading (Castelli, 2007)\n• Running, swimming, cycling 3-5x/week recommended\n\n<strong>"Make the heart beat, and the brain will follow."</strong>`,

        "sleep": `The key mechanism is <strong>adenosine</strong>. During the day, adenosine builds up in the brain, creating natural sleep pressure.\n\nExercise increases adenosine through ATP consumption:\n• Moderate exercise: <em>~5x increase</em>\n• High-intensity: <em>10-20x increase</em>\n\nMeta-analysis (Kovacevic, Sleep Med Rev, 2018) confirms regular exercise significantly improves sleep quality.\n\n<strong>Additional evidence:</strong>\n• Sleep deprivation → insulin resistance increases 16-32% (Spiegel, Lancet)\n• Time-restricted eating → 23% sleep quality improvement\n\n<strong>Tips:</strong>\n1. Exercise at moderate intensity during the day (avoid late evening)\n2. Time-restricted eating (eat within a 12-hour window)\n3. No caffeine after 2 PM (blocks adenosine)\n\n<strong>Sleep is medicine, and exercise is medicine.</strong>`,

        "muscle": `Muscle is not just for movement. It's an <strong>endocrine organ</strong> that secretes myokines (Pedersen, Nature Rev Endocrinology, 2012).\n\n<strong>Evidence:</strong>\n• Top 33% muscle mass → <em>81% lower</em> cardiovascular risk (Srikanthan, AJCN)\n• Bottom 25% muscle mass → <em>3.5x higher</em> diabetes risk\n• EWGSOP2 (2019) classified sarcopenia as a disease\n\n<strong>3 Anti-Aging Exercises:</strong>\n1. <strong>Squats</strong> — knee extensors decline ~20% with aging\n2. <strong>Calf raises</strong> — ankle extensors, fall prevention\n3. <strong>Back extensions</strong> — trunk extensors, posture maintenance\n\n"Do we lose muscle because we age, or do we age because we lose muscle?"\n<strong>Preserving muscle is preserving youth.</strong>`,

        "oxytocin": `Holt-Lunstad's meta-analysis (PLOS Medicine, 2010): <em>Strong social connections increase survival by 50%.</em> This effect rivals quitting smoking.\n\nThe biological mediator is <strong>oxytocin</strong>.\n\n<strong>Effects:</strong>\n• Inhibits cancer cell proliferation\n• Improves dementia symptoms (animal models)\n• Reduces blood pressure (Light et al., 2005)\n• Accelerates wound healing (Kiecolt-Glaser, 2005)\n• Pet bonding increases oxytocin (Nagasawa et al., Science, 2015)\n\n<strong>Ways to boost oxytocin:</strong>\n1. Sharing meals together\n2. Physical touch & hugs\n3. Exercising with others\n4. Bonding with pets\n5. Singing together\n6. Chatting with friends\n7. Volunteering\n\nLearn more in the book "The Oxytocin Story."\n\n<strong>Exercise is medicine, and love is medicine.</strong>`
    };

    function getResponse(msg) {
        const lower = msg.toLowerCase();
        for (const [kw, resp] of Object.entries(responses)) {
            if (lower.includes(kw)) return resp;
        }
        return `Great question. Let me answer from the perspective of evidence-based exercise medicine and salutogenesis.\n\nHealth is not simply the absence of disease. According to the WHO, we all exist on a continuum between Ease and Dis-ease. Through <strong>exercise, nutrition, sleep, and social connection</strong>, we can move toward Ease.\n\nTo give you a more specific answer, please let me know which topic interests you:\n\n• Cancer & Exercise (ACSM guidelines)\n• Diabetes & Lifestyle (DPP, DiRECT studies)\n• Dementia Prevention (Lancet Commission)\n• Muscle & Aging (Sarcopenia)\n• Sleep Health\n• Oxytocin & Relationships\n• Children & Youth (ADHD, ASD)`;
    }

    // ═══════════════════════════════════════════
    // Sample Question Pool (random 5 shown)
    // ═══════════════════════════════════════════
    const allQuestions = [
        "I'm undergoing chemo. Is it safe to exercise?",
        "What exercises help prevent dementia?",
        "I was diagnosed with diabetes. Can exercise help?",
        "My child has ADHD. Can exercise make a difference?",
        "I have trouble sleeping. Does exercise help with insomnia?",
        "How does oxytocin affect our health?",
        "Why do we lose muscle as we age? How can I prevent it?",
        "What is salutogenesis?",
        "For weight loss, is exercise or diet more important?",
        "Can exercise work as an antidepressant?",
        "What's the link between dopamine and exercise?",
        "What is insulin resistance? Can exercise reverse it?",
        "What exercises are best for heart health?",
        "Is intermittent fasting good for health?",
        "How does chronic stress affect the body?",
        "What is the glymphatic system in the brain?",
        "Why are mitochondria so important for health?",
        "What are the P-factor and E-factor?",
        "Is exercising with others really better than alone?",
        "What's the connection between sleep and Alzheimer's?",
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
    // Interaction Logic
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
        // Stop TTS
        if (synth && synth.speaking) {
            synth.cancel();
            if (currentTtsBtn) {
                currentTtsBtn.classList.remove('speaking');
                currentTtsBtn = null;
            }
        }
        // Stop STT
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

    // API URL
    const API_URL = window.JEON_AI_API_URL || '/api/chat';
    const sessionId = 'sess_en_' + Math.random().toString(36).slice(2, 10);

    // Conversation history (sent to server + saved to sessionStorage)
    const conversationHistory = [];
    const STORAGE_KEY = 'jeon-ai-chat-en';

    // ═══════════════════════════════════════════
    // Voice Configuration
    // ═══════════════════════════════════════════
    const VOICE_LANG = 'en-US';
    const VOICE_LABELS = {
        micStart: 'Start voice input',
        micStop: 'Stop voice input',
        ttsPlay: 'Read aloud',
        ttsStop: 'Stop reading',
        micDenied: 'Microphone access was denied. Please allow microphone permission in your browser settings.'
    };

    // TTS helpers
    const synth = window.speechSynthesis;

    function stripHtmlForTts(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    let currentTtsBtn = null;
    function speakText(text, btn) {
        if (!synth) return;
        if (synth.speaking && currentTtsBtn === btn) {
            synth.cancel();
            btn.classList.remove('speaking');
            currentTtsBtn = null;
            return;
        }
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
            // Wrap content in span so TTS doesn't read sender label
            const contentSpan = document.createElement('span');
            contentSpan.className = 'jeon-msg-content';
            contentSpan.innerHTML = content;
            div.innerHTML = `<div class="jeon-sender">Dr. Jeon AI</div>`;
            div.appendChild(contentSpan);
            // TTS button (reads content only)
            if (synth) {
                const ttsBtn = createTtsButton();
                ttsBtn.addEventListener('click', () => {
                    const msgText = stripHtmlForTts(contentSpan.innerHTML);
                    speakText(msgText, ttsBtn);
                });
                div.appendChild(ttsBtn);
            }
            // Feedback buttons
            const feedback = document.createElement('div');
            feedback.className = 'jeon-feedback';
            feedback.innerHTML = `<button class="jeon-feedback-btn" data-vote="up" aria-label="Helpful">&#128077;</button><button class="jeon-feedback-btn" data-vote="down" aria-label="Not helpful">&#128078;</button>`;
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

    function addStreamMsg() {
        const welcome = document.getElementById('jeon-ai-welcome');
        if (welcome) welcome.style.display = 'none';

        const div = document.createElement('div');
        div.className = 'jeon-msg ai';
        div.innerHTML = `<div class="jeon-sender">Dr. Jeon AI</div><span class="jeon-stream-text"></span>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
        return div;
    }

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
        div.innerHTML = `<div class="jeon-sender">Dr. Jeon AI</div><div class="jeon-typing"><span></span><span></span><span></span></div>`;
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

        // 30s timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: msg,
                    session_id: sessionId,
                    lang: 'en',
                    history: conversationHistory.slice(0, -1)
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
                addMsg(data.text, false); // addMsg handles formatText internally
                conversationHistory.push({ role: 'assistant', content: data.text });
            } else if (data.error) {
                throw new Error(data.error);
            }

        } catch (err) {
            clearTimeout(timeout);
            hideTyping();
            // Fallback to demo response + offline indicator
            const fallback = getResponse(msg);
            const msgDiv = addMsg(fallback, false, true);
            const badge = document.createElement('span');
            badge.className = 'jeon-offline-badge';
            badge.textContent = '(offline mode)';
            const sender = msgDiv.querySelector('.jeon-sender');
            if (sender) sender.appendChild(badge);
            conversationHistory.push({ role: 'assistant', content: fallback });
        }

        // Save to sessionStorage
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
    // Voice Input (STT)
    // ═══════════════════════════════════════════
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isListening = false;
    const micBtn = document.getElementById('jeon-ai-mic');

    let silenceTimer = null;
    const SILENCE_TIMEOUT = 5000; // 5s auto-stop on silence

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
            resetSilenceTimer(); // Reset timer on each speech result
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
        };

        micBtn.addEventListener('click', () => {
            if (isListening) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });
    }

    // Restore session (keep conversation across page refresh)
    try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
            const history = JSON.parse(saved);
            history.forEach(h => {
                if (h.role === 'user') {
                    addMsg(h.content, true);
                } else {
                    addMsg(h.content, false, true);
                }
            });
            conversationHistory.push(...history);
        }
    } catch(e) {}

    // ═══════════════════════════════════════════
    // Health Risk Assessment Models
    // ═══════════════════════════════════════════
    const RISK_MODELS = {
        diabetes: {
            title: 'Undiagnosed Diabetes Risk Assessment',
            citation: 'Park & Jeon (Epid Health 2022); Park et al. (NMCD 2023); Park et al. (KSEP 2020)',
            maxScore: 20,
            levels: [
                { max: 5, label: 'Low', color: '#34c759', emoji: '🟢' },
                { max: 10, label: 'Moderate', color: '#ff9500', emoji: '🟡' },
                { max: 14, label: 'High', color: '#ff6b35', emoji: '🟠' },
                { max: 20, label: 'Very High', color: '#ff3b30', emoji: '🔴' }
            ],
            fields: [
                { id: 'gender', label: 'Gender', type: 'select', options: [['male','Male'],['female','Female']] },
                { id: 'age', label: 'Age', type: 'number', placeholder: 'e.g. 55', min: 20, max: 100 },
                { id: 'rhr', label: 'Resting Heart Rate (bpm)', type: 'number', placeholder: 'e.g. 72', min: 40, max: 150 },
                { id: 'wc', label: 'Waist Circumference (cm)', type: 'number', placeholder: 'e.g. 90', min: 50, max: 160 }
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
            title: 'CKD Risk for Diabetes Patients',
            citation: 'Park & Jeon (BMC Public Health 2024)',
            maxScore: 16,
            levels: [
                { max: 4, label: 'Low', color: '#34c759', emoji: '🟢' },
                { max: 8, label: 'Moderate', color: '#ff9500', emoji: '🟡' },
                { max: 12, label: 'High', color: '#ff6b35', emoji: '🟠' },
                { max: 16, label: 'Very High', color: '#ff3b30', emoji: '🔴' }
            ],
            fields: [
                { id: 'gender', label: 'Gender', type: 'select', options: [['male','Male'],['female','Female']] },
                { id: 'age', label: 'Age', type: 'number', placeholder: 'e.g. 60', min: 20, max: 100 },
                { id: 'rhr', label: 'Resting Heart Rate (bpm)', type: 'number', placeholder: 'e.g. 75', min: 40, max: 150 },
                { id: 'duration', label: 'Diabetes Duration (years)', type: 'number', placeholder: 'e.g. 8', min: 0, max: 50 },
                { id: 'hypertension', label: 'Hypertension', type: 'select', options: [['no','No'],['yes','Yes']] }
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
            title: 'Colorectal Cancer Recurrence Risk',
            citation: 'Park & Jeon (PLOS ONE 2018); Cho & Jeon (Cancer Epi 2025)',
            maxScore: 14,
            levels: [
                { max: 3, label: 'Low', color: '#34c759', emoji: '🟢' },
                { max: 7, label: 'Moderate', color: '#ff9500', emoji: '🟡' },
                { max: 10, label: 'High', color: '#ff6b35', emoji: '🟠' },
                { max: 14, label: 'Very High', color: '#ff3b30', emoji: '🔴' }
            ],
            fields: [
                { id: 'rhr', label: 'Resting Heart Rate (bpm)', type: 'number', placeholder: 'e.g. 72', min: 40, max: 150 },
                { id: 'bodyfat', label: 'Body Fat (%)', type: 'select', options: [['normal','Normal (M<20/F<28)'],['over','Overweight (M20-25/F28-33)'],['obese','Obese (M25-30/F33-38)'],['severe','Severely Obese (M>30/F>38)']] },
                { id: 'activity', label: 'Weekly Physical Activity', type: 'select', options: [['active','Active (≥150 min/wk)'],['moderate','Moderate (75-149 min/wk)'],['low','Low (1-74 min/wk)'],['inactive','Inactive (almost none)']] },
                { id: 'stage', label: 'Cancer Stage', type: 'select', options: [['1','Stage I'],['2','Stage II'],['3','Stage III'],['4','Stage IV']] }
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
        'Low': 'Maintain your current lifestyle. Aim for 150 min/week moderate aerobic exercise + 2x/week strength training.',
        'Moderate': 'Aim for 150-300 min/week aerobic exercise, 2-3x/week strength training (squats, calf raises, back extensions). Walk 30 minutes daily.',
        'High': 'Consult a specialist before starting. Begin with walking 30 min 5x/week and 15-min walks after meals.',
        'Very High': 'Medical consultation is essential. Start with low-intensity walking and work under professional supervision.'
    };

    const DIET_RECS = {
        diabetes: 'Practice time-restricted eating (eat within 12 hours), limit refined carbohydrates, and increase dietary fiber.',
        ckd: 'Consider a low-protein diet, limit sodium intake, and manage fluid intake carefully.',
        cancer: 'Follow an anti-inflammatory diet. Increase vegetables and fruits, and limit processed meat.'
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
        html += '<button class="jeon-assess-submit" data-model="' + modelKey + '">Assess</button></div>';
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
        html += '<h5>' + model.title + ' Result</h5>';
        html += '<div class="jeon-risk-meter"><div class="jeon-risk-bar" style="width:' + pct + '%;background:' + level.color + ';"></div></div>';
        html += '<div class="jeon-risk-label" style="color:' + level.color + ';">' + level.emoji + ' ' + level.label + ' Risk</div>';
        html += '<div class="jeon-risk-score">Score: ' + score + ' / ' + model.maxScore + '</div>';
        html += '<div class="jeon-recommend"><h6>🏃 Exercise Recommendation</h6><p>' + EXERCISE_RECS[level.label] + '</p></div>';
        html += '<div class="jeon-recommend"><h6>🥗 Diet Recommendation</h6><p>' + DIET_RECS[modelKey] + '</p></div>';
        html += '<div class="jeon-risk-citation">📚 Source: ' + model.citation + '</div>';
        html += '<div class="jeon-risk-disclaimer">⚠️ This assessment is a reference tool based on research by Prof. Jeon\'s team and does not replace medical diagnosis.</div>';
        html += '</div>';
        return html;
    }

    // Assessment button click handlers
    document.querySelectorAll('.jeon-assess-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var modelKey = btn.getAttribute('data-assess');
            var welcome = document.getElementById('jeon-ai-welcome');
            if (welcome) welcome.style.display = 'none';
            var div = document.createElement('div');
            div.className = 'jeon-msg ai';
            div.innerHTML = '<div class="jeon-sender">Dr. Jeon AI</div>' + buildAssessmentForm(modelKey);
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
                if (!valid) { alert('Please fill in all fields.'); return; }
                var score = RISK_MODELS[modelKey].calculate(values);
                var resultDiv = document.createElement('div');
                resultDiv.className = 'jeon-msg ai';
                resultDiv.innerHTML = '<div class="jeon-sender">Dr. Jeon AI</div>' + generateResult(modelKey, score);
                messages.appendChild(resultDiv);
                messages.scrollTop = messages.scrollHeight;
            });
        });
    });

    // External API
    window.jeonAI = {
        ask: function(text) {
            if (!isOpen) openChat();
            setTimeout(() => send(text), 300);
        }
    };

})();
