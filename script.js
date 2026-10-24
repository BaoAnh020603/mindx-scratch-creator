/* ============================================================
   MindX Scratch Creator — Dashboard Script Thân Thiện
   script.js | Dễ dùng, âm thanh vui nhộn, kiểm tra logic & sáng tạo
   ============================================================ */

'use strict';

/* ── Trạng thái ứng dụng ── */
const STATE_KEY_PREFIX = 'mindx_dashboard_';
let lessonData   = null;
let totalSeconds = 0;
let timeLeft     = 0;
let timerInterval = null;
let isStarted    = false;
let isFinished   = false;
let currentVerifyingTaskId = null;

/* ── Tham chiếu DOM ── */
let timerDisplay, timerBox, timerStatusText, timerIcon;
let progressFill, progressPct, progressMsg;
let btnFinish, reviewSection, toastEl, confettiCanvas;
let btnThemeToggle, btnReset, btnStartSession, readyBanner;
let verifyModal, btnModalCancel, btnModalConfirm;


/* ── Fallback Data Mặc Định (Chạy offline mượt mà kể cả khi mở file://) ── */
const DEFAULT_FALLBACK_LESSON = {
  "id": "bai3-phan2",
  "title": "Bài 3 - Hành Trình Bí Ngô (Phần 2)",
  "subtitle": "Bắn Đạn, Va Chạm & Hiệu Ứng",
  "course": "MindX Scratch Creator",
  "duration": 60,
  "scratchUrl": "https://scratchfoundation.github.io/scratch-gui/",
  "tasks": [
    {
      "id": "task1",
      "title": "Nhiệm vụ 1: Hiệu ứng Hover Nút Bấm",
      "icon": "🖱️",
      "description": "Làm nút bấm có phản hồi khi người chơi di chuyển chuột qua (phóng to nhẹ khi hover, trở về ban đầu khi rời chuột).",
      "hint": {
        "concept": "Tư duy logic: Cần kiểm tra liên tục xem con trỏ chuột có đang chạm vào nút hay không để đổi kích thước (size).",
        "keywords": ["Vòng lặp forever (liên tục)", "Khối điều khiển if...else (nếu...ngược lại)", "Khối cảm biến touching mouse-pointer? (đang chạm con trỏ chuột)", "Khối hiển thị set size to...% (đặt kích thước)"],
        "creativeIdea": "💡 Ý tưởng sáng tạo: Thay vì chỉ đổi kích thước, em có thể thử đổi hiệu ứng màu (change color effect) hoặc phát âm thanh nhẹ (play sound pop) khi hover!"
      },
      "verification": {
        "question": "Khi kiểm tra nút bấm trên màn hình Scratch, điều gì đã xảy ra?",
        "options": [
          "Nút tự động phóng to khi di chuột vào và thu nhỏ lại khi rê chuột ra ngoài",
          "Nút chỉ đứng yên không có phản hồi gì",
          "Em đã sáng tạo thêm hiệu ứng khác (đổi màu / đổi trang phục / âm thanh)"
        ],
        "validIndices": [0, 2]
      }
    },
    {
      "id": "task2",
      "title": "Nhiệm vụ 2: Bắn đạn Water theo vị trí chuột",
      "icon": "💧",
      "description": "Lập trình để Farmer bắn ra các tia nước bay về hướng con trỏ chuột khi người chơi nhấn nút bắn (phím Space hoặc bấm chuột).",
      "hint": {
        "concept": "Tư duy logic: Sử dụng cơ chế Bản sao (Clone) để tạo nhiều viên đạn bay độc lập.",
        "keywords": ["Tạo bản sao: create clone of myself", "Khi là bản sao: when I start as a clone", "Xuất phát từ Farmer: go to Farmer", "Định hướng: point towards mouse-pointer", "Di chuyển liên tục cho tới khi chạm cạnh: repeat until touching edge -> move steps", "Xóa đạn: delete this clone"],
        "creativeIdea": "💡 Ý tưởng sáng tạo: Em có thể tạo hiệu ứng đạn xoay tròn khi bay, hoặc thêm đạn đôi / đạn chùm nếu muốn trò chơi hấp dẫn hơn!"
      },
      "verification": {
        "question": "Sau khi nhấn phím bắn, đạn nước hoạt động như thế nào?",
        "options": [
          "Đạn xuất phát từ Farmer, bay đúng hướng chuột và biến mất khi chạm viền",
          "Đạn bị đứng yên ở góc màn hình",
          "Em đã lập trình đạn sáng tạo theo cách riêng (đạn chùm / xoay / bắn nhanh)"
        ],
        "validIndices": [0, 2]
      }
    },
    {
      "id": "task3",
      "title": "Nhiệm vụ 3: Xử lý Va Chạm, Điểm & Máu (HP)",
      "icon": "💥",
      "description": "Xử lý tương tác giữa Đạn - Quái vật (cộng điểm, biến mất) và Quái vật - Farmer (trừ máu HP, hiệu ứng phản hồi).",
      "hint": {
        "concept": "Tư duy logic: Dùng khối cảm biến va chạm touching để kích hoạt thay đổi biến số và hiệu ứng.",
        "keywords": ["Kiểm tra va chạm: touching [tên nhân vật]?", "Cộng điểm khi bắn trúng: change Score by 10", "Trừ máu khi bị đụng: change HP by -1", "Hiệu ứng bị thương: dùng repeat kết hợp hide và show với khoảng chờ ngắn", "Xóa bản sao đạn: delete this clone"],
        "creativeIdea": "💡 Ý tưởng sáng tạo: Em có thể tạo hiệu ứng quái vật nổ tung thành nhiều mảnh, hoặc thêm âm thanh lúc nhận điểm / mất máu!"
      },
      "verification": {
        "question": "Khi va chạm xảy ra trong trò chơi của em:",
        "options": [
          "Đạn trúng quái được cộng điểm và quái/đạn biến mất, Farmer chạm quái bị trừ HP kèm hiệu ứng",
          "Các nhân vật đi xuyên qua nhau mà không có chuyện gì xảy ra",
          "Em đã sáng tạo thêm cơ chế điểm combo / nổ hiệu ứng / hồi máu đặc biệt"
        ],
        "validIndices": [0, 2]
      }
    }
  ],
  "knowledge": [
    {
      "icon": "🖱️",
      "title": "1. Hiệu ứng Hover Nút Bấm",
      "desc": "Sử dụng khối cảm biến `đang chạm [con trỏ chuột]?` kết hợp với `đặt kích thước` để người chơi biết nút đang được chọn."
    },
    {
      "icon": "💧",
      "title": "2. Cơ chế Bắn Đạn (Clone)",
      "desc": "Tạo đạn bằng `tạo bản sao của chính tôi`, cho đạn xuất phát từ nhân vật chính và `hướng về phía con trỏ chuột`."
    },
    {
      "icon": "💥",
      "title": "3. Xử lý Va Chạm & Tính Điểm",
      "desc": "Dùng điều kiện `đang chạm [nhân vật]?` để kích hoạt sự kiện: xóa đạn, cộng điểm hoặc trừ biến Máu (HP)."
    },
    {
      "icon": "✨",
      "title": "4. Hiệu ứng Bị Thương (Nhấp nháy)",
      "desc": "Dùng vòng lặp `lặp lại 3 lần` kết hợp xen kẽ `ẩn` và `hiện` kèm lệnh `đợi 0.15s` để làm nhân vật nhấp nháy chân thực."
    }
  ]
};

