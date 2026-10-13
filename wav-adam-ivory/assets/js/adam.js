/* ==========================================================
   FAS ADAM UI v4 · Chat ready + Voice orb ready
   ----------------------------------------------------------
   This file draws the chat and the orb. It does NOT talk to any
   server. The build team connects ADAM by listening for the
   events below and calling the FAS.chat / FAS.orb methods.

   PUBLIC API (window.FAS)
     FAS.chat.addMessage({ role: 'agent' | 'user' | 'note', text: '...', tag: 'EXTRACT' })
     FAS.chat.setTyping(true | false)
     FAS.orb.setState('idle' | 'listening' | 'thinking' | 'speaking')
     FAS.voice.setTranscript('words so far...')
     FAS.mode('text' | 'voice')

   EVENTS (listen with document.addEventListener)
     'fas:send'      detail: { text }        user pressed Send
     'fas:hint'      detail: { text }        user tapped a hint chip
     'fas:not-sure'  detail: {}              user tapped "I am not sure"
     'fas:mic'       detail: { listening }   mic turned on or off
     'fas:voice-end' detail: {}              user ended voice
     'fas:orb-state' detail: { state }       orb changed state

   EXAMPLE (backend wiring, for the dev)
     document.addEventListener('fas:send', async function (e) {
       FAS.chat.setTyping(true);
       const reply = await yourApi(e.detail.text);   // your code
       FAS.chat.setTyping(false);
       FAS.chat.addMessage({ role: 'agent', text: reply });
     });
   ========================================================== */
(function () {
  'use strict';

  var FAS = window.FAS = window.FAS || {};
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function emit(name, detail) { document.dispatchEvent(new CustomEvent(name, { detail: detail || {} })); }
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- MODE (Type / Talk) ---------------- */
  FAS.mode = function (mode) {
    var tab = document.getElementById(mode === 'voice' ? 'tab-voice' : 'tab-text');
    if (tab) tab.click();
  };
  $$('[data-goto-voice]').forEach(function (b) { b.addEventListener('click', function () { FAS.mode('voice'); }); });
  $$('[data-goto-text]').forEach(function (b) { b.addEventListener('click', function () { FAS.mode('text'); }); });
  if (window.location.hash === '#voice') FAS.mode('voice');

  /* ---------------- ORB ---------------- */
  var LABELS = {
    idle: 'Tap the mic and start talking',
    listening: 'Listening...',
    thinking: 'Thinking...',
    speaking: 'ADAM is talking'
  };

  FAS.orb = {
    states: Object.keys(LABELS),
    state: 'idle',
    setState: function (state) {
      if (!LABELS[state]) return;
      this.state = state;
      $$('[data-orb]').forEach(function (el) { el.setAttribute('data-orb-state', state); });
      $$('[data-orb-label]').forEach(function (el) { el.textContent = LABELS[state]; });
      var mic = $('[data-voice-mic]');
      if (mic) mic.setAttribute('aria-pressed', String(state === 'listening'));
      $$('[data-orb-preview]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-orb-preview') === state));
      });
      emit('fas:orb-state', { state: state });
    }
  };

  var micBtn = $('[data-voice-mic]');
  if (micBtn) {
    micBtn.addEventListener('click', function () {
      var listening = FAS.orb.state !== 'listening';
      FAS.orb.setState(listening ? 'listening' : 'idle');
      emit('fas:mic', { listening: listening });
    });
  }
  var endBtn = $('[data-voice-end]');
  if (endBtn) {
    endBtn.addEventListener('click', function () {
      FAS.orb.setState('idle');
      emit('fas:voice-end');
    });
  }
  $$('[data-orb-preview]').forEach(function (b) {
    b.addEventListener('click', function () { FAS.orb.setState(b.getAttribute('data-orb-preview')); });
  });

  /* ---------------- VOICE TRANSCRIPT ---------------- */
  FAS.voice = {
    setTranscript: function (text) {
      var el = $('[data-voice-transcript]');
      if (el) el.textContent = text;
    }
  };

  /* ---------------- CHAT ---------------- */
  var thread = $('[data-chat-thread]');
  var form = $('[data-chat-form]');
  var input = $('[data-chat-input]');

  function build(role, text, tag) {
    var tpl = document.getElementById('tpl-msg-' + role);
    if (!tpl) return null;
    var node = tpl.content.firstElementChild.cloneNode(true);
    var t = $('[data-msg-text]', node);
    if (t) t.textContent = text;            /* textContent: safe for user text */
    if (tag) { var g = $('[data-msg-tag]', node); if (g) g.textContent = tag; }
    return node;
  }

  FAS.chat = {
    addMessage: function (opts) {
      if (!thread) return null;
      var o = opts || {};
      var node = build(o.role || 'agent', o.text || '', o.tag);
      if (!node) return null;
      var typing = $('[data-chat-typing]', thread);
      thread.insertBefore(node, typing || null);
      node.scrollIntoView({ block: 'end', behavior: reduceMotion ? 'auto' : 'smooth' });
      return node;
    },
    setTyping: function (on) {
      var t = $('[data-chat-typing]');
      if (t) t.hidden = !on;
    }
  };

  function send() {
    if (!input) return;
    var text = input.value.trim();
    if (!text) { input.focus(); return; }
    FAS.chat.addMessage({ role: 'user', text: text, tag: 'YOU' });
    input.value = '';
    input.focus();
    emit('fas:send', { text: text });
  }

  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); send(); });
  if (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });
  }

  $$('[data-chat-hint]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.textContent.trim();
      FAS.chat.addMessage({ role: 'note', text: 'Try answering this: ' + text, tag: 'HINT' });
      emit('fas:hint', { text: text });
    });
  });
  $$('[data-chat-unsure]').forEach(function (b) {
    b.addEventListener('click', function () {
      FAS.chat.addMessage({ role: 'note', text: 'No problem. I marked this as a gap and will come back to it. I will not fill it in for you.', tag: 'NOTE' });
      emit('fas:not-sure');
    });
  });
})();
