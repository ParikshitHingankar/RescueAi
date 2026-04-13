// ========================================
// RESCUEMESH AI — app.js
// Team Tech Yantra · Google Hackathon
// ========================================

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  generateParticles();
  simulateBatteryStatus();
  simulateDeviceCount();
  simulateLastUpdate();
  setTimeout(() => showEarlyWarning(), 5000);
});

// ==================== LOGIN ====================
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  if (tab === 'signin') {
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.getElementById('signinForm').classList.add('active');
  } else {
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
    document.getElementById('signupForm').classList.add('active');
  }
}

function doLogin() {
  const email = document.getElementById('loginEmail')?.value || 'user@rescuemesh.ai';
  if (!email && document.getElementById('loginEmail')) {
    showLoginError('Please enter your email address.');
    return;
  }
  const loginBtn = document.querySelector('#signinForm .btn-primary') ||
                   document.querySelector('#signupForm .btn-primary');
  if (loginBtn) {
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting to Network...';
    loginBtn.disabled = true;
  }
  setTimeout(() => {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('mainApp').classList.add('active');
    const userEmail = document.getElementById('loginEmail')?.value || 'user@rescuemesh.ai';
    const display = document.getElementById('userEmailDisplay');
    if (display) display.textContent = userEmail || 'user@rescuemesh.ai';
    showToast('✅ Welcome to RescueMesh AI Network!');
    showSection('homeScreen');
    setTimeout(() => showAlertBanner('⚠️ EARLY WARNING: Flood alert issued for Godavari basin. Stay on high ground. ETA: 2 hours.'), 3000);
  }, 1800);
}

function showLoginError(msg) {
  showToast('❌ ' + msg);
}

function logout() {
  document.getElementById('mainApp').classList.remove('active');
  document.getElementById('loginPage').classList.add('active');
  showToast('👋 Logged out safely.');
}

function selectRole(el, role) {
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  showToast('✅ Role selected: ' + role.charAt(0).toUpperCase() + role.slice(1));
}

function togglePass(id) {
  const input = document.getElementById(id);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

// ==================== NAVIGATION ====================
function showSection(sectionId) {
  document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
    target.scrollTop = 0;
    window.scrollTo(0, 0);
  }
}

function toggleNav() {
  const nav = document.getElementById('navLinks');
  if (nav) nav.classList.toggle('open');
}

function toggleUserMenu() {
  const menu = document.getElementById('userMenu');
  if (menu) menu.classList.toggle('hidden');
}

document.addEventListener('click', (e) => {
  const menu = document.getElementById('userMenu');
  const avatar = document.querySelector('.user-avatar');
  if (menu && avatar && !avatar.contains(e.target)) {
    menu.classList.add('hidden');
  }
});

// ==================== ALERT BANNER ====================
function showAlertBanner(text) {
  const banner = document.getElementById('alertBanner');
  const alertText = document.getElementById('alertText');
  if (banner && alertText) {
    alertText.textContent = text;
    banner.classList.remove('hidden');
    banner.style.top = '0';
    document.querySelector('.navbar').style.top = '44px';
  }
}

function closeAlert() {
  const banner = document.getElementById('alertBanner');
  if (banner) {
    banner.classList.add('hidden');
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.style.top = '0';
  }
}

function showEarlyWarning() {
  const warnings = [
    '⚠️ EARLY WARNING: Seismic activity detected 60km from Nanded. Possible M4.8 earthquake in 1 hour.',
    '🌊 EARLY WARNING: Cyclone track update — landfall expected near Konkan coast in 6 hours.',
    '🌧️ EARLY WARNING: Heavy rainfall warning — Flood risk HIGH for low-lying areas of Marathwada.',
    '🔥 EARLY WARNING: Fire weather conditions extreme in Nashik forests. Avoid open burning.',
  ];
  const msg = warnings[Math.floor(Math.random() * warnings.length)];
  showAlertBanner(msg);
}

// ==================== SOS ====================
function triggerSOS() {
  openModal('sosModal');
}

function confirmSOS() {
  closeModal('sosModal');
  const status = document.getElementById('sosStatus');
  if (status) {
    status.classList.remove('hidden');
  }
  showToast('🆘 SOS SIGNAL SENT! Emergency services notified. Help is on the way!');
  sendSystemNotification('🆘 SOS Sent', 'Your SOS signal has been broadcast to 12 nearby devices and emergency services.');

  // Vibrate if supported
  if (navigator.vibrate) {
    navigator.vibrate([300, 100, 300, 100, 300]);
  }

  // Auto redirect to alert screen
  setTimeout(() => {
    showSection('alertScreen');
  }, 2000);
}