/* ── Âm thanh Web Audio API ── */
function playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Trình duyệt chặn âm thanh, bỏ qua an toàn
  }
}

function playCheckSound() {
  playTone(523.25, 'triangle', 0.12, 0.15); // C5
  setTimeout(() => playTone(659.25, 'triangle', 0.2, 0.12), 80); // E5
}

function playStartSound() {
  playTone(440, 'triangle', 0.1, 0.15); // A4
  setTimeout(() => playTone(554.37, 'triangle', 0.1, 0.15), 90); // C#5
  setTimeout(() => playTone(659.25, 'triangle', 0.25, 0.2), 180); // E5
}

function playVictorySound() {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    setTimeout(() => playTone(freq, 'triangle', 0.25, 0.2), idx * 110);
  });
}

/* ── Khởi động DOM ── */
document.addEventListener('DOMContentLoaded', async () => {
  timerDisplay     = document.getElementById('timer-display');
  timerBox         = document.getElementById('timer-box');
  timerStatusText  = document.getElementById('timer-status-text');
  timerIcon        = document.getElementById('timer-icon');
  progressFill     = document.getElementById('progress-fill');
  progressPct      = document.getElementById('progress-pct');
  progressMsg      = document.getElementById('progress-msg');
  btnFinish        = document.getElementById('btn-finish');
  reviewSection    = document.getElementById('review-section');
  toastEl          = document.getElementById('toast');
  confettiCanvas   = document.getElementById('confetti-canvas');
  btnThemeToggle   = document.getElementById('btn-theme-toggle');
  btnReset         = document.getElementById('btn-reset-progress');
  btnStartSession  = document.getElementById('btn-start-session');
  readyBanner      = document.getElementById('ready-banner');

  // Modal elements
  verifyModal     = document.getElementById('verify-modal');
  btnModalCancel  = document.getElementById('btn-modal-cancel');
  btnModalConfirm = document.getElementById('btn-modal-confirm');

  // Sự kiện — dùng ?. để tránh crash khi phần tử null
  btnStartSession?.addEventListener('click', startSession);
  btnFinish?.addEventListener('click', finishLesson);
  btnThemeToggle?.addEventListener('click', toggleTheme);
  btnReset?.addEventListener('click', confirmReset);
  btnModalCancel?.addEventListener('click', closeModal);
  btnModalConfirm?.addEventListener('click', confirmVerification);

  initTheme();

  const lessonId = getLessonIdFromUrl() || 'bai3-phan2';
  await loadLesson(lessonId);
});

function getLessonIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('lesson');
}

function getStateKey(lessonId) {
  return STATE_KEY_PREFIX + lessonId;
}

/* ── Tải dữ liệu bài học ── */
async function loadLesson(lessonId) {
  try {
    const res = await fetch(`lessons/${lessonId}.json`);
    if (!res.ok) throw new Error('Không tìm thấy file bài học');
    lessonData = await res.json();
  } catch (err) {
    console.warn('Mở trực tiếp hoặc fetch thất bại. Tự động dùng fallback.', err);
    lessonData = DEFAULT_FALLBACK_LESSON;
  }

  if (lessonData) {
    renderDashboard(lessonData);
    restoreState(lessonData.id);
    setupTimerInitial(lessonData.id, lessonData.duration * 60);
    hideLoading();
  } else {
    showToast('⚠️ Không thể tải nội dung bài học. Vui lòng thử lại!', 'warning');
  }
}

