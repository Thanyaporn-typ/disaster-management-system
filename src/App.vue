<template>
  <div id="app">

    <!-- ══ Incoming Alert Toast ══ -->
    <transition name="toast">
      <div class="alert-toast" v-if="toast">
        <div class="toast-icon"><i class="bi bi-exclamation-octagon-fill"></i></div>
        <div class="toast-body">
          <div class="toast-title">แจ้งเหตุใหม่เข้ามา!</div>
          <div class="toast-sub">{{ toast.id }} — {{ toast.location }}</div>
        </div>
        <button class="toast-action" @click="switchToOfficer">
          ดูที่เจ้าหน้าที่ →
        </button>
        <button class="toast-close" @click="toast = null"><i class="bi bi-x-lg"></i></button>
      </div>
    </transition>

    <!-- ══ Mode Switcher ══ -->
    <div class="mode-switcher">
      <div class="switcher-brand">
        <!-- <span class="switcher-brand-icon"><i class="bi bi-shield-fill"></i></span> -->
        <span class="switcher-brand-name">ระบบบริหารจัดการภัยพิบัติ</span>
        <span class="demo-tag">DEMO</span>
        <span class="version-tag">v{{ appVersion }}</span>
      </div>
      <div class="switcher-tabs">
        <button
          :class="['mode-btn', mode === 'citizen' ? 'active' : '']"
          @click="mode = 'citizen'"
        >
          <span class="mode-btn-icon"><i class="bi bi-person-fill"></i></span>
          <span class="mode-btn-label">ประชาชน</span>
        </button>
        <button
          :class="['mode-btn', mode === 'officer' ? 'active' : '']"
          @click="mode = 'officer'; newTaskCount = 0"
        >
          <span class="mode-btn-icon"><i class="bi bi-person-badge-fill"></i></span>
          <span class="mode-btn-label">เจ้าหน้าที่</span>
          <span class="notif-badge" v-if="newTaskCount > 0">{{ newTaskCount }}</span>
        </button>
        <button
          :class="['mode-btn', mode === 'admin' ? 'active' : '']"
          @click="mode = 'admin'; newTaskCount = 0"
        >
          <span class="mode-btn-icon"><i class="bi bi-gear-fill"></i></span>
          <span class="mode-btn-label">ผู้ดูแลระบบ</span>
          <span class="notif-badge" v-if="mode !== 'admin' && newTaskCount > 0">{{ newTaskCount }}</span>
        </button>
      </div>
    </div>

    <CitizenApp
      v-if="mode === 'citizen'"
      :submitted-reports="sharedTasks"
      :shared-shelters="sharedShelters"
      @report-submitted="handleNewReport"
    />
    <FieldOfficerApp
      v-if="mode === 'officer'"
      :external-tasks="sharedTasks"
      :shared-shelters="sharedShelters"
      @shelters-updated="sharedShelters = $event"
    />
    <AdminApp
      v-if="mode === 'admin'"
      :external-incidents="sharedTasks"
      :shared-shelters="sharedShelters"
      @shelters-updated="sharedShelters = $event"
    />
  </div>
</template>

<script>
import CitizenApp from './CitizenApp.vue'
import FieldOfficerApp from './FieldOfficerApp.vue'
import AdminApp from './AdminApp.vue'
import pkg from '../package.json'