function sendSOS() {
  const sosStatus = document.getElementById('sosStatus');
  if (sosStatus) {
    sosStatus.classList.remove('hidden');
    showToast('📡 SOS Broadcasting to all nearby devices & emergency services!');
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    sendSystemNotification('📡 SOS Broadcast', 'Your emergency signal is being broadcast to nearby devices.');
  }
}

// ==================== LOCATION ====================
function shareLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude.toFixed(4) + '° N';
      const lng = pos.coords.longitude.toFixed(4) + '° E';
      const latEl = document.getElementById('userLat');
      const lngEl = document.getElementById('userLng');
      if (latEl) latEl.textContent = lat;
      if (lngEl) lngEl.textContent = lng;
      showToast('📍 Location shared: ' + lat + ', ' + lng);
      sendSystemNotification('📍 Location Shared', 'Your real-time location is being shared with emergency services.');
    }, () => {
      showToast('📍 Location: Nanded, Maharashtra (17.9689°N, 76.8190°E)');
    });
  } else {
    showToast('📍 Location: Nanded, Maharashtra (17.9689°N, 76.8190°E)');
  }
}

// ==================== DISASTER GUIDES ====================
function showDisaster(btn, type) {
  document.querySelectorAll('.dis-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.dis-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = document.getElementById('dis-' + type);
  if (panel) panel.classList.add('active');
}

// ==================== EMERGENCY TYPES ====================
function selectEmergency(btn, type) {
  document.querySelectorAll('.etype-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showToast('Emergency type: ' + type.charAt(0).toUpperCase() + type.slice(1) + ' selected');
}

// ==================== VOLUNTEER ====================
function toggleVolunteerMode() {
  const t1 = document.getElementById('volunteerToggle');
  const t2 = document.getElementById('volunteerToggle2');
  const isOn = t1?.checked || t2?.checked;

  if (t1) t1.checked = isOn;
  if (t2) t2.checked = isOn;

  if (isOn) {
    showToast('✅ Volunteer Mode ACTIVATED! You are now visible to rescue coordinators.');
    showSection('volunteerScreen');
    sendSystemNotification('🙋 Volunteer Mode ON', 'You are now part of the active rescue network.');
  } else {
    showToast('⏸️ Volunteer Mode deactivated.');
  }
}

function selectVolRole(el, role) {
  document.querySelectorAll('.vol-role-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  showToast('✅ Role: ' + role + ' — You will receive relevant rescue tasks.');
}

function acceptRescue(btn) {
  const card = btn.closest('.rescue-card');
  if (card) {
    card.style.borderColor = 'var(--green)';
    card.style.background = 'rgba(0,255,136,0.05)';
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Accepted';
    btn.style.background = 'rgba(0,255,136,0.2)';
    btn.disabled = true;
    showToast('✅ Rescue request accepted! Navigate to victim now.');
    sendSystemNotification('🚁 Rescue Accepted', 'You have accepted a rescue request. Navigate to the victim location.');
  }
}

function navigateToVictim() {
  showToast('🗺️ Opening navigation... Calculating safest route to victim.');
  setTimeout(() => showSection('mapScreen'), 1000);
}

function completeTask(btn) {
  const item = btn.closest('.task-item');
  if (item) {
    item.style.opacity = '0.5';
    item.style.textDecoration = 'line-through';
    btn.innerHTML = '✓ Done';
    btn.disabled = true;
    showToast('✅ Task marked as completed! Great work!');
  }
}

// ==================== MODALS ====================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('hidden');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
}

// ==================== CHATBOT ====================
function openChatbot() {
  const panel = document.getElementById('chatbotPanel');
  if (panel) panel.classList.remove('hidden');
}

function closeChatbot() {
  const panel = document.getElementById('chatbotPanel');
  if (panel) panel.classList.add('hidden');
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  if (!input || !input.value.trim()) return;

  const userMsg = input.value.trim();
  input.value = '';

  appendChatMessage('user', userMsg);
  showTypingIndicator();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are RescueMesh AI, an emergency disaster response assistant built by Team Tech Yantra for Google Developer Hackathon. You help users during disasters like earthquakes, floods, fires, cyclones, tsunamis, and accidents. 
        
        Rules:
        - Give IMMEDIATE, CLEAR, ACTIONABLE advice in crisis situations
        - Use bullet points for steps
        - Always be calm but urgent when needed
        - Mention emergency numbers (112 India) when relevant
        - Keep responses concise and life-saving focused
        - Use emergency emojis to make responses scannable quickly
        - Always end with: "Stay safe. Press SOS button if immediate help needed."`,
        messages: [{ role: 'user', content: userMsg }]
      })
    });

    const data = await response.json();
    removeTypingIndicator();

    if (data.content && data.content[0]) {
      appendChatMessage('bot', data.content[0].text);
    } else {
      appendChatMessage('bot', getOfflineResponse(userMsg));
    }
  } catch (err) {
    removeTypingIndicator();
    appendChatMessage('bot', getOfflineResponse(userMsg));
  }

  scrollChatToBottom();
}

function sendSuggestion(text) {
  const input = document.getElementById('chatInput');
  if (input) {
    input.value = text;
    sendChat();
  }
}

function appendChatMessage(role, text) {
  const messages = document.getElementById('chatMessages');
  if (!messages) return;

  const msg = document.createElement('div');
  msg.className = `chat-msg ${role}`;

  if (role === 'bot') {
    msg.innerHTML = `
      <div class="bot-avatar"><i class="fas fa-robot"></i></div>
      <div class="msg-bubble">${formatChatText(text)}</div>
    `;
  } else {
    msg.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
  }

  messages.appendChild(msg);
  scrollChatToBottom();
}

function showTypingIndicator() {
  const messages = document.getElementById('chatMessages');
  if (!messages) return;

  const typing = document.createElement('div');
  typing.className = 'chat-msg bot typing-indicator';
  typing.id = 'typingIndicator';
  typing.innerHTML = `
    <div class="bot-avatar"><i class="fas fa-robot"></i></div>
    <div class="msg-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  messages.appendChild(typing);
  scrollChatToBottom();
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) indicator.remove();
}

function scrollChatToBottom() {
  const messages = document.getElementById('chatMessages');
  if (messages) {
    setTimeout(() => {
      messages.scrollTop = messages.scrollHeight;
    }, 100);
  }
}

function formatChatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/•\s/g, '• ');
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Offline fallback responses
function getOfflineResponse(msg) {
  const lowerMsg = msg.toLowerCase();

  if (lowerMsg.includes('earthquake')) {
    return `🏔️ <strong>EARTHQUAKE — IMMEDIATE ACTIONS:</strong><br><br>
    🔴 <strong>RIGHT NOW:</strong><br>
    • DROP to hands and knees immediately<br>
    • Take COVER under a sturdy table or desk<br>
    • HOLD ON until shaking stops<br><br>
    🟡 <strong>STAY AWAY FROM:</strong><br>
    • Windows, glass, heavy furniture<br>
    • Elevators — use stairs only<br><br>
    🟢 <strong>AFTER SHAKING STOPS:</strong><br>
    • Check for injuries & gas leaks<br>
    • Move to open ground away from buildings<br>
    • Expect aftershocks — stay alert<br><br>
    📞 Call 112 · Press SOS button on this app<br><br>
    Stay safe. Press SOS button if immediate help needed.`;
  }

  if (lowerMsg.includes('flood')) {
    return `🌊 <strong>FLOOD EMERGENCY — IMMEDIATE ACTIONS:</strong><br><br>
    🔴 <strong>IMMEDIATELY:</strong><br>
    • Move to highest point in building NOW<br>
    • Do NOT walk in moving water (6 inches can knock you down)<br>
    • Avoid electrical equipment<br><br>
    🟡 <strong>SIGNAL FOR HELP:</strong><br>
    • Wave bright cloth from roof/window<br>
    • Use torch at night<br>
    • Call 112 or press SOS on this app<br><br>
    🟢 <strong>SURVIVAL TIPS:</strong><br>
    • Save phone battery — use only for emergencies<br>
    • Store drinking water in clean containers<br><br>
    📞 Call 1078 (Flood Relief) · Press SOS<br><br>
    Stay safe. Press SOS button if immediate help needed.`;
  }

  if (lowerMsg.includes('fire')) {
    return `🔥 <strong>FIRE EMERGENCY — IMMEDIATE ACTIONS:</strong><br><br>
    🔴 <strong>RIGHT NOW:</strong><br>
    • Activate fire alarm immediately<br>
    • Yell "FIRE!" to alert others<br>
    • Call 101 (Fire Brigade) & 112<br><br>
    🟡 <strong>ESCAPE:</strong><br>
    • Stay LOW — smoke rises, clean air is near the floor<br>
    • Feel doors before opening (if hot, don't open)<br>
    • Use stairs ONLY — never elevator<br><br>
    🟢 <strong>IF TRAPPED:</strong><br>
    • Seal door gaps with cloth<br>
    • Signal from window with cloth or torch<br>
    • Do NOT jump unless fire is directly below<br><br>
    📞 Call 101 Fire Brigade · 112 Emergency<br><br>
    Stay safe. Press SOS button if immediate help needed.`;
  }

  if (lowerMsg.includes('cyclone') || lowerMsg.includes('hurricane') || lowerMsg.includes('storm')) {
    return `🌪️ <strong>CYCLONE EMERGENCY — ACTIONS:</strong><br><br>
    🔴 <strong>IMMEDIATELY:</strong><br>
    • Go to the strongest/innermost room<br>
    • Stay away from ALL windows<br>
    • Do NOT go outside during the storm<br><br>
    🟡 <strong>WARNING — "Eye of Storm":</strong><br>
    • If calm suddenly — DO NOT go out<br>
    • The eye is temporary — violent winds return<br><br>
    🟢 <strong>SUPPLIES NEEDED:</strong><br>
    • Water, food, flashlight, first aid kit<br>
    • Charged phone with RescueMesh AI open<br><br>
    📞 Call 112 · Monitor RescueMesh AI alerts<br><br>
    Stay safe. Press SOS button if immediate help needed.`;
  }

  if (lowerMsg.includes('tsunami')) {
    return `🌊 <strong>TSUNAMI WARNING — IMMEDIATE ACTIONS:</strong><br><br>
    🔴 <strong>MOVE NOW — Every second counts:</strong><br>
    • Run to HIGH GROUND immediately<br>
    • Go INLAND as far as possible<br>
    • Do NOT wait for official warning<br><br>
    🟡 <strong>WARNING SIGNS:</strong><br>
    • Ground shaking near coast<br>
    • Ocean suddenly recedes (reveals sea floor)<br>
    • Loud roaring sound from ocean<br><br>
    🟢 <strong>NEVER:</strong><br>
    • Go to shore to watch the waves<br>
    • Return until official all-clear given<br>
    • Multiple waves may follow — STAY HIGH<br><br>
    📞 Call 112 · RescueMesh AI is tracking waves<br><br>
    Stay safe. Press SOS button if immediate help needed.`;
  }

  if (lowerMsg.includes('accident') || lowerMsg.includes('crash')) {
    return `🚗 <strong>ACCIDENT RESPONSE — IMMEDIATE ACTIONS:</strong><br><br>
    🔴 <strong>FIRST:</strong><br>
    • Ensure YOUR safety first<br>
    • Turn on hazard lights<br>
    • Call 112 immediately<br><br>
    🟡 <strong>HELP INJURED:</strong><br>
    • Do NOT move injured person (spinal injury risk)<br>
    • Control bleeding with direct firm pressure<br>
    • Check breathing — give CPR if trained<br>
    • Keep victim warm and calm<br><br>
    🟢 <strong>WAIT FOR HELP:</strong><br>
    • Keep the scene safe<br>
    • Note vehicle numbers<br>
    • Share your location via RescueMesh AI SOS<br><br>
    📞 Call 112 · 102 Ambulance<br><br>
    Stay safe. Press SOS button if immediate help needed.`;
  }

  if (lowerMsg.includes('first aid')) {
    return `🏥 <strong>BASIC FIRST AID — Quick Reference:</strong><br><br>
    🩸 <strong>Bleeding:</strong> Apply direct pressure with clean cloth for 10+ minutes<br><br>
    💓 <strong>CPR (Unconscious, no breathing):</strong><br>
    • 30 chest compressions (hard & fast)<br>
    • 2 rescue breaths<br>
    • Repeat until help arrives<br><br>
    🔥 <strong>Burns:</strong> Cool running water for 20 min. Do NOT use ice or butter<br><br>
    🦴 <strong>Fracture:</strong> Immobilize the limb. Do NOT try to straighten<br><br>
    😵 <strong>Unconscious:</strong> Recovery position (on side). Keep airway clear<br><br>
    📞 Call 102 Ambulance immediately<br><br>
    Stay safe. Press SOS button if immediate help needed.`;
  }

  // Default response
  return `🛡️ <strong>RescueMesh AI here!</strong><br><br>
  I can help you with emergency situations. Tell me specifically what's happening:<br><br>
  • 🏔️ Earthquake response<br>
  • 🌊 Flood emergency<br>
  • 🔥 Fire emergency<br>
  • 🌪️ Cyclone/Storm<br>
  • 🌊 Tsunami<br>
  • 🚗 Accident<br>
  • 🏥 First aid help<br><br>
  📞 <strong>EMERGENCY? Call 112 immediately!</strong><br><br>
  Stay safe. Press SOS button if immediate help needed.`;
}