/* ── Render Dashboard ── */
function renderDashboard(lesson) {
  document.title = `${lesson.title} — MindX Scratch`;

  const titleEl = document.getElementById('title-text');
  const badgeEl = document.getElementById('header-badge');
  const iframe  = document.getElementById('scratch-frame');

  if (titleEl) titleEl.textContent = lesson.title;
  if (badgeEl) badgeEl.textContent = lesson.course || 'MindX Scratch';
  if (iframe && lesson.scratchUrl) {
    // Sử dụng Scratch GUI sạch không bị lỗi embed
    iframe.src = lesson.scratchUrl;
    iframe.onload = () => hideLoading();
    setTimeout(hideLoading, 2500);
  }

  // Cập nhật nút tải tài nguyên tương ứng với từng bài
  const dlBtn = document.getElementById('btn-download-template');
  if (dlBtn && lesson.templateUrl) {
    dlBtn.href = lesson.templateUrl;
    dlBtn.download = `${lesson.id}-nhan-vat-mau.sb3`;
  }

  // Render danh sách nhiệm vụ
  const tasksContainer = document.getElementById('tasks-container');
  if (tasksContainer) {
    tasksContainer.innerHTML = '';
    lesson.tasks.forEach((task, idx) => {
      const card = createTaskCard(task, idx);
      tasksContainer.appendChild(card);
    });
  }

  // Render bảng kiến thức bảo bối
  const reviewContainer = document.getElementById('knowledge-container');
  if (reviewContainer) {
    reviewContainer.innerHTML = '';
    lesson.knowledge.forEach(ki => {
      const item = document.createElement('div');
      item.className = 'knowledge-badge-card';
      item.innerHTML = `
        <div class="badge-icon">${ki.icon}</div>
        <div>
          <div class="badge-text-title">${escapeHtml(ki.title)}</div>
          <div class="badge-text-desc">${escapeHtml(ki.desc)}</div>
        </div>`;
      reviewContainer.appendChild(item);
    });
  }
}

/* ── Tạo thẻ nhiệm vụ (Task Card) ── */
function createTaskCard(task, idx) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.id = `card-${task.id}`;

  const keywordsPills = (task.hint.keywords || [])
    .map(kw => `<span class="keyword-pill">🧩 ${escapeHtml(kw)}</span>`)
    .join('');

  card.innerHTML = `
    <div class="task-header">
      <!-- Checkbox khóa: Chỉ tích khi bấm nút Kiểm tra đạt -->
      <div class="custom-checkbox" id="chk-${task.id}" title="Hoàn thành bài rồi bấm nút 'Kiểm tra' để tích nhé!"></div>
      <div class="task-body">
        <div class="task-title-row">
          <div class="task-name">${task.icon} ${escapeHtml(task.title)}</div>
          <span class="task-status-pill" id="status-${task.id}">Đang làm</span>
        </div>
        <div class="task-desc">${escapeHtml(task.description)}</div>

        <!-- Hàng nút thao tác -->
        <div class="task-buttons-row">
          <button class="btn-toggle-hint" type="button" onclick="toggleHint('${task.id}')">
            <span id="hint-icon-${task.id}">💡</span>
            <span id="hint-btn-text-${task.id}">Xem hướng dẫn tư duy</span>
          </button>
          
          <button class="btn-verify-task" type="button" onclick="openVerifyModal('${task.id}')">
            <span>🔍 Kiểm tra hoàn thành</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Khung gợi ý tư duy (Không hiện sẵn code giải) -->
    <div class="hint-drawer" id="hint-${task.id}">
      <div class="hint-inner">
        <div class="hint-concept-box">
          🧠 ${escapeHtml(task.hint.concept)}
        </div>
        
        <div style="font-size:11.5px;font-weight:700;color:var(--text-muted);margin-bottom:4px;">
          Khối lệnh cần tư duy tìm kiếm trong Scratch:
        </div>
        <div class="hint-keywords-tags">
          ${keywordsPills}
        </div>

        <div class="hint-creative-box">
          ${escapeHtml(task.hint.creativeIdea)}
        </div>
      </div>
    </div>`;

  return card;
}

/* ── Đóng / Mở gợi ý ── */
function toggleHint(taskId) {
  const drawer   = document.getElementById(`hint-${taskId}`);
  const btnText  = document.getElementById(`hint-btn-text-${taskId}`);
  const btnIcon  = document.getElementById(`hint-icon-${taskId}`);
  if (!drawer) return;

  const isOpen = drawer.classList.contains('open');
  drawer.classList.toggle('open', !isOpen);

  if (btnText && btnIcon) {
    btnText.textContent = isOpen ? 'Xem hướng dẫn tư duy' : 'Thu gọn gợi ý';
    btnIcon.textContent = isOpen ? '💡' : '🔼';
  }
}

/* ── Mở Modal Kiểm Tra & Tự Động Quét Code SB3 ── */
let currentParsedProject = null; // Lưu project vừa quét