export default {
  name: 'App',
  components: { CitizenApp, FieldOfficerApp, AdminApp },
  data() {
    return {
      appVersion: pkg.version,
      mode: 'citizen',
      sharedTasks: [],
      newTaskCount: 0,
      toast: null,
      toastTimer: null,
      sharedShelters: [
        { id: 1, name: 'โรงเรียนวัดสีลม', lat: 13.7260, lng: 100.5290, capacity: 200, available: true, tags: ['มีอาหาร/น้ำ'], icon: 'bi-building' },
        { id: 2, name: 'ศาลาประชาคมเขตบางรัก', lat: 13.7240, lng: 100.5270, capacity: 150, available: false, tags: ['มีอาหาร/น้ำ'], icon: 'bi-bank' },
        { id: 3, name: 'วัดยานนาวา', lat: 13.7180, lng: 100.5220, capacity: 300, available: true, tags: ['ที่พักพิง', 'น้ำดื่ม'], icon: 'bi-house-fill' },
        { id: 4, name: 'โรงเรียนสาธิตจุฬาลงกรณ์', lat: 13.7380, lng: 100.5310, capacity: 500, available: true, tags: ['มีอาหาร/น้ำ', 'พยาบาล'], icon: 'bi-building' },
        { id: 5, name: 'ศูนย์กีฬาเขตสาทร', lat: 13.7200, lng: 100.5250, capacity: 400, available: true, tags: ['มีอาหาร/น้ำ', 'ห้องน้ำ'], icon: 'bi-buildings' },
        { id: 6, name: 'วัดปทุมวนาราม', lat: 13.7450, lng: 100.5330, capacity: 250, available: false, tags: ['ที่พักพิง'], icon: 'bi-house-fill' },
        { id: 7, name: 'หอประชุมเขตลาดกระบัง', lat: 13.7260, lng: 100.5310, capacity: 600, available: true, tags: ['มีอาหาร/น้ำ', 'พยาบาล', 'ห้องน้ำ'], icon: 'bi-buildings' },
        { id: 8, name: 'โรงเรียนบ้านท่าข้าม', lat: 13.7150, lng: 100.5200, capacity: 180, available: true, tags: ['น้ำดื่ม'], icon: 'bi-building' },
      ],
    }
  },
  methods: {
    handleNewReport(report) {
      this.sharedTasks = [report, ...this.sharedTasks]
      this.newTaskCount++
      this.toast = report
      clearTimeout(this.toastTimer)
      this.toastTimer = setTimeout(() => { this.toast = null }, 6000)
    },
    switchToOfficer() {
      this.mode = 'officer'
      this.newTaskCount = 0
      this.toast = null
    },
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

body { background: #f7f7f7; font-family: 'Kanit', 'Inter', sans-serif; }

/* Mode Switcher */
.mode-switcher {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #3d3f40;
  padding: 0 24px;
  height: 52px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.switcher-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.switcher-brand-icon { font-size: 20px; }
.switcher-brand-name {
  font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.3px;
}
.demo-tag {
  background: rgba(248,210,71,0.18);
  color: #f8d247;
  border: 1px solid rgba(248,210,71,0.35);
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 1px;
}
.version-tag {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.45);
  border: 1px solid rgba(255,255,255,0.12);
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}
.switcher-tabs {
  display: flex;
  align-items: center;
  gap: 2px;
}
.mode-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 18px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.5);
  font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}
.mode-btn:hover { color: #fff; background: rgba(255,255,255,0.07); }
.mode-btn.active { background: #f8d247; color: #3d3f40; }
.mode-btn-icon { font-size: 15px; }
.notif-badge {
  position: absolute;
  top: -2px; right: -2px;
  min-width: 18px; height: 18px;
  background: #ef4444;
  color: #fff;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px;
  animation: badge-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes badge-pop {
  from { transform: scale(0); }
  to   { transform: scale(1); }
}

/* Alert Toast */
.alert-toast {
  position: fixed;
  bottom: 24px; right: 24px;
  z-index: 9999;
  background: #555859;
  color: #fff;
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
  border-left: 4px solid #ef4444;
  max-width: 380px;
  min-width: 300px;
}
.toast-icon { font-size: 26px; flex-shrink: 0; animation: ring 0.6s ease infinite alternate; }
@keyframes ring {
  from { transform: rotate(-10deg); }
  to   { transform: rotate(10deg); }
}
.toast-body { flex: 1; }
.toast-title { font-size: 15px; font-weight: 700; color: #f8d247; margin-bottom: 3px; }
.toast-sub { font-size: 13px; color: #aab; }
.toast-action {
  background: #f8d247;
  color: #555859;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: opacity 0.2s;
}
.toast-action:hover { opacity: 0.85; }
.toast-close {
  background: none;
  border: none;
  color: #667;
  font-size: 16px;
  cursor: pointer;
  padding: 2px;
  flex-shrink: 0;
}
.toast-close:hover { color: #fff; }

/* Toast transition */
.toast-enter-active { animation: slide-up 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.toast-leave-active { animation: slide-down 0.25s ease-in; }
@keyframes slide-up {
  from { transform: translateY(80px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
@keyframes slide-down {
  from { transform: translateY(0); opacity: 1; }
  to   { transform: translateY(80px); opacity: 0; }
}

/* ══ Responsive — Mode Switcher ══ */
@media (max-width: 768px) {
  .mode-switcher { padding: 0 16px; }
  .switcher-brand-name { display: none; }
  .demo-tag { display: none; }
  .version-tag { display: none; }
}
@media (max-width: 480px) {
  .mode-switcher { height: 46px; padding: 0 10px; }
  .switcher-brand-icon { font-size: 18px; }
  .mode-btn { padding: 6px 10px; font-size: 12px; gap: 4px; }
  .mode-btn-icon { font-size: 13px; }
  .alert-toast { left: 12px; right: 12px; bottom: 12px; }
}
@media (max-width: 360px) {
  .mode-btn-label { display: none; }
  .mode-btn { padding: 8px 14px; }
  .mode-btn-icon { font-size: 17px; }
}
</style>