// ==================== TOAST ====================
function showToast(msg, duration = 3500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, duration);
}

// ==================== SYSTEM NOTIFICATIONS ====================
function sendSystemNotification(title, body) {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '🛡️',
        badge: '🛡️',
        tag: 'rescuemesh-alert'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body: body });
        }
      });
    }
  }
}

// Request notification permission on load
window.addEventListener('load', () => {
  if ('Notification' in window && Notification.permission === 'default') {
    setTimeout(() => {
      Notification.requestPermission();
    }, 4000);
  }
});

// ==================== STATUS SIMULATIONS ====================
function simulateBatteryStatus() {
  if (navigator.getBattery) {
    navigator.getBattery().then(battery => {
      const level = Math.round(battery.level * 100);
      const el = document.getElementById('batteryLevel');
      if (el) el.textContent = level + '%';
      battery.addEventListener('levelchange', () => {
        const el = document.getElementById('batteryLevel');
        if (el) el.textContent = Math.round(battery.level * 100) + '%';
      });
    });
  }
}

function simulateDeviceCount() {
  setInterval(() => {
    const el = document.getElementById('connectedDevices');
    if (el) {
      const current = parseInt(el.textContent);
      const change = Math.floor(Math.random() * 3) - 1;
      const next = Math.max(8, Math.min(20, current + change));
      el.textContent = next;
    }
  }, 8000);
}

