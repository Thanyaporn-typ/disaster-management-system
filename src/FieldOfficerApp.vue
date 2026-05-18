<template>
  <div class="officer-app">

    <!-- ══════════ NAVBAR ══════════ -->
    <nav class="officer-navbar">
      <div class="on-logo">
        <div class="on-logo-icon">🦺</div>
        <span class="on-logo-text">ระบบเจ้าหน้าที่ภาคสนาม</span>
      </div>
      <div class="on-user">
        <div class="on-avatar">ส</div>
        <div class="on-user-info">
          <div class="on-user-name">สิบตรีสมชาย</div>
          <div class="on-user-role">เจ้าหน้าที่ภาคสนาม</div>
        </div>
      </div>
    </nav>

    <!-- ══════════ WORKFLOW STEPS BAR ══════════ -->
    <div class="workflow-bar" v-if="currentStep !== 'tasks'">
      <div
        v-for="(step, i) in workflowSteps"
        :key="step.key"
        :class="['wf-step', currentStep === step.key ? 'active' : stepIndex > i ? 'done' : '']"
      >
        <div class="wf-circle">
          <span v-if="stepIndex > i">✓</span>
          <span v-else>{{ i + 1 }}</span>
        </div>
        <div class="wf-label">{{ step.label }}</div>
        <div class="wf-line" v-if="i < workflowSteps.length - 1"></div>
      </div>
    </div>

    <!-- ══════════ STEP 1: TASK LIST ══════════ -->
    <div v-if="currentStep === 'tasks'" class="page-tasks">
      <div class="tasks-header">
        <div class="tasks-header-top">
          <h1 class="tasks-title">ภารกิจของฉัน</h1>
          <div class="tasks-date">{{ todayStr }}</div>
        </div>
        <div class="task-tabs">
          <button
            v-for="tab in taskTabs"
            :key="tab.key"
            :class="['task-tab', activeTaskTab === tab.key ? 'active' : '']"
            @click="activeTaskTab = tab.key; tab.key === 'new' && (newAlertCount = 0)"
          >
            {{ tab.label }}
            <span class="task-tab-count">{{ tasksByTab(tab.key).length }}</span>
            <span class="new-dot" v-if="tab.key === 'new' && newAlertCount > 0">{{ newAlertCount }}</span>
          </button>
        </div>
      </div>

      <!-- New report notification banner -->
      <transition name="alert-slide">
        <div class="new-report-banner" v-if="newAlertCount > 0 && activeTaskTab !== 'new'">
          <span class="banner-pulse"></span>
          <span class="banner-msg">🚨 มีเหตุการณ์ใหม่ {{ newAlertCount }} รายการ เข้ามา!</span>
          <button class="banner-btn" @click="activeTaskTab = 'new'; newAlertCount = 0">ดูเลย →</button>
        </div>
      </transition>

      <div class="task-list">
        <div
          v-for="task in tasksByTab(activeTaskTab)"
          :key="task.id"
          class="task-card"
          :class="task.urgency"
        >
          <div class="task-card-top">
            <div class="task-id">{{ task.id }}</div>
            <span class="urgency-tag" :class="task.urgency">{{ urgencyLabel(task.urgency) }}</span>
          </div>
          <div class="task-info-row">
            <span class="task-info-icon">📅</span>
            <span class="task-info-text">วันเวลาแจ้งเหตุ: {{ task.date }}</span>
          </div>
          <div class="task-info-row">
            <span class="task-info-icon">📍</span>
            <span class="task-info-text">สถานที่: {{ task.location }}</span>
          </div>
          <div class="task-info-row">
            <span class="task-info-icon">🆘</span>
            <span class="task-info-text">ประเภท: {{ task.type }}</span>
          </div>
          <div class="task-card-actions">
            <button
              v-if="activeTaskTab === 'new'"
              class="btn-accept"
              @click="acceptTask(task)"
            >✔ รับเรื่อง</button>
            <button
              v-else-if="activeTaskTab === 'assigned'"
              class="btn-continue"
              @click="continueTask(task)"
            >▶ เริ่มดำเนินการ</button>
            <span v-else class="task-done-badge">✅ เสร็จสิ้น</span>
          </div>
        </div>

        <div v-if="tasksByTab(activeTaskTab).length === 0" class="empty-tasks">
          <div class="empty-icon">📭</div>
          <div class="empty-text">ไม่มีภารกิจในหมวดนี้</div>
        </div>
      </div>
    </div>

    <!-- ══════════ STEP 2: INCIDENT DETAIL & INSPECTION ══════════ -->
    <div v-if="currentStep === 'detail'" class="page-detail">
      <div class="detail-header">
        <button class="back-btn" @click="currentStep = 'tasks'">← กลับ</button>
        <h2 class="detail-title">ข้อมูลแจ้งเหตุ</h2>
        <div class="detail-id">{{ selectedTask.id }}</div>
      </div>

      <div class="mobile-content">
        <!-- Incident Info Card -->
        <div class="info-card">
          <div class="info-card-head">รายละเอียดเหตุการณ์</div>
          <div class="info-row">
            <span class="info-label">วันที่แจ้ง</span>
            <span class="info-val">{{ selectedTask.date }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">สถานที่</span>
            <span class="info-val">{{ selectedTask.location }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">ประเภทเหตุ</span>
            <span class="info-val">{{ selectedTask.type }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">ระดับความเร่งด่วน</span>
            <span class="urgency-tag" :class="selectedTask.urgency">{{ urgencyLabel(selectedTask.urgency) }}</span>
          </div>
        </div>

        <!-- Map Area -->
        <div class="map-card">
          <div class="map-card-head">📍 แผนที่สถานที่เกิดเหตุ</div>
          <div class="map-mock-mobile">
            <div class="map-grid-lines"></div>
            <div class="map-marker-pin">📍</div>
            <div class="map-location-label">{{ selectedTask.location }}</div>
          </div>
        </div>

        <!-- Incident Image -->
        <div class="info-card">
          <div class="info-card-head">
            📷 รูปภาพแจ้งเหตุ
            <span class="img-count-badge" v-if="selectedTask.images && selectedTask.images.length">
              {{ selectedTask.images.length }}/4
            </span>
          </div>
          <div v-if="selectedTask.images && selectedTask.images.length" class="incident-img-grid">
            <div
              v-for="(img, idx) in selectedTask.images"
              :key="idx"
              class="incident-thumb"
              @click="lightboxImage = img"
            >
              <img :src="img" class="incident-thumb-img" :alt="'รูปภาพ ' + (idx + 1)" />
              <div class="incident-thumb-overlay">🔍</div>
            </div>
          </div>
          <div v-else class="incident-img-area">
            <div class="incident-img-placeholder">ไม่มีรูปภาพแนบมา</div>
          </div>
        </div>

        <!-- Urgency Slider -->
        <div class="info-card">
          <div class="info-card-head">ระดับความเร่งด่วน (ประเมิน ณ ที่เกิดเหตุ)</div>
          <div class="urgency-slider-wrap">
            <input type="range" min="0" max="2" v-model.number="fieldUrgency" class="urgency-slider" />
            <div class="urgency-labels">
              <span :class="fieldUrgency === 0 ? 'urg-active' : ''">ปกติ</span>
              <span :class="fieldUrgency === 1 ? 'urg-active' : ''">ด่วน</span>
              <span :class="fieldUrgency === 2 ? 'urg-active' : ''">ด่วนมาก</span>
            </div>
          </div>
        </div>

        <!-- Needs -->
        <div class="info-card">
          <div class="info-card-head">ความต้องการให้ช่วยเหลือ</div>
          <div class="needs-grid">
            <label v-for="need in needs" :key="need.key" class="need-check">
              <input type="checkbox" v-model="need.checked" />
              <span class="need-box" :class="{ checked: need.checked }">{{ need.label }}</span>
            </label>
          </div>
        </div>

        <!-- People Count -->
        <div class="info-card">
          <div class="info-card-head">จำนวนคนที่ประสบภัย</div>
          <div class="people-counter">
            <button class="counter-btn" @click="peopleCount = Math.max(0, peopleCount - 1)">−</button>
            <span class="counter-num">{{ peopleCount }}</span>
            <button class="counter-btn" @click="peopleCount++">+</button>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="info-card">
          <div class="info-card-head">ช่องทางการติดต่อกลับ</div>
          <div class="contact-row">
            <span class="contact-label">ชื่อ</span>
            <input class="contact-input" v-model="contactName" placeholder="ชื่อผู้ประสบภัย" />
          </div>
          <div class="contact-row">
            <span class="contact-label">โทร</span>
            <input class="contact-input" v-model="contactPhone" placeholder="เบอร์โทรศัพท์" />
          </div>
        </div>

        <button class="btn-primary-full" @click="currentStep = 'checkin'">
          📍 เช็คอินสถานที่ปฏิบัติงาน
        </button>
      </div>
    </div>

    <!-- ══════════ STEP 3: CHECK-IN AT LOCATION ══════════ -->
    <div v-if="currentStep === 'checkin'" class="page-checkin">
      <div class="detail-header">
        <button class="back-btn" @click="currentStep = 'detail'">← กลับ</button>
        <h2 class="detail-title">เช็คอินสถานที่</h2>
        <div class="detail-id">{{ selectedTask.id }}</div>
      </div>

      <div class="mobile-content">
        <div class="checkin-status-card">
          <div class="checkin-pulse">
            <div class="pulse-ring"></div>
            <div class="pulse-dot">📍</div>
          </div>
          <div class="checkin-status-text">กำลังระบุตำแหน่ง...</div>
          <div class="checkin-coords">13.7681° N, 100.6350° E</div>
        </div>

        <!-- Large Map -->
        <div class="map-card">
          <div class="map-card-head">🗺️ ตำแหน่งปัจจุบันของท่าน</div>
          <div class="map-mock-large">
            <div class="map-grid-lines"></div>
            <!-- Officer position -->
            <div class="officer-marker">🦺</div>
            <!-- Incident position -->
            <div class="incident-marker">🚨</div>
            <div class="distance-badge">ห่าง ~200 ม.</div>
          </div>
        </div>

        <!-- Location Detail -->
        <div class="info-card">
          <div class="info-card-head">รายละเอียดการเช็คอิน</div>
          <div class="info-row">
            <span class="info-label">สถานที่เกิดเหตุ</span>
            <span class="info-val">{{ selectedTask.location }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">เวลาเช็คอิน</span>
            <span class="info-val">{{ checkinTime }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">สถานะ</span>
            <span class="status-badge active">กำลังปฏิบัติงาน</span>
          </div>
        </div>

        <button class="btn-primary-full" @click="doCheckin">
          ✅ ยืนยันเช็คอิน
        </button>
      </div>
    </div>

    <!-- ══════════ STEP 4: EVIDENCE CAPTURE & COMPLETE ══════════ -->
    <div v-if="currentStep === 'complete'" class="page-complete">
      <div class="detail-header">
        <button class="back-btn" @click="currentStep = 'checkin'">← กลับ</button>
        <h2 class="detail-title">อัปเดตผลการปฏิบัติงาน</h2>
        <div class="detail-id">{{ selectedTask.id }}</div>
      </div>

      <div class="mobile-content">
        <div class="checkin-done-banner">
          <span class="done-icon">✅</span>
          <span>เช็คอินสำเร็จ — {{ checkinTime }}</span>
        </div>

        <!-- Outcome -->
        <div class="info-card">
          <div class="info-card-head">ผลการปฏิบัติงาน</div>
          <div class="outcome-options">
            <label v-for="o in outcomes" :key="o.key" class="outcome-radio">
              <input type="radio" :value="o.key" v-model="selectedOutcome" />
              <span class="outcome-box" :class="{ selected: selectedOutcome === o.key }">
                {{ o.icon }} {{ o.label }}
              </span>
            </label>
          </div>
        </div>

        <!-- Completion Note -->
        <div class="info-card">
          <div class="info-card-head">บันทึกการปฏิบัติงาน</div>
          <textarea
            class="completion-note"
            v-model="completionNote"
            placeholder="อธิบายสิ่งที่ดำเนินการ เช่น ช่วยเหลือผู้ประสบภัย 3 ราย ส่งโรงพยาบาลเรียบร้อย..."
            rows="4"
          ></textarea>
        </div>

        <!-- Photo Upload -->
        <div class="info-card">
          <div class="info-card-head">📷 โปรดแนบรูปภาพงานที่ดำเนินการสำเร็จ</div>
          <div class="evidence-upload" @click="triggerEvidenceUpload">
            <div v-if="!evidenceImage" class="evidence-placeholder">
              <div class="evidence-plus">+</div>
              <div class="evidence-hint">เพิ่มรูปภาพ</div>
            </div>
            <img v-else :src="evidenceImage" class="evidence-preview" alt="evidence" />
            <input ref="evidenceInput" type="file" accept="image/*" hidden @change="handleEvidence" />
          </div>
          <div v-if="evidenceImage" class="upload-change" @click="triggerEvidenceUpload">เปลี่ยนรูป</div>
        </div>

        <button class="btn-primary-full btn-success" @click="submitCase">
          💾 บันทึกและปิดเคส
        </button>
      </div>
    </div>

    <!-- ══════════ STEP 5: SUCCESS ══════════ -->
    <div v-if="currentStep === 'success'" class="page-success">
      <div class="success-content">
        <div class="success-icon-wrap">
          <div class="success-ring"></div>
          <div class="success-check">✓</div>
        </div>
        <h2 class="success-title">ปิดเคสสำเร็จ!</h2>
        <p class="success-sub">เคส {{ selectedTask.id }} ได้รับการบันทึกเรียบร้อยแล้ว</p>
        <div class="success-summary">
          <div class="summary-row">
            <span class="summary-label">สถานที่</span>
            <span class="summary-val">{{ selectedTask.location }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">ผลการปฏิบัติงาน</span>
            <span class="summary-val">{{ outcomeLabel }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">เวลาปิดเคส</span>
            <span class="summary-val">{{ closeTime }}</span>
          </div>
        </div>
        <button class="btn-primary-full" @click="backToTasks">← กลับสู่รายการภารกิจ</button>
      </div>
    </div>

    <!-- Lightbox -->
    <transition name="fade">
      <div class="lightbox" v-if="lightboxImage" @click="lightboxImage = null">
        <button class="lightbox-close" @click="lightboxImage = null">✕</button>
        <img :src="lightboxImage" class="lightbox-img" @click.stop alt="lightbox" />
      </div>
    </transition>

    <!-- Footer -->
    <footer class="officer-footer">
      <span>© 2568 ระบบเจ้าหน้าที่ภาคสนาม — กรมป้องกันและบรรเทาสาธารณภัย</span>
    </footer>

  </div>
</template>

<script>
export default {
  name: 'FieldOfficerApp',
  props: {
    externalTasks: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    externalTasks(newList) {
      newList.forEach(task => {
        if (!this.tasks.find(t => t.id === task.id)) {
          this.tasks.unshift({ ...task })
          this.newAlertCount++
        }
      })
    },
  },
  data() {
    const now = new Date()
    return {
      currentStep: 'tasks',
      activeTaskTab: 'new',
      selectedTask: null,
      newAlertCount: 0,
      fieldUrgency: 1,
      peopleCount: 10,
      contactName: 'นางไก่',
      contactPhone: '080-111-111',
      checkinTime: '',
      closeTime: '',
      evidenceImage: null,
      lightboxImage: null,
      completionNote: '',
      selectedOutcome: 'resolved',

      taskTabs: [
        { key: 'new', label: 'รับเรื่อง' },
        { key: 'assigned', label: 'กำลังดำเนินการ' },
        { key: 'done', label: 'เสร็จสิ้น' },
      ],

      workflowSteps: [
        { key: 'detail', label: 'ข้อมูลเหตุ' },
        { key: 'checkin', label: 'เช็คอิน' },
        { key: 'complete', label: 'ปิดเคส' },
      ],

      needs: [
        { key: 'food', label: 'อาหาร', checked: false },
        { key: 'oxygen', label: 'ออกซิเจน', checked: false },
        { key: 'clothes', label: 'เสื้อผ้า', checked: false },
        { key: 'other', label: 'อื่นๆ', checked: false },
      ],

      outcomes: [
        { key: 'resolved', icon: '✅', label: 'แก้ไขสำเร็จ' },
        { key: 'transferred', icon: '🚑', label: 'ส่งต่อโรงพยาบาล' },
        { key: 'evacuated', icon: '🚌', label: 'อพยพแล้ว' },
        { key: 'pending', icon: '⏳', label: 'รอหน่วยสนับสนุน' },
      ],

      tasks: [
        {
          id: 'NO.1111',
          date: '1/1/26 09:30',
          location: 'บ้านท่า, ลาดกระบัง',
          type: 'น้ำท่วม',
          urgency: 'high',
          status: 'new',
          images: [
            'https://picsum.photos/seed/flood1/600/400',
            'https://picsum.photos/seed/flood2/600/400',
            'https://picsum.photos/seed/flood3/600/400',
          ],
        },
        {
          id: 'NO.1112',
          date: '1/1/26 10:15',
          location: 'ซอยลาดพร้าว 41',
          type: 'ไฟไหม้',
          urgency: 'high',
          status: 'new',
          images: [
            'https://picsum.photos/seed/fire1/600/400',
            'https://picsum.photos/seed/fire2/600/400',
          ],
        },
        {
          id: 'NO.1113',
          date: '1/1/26 08:00',
          location: 'ถนนพหลโยธิน กม.5',
          type: 'อุบัติเหตุ',
          urgency: 'mid',
          status: 'assigned',
          images: [
            'https://picsum.photos/seed/acc1/600/400',
            'https://picsum.photos/seed/acc2/600/400',
            'https://picsum.photos/seed/acc3/600/400',
            'https://picsum.photos/seed/acc4/600/400',
          ],
        },
        {
          id: 'NO.1110',
          date: '31/12/25 14:00',
          location: 'บ้านคลองสาน',
          type: 'น้ำท่วม',
          urgency: 'low',
          status: 'done',
          images: [
            'https://picsum.photos/seed/done1/600/400',
          ],
        },
      ],

      todayStr: now.toLocaleDateString('th-TH', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      }),
    }
  },
  computed: {
    stepIndex() {
      const keys = this.workflowSteps.map(s => s.key)
      return keys.indexOf(this.currentStep)
    },
    outcomeLabel() {
      const o = this.outcomes.find(o => o.key === this.selectedOutcome)
      return o ? `${o.icon} ${o.label}` : ''
    },
  },
  methods: {
    tasksByTab(tab) {
      const map = { new: 'new', assigned: 'assigned', done: 'done' }
      return this.tasks.filter(t => t.status === map[tab])
    },
    urgencyLabel(u) {
      return { low: 'ปกติ', mid: 'ด่วน', high: 'ด่วนมาก' }[u] || u
    },
    acceptTask(task) {
      task.status = 'assigned'
      this.activeTaskTab = 'assigned'
    },
    continueTask(task) {
      this.selectedTask = task
      this.currentStep = 'detail'
    },
    doCheckin() {
      const now = new Date()
      this.checkinTime = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      this.currentStep = 'complete'
    },
    triggerEvidenceUpload() {
      this.$refs.evidenceInput.click()
    },
    handleEvidence(e) {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = ev => { this.evidenceImage = ev.target.result }
      reader.readAsDataURL(file)
    },
    submitCase() {
      const now = new Date()
      this.closeTime = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      if (this.selectedTask) this.selectedTask.status = 'done'
      this.currentStep = 'success'
    },
    backToTasks() {
      this.currentStep = 'tasks'
      this.activeTaskTab = 'done'
      this.evidenceImage = null
      this.completionNote = ''
      this.needs.forEach(n => n.checked = false)
    },
  },
}
</script>

<style scoped>
/* ── Base ── */
.officer-app {
  min-height: 100vh;
  background: #f7f7f7;
  font-family: 'Kanit', 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
}

/* ── Navbar ── */
.officer-navbar {
  background: #555859;
  color: #fff;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(0,0,0,0.25);
}
.on-logo { display: flex; align-items: center; gap: 10px; }
.on-logo-icon { font-size: 24px; }
.on-logo-text { font-size: 17px; font-weight: 700; letter-spacing: 0.3px; }
.on-user { display: flex; align-items: center; gap: 10px; }
.on-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: #f8d247; color: #555859;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 16px;
}
.on-user-name { font-size: 14px; font-weight: 600; line-height: 1.2; }
.on-user-role { font-size: 12px; color: #aab; line-height: 1.2; }

/* ── Workflow Bar ── */
.workflow-bar {
  background: #fff;
  border-bottom: 1px solid #e8eaf0;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}
.wf-step {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}
.wf-circle {
  width: 32px; height: 32px; border-radius: 50%;
  border: 2px solid #d0d5e0;
  background: #f7f7f7;
  color: #9aa;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700;
  transition: all 0.2s;
  flex-shrink: 0;
}
.wf-step.active .wf-circle {
  border-color: #f8d247;
  background: #f8d247;
  color: #555859;
}
.wf-step.done .wf-circle {
  border-color: #22c55e;
  background: #22c55e;
  color: #fff;
}
.wf-label {
  font-size: 13px;
  color: #888;
  font-weight: 500;
  white-space: nowrap;
}
.wf-step.active .wf-label { color: #555859; font-weight: 700; }
.wf-step.done .wf-label { color: #22c55e; }
.wf-line {
  width: 40px; height: 2px;
  background: #e0e4ef;
  margin: 0 6px;
  flex-shrink: 0;
}

/* ── Task List Page ── */
.page-tasks { flex: 1; display: flex; flex-direction: column; }

.tasks-header {
  background: #555859;
  color: #fff;
  padding: 20px 24px 0;
}
.tasks-header-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
}
.tasks-title { font-size: 22px; font-weight: 700; }
.tasks-date { font-size: 13px; color: #aab; }
.task-tabs {
  display: flex;
  gap: 0;
  border-bottom: none;
}
.task-tab {
  position: relative;
  flex: 1;
  padding: 10px 8px;
  background: transparent;
  border: none;
  color: #aab;
  font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.task-tab.active { color: #f8d247; border-bottom-color: #f8d247; }
.task-tab-count {
  background: rgba(255,255,255,0.15);
  color: #fff;
  border-radius: 999px;
  padding: 1px 8px;
  font-size: 12px;
  font-weight: 700;
}
.task-tab.active .task-tab-count { background: #f8d247; color: #555859; }

.new-dot {
  position: absolute;
  top: 4px; right: 4px;
  min-width: 16px; height: 16px;
  background: #ef4444;
  color: #fff;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  padding: 0 3px;
  animation: badge-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes badge-pop {
  from { transform: scale(0); }
  to   { transform: scale(1); }
}

.new-report-banner {
  background: linear-gradient(90deg, #7f1d1d, #991b1b);
  color: #fff;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-bottom: 2px solid #ef4444;
}
.banner-pulse {
  width: 10px; height: 10px; border-radius: 50%;
  background: #fca5a5;
  flex-shrink: 0;
  animation: blink 0.8s ease infinite alternate;
}
@keyframes blink {
  from { opacity: 0.4; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1.2); }
}
.banner-msg { flex: 1; font-size: 14px; font-weight: 700; }
.banner-btn {
  background: #f8d247;
  color: #555859;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.alert-slide-enter-active { animation: slide-in 0.3s ease-out; }
.alert-slide-leave-active { animation: slide-out 0.2s ease-in; }
@keyframes slide-in {
  from { transform: translateY(-100%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
@keyframes slide-out {
  from { transform: translateY(0); opacity: 1; }
  to   { transform: translateY(-100%); opacity: 0; }
}

.task-list {
  flex: 1;
  padding: 20px 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
}

.task-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  border-left: 5px solid #e0e4ef;
  transition: transform 0.15s, box-shadow 0.15s;
}
.task-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
.task-card.high { border-left-color: #ef4444; }
.task-card.mid  { border-left-color: #f59e0b; }
.task-card.low  { border-left-color: #22c55e; }

.task-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.task-id { font-size: 16px; font-weight: 800; color: #555859; }
.urgency-tag {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}
.urgency-tag.high { background: #fee2e2; color: #dc2626; }
.urgency-tag.mid  { background: #fef3c7; color: #d97706; }
.urgency-tag.low  { background: #dcfce7; color: #16a34a; }

.task-info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
}
.task-info-icon { font-size: 14px; }
.task-info-text { flex: 1; }

.task-card-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
.btn-accept {
  background: #555859;
  color: #f8d247;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-accept:hover { background: #2d2d4e; }
.btn-continue {
  background: #f8d247;
  color: #555859;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-continue:hover { opacity: 0.85; }
.task-done-badge { font-size: 14px; color: #22c55e; font-weight: 700; }

.empty-tasks {
  text-align: center;
  padding: 60px 20px;
  color: #aaa;
}
.empty-icon { font-size: 48px; margin-bottom: 12px; }
.empty-text { font-size: 16px; }

/* ── Shared Detail/Checkin/Complete ── */
.page-detail, .page-checkin, .page-complete, .page-success {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.detail-header {
  background: #fff;
  border-bottom: 1px solid #e8eaf0;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.back-btn {
  background: none;
  border: 1px solid #e0e4ef;
  border-radius: 8px;
  padding: 6px 12px;
  font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 14px;
  color: #555;
  cursor: pointer;
}
.back-btn:hover { background: #f7f7f7; }
.detail-title { flex: 1; font-size: 18px; font-weight: 700; color: #555859; }
.detail-id {
  font-size: 13px;
  font-weight: 700;
  color: #f8d247;
  background: #555859;
  padding: 3px 10px;
  border-radius: 999px;
}

.mobile-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
}

/* ── Info Card ── */
.info-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.info-card-head {
  font-size: 14px;
  font-weight: 700;
  color: #555859;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f2f8;
}
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 0;
  border-bottom: 1px solid #f8f9fc;
  font-size: 14px;
}
.info-row:last-child { border-bottom: none; }
.info-label { color: #888; }
.info-val { color: #555859; font-weight: 600; }

/* ── Map ── */
.map-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.map-card-head {
  font-size: 14px; font-weight: 700; color: #555859;
  padding: 14px 18px 10px;
  border-bottom: 1px solid #f0f2f8;
}
.map-mock-mobile {
  height: 180px;
  background: linear-gradient(135deg, #e8f4f8 0%, #ddeeff 50%, #e0eecc 100%);
  position: relative;
  overflow: hidden;
}
.map-mock-large {
  height: 260px;
  background: linear-gradient(135deg, #e8f4f8 0%, #ddeeff 50%, #e0eecc 100%);
  position: relative;
  overflow: hidden;
}
.map-grid-lines {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(100,140,180,0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100,140,180,0.15) 1px, transparent 1px);
  background-size: 30px 30px;
}
.map-marker-pin {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -60%);
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}
.map-location-label {
  position: absolute;
  bottom: 10px; left: 0; right: 0;
  text-align: center;
  font-size: 12px; font-weight: 600;
  color: #555859;
  background: rgba(255,255,255,0.85);
  padding: 4px;
}
.officer-marker {
  position: absolute;
  top: 55%; left: 48%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}
.incident-marker {
  position: absolute;
  top: 30%; left: 58%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}
.distance-badge {
  position: absolute;
  bottom: 10px; right: 10px;
  background: #555859;
  color: #f8d247;
  font-size: 12px; font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
}

/* ── Incident Image ── */
.img-count-badge {
  margin-left: 8px;
  background: #f0f2f8;
  color: #555859;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
}
.incident-img-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.incident-thumb {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 4/3;
  cursor: pointer;
  background: #f0f2f8;
}
.incident-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.25s;
}
.incident-thumb:hover .incident-thumb-img { transform: scale(1.05); }
.incident-thumb-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  opacity: 0;
  transition: opacity 0.2s;
}
.incident-thumb:hover .incident-thumb-overlay { opacity: 1; }

.incident-img-area {
  background: #f7f7f7;
  border-radius: 10px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.incident-img-placeholder { color: #bbb; font-size: 14px; }

/* ── Lightbox ── */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.88);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.lightbox-img {
  max-width: 100%;
  max-height: 90vh;
  border-radius: 12px;
  object-fit: contain;
  box-shadow: 0 8px 40px rgba(0,0,0,0.6);
}
.lightbox-close {
  position: absolute;
  top: 16px; right: 20px;
  background: rgba(255,255,255,0.15);
  border: none;
  border-radius: 50%;
  width: 36px; height: 36px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.lightbox-close:hover { background: rgba(255,255,255,0.28); }
.fade-enter-active { animation: fade-in 0.2s ease; }
.fade-leave-active { animation: fade-in 0.15s ease reverse; }
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ── Urgency Slider ── */
.urgency-slider-wrap { display: flex; flex-direction: column; gap: 10px; }
.urgency-slider {
  width: 100%;
  accent-color: #f8d247;
  cursor: pointer;
}
.urgency-labels {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #aaa;
}
.urg-active { color: #f8d247; font-weight: 700; }

/* ── Needs ── */
.needs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.need-check { display: flex; align-items: center; gap: 0; cursor: pointer; }
.need-check input { display: none; }
.need-box {
  flex: 1;
  border: 2px solid #e0e4ef;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  text-align: center;
  transition: all 0.15s;
  cursor: pointer;
}
.need-box.checked {
  border-color: #f8d247;
  background: #fdf6d8;
  color: #555859;
}

/* ── People Counter ── */
.people-counter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
.counter-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: #f7f7f7;
  border: 2px solid #e0e4ef;
  font-size: 20px; font-weight: 700;
  color: #555859;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.counter-btn:hover { background: #f8d247; border-color: #f8d247; }
.counter-num { font-size: 28px; font-weight: 800; color: #555859; min-width: 48px; text-align: center; }

/* ── Contact ── */
.contact-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.contact-row:last-child { margin-bottom: 0; }
.contact-label { width: 36px; font-size: 13px; color: #888; flex-shrink: 0; }
.contact-input {
  flex: 1;
  border: 1.5px solid #e0e4ef;
  border-radius: 8px;
  padding: 8px 12px;
  font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 14px;
  color: #555859;
  outline: none;
  transition: border-color 0.2s;
}
.contact-input:focus { border-color: #f8d247; }

/* ── Check-in ── */
.checkin-status-card {
  background: #fff;
  border-radius: 14px;
  padding: 24px 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  text-align: center;
}
.checkin-pulse {
  position: relative;
  width: 64px; height: 64px;
  margin: 0 auto 14px;
  display: flex; align-items: center; justify-content: center;
}
.pulse-ring {
  position: absolute; inset: 0;
  border: 3px solid #f8d247;
  border-radius: 50%;
  animation: pulse 1.5s ease-out infinite;
}
@keyframes pulse {
  0% { transform: scale(0.9); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}
.pulse-dot { font-size: 28px; position: relative; z-index: 1; }
.checkin-status-text { font-size: 16px; font-weight: 700; color: #555859; margin-bottom: 4px; }
.checkin-coords { font-size: 12px; color: #888; }

.status-badge { padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.status-badge.active { background: #dcfce7; color: #16a34a; }

/* ── Complete ── */
.checkin-done-banner {
  background: #dcfce7;
  border: 1.5px solid #86efac;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #166534;
}
.done-icon { font-size: 18px; }

.outcome-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.outcome-radio { cursor: pointer; }
.outcome-radio input { display: none; }
.outcome-box {
  display: block;
  border: 2px solid #e0e4ef;
  border-radius: 8px;
  padding: 10px 8px;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  color: #666;
  transition: all 0.15s;
  cursor: pointer;
}
.outcome-box.selected {
  border-color: #22c55e;
  background: #dcfce7;
  color: #166534;
}

.completion-note {
  width: 100%;
  border: 1.5px solid #e0e4ef;
  border-radius: 8px;
  padding: 10px 12px;
  font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 14px;
  color: #555859;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
}
.completion-note:focus { border-color: #22c55e; }

.evidence-upload {
  background: #f7f7f7;
  border: 2px dashed #d0d5e0;
  border-radius: 12px;
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.evidence-upload:hover { border-color: #f8d247; background: #fdf6d8; }
.evidence-placeholder { text-align: center; }
.evidence-plus { font-size: 40px; color: #bbb; line-height: 1; }
.evidence-hint { font-size: 14px; color: #aaa; margin-top: 6px; font-weight: 600; }
.evidence-preview { width: 100%; height: 200px; object-fit: cover; border-radius: 10px; }
.upload-change {
  text-align: center;
  color: #888;
  font-size: 13px;
  margin-top: 8px;
  cursor: pointer;
  text-decoration: underline;
}

/* ── Success ── */
.page-success { flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px; }
.success-content {
  background: #fff;
  border-radius: 20px;
  padding: 40px 28px;
  text-align: center;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 4px 24px rgba(0,0,0,0.1);
}
.success-icon-wrap {
  position: relative;
  width: 80px; height: 80px;
  margin: 0 auto 20px;
}
.success-ring {
  position: absolute; inset: 0;
  border: 4px solid #22c55e;
  border-radius: 50%;
  animation: success-ring 0.5s ease-out;
}
@keyframes success-ring {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
.success-check {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 36px; color: #22c55e; font-weight: 800;
}
.success-title { font-size: 26px; font-weight: 800; color: #555859; margin-bottom: 8px; }
.success-sub { font-size: 15px; color: #666; margin-bottom: 24px; }
.success-summary {
  background: #f7f7f7;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: left;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #e8eaf0;
  font-size: 14px;
}
.summary-row:last-child { border-bottom: none; }
.summary-label { color: #888; }
.summary-val { font-weight: 700; color: #555859; }

/* ── Buttons ── */
.btn-primary-full {
  background: #555859;
  color: #f8d247;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s, transform 0.1s;
}
.btn-primary-full:hover { background: #2d2d4e; transform: translateY(-1px); }
.btn-success { background: #16a34a; color: #fff; }
.btn-success:hover { background: #15803d; }

/* ── Footer ── */
.officer-footer {
  background: #555859;
  color: #6b7280;
  text-align: center;
  padding: 14px;
  font-size: 12px;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  /* Navbar */
  .officer-navbar { padding: 0 14px; height: 56px; }
  .on-logo-icon { font-size: 20px; }
  .on-logo-text { font-size: 14px; }
  .on-user-role { display: none; }
  .on-avatar { width: 32px; height: 32px; font-size: 14px; }
  .on-user-name { font-size: 13px; }

  /* Workflow bar */
  .workflow-bar { padding: 10px 10px; gap: 0; overflow-x: auto; }
  .wf-label { font-size: 11px; }
  .wf-circle { width: 28px; height: 28px; font-size: 12px; }
  .wf-line { width: 20px; }

  /* Task list */
  .tasks-header { padding: 14px 14px 0; }
  .tasks-title { font-size: 18px; }
  .tasks-date { font-size: 12px; }
  .task-tab { font-size: 12px; padding: 8px 6px; gap: 4px; }
  .task-tab-count { padding: 1px 6px; font-size: 11px; }

  /* Cards & content */
  .task-list { padding: 14px; gap: 10px; }
  .mobile-content { padding: 14px; gap: 10px; }
  .task-card { padding: 14px; }
  .task-id { font-size: 14px; }
  .task-info-row { font-size: 13px; }
  .btn-accept, .btn-continue { font-size: 13px; padding: 7px 16px; }

  /* Detail/checkin/complete */
  .detail-header { padding: 12px 14px; gap: 10px; }
  .detail-title { font-size: 15px; }
  .detail-id { font-size: 12px; }
  .info-card { padding: 14px; }
  .info-card-head { font-size: 13px; margin-bottom: 10px; padding-bottom: 8px; }
  .info-row { font-size: 13px; }
  .map-mock-mobile { height: 160px; }
  .map-mock-large { height: 220px; }
  .back-btn { font-size: 13px; padding: 5px 10px; }

  /* Grids */
  .needs-grid { grid-template-columns: 1fr 1fr; }
  .outcome-options { grid-template-columns: 1fr 1fr; }

  /* Success */
  .success-content { padding: 28px 18px; }
  .success-title { font-size: 22px; }
  .success-sub { font-size: 14px; }

  /* Footer */
  .officer-footer { font-size: 11px; padding: 12px; }
}

@media (max-width: 400px) {
  /* Collapse logo text on very small phones */
  .on-logo-text { display: none; }

  /* Workflow: circles only */
  .wf-label { display: none; }
  .wf-line { width: 14px; }

  /* Tabs: hide counts */
  .task-tab-count { display: none; }

  /* Banner */
  .banner-msg { font-size: 12px; }
  .banner-btn { font-size: 12px; padding: 5px 10px; }

  /* Outcome grid stacks */
  .outcome-options { grid-template-columns: 1fr; }
}
</style>
