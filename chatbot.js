/**
 * DEMON-71 Defence Rover Team - AI Assistant Client Module
 * Author: Tarikur Rahman
 */

(function () {
  'use strict';

  let chatHistory = [];

  // Create UI Elements
  function initChatbotUI() {
    // Prevent duplicate injection
    if (document.getElementById('rover-ai-panel')) return;

    // Trigger Button
    const trigger = document.createElement('button');
    trigger.id = 'rover-ai-trigger';
    trigger.className = 'rover-ai-trigger';
    trigger.setAttribute('aria-label', 'Open DEMON-71 AI Assistant');
    trigger.innerHTML = `<i class="fas fa-robot"></i><span class="rover-ai-badge"></span>`;
    document.body.appendChild(trigger);

    // Chat Panel
    const panel = document.createElement('div');
    panel.id = 'rover-ai-panel';
    panel.className = 'rover-ai-panel';
    panel.innerHTML = `
      <div class="rover-ai-header">
        <div class="rover-ai-header-left">
          <div class="rover-ai-avatar">
            <i class="fas fa-microchip"></i>
          </div>
          <div class="rover-ai-title-wrap">
            <h3>Rover AI</h3>
            <div class="rover-ai-status">
              <span class="rover-ai-status-dot"></span> Defence Rover Team Assistant
            </div>
          </div>
        </div>
        <button id="rover-ai-close" class="rover-ai-close" aria-label="Close Chat">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div id="rover-ai-body" class="rover-ai-body">
        <div class="rover-ai-welcome">
          <p><strong>Greetings! I'm Rover AI</strong>, the official assistant for the <strong>DEMON-71 Defence Rover Team</strong>. Ask me anything about our team, rover specifications, tactical modules, sensors, electronics, or future upgrades!</p>
          <div class="rover-ai-suggestions">
            <button class="rover-ai-chip" data-prompt="What is DEMON-71?">What is DEMON-71?</button>
            <button class="rover-ai-chip" data-prompt="Who are the team members?">Who are the team members?</button>
            <button class="rover-ai-chip" data-prompt="Tell me about the Bomb Defusal module">Bomb Defusal module</button>
            <button class="rover-ai-chip" data-prompt="What sensors and cameras are used?">Sensors & Electronics</button>
          </div>
        </div>
      </div>

      <div class="rover-ai-footer">
        <input type="text" id="rover-ai-input" class="rover-ai-input-field" placeholder="Ask Rover AI a question..." autocomplete="off" />
        <button id="rover-ai-send" class="rover-ai-send-btn" aria-label="Send Message">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    `;
    document.body.appendChild(panel);

    // Bind Event Listeners
    const closeBtn = document.getElementById('rover-ai-close');
    const sendBtn = document.getElementById('rover-ai-send');
    const input = document.getElementById('rover-ai-input');
    const body = document.getElementById('rover-ai-body');

    trigger.addEventListener('click', toggleChatPanel);
    closeBtn.addEventListener('click', toggleChatPanel);

    sendBtn.addEventListener('click', handleSendMessage);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });

    // Suggested Chips delegate listener
    body.addEventListener('click', function (e) {
      if (e.target.classList.contains('rover-ai-chip')) {
        const promptText = e.target.getAttribute('data-prompt');
        if (promptText) {
          input.value = promptText;
          handleSendMessage();
        }
      }
    });
  }

  function toggleChatPanel() {
    const panel = document.getElementById('rover-ai-panel');
    const triggerIcon = document.querySelector('#rover-ai-trigger i');

    if (panel) {
      panel.classList.toggle('active');
      const isOpen = panel.classList.contains('active');

      if (triggerIcon) {
        triggerIcon.className = isOpen ? 'fas fa-chevron-down' : 'fas fa-robot';
      }

      if (isOpen) {
        document.getElementById('rover-ai-input').focus();
        scrollToBottom();
      }
    }
  }

  function scrollToBottom() {
    const body = document.getElementById('rover-ai-body');
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold text **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Headings ###
    formatted = formatted.replace(/^### (.*$)/gim, '<strong style="font-size:14px; display:block; margin-top:6px;">$1</strong>');

    // Bullet points (- or *)
    const lines = formatted.split('\n');
    let inList = false;
    let result = [];

    for (let line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          inList = true;
          result.push('<ul>');
        }
        result.push(`<li>${trimmed.substring(2)}</li>`);
      } else {
        if (inList) {
          inList = false;
          result.push('</ul>');
        }
        if (trimmed.length > 0) {
          result.push(`<p>${line}</p>`);
        }
      }
    }
    if (inList) result.push('</ul>');

    return result.join('');
  }

  function appendMessage(role, text) {
    const body = document.getElementById('rover-ai-body');
    if (!body) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `rover-ai-msg ${role}`;

    const avatarIcon = role === 'bot' ? 'fa-robot' : 'fa-user';
    const formattedContent = role === 'bot' ? formatMarkdown(text) : `<p>${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`;

    msgDiv.innerHTML = `
      <div class="rover-ai-msg-avatar"><i class="fas ${avatarIcon}"></i></div>
      <div class="rover-ai-bubble">${formattedContent}</div>
    `;

    body.appendChild(msgDiv);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const body = document.getElementById('rover-ai-body');
    if (!body) return null;

    const typingDiv = document.createElement('div');
    typingDiv.id = 'rover-ai-typing-indicator';
    typingDiv.className = 'rover-ai-msg bot';
    typingDiv.innerHTML = `
      <div class="rover-ai-msg-avatar"><i class="fas fa-robot"></i></div>
      <div class="rover-ai-bubble rover-ai-typing">
        <span class="rover-ai-dot"></span>
        <span class="rover-ai-dot"></span>
        <span class="rover-ai-dot"></span>
      </div>
    `;
    body.appendChild(typingDiv);
    scrollToBottom();
    return typingDiv;
  }

  function hideTypingIndicator() {
    const indicator = document.getElementById('rover-ai-typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  async function handleSendMessage() {
    const input = document.getElementById('rover-ai-input');
    const sendBtn = document.getElementById('rover-ai-send');
    if (!input || !sendBtn) return;

    const userText = input.value.trim();
    if (!userText) return;

    // Append User Message
    appendMessage('user', userText);
    chatHistory.push({ role: 'user', text: userText });
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    // Show Typing Indicator
    showTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          history: chatHistory.slice(-8)
        }),
      });

      hideTypingIndicator();

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.reply || "I don't have that information in the team's website data yet.";

      appendMessage('bot', botReply);
      chatHistory.push({ role: 'model', text: botReply });

    } catch (error) {
      console.error('Chat error:', error);
      hideTypingIndicator();
      appendMessage('bot', "Sorry, I'm having trouble connecting right now. Please try again.");
    } finally {
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotUI);
  } else {
    initChatbotUI();
  }
})();