function openVerifyModal(taskId) {
  if (!lessonData) return;
  const task = lessonData.tasks.find(t => t.id === taskId);
  if (!task) return;

  currentVerifyingTaskId = taskId;

  const modalIcon    = document.getElementById('modal-task-icon');
  const modalTitle   = document.getElementById('modal-task-title');
  const dropzone     = document.getElementById('sb3-dropzone');
  const dropIcon     = document.getElementById('dropzone-icon');
  const dropTitle    = document.getElementById('dropzone-title');
  const dropSub      = document.getElementById('dropzone-sub');
  const resContainer = document.getElementById('scan-result-container');
  const evalBox      = document.getElementById('scan-eval-box');
  const modeChoice   = document.getElementById('verify-mode-choice');
  const confirmBtn   = document.getElementById('btn-modal-confirm');
  const fileInput    = document.getElementById('sb3-file-input');

  // Reset modal UI
  if (modalIcon)  modalIcon.textContent  = task.icon;
  if (modalTitle) modalTitle.textContent = `Kiểm Tra Tự Động: ${task.title}`;
  if (resContainer) resContainer.style.display = 'none';
  if (evalBox) evalBox.className = 'scan-eval-box';
  if (modeChoice) modeChoice.style.display = 'none';
  if (confirmBtn) confirmBtn.disabled = true;
  if (fileInput)  fileInput.value = '';

  if (dropIcon)  dropIcon.textContent = '📥';
  if (dropTitle) dropTitle.innerHTML = 'Kéo thả file .sb3 vào đây hoặc <span class="browse-link">Chọn file từ máy</span>';
  if (dropSub)   dropSub.textContent = 'Hệ thống sẽ giải mã phân tích toàn bộ khối lệnh Scratch của em trong 0.2s';

  // Thiết lập sự kiện kéo thả file
  setupDropzone();

  // Reset radio approach
  const approachRadios = document.querySelectorAll('input[name="task-approach"]');
  approachRadios.forEach(r => { r.checked = r.value === 'standard'; });

  const vm = verifyModal || document.getElementById('verify-modal');
  if (vm) vm.style.display = 'flex';
}

function setupDropzone() {
  const dropzone = document.getElementById('sb3-dropzone');
  const fileInput = document.getElementById('sb3-file-input');
  if (!dropzone || !fileInput) return;

  // Tránh gắn trùng listener
  dropzone.onclick = () => fileInput.click();

  fileInput.onchange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleSb3File(e.target.files[0]);
    }
  };

  dropzone.ondragover = (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  };

  dropzone.ondragleave = () => {
    dropzone.classList.remove('dragover');
  };

  dropzone.ondrop = (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSb3File(e.dataTransfer.files[0]);
    }
  };
}

/* ── Giải mã file Scratch (.sb3) và đối chiếu khối lệnh ── */
async function handleSb3File(file) {
  const lowerName = file.name.toLowerCase();
  if (!lowerName.endsWith('.sb3') && !lowerName.endsWith('.pmp') && !lowerName.endsWith('.zip')) {
    showToast('⚠️ Vui lòng chọn file Scratch (.sb3 hoặc .pmp)!', 'warning');
    return;
  }

  const dropIcon  = document.getElementById('dropzone-icon');
  const dropTitle = document.getElementById('dropzone-title');
  const dropSub   = document.getElementById('dropzone-sub');
  const resContainer = document.getElementById('scan-result-container');
  const evalBox   = document.getElementById('scan-eval-box');
  const modeChoice= document.getElementById('verify-mode-choice');
  const confirmBtn= document.getElementById('btn-modal-confirm');

  if (dropIcon)  dropIcon.textContent = '⚙️';
  if (dropTitle) dropTitle.textContent = `Đang giải nén & phân tích: ${file.name}...`;
  if (dropSub)   dropSub.textContent = 'Kiểm tra cấu trúc JSON và các khối lệnh (opcodes)...';

  try {
    if (typeof JSZip === 'undefined') {
      throw new Error('Thư viện JSZip chưa sẵn sàng');
    }

    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    const projectJsonFile = contents.file('project.json');

    if (!projectJsonFile) {
      throw new Error('File không hợp lệ: Không tìm thấy project.json trong file .sb3');
    }

    const jsonText = await projectJsonFile.async('text');
    const projectData = JSON.parse(jsonText);
    currentParsedProject = projectData;

    // Phân tích đối chiếu với nhiệm vụ hiện tại
    evaluateProjectForTask(projectData, file.name);

  } catch (err) {
    console.error('Lỗi phân tích file SB3:', err);
    if (dropIcon)  dropIcon.textContent = '❌';
    if (dropTitle) dropTitle.textContent = 'Không thể đọc file .sb3 này!';
    if (dropSub)   dropSub.textContent = 'Em hãy kiểm tra xem file đã lưu hoàn tất từ Scratch chưa nhé.';
    
    if (resContainer && evalBox) {
      resContainer.style.display = 'block';
      evalBox.className = 'scan-eval-box failed';
      evalBox.innerHTML = `
        <div class="eval-title">❌ Lỗi đọc file</div>
        <div>Không thể giải mã file Scratch. Em hãy chắc chắn đã chọn file <b>.sb3</b> được tải từ menu Tập tin ➔ Lưu về máy tính nhé!</div>
      `;
    }
  }
}

