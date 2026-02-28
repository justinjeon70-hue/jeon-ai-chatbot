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

        /* ── Mobile Responsive ── */
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
                </div>
            </div>

            <div id="jeon-ai-input-area">
                <textarea id="jeon-ai-input" placeholder="Ask about exercise and health..." rows="1"></textarea>
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

    function addMsg(text, isUser, isHtml) {
        const welcome = document.getElementById('jeon-ai-welcome');
        if (welcome) welcome.style.display = 'none';

        const div = document.createElement('div');
        div.className = `jeon-msg ${isUser ? 'user' : 'ai'}`;
        if (!isUser) {
            const content = isHtml ? text : formatText(text);
            div.innerHTML = `<div class="jeon-sender">Dr. Jeon AI</div>${content}`;
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
        input.value = '';
        input.style.height = 'auto';
        sendBtn.disabled = true;

        showTyping();

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, session_id: sessionId, lang: 'en' })
            });

            hideTyping();

            if (!res.ok) {
                let errMsg = 'Server error';
                try { const err = await res.json(); errMsg = err.error || errMsg; } catch(e) {}
                throw new Error(errMsg);
            }

            const data = await res.json();
            if (data.text) {
                addMsg(formatText(data.text), false);
            } else if (data.error) {
                throw new Error(data.error);
            }

        } catch (err) {
            hideTyping();
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

    // External API
    window.jeonAI = {
        ask: function(text) {
            if (!isOpen) openChat();
            setTimeout(() => send(text), 300);
        }
    };

})();