function simulateLastUpdate() {
  const el = document.getElementById('lastUpdate');
  if (!el) return;

  let seconds = 0;
  setInterval(() => {
    seconds++;
    if (seconds < 60) {
      el.textContent = seconds + 's ago';
    } else {
      el.textContent = Math.floor(seconds / 60) + 'm ago';
    }
  }, 1000);

  // Simulate refresh
  setInterval(() => {
    seconds = 0;
    el.textContent = 'Just now';
    showToast('🛰️ Prediction data refreshed');
  }, 120000);
}

// ==================== PARTICLES ====================
function generateParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: rgba(255, ${Math.floor(Math.random() * 100)}, 0, ${Math.random() * 0.4 + 0.1});
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: particleFloat ${Math.random() * 10 + 8}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    container.appendChild(p);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
      33% { transform: translateY(-30px) translateX(15px); opacity: 0.7; }
      66% { transform: translateY(20px) translateX(-10px); opacity: 0.4; }
    }
  `;
  document.head.appendChild(style);
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
  // Escape closes modals and chatbot
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    closeChatbot();
  }

  // Ctrl+S = SOS (on main app)
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    if (!document.getElementById('mainApp').classList.contains('active')) return;
    triggerSOS();
  }
});

// ==================== REAL-TIME ALERT SIMULATION ====================
const alertMessages = [
  '⚠️ EARLY WARNING: Earthquake M4.2 detected near Osmanabad. Estimated tremors in Nanded in 45 minutes.',
  '🌊 EARLY WARNING: Flood risk elevated — Manjara river water level rising. Move to higher ground.',
  '🔥 ALERT: Forest fire spotted near Nanded hills. Smoke visible from 20km. Avoid area.',
  '🌪️ CYCLONE UPDATE: System intensifying in Bay of Bengal. Expected to make landfall in 18 hours.',
  '✅ ALL CLEAR: Seismic activity in Latur has subsided. Normal operations resumed.',
];

let alertIndex = 0;
setInterval(() => {
  if (document.getElementById('mainApp')?.classList.contains('active')) {
    alertIndex = (alertIndex + 1) % alertMessages.length;
    showAlertBanner(alertMessages[alertIndex]);
  }
}, 45000);

// ==================== SERVICE WORKER (PWA) ====================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Service worker registration for offline capability
    console.log('RescueMesh AI — Ready for offline use');
  });
}

// ==================== CONSOLE BRANDING ====================
console.log('%c🛡️ RescueMesh AI', 'color: #ff6600; font-size: 24px; font-weight: bold; font-family: Bebas Neue;');
console.log('%cTeam Tech Yantra · Google Developer Hackathon', 'color: #ff4400; font-size: 14px;');
console.log('%cDisaster Response Intelligence Platform v1.0.0', 'color: #999; font-size: 12px;');
console.log('%c⚡ Built with ❤️ to save lives', 'color: #00ff88; font-size: 12px;');