/* ── Đối chiếu khối lệnh của Project với Nhiệm Vụ ── */
function evaluateProjectForTask(project, fileName) {
  const dropIcon  = document.getElementById('dropzone-icon');
  const dropTitle = document.getElementById('dropzone-title');
  const dropSub   = document.getElementById('dropzone-sub');
  const resContainer = document.getElementById('scan-result-container');
  const evalBox   = document.getElementById('scan-eval-box');
  const modeChoice= document.getElementById('verify-mode-choice');
  const confirmBtn= document.getElementById('btn-modal-confirm');

  const task = lessonData.tasks.find(t => t.id === currentVerifyingTaskId);
  if (!task) return;

  // Gom toàn bộ khối lệnh (opcodes, text, fields) từ tất cả Targets (Stage + Sprites)
  const allOpcodes = new Set();
  const allBlockTexts = [];
  let totalBlocks = 0;
  const spriteNames = [];

  (project.targets || []).forEach(target => {
    if (!target.isStage) spriteNames.push(target.name);
    const blocks = target.blocks || {};
    Object.values(blocks).forEach(blk => {
      if (blk && typeof blk === 'object') {
        if (blk.opcode) {
          allOpcodes.add(blk.opcode);
          totalBlocks++;
        }
        // Lưu thông tin inputs & fields để dò từ khóa
        if (blk.fields) {
          Object.values(blk.fields).forEach(f => {
            if (Array.isArray(f) && f[0]) allBlockTexts.push(String(f[0]).toLowerCase());
          });
        }
      }
    });
  });

  const allBlockString = Array.from(allOpcodes).join(' ') + ' ' + allBlockTexts.join(' ');
  const rules = task.codeRules;

  let isPassed = false;
  let feedbackMessage = '';
  let foundDetails = [];

  // Kiểm tra project có trống rỗng không
  if (totalBlocks === 0) {
    isPassed = false;
    feedbackMessage = 'Project hoàn toàn trống trơn (0 khối lệnh)! Em chưa lập trình gì trên Scratch.';
  } else if (!rules) {
    // Nếu không cấu hình rules cụ thể, chấp nhận khi project có code
    isPassed = totalBlocks >= 3;
    feedbackMessage = isPassed ? 'Đã phát hiện khối lệnh hợp lệ!' : 'Số lượng khối lệnh quá ít, em cần hoàn thành đủ yêu cầu bài!';
  } else {
    // Dò theo requiredOpcodes hoặc requiredKeywords
    let opcodeMatches = 0;
    let keywordMatches = 0;

    (rules.requiredOpcodes || []).forEach(op => {
      if (allOpcodes.has(op)) {
        opcodeMatches++;
        foundDetails.push(`Khối lệnh: <code>${op}</code>`);
      }
    });

    (rules.requiredKeywords || []).forEach(kw => {
      if (allBlockString.includes(kw.toLowerCase())) {
        keywordMatches++;
        foundDetails.push(`Từ khóa logic: <code>${kw}</code>`);
      }
    });

    // Tiêu chí đạt: Có ít nhất 1 opcode yêu cầu VÀ có từ khóa hoặc >= 50% yêu cầu
    const minOpcodeNeeded = Math.min(1, (rules.requiredOpcodes || []).length);
    const hasRequiredOp = opcodeMatches >= minOpcodeNeeded;
    const hasRequiredKw = keywordMatches >= 1;

    if (hasRequiredOp && hasRequiredKw) {
      isPassed = true;
      feedbackMessage = rules.successFeedback || 'Hệ thống đã phát hiện đầy đủ khối lệnh theo yêu cầu của nhiệm vụ!';
    } else {
      isPassed = false;
      feedbackMessage = rules.missingFeedback || 'Bài làm của em chưa có đủ khối lệnh logic cần thiết cho nhiệm vụ này!';
    }
  }

  // Cập nhật giao diện kết quả
  if (resContainer) resContainer.style.display = 'block';

  if (isPassed) {
    if (dropIcon)  dropIcon.textContent = '✅';
    if (dropTitle) dropTitle.textContent = `Đã quét thành công: ${fileName}`;
    if (dropSub)   dropSub.textContent = `Tổng cộng: ${totalBlocks} khối lệnh | ${spriteNames.length} nhân vật (${spriteNames.slice(0, 3).join(', ')})`;

    evalBox.className = 'scan-eval-box success';
    evalBox.innerHTML = `
      <div class="eval-title">🎉 ĐỐI CHIẾU THÀNH CÔNG — CODE HỢP LỆ!</div>
      <div>${escapeHtml(feedbackMessage)}</div>
      <div class="eval-details">
        <b>Đã phát hiện:</b> ${foundDetails.length > 0 ? foundDetails.join(' • ') : 'Các khối lệnh tương tác chuẩn'}<br/>
        <b>Quy mô project:</b> ${totalBlocks} khối lệnh trên ${spriteNames.length} nhân vật.
      </div>
    `;

    if (modeChoice) modeChoice.style.display = 'block';
    if (confirmBtn) confirmBtn.disabled = false;
    playCheckSound();

  } else {
    if (dropIcon)  dropIcon.textContent = '⚠️';
    if (dropTitle) dropTitle.textContent = `Chưa đạt yêu cầu: ${fileName}`;
    if (dropSub)   dropSub.textContent = 'Hệ thống đối chiếu và chưa thấy khối lệnh logic theo đề bài.';

    evalBox.className = 'scan-eval-box failed';
    evalBox.innerHTML = `
      <div class="eval-title">❌ CHƯA ĐẠT YÊU CẦU NHIỆM VỤ</div>
      <div>${escapeHtml(feedbackMessage)}</div>
      <div class="eval-details" style="color:#B91C1C;">
        👉 <b>Lời khuyên:</b> Em hãy qua màn hình Scratch bên trái, hoàn thành các khối lệnh gợi ý rồi vào menu <b>Tập tin ➔ Lưu về máy tính</b> và nạp lại file nhé!
      </div>
    `;

    if (modeChoice) modeChoice.style.display = 'none';
    if (confirmBtn) confirmBtn.disabled = true;
  }
}

function closeModal() {
  const vm = verifyModal || document.getElementById('verify-modal');
  if (vm) vm.style.display = 'none';
  currentVerifyingTaskId = null;
  currentParsedProject = null;
}

/* ── Xác nhận kết quả tự động kiểm tra ── */
function confirmVerification() {
  if (!currentVerifyingTaskId || !lessonData) return;
  const task = lessonData.tasks.find(t => t.id === currentVerifyingTaskId);
  if (!task) return;

  const approachInput = document.querySelector('input[name="task-approach"]:checked');
  const isCreative = approachInput && approachInput.value === 'creative';

  // Tích hoàn thành
  const chk = document.getElementById(`chk-${task.id}`);
  const card = document.getElementById(`card-${task.id}`);
  const status = document.getElementById(`status-${task.id}`);

  if (chk) chk.classList.add('checked');
  if (card) card.classList.add('completed');
  if (status) {
    status.textContent = isCreative ? 'Hoàn thành (Sáng tạo) 🌟' : 'Hoàn thành ⭐';
  }

  closeModal();
  playCheckSound();
  
  if (isCreative) {
    showToast('🎨 Đã tích xanh! Khen ngợi tinh thần tự do sáng tạo của em!', 'success');
  } else {
    showToast('🎉 Đã xác nhận hoàn thành nhiệm vụ!', 'success');
  }

  updateProgress();
  saveState();
}

/* ── Tính toán tiến độ ── */
function updateProgress() {
  if (!lessonData) return;
  const total = lessonData.tasks.length;
  const done  = lessonData.tasks.filter(t => {
    const chk = document.getElementById(`chk-${t.id}`);
    return chk && chk.classList.contains('checked');
  }).length;

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressPct)  progressPct.textContent  = `${pct}% (${done}/${total} task)`;

  if (progressMsg) {
    if (!isStarted) {
      progressMsg.textContent = 'Bấm "Bắt đầu làm bài" để khởi động nhé! 🚀';
    } else if (done === 0) {
      progressMsg.textContent = 'Đồng hồ đang chạy! Hãy làm nhiệm vụ 1 nào! 💪';
    } else if (done === 1) {
      progressMsg.textContent = 'Khởi đầu tuyệt vời! Cố lên nào! ⭐';
    } else if (done === 2) {
      progressMsg.textContent = 'Sắp xong rồi, chỉ còn 1 nhiệm vụ nữa thôi! 🔥';
    } else if (done >= total) {
      progressMsg.textContent = 'Đỉnh chóp! Bấm "Nộp bài" để nhận kết quả nhé! 🏆';
    }
  }

  // Khóa nút nộp bài nếu chưa hoàn thành 100% nhiệm vụ
  if (btnFinish && !isFinished) {
    if (done >= total && total > 0) {
      btnFinish.disabled = false;
      btnFinish.style.opacity = '1';
      btnFinish.style.cursor = 'pointer';
      btnFinish.innerHTML = '🎉 NỘP BÀI &amp; XEM KIẾN THỨC CỐT LÕI';
      btnFinish.title = 'Đã hoàn thành tất cả nhiệm vụ, em có thể nộp bài ngay!';
    } else {
      btnFinish.disabled = true;
      btnFinish.style.opacity = '0.65';
      btnFinish.style.cursor = 'not-allowed';
      btnFinish.innerHTML = `🔒 HOÀN THÀNH ĐỦ NHIỆM VỤ ĐỂ NỘP BÀI (${done}/${total})`;
      btnFinish.title = `Em cần hoàn thành đủ ${total} nhiệm vụ mới được phép nộp bài nhé! (Hiện tại: ${done}/${total})`;
    }
  }
}

let chosenDurationMinutes = null; // Chưa chọn phút nào khi vừa vào

/* ── Bắt đầu làm bài & tính giờ (Khóa vĩnh viễn không cho đổi thời gian) ── */
function startSession() {
  if (isStarted) return;
  if (!chosenDurationMinutes) {
    alert('Em hãy chọn một mốc thời gian (30, 45, 60 hoặc 90 phút) trước nhé!');
    return;
  }
  isStarted = true;

  playStartSound();

  // Khóa giao diện chọn thời gian & hiển thị trạng thái đang diễn ra
  readyBanner.classList.add('started');
  readyBanner.innerHTML = `
    <div class="ready-header" style="margin-bottom:0;">
      <span style="font-size:24px;">⚡</span>
      <div>
        <div class="ready-title">Buổi làm bài đang diễn ra (${chosenDurationMinutes} phút)!</div>
        <div class="ready-desc">Thời gian đã bắt đầu đếm ngược và đã được khóa cố định. Cố gắng hoàn thành nhiệm vụ nhé!</div>
      </div>
    </div>
  `;

  if (timerStatusText) timerStatusText.textContent = `Đang đếm ngược (${chosenDurationMinutes}p)`;
  if (timerIcon) timerIcon.textContent = '⏱️';
  if (timerBox) timerBox.classList.add('running');

  if (lessonData) {
    totalSeconds = chosenDurationMinutes * 60;
    timeLeft = totalSeconds;
    localStorage.setItem(`${getStateKey(lessonData.id)}_duration`, chosenDurationMinutes);
    localStorage.setItem(`${getStateKey(lessonData.id)}_time`, timeLeft);
    localStorage.setItem(`${getStateKey(lessonData.id)}_started`, 'true');
    renderTimerText();
    runCountdown(lessonData.id);
  }

  showToast(`🚀 Đã bắt đầu tính giờ ${chosenDurationMinutes} phút! Chúc em làm bài thật tốt!`, 'success');
  updateProgress();
}

/* ── Cài đặt đồng hồ ban đầu ── */
function setupTimerInitial(lessonId, defaultDurationSec) {
  const timeBtns = document.querySelectorAll('.btn-time-opt');
  const startBtn = document.getElementById('btn-start-session');

  // Lắng nghe các nút chọn thời gian 30p, 45p, 60p, 90p
  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isStarted) return; // Nếu đã bắt đầu thì không cho phép đổi
      timeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      chosenDurationMinutes = parseInt(btn.dataset.mins, 10);
      
      // Mở khóa nút bắt đầu
      if (startBtn) {
        startBtn.disabled = false;
        startBtn.style.opacity = '1';
        startBtn.style.cursor = 'pointer';
        startBtn.innerHTML = `⚡ XÁC NHẬN &amp; BẮT ĐẦU TÍNH GIỜ (${chosenDurationMinutes} PHÚT)`;
      }

      // Cập nhật hiển thị số phút trên đồng hồ
      timeLeft = chosenDurationMinutes * 60;
      totalSeconds = timeLeft;
      renderTimerText();
      if (timerStatusText) timerStatusText.textContent = `Đã chọn (${chosenDurationMinutes}:00)`;
    });
  });

  // Kiểm tra xem đã từng bấm bắt đầu chưa (đã bắt đầu thì khóa vĩnh viễn)
  const started = localStorage.getItem(`${getStateKey(lessonId)}_started`);
  const savedDuration = localStorage.getItem(`${getStateKey(lessonId)}_duration`);
  if (savedDuration) {
    chosenDurationMinutes = parseInt(savedDuration, 10);
  }

  const saved = localStorage.getItem(`${getStateKey(lessonId)}_time`);

  if (started === 'true') {
    // Đã bắt đầu làm trước đó -> khôi phục thời gian đang chạy
    isStarted = true;
    timeLeft = saved !== null ? parseInt(saved, 10) : chosenDurationMinutes * 60;
    totalSeconds = chosenDurationMinutes * 60;
    if (timeLeft <= 0) timeLeft = 0;
    renderTimerText();

    readyBanner.classList.add('started');
    readyBanner.innerHTML = `
      <div class="ready-header" style="margin-bottom:0;">
        <span style="font-size:24px;">⚡</span>
        <div>
          <div class="ready-title">Buổi làm bài đang diễn ra (${chosenDurationMinutes} phút)!</div>
          <div class="ready-desc">Thời gian đã bắt đầu đếm ngược và đã được khóa cố định. Tiếp tục hoàn thành nhé!</div>
        </div>
      </div>
    `;
    if (timerStatusText) timerStatusText.textContent = `Đang đếm ngược (${chosenDurationMinutes}p)`;
    if (timerIcon) timerIcon.textContent = '⏱️';
    if (timerBox) timerBox.classList.add('running');
    runCountdown(lessonId);
  } else {
    // Chưa bắt đầu: Mặc định hiển thị đúng 00:00 cho đến khi học sinh bấm chọn phút!
    timeLeft = 0;
    totalSeconds = 0;
    if (timerDisplay) timerDisplay.textContent = '00:00';
    if (timerStatusText) timerStatusText.textContent = 'Chưa chọn thời gian';
  }
}

function runCountdown(lessonId) {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft > 0 && !isFinished) {
      timeLeft--;
      renderTimerText();
      localStorage.setItem(`${getStateKey(lessonId)}_time`, timeLeft);
    } else if (timeLeft <= 0 && !isFinished) {
      clearInterval(timerInterval);
      if (timerBox) timerBox.classList.add('warning');
      showToast('⏰ Đã hết giờ 60 phút! Em hãy bấm Nộp bài nhé.', 'warning');
      finishLesson();
    }
  }, 1000);
}

function renderTimerText() {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const str = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  if (timerDisplay) timerDisplay.textContent = str;

  if (timerBox) {
    timerBox.classList.toggle('warning', timeLeft <= 300 && timeLeft > 0);
  }
}

/* ── Nộp bài & Hoàn thành ── */
function finishLesson() {
  if (isFinished) return;

  // Kiểm tra xem đã làm đủ task chưa
  const total = lessonData ? lessonData.tasks.length : 3;
  const done  = lessonData ? lessonData.tasks.filter(t => {
    const chk = document.getElementById(`chk-${t.id}`);
    return chk && chk.classList.contains('checked');
  }).length : 0;

  // Bắt buộc phải hoàn thành 100% nhiệm vụ mới cho nộp
  if (done < total) {
    showToast(`⚠️ Em mới hoàn thành ${done}/${total} nhiệm vụ! Hãy kiểm tra và hoàn thành đủ tất cả nhiệm vụ mới được nộp bài nhé!`, 'warning');
    alert(`⚠️ Chưa thể nộp bài!\n\nEm mới hoàn thành ${done}/${total} nhiệm vụ.\nHãy hoàn thành và bấm "Kiểm tra hoàn thành" đủ tất cả các nhiệm vụ còn lại nhé!`);
    return;
  }

  isFinished = true;
  if (timerInterval) clearInterval(timerInterval);

  reviewSection.style.display = 'block';
  reviewSection.scrollIntoView({ behavior: 'smooth' });

  btnFinish.style.background = 'linear-gradient(135deg, #FFAB19, #FF8C1A)';
  btnFinish.innerHTML = '🏆 EM ĐÃ HOÀN THÀNH BÀI HỌC XUẤT SẮC!';
  btnFinish.disabled = true;

  playVictorySound();
  launchConfetti();
  showToast('🌟 Chúc mừng em đã hoàn thành bài học!', 'success');

  if (lessonData) {
    localStorage.setItem(`${getStateKey(lessonData.id)}_finished`, 'true');
  }
}

/* ── Đổi Chế Độ Sáng / Tối ── */
function initTheme() {
  const savedTheme = localStorage.getItem('mindx_theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeBtn(true);
  } else {
    updateThemeBtn(false);
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('mindx_theme', isDark ? 'dark' : 'light');
  updateThemeBtn(isDark);
}

function updateThemeBtn(isDark) {
  const icon = document.getElementById('theme-icon');
  const text = document.getElementById('theme-text');
  if (icon) icon.textContent = isDark ? '☀️' : '🌙';
  if (text) text.textContent = isDark ? 'Chế độ sáng' : 'Chế độ tối';
}

/* ── Reset làm lại từ đầu ── */
function confirmReset() {
  if (confirm('Em có chắc muốn xóa tiến độ và bắt đầu lại bài học từ đầu không?')) {
    if (lessonData) {
      localStorage.removeItem(getStateKey(lessonData.id));
      localStorage.removeItem(`${getStateKey(lessonData.id)}_time`);
      localStorage.removeItem(`${getStateKey(lessonData.id)}_started`);
      localStorage.removeItem(`${getStateKey(lessonData.id)}_finished`);
    }
    window.location.reload();
  }
}

/* ── Lưu & Phục hồi trạng thái ── */
function saveState() {
  if (!lessonData) return;
  const key = getStateKey(lessonData.id);
  const taskStates = {};
  lessonData.tasks.forEach(t => {
    const chk = document.getElementById(`chk-${t.id}`);
    taskStates[t.id] = chk ? chk.classList.contains('checked') : false;
  });
  localStorage.setItem(key, JSON.stringify(taskStates));
}

function restoreState(lessonId) {
  const key = getStateKey(lessonId);
  const raw = localStorage.getItem(key);
  if (!raw) return;

  try {
    const taskStates = JSON.parse(raw);
    Object.entries(taskStates).forEach(([taskId, done]) => {
      if (done) {
        const chk    = document.getElementById(`chk-${taskId}`);
        const card   = document.getElementById(`card-${taskId}`);
        const status = document.getElementById(`status-${taskId}`);
        if (chk)    chk.classList.add('checked');
        if (card)   card.classList.add('completed');
        if (status) status.textContent = 'Hoàn thành ⭐';
      }
    });
    updateProgress();
  } catch (e) {
    console.warn('Không thể phục hồi tiến độ', e);
  }

  const finished = localStorage.getItem(`${key}_finished`);
  if (finished === 'true') {
    reviewSection.style.display = 'block';
    btnFinish.style.background = 'linear-gradient(135deg, #FFAB19, #FF8C1A)';
    btnFinish.innerHTML = '🏆 EM ĐÃ HOÀN THÀNH BÀI HỌC XUẤT SẮC!';
    btnFinish.disabled = true;
    isFinished = true;
  }
}

/* ── Toast Thông Báo ── */
let toastTimeout = null;
function showToast(msg, type = 'success') {
  if (!toastEl) return;
  const borderColors = {
    success: 'var(--scratch-green)',
    warning: 'var(--scratch-orange)',
    error:   'var(--mindx-red)'
  };
  toastEl.style.borderLeftColor = borderColors[type] || borderColors.success;
  toastEl.innerHTML = msg;
  toastEl.classList.add('show');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toastEl.classList.remove('show'), 3200);
}

/* ── Pháo Hoa Rực Rỡ ── */
function launchConfetti() {
  const canvas = confettiCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#FF4757', '#4D97FE', '#2ED573', '#FFAB19', '#9966FF', '#FFBF00'];
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 200,
    r: 4 + Math.random() * 6,
    d: 2 + Math.random() * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    tilt: Math.random() * 10 - 5,
    tiltAngle: 0,
    tiltSpeed: 0.1 + Math.random() * 0.2,
  }));

  let frame = 0;
  const maxFrames = 180;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - frame / maxFrames);
      ctx.fill();
      ctx.restore();

      p.y += p.d;
      p.tiltAngle += p.tiltSpeed;
      p.x += Math.sin(p.tiltAngle) * 1.5;
    });

    frame++;
    if (frame < maxFrames) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  draw();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    setTimeout(() => overlay.remove(), 400);
  }
}

// Phơi hàm ra ngoài window
window.toggleHint       = toggleHint;
window.openVerifyModal  = openVerifyModal;
window.finishLesson     = finishLesson;
