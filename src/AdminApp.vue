<template>
  <div class="admin-app">

    <!-- ══ Top Navbar ══ -->
    <nav class="admin-topbar">
      <div class="admin-topbar-left">
        <div class="admin-logo-icon"><i class="bi bi-shield-fill"></i></div>
        <span class="admin-topbar-title">Admin Control & Monitoring</span>
        <span class="admin-topbar-sub">Data Analysis, Alerts & System Oversight</span>
      </div>
      <div class="admin-topbar-right">
        <div class="admin-bell" @click="showAlerts = !showAlerts">
          <i class="bi bi-bell-fill"></i>
          <span class="bell-badge" v-if="newAlerts > 0">{{ newAlerts }}</span>
        </div>
        <!-- Alert dropdown -->
        <div class="alert-dropdown" v-if="showAlerts && newAlerts > 0">
          <div class="alert-dropdown-head">แจ้งเตือนเหตุเร่งด่วน</div>
          <div
            class="alert-item"
            v-for="inc in urgentIncidents.slice(0, 5)"
            :key="inc.id"
          >
            <span class="alert-dot"></span>
            <div>
              <div class="alert-item-id">{{ inc.id }}</div>
              <div class="alert-item-loc">{{ inc.location }}</div>
            </div>
            <span class="urgency-badge high">ด่วนมาก</span>
          </div>
        </div>
        <div class="admin-user-chip">
          <div class="admin-avatar">A</div>
          <div>
            <div class="admin-name">ผู้ดูแลระบบ</div>
            <div class="admin-role">Super Admin</div>
          </div>
        </div>
      </div>
    </nav>

    <div class="admin-layout">

      <!-- ══ Sidebar ══ -->
      <aside class="admin-sidebar">
        <div
          v-for="v in views"
          :key="v.key"
          :class="['sidebar-item', activeView === v.key ? 'active' : '']"
          @click="activeView = v.key; showAlerts = false"
        >
          <span class="sidebar-icon"><i :class="['bi', v.icon]"></i></span>
          <span class="sidebar-label">{{ v.label }}</span>
        </div>
      </aside>

      <!-- ══ Main Content ══ -->
      <main class="admin-main">

        <!-- ─── OVERVIEW ─── -->
        <div v-if="activeView === 'overview'" class="view-overview">
          <div class="view-header">
            <h2 class="view-title">ภาพรวมทั้งหมด</h2>
            <div class="view-date">{{ todayStr }}</div>
          </div>

          <!-- Stats Row -->
          <div class="stats-row">
            <div class="stat-card" style="border-top:4px solid #3b82f6">
              <div class="stat-icon" style="color:#3b82f6"><i class="bi bi-clipboard2-data-fill"></i></div>
              <div class="stat-num">{{ totalCount.toLocaleString() }}</div>
              <div class="stat-label">รับแจ้งทั้งหมด</div>
            </div>
            <div class="stat-card" style="border-top:4px solid #f59e0b">
              <div class="stat-icon" style="color:#f59e0b"><i class="bi bi-gear-fill"></i></div>
              <div class="stat-num">{{ processingCount.toLocaleString() }}</div>
              <div class="stat-label">กำลังดำเนินการ</div>
            </div>
            <div class="stat-card" style="border-top:4px solid #22c55e">
              <div class="stat-icon" style="color:#22c55e"><i class="bi bi-check-circle-fill"></i></div>
              <div class="stat-num">{{ doneCount.toLocaleString() }}</div>
              <div class="stat-label">เสร็จสิ้นแล้ว</div>
            </div>
            <div class="stat-card" style="border-top:4px solid #f8d247">
              <div class="stat-icon" style="color:#f8d247"><i class="bi bi-stopwatch-fill"></i></div>
              <div class="stat-num">{{ slaRate }}%</div>
              <div class="stat-label">SLA ผ่านเกณฑ์</div>
            </div>
          </div>

          <!-- Middle Grid: Table + Charts -->
          <div class="overview-grid">

            <!-- Incidents Table -->
            <div class="card">
              <div class="card-head-row">
                <span class="card-head">รายการเหตุการณ์ล่าสุด</span>
                <button class="btn-sm" @click="activeView = 'incidents'">ดูทั้งหมด →</button>
              </div>
              <div class="table-wrap">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>หมายเลข</th>
                      <th>ประเภท</th>
                      <th>สถานที่</th>
                      <th>ระดับ</th>
                      <th>วันที่</th>
                      <th>สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="inc in allIncidents.slice(0, 8)"
                      :key="inc.id"
                      :class="[inc.urgency === 'high' && inc.status !== 'done' ? 'row-urgent' : '', 'row-clickable']"
                      @click="openIncident(inc)"
                    >
                      <td class="td-id">{{ inc.id }}</td>
                      <td>{{ inc.type }}</td>
                      <td class="td-loc">{{ inc.location }}</td>
                      <td><span :class="['urgency-badge', inc.urgency]">{{ urgencyText(inc.urgency) }}</span></td>
                      <td class="td-date">{{ inc.date }}</td>
                      <td><span :class="['status-pill', inc.status]">{{ statusText(inc.status) }}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Charts column -->
            <div class="charts-col">

              <!-- SLA Donut -->
              <div class="card chart-card">
                <div class="card-head">Per. SLA</div>
                <div class="donut-wrap">
                  <svg viewBox="0 0 120 120" class="donut-svg">
                    <!-- background (red = failed) -->
                    <circle cx="60" cy="60" r="45" fill="none" stroke="#fee2e2" stroke-width="16"/>
                    <circle cx="60" cy="60" r="45" fill="none" stroke="#ef4444" stroke-width="16"
                      :stroke-dasharray="failDash" stroke-linecap="round"
                      transform="rotate(-90 60 60)"/>
                    <!-- foreground (yellow = passed) -->
                    <circle cx="60" cy="60" r="45" fill="none" stroke="#f8d247" stroke-width="16"
                      :stroke-dasharray="passDash" stroke-linecap="round"
                      transform="rotate(-90 60 60)"/>
                    <text x="60" y="56" text-anchor="middle" font-size="18" font-weight="800" fill="#555859">{{ slaRate }}%</text>
                    <text x="60" y="70" text-anchor="middle" font-size="9" fill="#888">ผ่านเกณฑ์</text>
                  </svg>
                </div>
                <div class="donut-legend">
                  <div class="legend-row"><span class="dot yellow"></span>ผ่านเกณฑ์ {{ slaRate }}%</div>
                  <div class="legend-row"><span class="dot red"></span>ไม่ผ่าน {{ 100 - slaRate }}%</div>
                </div>
              </div>

              <!-- Urgency Line Chart -->
              <div class="card chart-card">
                <div class="card-head">ระดับความเร่งด่วน (รายเดือน)</div>
                <div class="linechart-wrap">
                  <svg :viewBox="`0 0 300 ${chartH + 30}`" class="line-svg">
                    <!-- Y gridlines -->
                    <line v-for="g in [0,1,2,3]" :key="'grid-' + g"
                      :x1="chartPad" :y1="chartH - g*(chartH/3)"
                      :x2="300 - chartPad" :y2="chartH - g*(chartH/3)"
                      stroke="#f0f2f8" stroke-width="1"/>
                    <!-- Lines -->
                    <polyline :points="linePoints('high')" fill="none" stroke="#ef4444" stroke-width="2" stroke-linejoin="round"/>
                    <polyline :points="linePoints('mid')"  fill="none" stroke="#f59e0b" stroke-width="2" stroke-linejoin="round"/>
                    <polyline :points="linePoints('low')"  fill="none" stroke="#22c55e" stroke-width="2" stroke-linejoin="round"/>
                    <!-- X labels -->
                    <text
                      v-for="(d, i) in monthlyData"
                      :key="'month-' + i"
                      :x="chartPad + i * ((300 - chartPad*2) / (monthlyData.length - 1))"
                      :y="chartH + 18"
                      text-anchor="middle"
                      font-size="7"
                      fill="#aaa"
                    >{{ d.month }}</text>
                  </svg>
                  <div class="line-legend">
                    <span class="ll-item"><span class="ll-dot" style="background:#ef4444"></span>ด่วนมาก</span>
                    <span class="ll-item"><span class="ll-dot" style="background:#f59e0b"></span>ด่วน</span>
                    <span class="ll-item"><span class="ll-dot" style="background:#22c55e"></span>ปกติ</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- ─── INCIDENTS ─── -->
        <div v-if="activeView === 'incidents'" class="view-incidents">
          <div class="view-header">
            <h2 class="view-title">ข้อมูลแจ้งเหตุ</h2>
            <button class="btn-export"><i class="bi bi-download"></i> Export CSV</button>
          </div>

          <!-- Urgent Alert Banner -->
          <div class="urgent-banner" v-if="urgentIncidents.length > 0">
            <span class="ub-pulse"></span>
            <span class="ub-text"><i class="bi bi-exclamation-triangle-fill"></i> มีเหตุการณ์เร่งด่วน {{ urgentIncidents.length }} รายการ ที่ยังไม่ได้รับการแก้ไข</span>
          </div>

          <!-- Filters -->
          <div class="filter-row">
            <div class="search-wrap">
              <i class="bi bi-search search-icon"></i>
              <input class="search-input" v-model="searchQ" placeholder="ค้นหาหมายเลข, สถานที่..." />
            </div>
            <select class="filter-select" v-model="filterUrgency">
              <option value="all">ทุกระดับ</option>
              <option value="high">ด่วนมาก</option>
              <option value="mid">ด่วน</option>
              <option value="low">ปกติ</option>
            </select>
            <select class="filter-select" v-model="filterStatus">
              <option value="all">ทุกสถานะ</option>
              <option value="new">รับเรื่อง</option>
              <option value="assigned">ดำเนินการ</option>
              <option value="done">เสร็จสิ้น</option>
            </select>
            <div class="filter-count">{{ filteredIncidents.length }} รายการ</div>
          </div>

          <div class="card">
            <div class="table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>หมายเลข</th>
                    <th>ประเภท</th>
                    <th>สถานที่</th>
                    <th>ผู้แจ้ง</th>
                    <th>โทร</th>
                    <th>ระดับ</th>
                    <th>วันที่</th>
                    <th>สถานะ</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="inc in filteredIncidents"
                    :key="inc.id"
                    :class="[inc.urgency === 'high' && inc.status !== 'done' ? 'row-urgent' : '', 'row-clickable']"
                    @click="openIncident(inc)"
                  >
                    <td class="td-id">{{ inc.id }}</td>
                    <td>{{ inc.type }}</td>
                    <td class="td-loc">{{ inc.location }}</td>
                    <td>{{ inc.contactName || '—' }}</td>
                    <td>{{ inc.contactPhone || '—' }}</td>
                    <td><span :class="['urgency-badge', inc.urgency]">{{ urgencyText(inc.urgency) }}</span></td>
                    <td class="td-date">{{ inc.date }}</td>
                    <td><span :class="['status-pill', inc.status]">{{ statusText(inc.status) }}</span></td>
                    <td><button class="btn-eye" @click.stop="openIncident(inc)"><i class="bi bi-eye-fill"></i></button></td>
                  </tr>
                </tbody>
              </table>
              <div class="empty-table" v-if="filteredIncidents.length === 0">
                <div><i class="bi bi-inbox" style="font-size:2em"></i></div><div>ไม่พบรายการที่ค้นหา</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ─── MAP / RISK ZONES ─── -->
        <div v-if="activeView === 'map'" class="view-map">
          <div class="view-header">
            <h2 class="view-title">กำหนดพื้นที่เสี่ยงภัย</h2>
            <button class="btn-add-zone" @click="showAddZone = !showAddZone">+ เพิ่มพื้นที่</button>
          </div>

          <!-- Add Zone Form -->
          <div class="add-zone-form card" v-if="showAddZone">
            <div class="card-head">เพิ่มพื้นที่เสี่ยงภัยใหม่</div>
            <div class="zone-form-row">
              <input class="zone-input" v-model="newZone.name" placeholder="ชื่อพื้นที่" />
              <select class="filter-select" v-model="newZone.level">
                <option value="high">สูง (แดง)</option>
                <option value="medium">กลาง (เหลือง)</option>
                <option value="low">ต่ำ (เขียว)</option>
              </select>
              <button class="btn-save-zone" @click="addZone">บันทึก</button>
              <button class="btn-cancel" @click="showAddZone = false">ยกเลิก</button>
            </div>
          </div>

          <div class="map-section">
            <!-- Risk zone list -->
            <div class="zone-list">
              <div class="card-head" style="padding:0 0 12px">รายการพื้นที่เสี่ยงภัย</div>
              <div
                v-for="zone in riskZones"
                :key="zone.id"
                :class="['zone-item', selectedZone === zone.id ? 'selected' : '']"
                @click="selectedZone = zone.id"
              >
                <span class="zone-level-dot" :class="zone.level"></span>
                <div class="zone-item-info">
                  <div class="zone-name">{{ zone.name }}</div>
                  <div class="zone-level-label">{{ zoneLevelText(zone.level) }}</div>
                </div>
                <span :class="['zone-badge', zone.level]">{{ zoneLevelText(zone.level) }}</span>
              </div>
            </div>

            <!-- Map Display -->
            <div class="risk-map-card card">
              <div class="card-head-row">
                <span class="card-head">แผนที่พื้นที่เสี่ยงภัย</span>
                <div class="map-legend-row">
                  <span class="ml-item"><span class="ml-dot high"></span>เสี่ยงสูง</span>
                  <span class="ml-item"><span class="ml-dot medium"></span>เสี่ยงกลาง</span>
                  <span class="ml-item"><span class="ml-dot low-z"></span>เสี่ยงต่ำ</span>
                </div>
              </div>
              <div class="risk-map">
                <!-- Map background -->
                <div class="map-bg-grid"></div>
                <!-- Roads main -->
                <div class="road road-h" style="top:35%;left:0;width:100%;height:3px"></div>
                <div class="road road-h" style="top:62%;left:0;width:100%;height:2px"></div>
                <div class="road road-v" style="left:30%;top:0;width:2px;height:100%"></div>
                <div class="road road-v" style="left:58%;top:0;width:2px;height:100%"></div>
                <div class="road road-v" style="left:80%;top:0;width:2px;height:100%"></div>
                <!-- Roads minor -->
                <div class="road road-h" style="top:18%;left:0;width:100%;height:1px;opacity:0.55"></div>
                <div class="road road-h" style="top:80%;left:0;width:100%;height:1px;opacity:0.55"></div>
                <div class="road road-v" style="left:10%;top:0;width:1px;height:100%;opacity:0.55"></div>
                <div class="road road-v" style="left:44%;top:0;width:1px;height:100%;opacity:0.55"></div>
                <!-- Area Labels -->
                <div class="map-area-label" style="top:7%;left:33%">รามคำแหง</div>
                <div class="map-area-label" style="top:7%;left:60%">สะพานสูง</div>
                <div class="map-area-label" style="top:70%;left:33%">ลาดกระบัง</div>
                <div class="map-area-label" style="top:70%;left:62%">นวมินทร์</div>
                <div class="map-area-label" style="top:7%;left:4%">มีนบุรี</div>
                <div class="map-area-label" style="top:48%;left:3%">ประเวศ</div>
                <!-- POIs -->
                <div class="map-poi" style="top:27%;left:50%"><i class="bi bi-hospital-fill"></i> รพ.รามคำแหง</div>
                <div class="map-poi" style="top:44%;left:20%"><i class="bi bi-building-fill"></i> โรงเรียน</div>
                <div class="map-poi" style="top:14%;left:36%"><i class="bi bi-truck-front-fill"></i> สถานีดับเพลิง</div>
                <div class="map-poi" style="top:67%;left:68%"><i class="bi bi-bank2"></i> ที่ว่าการอำเภอ</div>
                <!-- Compass -->
                <div class="map-compass">N ↑</div>
                <!-- Risk zone circles -->
                <div
                  v-for="zone in riskZones"
                  :key="zone.id"
                  :class="['risk-circle', zone.level, selectedZone === zone.id ? 'selected-zone' : '']"
                  :style="{
                    left: zone.x + '%',
                    top: zone.y + '%',
                    width: zone.size + 'px',
                    height: zone.size + 'px',
                    marginLeft: -(zone.size/2) + 'px',
                    marginTop: -(zone.size/2) + 'px',
                  }"
                >
                  <div class="risk-zone-label">{{ zone.name }}</div>
                </div>
                <!-- Caution badge -->
                <div class="caution-badge"><i class="bi bi-exclamation-triangle-fill"></i> Caution</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ─── CONFIG ─── -->
        <div v-if="activeView === 'config'" class="view-config">
          <div class="view-header">
            <h2 class="view-title">กำหนดข้อมูลหลัก</h2>
          </div>

          <!-- SLA Config -->
          <div class="card config-card">
            <div class="card-head"><i class="bi bi-stopwatch-fill"></i> กำหนด SLA / Response Time</div>
            <div class="config-row">
              <label class="config-label">เวลาตอบสนองเป้าหมาย</label>
              <div class="sla-input-wrap">
                <input type="number" class="sla-input" v-model.number="slaTarget" min="5" max="60" />
                <span class="sla-unit">นาที</span>
              </div>
            </div>
            <div class="config-row">
              <label class="config-label">เวลาแก้ไขเป้าหมาย</label>
              <div class="sla-input-wrap">
                <input type="number" class="sla-input" v-model.number="resolveTarget" min="30" max="480" />
                <span class="sla-unit">นาที</span>
              </div>
            </div>
            <div class="config-row">
              <label class="config-label">ส่งแจ้งเตือนซ้ำทุก</label>
              <div class="sla-input-wrap">
                <input type="number" class="sla-input" v-model.number="reminderInterval" min="5" max="60" />
                <span class="sla-unit">นาที (หากยังไม่รับเรื่อง)</span>
              </div>
            </div>
            <div class="config-save-row">
              <button class="btn-save" @click="savedSLA = true"><i class="bi bi-floppy-fill"></i> บันทึกการตั้งค่า</button>
              <span class="save-confirm" v-if="savedSLA"><i class="bi bi-check-circle-fill"></i> บันทึกแล้ว</span>
            </div>
          </div>

          <!-- RBAC -->
          <div class="card config-card">
            <div class="card-head-row">
              <span class="card-head"><i class="bi bi-people-fill"></i> จัดการสิทธิ์ผู้ใช้งาน (RBAC)</span>
              <button class="btn-sm">+ เพิ่มผู้ใช้</button>
            </div>
            <div class="table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>ชื่อ</th>
                    <th>บทบาท</th>
                    <th>พื้นที่รับผิดชอบ</th>
                    <th>สถานะ</th>
                    <th>การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in rbacUsers" :key="user.id">
                    <td>
                      <div class="user-cell">
                        <div class="user-small-avatar">{{ user.name[0] }}</div>
                        {{ user.name }}
                      </div>
                    </td>
                    <td><span class="role-badge">{{ user.role }}</span></td>
                    <td>{{ user.zone }}</td>
                    <td>
                      <span :class="['active-badge', user.active ? 'on' : 'off']">
                        {{ user.active ? 'ใช้งาน' : 'ระงับ' }}
                      </span>
                    </td>
                    <td>
                      <button class="btn-xs" @click="user.active = !user.active">
                        {{ user.active ? 'ระงับ' : 'เปิดใช้' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Risk Zone Config -->
          <div class="card config-card">
            <div class="card-head-row">
              <span class="card-head"><i class="bi bi-map-fill"></i> กำหนดพื้นที่เสี่ยงภัย</span>
              <button class="btn-sm" @click="activeView = 'map'">จัดการบนแผนที่ →</button>
            </div>
            <div class="table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>ชื่อพื้นที่</th>
                    <th>ระดับความเสี่ยง</th>
                    <th>รัศมี (px)</th>
                    <th>การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="zone in riskZones" :key="zone.id">
                    <td>{{ zone.name }}</td>
                    <td><span :class="['zone-badge', zone.level]">{{ zoneLevelText(zone.level) }}</span></td>
                    <td>{{ zone.size }} px</td>
                    <td>
                      <button class="btn-xs danger" @click="removeZone(zone.id)">ลบ</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </main>
    </div>

    <!-- Footer -->
    <footer class="admin-footer">
      © 2568 ระบบผู้ดูแลระบบแจ้งเหตุภัยพิบัติ — กรมป้องกันและบรรเทาสาธารณภัย
    </footer>

    <!-- ════ INCIDENT DETAIL MODAL ════ -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showModal && selectedIncident" @click.self="closeModal">
        <div class="modal-panel">

          <!-- Header -->
          <div class="modal-hd">
            <div class="modal-hd-left">
              <div class="modal-case-id">{{ selectedIncident.id }}</div>
              <span :class="['urgency-badge', selectedIncident.urgency]">{{ urgencyText(selectedIncident.urgency) }}</span>
            </div>
            <button class="modal-close-btn" @click="closeModal"><i class="bi bi-x-lg"></i></button>
          </div>

          <!-- Status Stepper -->
          <div class="modal-stepper">
            <div v-for="(s, i) in statusSteps" :key="s.key" class="stepper-seg">
              <button
                :class="['stepper-btn',
                  normalizeStatus(selectedIncident.status) === s.key ? 'current' : '',
                  isStatusPast(selectedIncident, s.key) ? 'past' : ''
                ]"
                @click="updateIncidentStatus(selectedIncident.id, s.key)"
              >
                <span class="stepper-icon"><i :class="['bi', s.icon]"></i></span>
                <span class="stepper-label">{{ s.label }}</span>
              </button>
              <div
                v-if="i < statusSteps.length - 1"
                :class="['stepper-line',
                  isStatusPast(selectedIncident, statusSteps[i+1].key) ||
                  normalizeStatus(selectedIncident.status) === statusSteps[i+1].key ? 'filled' : ''
                ]"
              ></div>
            </div>
          </div>

          <!-- Body -->
          <div class="modal-body">

            <!-- Info Grid -->
            <div class="modal-info-grid">
              <div class="modal-info-sect">
                <div class="modal-sect-title"><i class="bi bi-clipboard2-fill"></i> รายละเอียดเหตุการณ์</div>
                <div class="mfield"><span class="mf-lbl">ประเภทเหตุ</span><span class="mf-val">{{ selectedIncident.type || '—' }}</span></div>
                <div class="mfield"><span class="mf-lbl">สถานที่</span><span class="mf-val">{{ selectedIncident.location }}</span></div>
                <div class="mfield"><span class="mf-lbl">วันที่แจ้ง</span><span class="mf-val">{{ selectedIncident.date }}</span></div>
                <div class="mfield"><span class="mf-lbl">ผู้ประสบภัย</span><span class="mf-val">{{ selectedIncident.peopleCount != null ? selectedIncident.peopleCount + ' คน' : '—' }}</span></div>
              </div>
              <div class="modal-info-sect">
                <div class="modal-sect-title"><i class="bi bi-person-fill"></i> ข้อมูลผู้แจ้ง</div>
                <div class="mfield"><span class="mf-lbl">ชื่อ</span><span class="mf-val">{{ selectedIncident.contactName || '—' }}</span></div>
                <div class="mfield">
                  <span class="mf-lbl">โทรศัพท์</span>
                  <span class="mf-val">
                    <a v-if="selectedIncident.contactPhone" :href="'tel:' + selectedIncident.contactPhone" class="mf-phone">
                      <i class="bi bi-telephone-fill"></i> {{ selectedIncident.contactPhone }}
                    </a>
                    <span v-else>—</span>
                  </span>
                </div>
                <div class="mfield">
                  <span class="mf-lbl">สถานะปัจจุบัน</span>
                  <span :class="['status-pill', normalizeStatus(selectedIncident.status)]">
                    {{ statusText(selectedIncident.status) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Images -->
            <div v-if="selectedIncident.images && selectedIncident.images.length" class="modal-images-sect">
              <div class="modal-sect-title"><i class="bi bi-images"></i> รูปภาพแนบ ({{ selectedIncident.images.length }})</div>
              <div class="modal-img-grid">
                <div v-for="(img, idx) in selectedIncident.images" :key="idx" class="modal-img-thumb" @click="lightboxImg = img">
                  <img :src="img" alt="incident" />
                  <div class="modal-img-overlay"><i class="bi bi-zoom-in"></i></div>
                </div>
              </div>
            </div>

            <!-- Timeline -->
            <div class="modal-tl-sect">
              <div class="modal-sect-title"><i class="bi bi-clock-history"></i> ประวัติดำเนินการ</div>
              <div class="modal-tl">
                <div v-for="(ev, i) in incidentTimeline" :key="i" class="tl-ev">
                  <div class="tl-ev-col">
                    <div :class="['tl-ev-dot', i === 0 ? 'latest' : '']"></div>
                    <div class="tl-ev-line" v-if="i < incidentTimeline.length - 1"></div>
                  </div>
                  <div class="tl-ev-body">
                    <div class="tl-ev-label">{{ ev.label }}</div>
                    <div class="tl-ev-time">{{ ev.time }}</div>
                  </div>
                </div>
              </div>
            </div>

          </div><!-- /.modal-body -->

          <!-- Footer -->
          <div class="modal-ft">
            <button class="modal-btn-outline" @click="closeModal">ปิด</button>
            <button class="modal-btn-primary"><i class="bi bi-printer-fill"></i> พิมพ์รายงาน</button>
          </div>

        </div>
      </div>
    </transition>

    <!-- Lightbox -->
    <transition name="modal-fade">
      <div class="modal-overlay lb-overlay" v-if="lightboxImg" @click="lightboxImg = null">
        <img :src="lightboxImg" class="lb-img" @click.stop alt="lightbox" />
        <button class="lb-close" @click="lightboxImg = null"><i class="bi bi-x-lg"></i></button>
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name: 'AdminApp',
  props: {
    externalIncidents: { type: Array, default: () => [] },
  },
  watch: {
    externalIncidents(val) {
      this.newAlerts = val.length
    },
  },
  data() {
    const now = new Date()
    return {
      activeView: 'overview',
      showAlerts: false,
      newAlerts: 0,
      searchQ: '',
      filterUrgency: 'all',
      filterStatus: 'all',
      slaTarget: 15,
      resolveTarget: 120,
      reminderInterval: 10,
      savedSLA: false,
      showAddZone: false,
      selectedZone: null,
      newZone: { name: '', level: 'medium' },
      chartH: 90,
      chartPad: 12,
      showModal: false,
      selectedIncidentId: null,
      lightboxImg: null,
      statusMap: {},
      statusSteps: [
        { key: 'new',      label: 'รับเรื่อง',      icon: 'bi-inbox-fill' },
        { key: 'assigned', label: 'ดำเนินการ',      icon: 'bi-person-gear' },
        { key: 'done',     label: 'เสร็จสิ้น',      icon: 'bi-check-circle-fill' },
      ],

      todayStr: now.toLocaleDateString('th-TH', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      }),

      views: [
        { key: 'overview',  icon: 'bi-bar-chart-line-fill', label: 'ภาพรวมทั้งหมด' },
        { key: 'incidents', icon: 'bi-clipboard2-data-fill', label: 'ข้อมูลแจ้งเหตุ' },
        { key: 'map',       icon: 'bi-map-fill',            label: 'กำหนดพื้นที่เสี่ยงภัย' },
        { key: 'config',    icon: 'bi-gear-fill',           label: 'กำหนดข้อมูลหลัก' },
      ],

      mockIncidents: [
        { id: 'NO.1111', type: 'น้ำท่วม',   location: 'บ้านท่า ลาดกระบัง',       urgency: 'high', status: 'done',     date: '1/1/26',    contactName: 'นางไก่',   contactPhone: '080-111-111', images: ['https://picsum.photos/seed/flood1/600/400', 'https://picsum.photos/seed/flood2/600/400', 'https://picsum.photos/seed/flood3/600/400'] },
        { id: 'NO.1112', type: 'ไฟไหม้',    location: 'ซอยลาดพร้าว 41',          urgency: 'high', status: 'assigned', date: '1/1/26',    contactName: 'นายแดง',   contactPhone: '081-222-333', images: ['https://picsum.photos/seed/fire1/600/400', 'https://picsum.photos/seed/fire2/600/400'] },
        { id: 'NO.1113', type: 'อุบัติเหตุ', location: 'ถนนพหลโยธิน กม.5',       urgency: 'mid',  status: 'assigned', date: '1/1/26',    contactName: 'นายดำ',    contactPhone: '082-444-555', images: ['https://picsum.photos/seed/acc1/600/400', 'https://picsum.photos/seed/acc2/600/400', 'https://picsum.photos/seed/acc3/600/400', 'https://picsum.photos/seed/acc4/600/400'] },
        { id: 'NO.1098', type: 'น้ำท่วม',   location: 'ตลาดเช้า นครปฐม',         urgency: 'mid',  status: 'assigned', date: '28/12/25',  contactName: 'นางขาว',   contactPhone: '083-666-777', images: ['https://picsum.photos/seed/flood4/600/400', 'https://picsum.photos/seed/flood5/600/400'] },
        { id: 'NO.1045', type: 'ดินถล่ม',   location: 'โรงเรียนบ้านท่า',          urgency: 'low',  status: 'done',     date: '15/12/25',  contactName: 'นายเขียว', contactPhone: '084-888-999', images: ['https://picsum.photos/seed/land1/600/400', 'https://picsum.photos/seed/land2/600/400'] },
        { id: 'NO.1032', type: 'น้ำท่วม',   location: 'ชุมชนริมคลอง สะพานสูง',   urgency: 'high', status: 'done',     date: '10/12/25',  contactName: 'นางฟ้า',   contactPhone: '085-000-111', images: ['https://picsum.photos/seed/flood6/600/400', 'https://picsum.photos/seed/flood7/600/400', 'https://picsum.photos/seed/flood8/600/400'] },
        { id: 'NO.1020', type: 'ไฟป่า',     location: 'เขาดินวนา มีนบุรี',        urgency: 'mid',  status: 'done',     date: '5/12/25',   contactName: 'นายใจ',    contactPhone: '086-222-333', images: ['https://picsum.photos/seed/wild1/600/400', 'https://picsum.photos/seed/wild2/600/400'] },
        { id: 'NO.1010', type: 'แก๊สรั่ว',  location: 'หมู่บ้านการเคหะ รามคำแหง', urgency: 'high', status: 'new',      date: '1/12/25',   contactName: 'นางดี',    contactPhone: '087-444-555', images: ['https://picsum.photos/seed/gas1/600/400'] },
        { id: 'NO.1005', type: 'น้ำท่วม',   location: 'ถนนรามคำแหง 24',           urgency: 'low',  status: 'done',     date: '28/11/25',  contactName: 'นายมี',    contactPhone: '088-666-777', images: ['https://picsum.photos/seed/flood9/600/400', 'https://picsum.photos/seed/flood10/600/400'] },
        { id: 'NO.0998', type: 'อาคารถล่ม', location: 'ซอยสุขาภิบาล 3',          urgency: 'high', status: 'done',     date: '20/11/25',  contactName: 'นางสุข',   contactPhone: '089-888-999', images: ['https://picsum.photos/seed/build1/600/400', 'https://picsum.photos/seed/build2/600/400', 'https://picsum.photos/seed/build3/600/400'] },
      ],

      riskZones: [
        { id: 1, name: 'สะพานสูง',              level: 'high',   x: 65, y: 60, size: 120 },
        { id: 2, name: 'ลาดกระบัง-รามคำแหง',    level: 'medium', x: 38, y: 30, size: 180 },
        { id: 3, name: 'นวมินทร์',               level: 'low',    x: 78, y: 72, size: 90  },
      ],

      rbacUsers: [
        { id: 1, name: 'นายสมชาย', role: 'เจ้าหน้าที่ภาคสนาม', zone: 'ลาดกระบัง',   active: true  },
        { id: 2, name: 'นายสมหมาย',   role: 'เจ้าหน้าที่ภาคสนาม', zone: 'สะพานสูง',    active: true  },
        { id: 3, name: 'นางสาวมานี',  role: 'ผู้ประสานงาน',        zone: 'ทั้งหมด',      active: true  },
        { id: 4, name: 'นายวิชาญ',    role: 'หัวหน้าชุด',          zone: 'ลาดกระบัง',   active: false },
        { id: 5, name: 'นางสาวรัตนา', role: 'ผู้วิเคราะห์ข้อมูล',  zone: 'ส่วนกลาง',    active: true  },
      ],

      monthlyData: [
        { month: 'ม.ค.', high: 22, mid: 15, low: 8  },
        { month: 'ก.พ.', high: 18, mid: 19, low: 6  },
        { month: 'มี.ค.', high: 25, mid: 20, low: 10 },
        { month: 'เม.ย.', high: 20, mid: 17, low: 7  },
        { month: 'พ.ค.', high: 28, mid: 22, low: 12 },
        { month: 'มิ.ย.', high: 15, mid: 18, low: 5  },
        { month: 'ก.ค.', high: 24, mid: 16, low: 9  },
        { month: 'ส.ค.', high: 30, mid: 25, low: 14 },
        { month: 'ก.ย.', high: 26, mid: 21, low: 11 },
        { month: 'ต.ค.', high: 19, mid: 14, low: 6  },
        { month: 'พ.ย.', high: 22, mid: 17, low: 8  },
        { month: 'ธ.ค.', high: 28, mid: 20, low: 10 },
      ],
    }
  },

  computed: {
    selectedIncident() {
      if (!this.selectedIncidentId) return null
      return this.allIncidents.find(i => i.id === this.selectedIncidentId) || null
    },
    allIncidents() {
      return [...this.externalIncidents, ...this.mockIncidents].map(inc => {
        const override = this.statusMap[inc.id]
        return override ? { ...inc, status: override } : inc
      })
    },
    incidentTimeline() {
      if (!this.selectedIncident) return []
      const s = this.normalizeStatus(this.selectedIncident.status)
      const date = this.selectedIncident.date || '—'
      const events = [{ label: 'รับเรื่องเข้าระบบ', time: date }]
      if (s === 'assigned' || s === 'done') {
        events.unshift({ label: 'มอบหมายเจ้าหน้าที่ภาคสนาม', time: date })
      }
      if (s === 'done') {
        events.unshift({ label: 'ปิดเคสเรียบร้อยแล้ว', time: date })
      }
      return events
    },
    totalCount() { return this.allIncidents.length + 1990 },
    processingCount() {
      return this.allIncidents.filter(i => ['new','assigned','received','processing'].includes(i.status)).length + 840
    },
    doneCount() {
      return this.allIncidents.filter(i => i.status === 'done').length + 1143
    },
    slaRate() { return 87 },
    urgentIncidents() {
      return this.allIncidents.filter(i => i.urgency === 'high' && i.status !== 'done')
    },
    filteredIncidents() {
      return this.allIncidents
        .filter(i => this.filterUrgency === 'all' || i.urgency === this.filterUrgency)
        .filter(i => this.filterStatus === 'all' || i.status === this.filterStatus)
        .filter(i => {
          if (!this.searchQ) return true
          const q = this.searchQ.toLowerCase()
          return i.id.toLowerCase().includes(q) || i.location.toLowerCase().includes(q)
        })
    },
    /* Donut chart */
    circ() { return 2 * Math.PI * 45 },
    passDash() {
      const f = (this.slaRate / 100) * this.circ
      return `${f} ${this.circ - f}`
    },
    failDash() {
      const f = ((100 - this.slaRate) / 100) * this.circ
      return `${f} ${this.circ - f}`
    },
  },

  methods: {
    urgencyText(u) { return { low: 'ปกติ', mid: 'ด่วน', high: 'ด่วนมาก' }[u] || u },
    statusText(s) {
      return { new: 'รับเรื่อง', assigned: 'ดำเนินการ', done: 'เสร็จสิ้น', received: 'รับเรื่อง', processing: 'ดำเนินการ' }[s] || s
    },
    zoneLevelText(l) { return { high: 'เสี่ยงสูง', medium: 'เสี่ยงกลาง', low: 'เสี่ยงต่ำ' }[l] || l },

    linePoints(key) {
      const W = 300 - this.chartPad * 2
      const maxVal = 35
      return this.monthlyData.map((d, i) => {
        const x = this.chartPad + (i / (this.monthlyData.length - 1)) * W
        const y = this.chartH - (d[key] / maxVal) * this.chartH
        return `${x.toFixed(1)},${y.toFixed(1)}`
      }).join(' ')
    },

    addZone() {
      if (!this.newZone.name.trim()) return
      const id = Date.now()
      this.riskZones.push({
        id, name: this.newZone.name,
        level: this.newZone.level,
        x: 50, y: 50, size: 100,
      })
      this.newZone = { name: '', level: 'medium' }
      this.showAddZone = false
    },
    removeZone(id) {
      this.riskZones = this.riskZones.filter(z => z.id !== id)
    },

    openIncident(inc) {
      this.selectedIncidentId = inc.id
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedIncidentId = null
      this.lightboxImg = null
    },
    updateIncidentStatus(id, status) {
      this.$set(this.statusMap, id, status)
    },
    normalizeStatus(s) {
      if (s === 'received' || s === 'new') return 'new'
      if (s === 'processing' || s === 'assigned') return 'assigned'
      return s || 'new'
    },
    isStatusPast(inc, key) {
      const order = ['new', 'assigned', 'done']
      const current = order.indexOf(this.normalizeStatus(inc.status))
      return order.indexOf(key) < current
    },
  },
}
</script>

<style scoped>
/* ── Base ── */
.admin-app {
  min-height: 100vh;
  background: #f7f7f7;
  font-family: 'Kanit', 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
}

/* ── Topbar ── */
.admin-topbar {
  background: #555859;
  color: #fff;
  height: 60px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky; top: 0; z-index: 200;
  box-shadow: 0 2px 12px rgba(0,0,0,0.3);
}
.admin-topbar-left { display: flex; align-items: center; gap: 12px; }
.admin-logo-icon { font-size: 22px; }
.admin-topbar-title { font-size: 17px; font-weight: 800; }
.admin-topbar-sub { font-size: 12px; color: #778; margin-left: 4px; }
.admin-topbar-right { display: flex; align-items: center; gap: 16px; position: relative; }

.admin-bell {
  font-size: 20px; cursor: pointer; position: relative;
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px;
  transition: background 0.2s;
}
.admin-bell:hover { background: rgba(255,255,255,0.1); }
.bell-badge {
  position: absolute; top: 2px; right: 2px;
  min-width: 16px; height: 16px;
  background: #ef4444; color: #fff;
  border-radius: 999px; font-size: 10px; font-weight: 800;
  display: flex; align-items: center; justify-content: center; padding: 0 3px;
}

.alert-dropdown {
  position: absolute; top: 48px; right: 40px;
  background: #fff; border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  width: 280px; overflow: hidden; z-index: 300;
}
.alert-dropdown-head {
  background: #555859; color: #f8d247;
  padding: 10px 14px; font-size: 13px; font-weight: 700;
}
.alert-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; border-bottom: 1px solid #f0f2f8;
  font-size: 13px;
}
.alert-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #ef4444; flex-shrink: 0;
  animation: blink 0.8s ease infinite alternate;
}
@keyframes blink { from { opacity: 0.4; } to { opacity: 1; } }
.alert-item-id { font-weight: 700; color: #555859; }
.alert-item-loc { color: #888; font-size: 12px; }

.admin-user-chip { display: flex; align-items: center; gap: 10px; }
.admin-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: #f8d247; color: #555859;
  font-weight: 800; font-size: 15px;
  display: flex; align-items: center; justify-content: center;
}
.admin-name { font-size: 14px; font-weight: 700; line-height: 1.2; }
.admin-role { font-size: 11px; color: #aab; }

/* ── Layout ── */
.admin-layout {
  flex: 1; display: flex; min-height: 0;
}

/* ── Sidebar ── */
.admin-sidebar {
  width: 200px; flex-shrink: 0;
  background: #555859;
  padding: 20px 12px;
  display: flex; flex-direction: column; gap: 4px;
}
.sidebar-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  color: #778;
  font-size: 14px; font-weight: 600;
  transition: all 0.2s;
}
.sidebar-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
.sidebar-item.active { background: #f8d247; color: #555859; }
.sidebar-icon { font-size: 16px; flex-shrink: 0; }

/* ── Main ── */
.admin-main {
  flex: 1; overflow-y: auto; padding: 24px;
}

/* ── View Header ── */
.view-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.view-title { font-size: 22px; font-weight: 800; color: #555859; }
.view-date { font-size: 13px; color: #888; }

/* ── Stats Row ── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}
.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  text-align: center;
}
.stat-icon { font-size: 24px; margin-bottom: 8px; }
.stat-num { font-size: 28px; font-weight: 800; color: #555859; line-height: 1; }
.stat-label { font-size: 13px; color: #888; margin-top: 4px; }

/* ── Cards ── */
.card {
  background: #fff;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}
.card-head {
  font-size: 14px; font-weight: 700; color: #555859;
  margin-bottom: 14px;
}
.card-head-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
}
.card-head-row .card-head { margin-bottom: 0; }

/* ── Overview Grid ── */
.overview-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
}
.charts-col { display: flex; flex-direction: column; gap: 16px; }

/* ── Table ── */
.table-wrap { overflow-x: auto; }
.admin-table {
  width: 100%; border-collapse: collapse; font-size: 13px;
}
.admin-table th {
  text-align: left; padding: 9px 12px;
  background: #f8f9fc; color: #666; font-weight: 700;
  border-bottom: 2px solid #e8eaf0; white-space: nowrap;
}
.admin-table td {
  padding: 9px 12px;
  border-bottom: 1px solid #f0f2f8;
  color: #333;
  vertical-align: middle;
}
.admin-table tr:last-child td { border-bottom: none; }
.admin-table tr:hover td { background: #fafbff; }
.row-urgent td { background: #fff8f8 !important; }
.td-id { font-weight: 700; color: #555859; white-space: nowrap; }
.td-loc { max-width: 160px; }
.td-date { white-space: nowrap; color: #888; }
.empty-table { text-align: center; padding: 40px; color: #aaa; font-size: 14px; }

/* ── Badges ── */
.urgency-badge {
  padding: 3px 10px; border-radius: 999px;
  font-size: 12px; font-weight: 700; white-space: nowrap;
}
.urgency-badge.high { background: #fee2e2; color: #dc2626; }
.urgency-badge.mid  { background: #fef3c7; color: #d97706; }
.urgency-badge.low  { background: #dcfce7; color: #16a34a; }

.status-pill {
  padding: 3px 10px; border-radius: 999px;
  font-size: 12px; font-weight: 700; white-space: nowrap;
}
.status-pill.new, .status-pill.received { background: #eff6ff; color: #2563eb; }
.status-pill.assigned, .status-pill.processing { background: #fef3c7; color: #d97706; }
.status-pill.done { background: #dcfce7; color: #16a34a; }

/* ── Donut Chart ── */
.donut-wrap {
  display: flex; align-items: center; justify-content: center;
  padding: 10px 0;
}
.donut-svg { width: 120px; height: 120px; }
.donut-legend { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
.legend-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #555; }
.dot {
  width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
}
.dot.yellow { background: #f8d247; }
.dot.red    { background: #ef4444; }

/* ── Line Chart ── */
.linechart-wrap { padding: 4px 0; }
.line-svg { width: 100%; display: block; }
.line-legend {
  display: flex; gap: 12px; justify-content: center;
  margin-top: 6px; flex-wrap: wrap;
}
.ll-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #666; }
.ll-dot { width: 10px; height: 3px; border-radius: 2px; }

/* ── Buttons ── */
.btn-sm {
  padding: 5px 12px; border-radius: 8px;
  background: #f7f7f7; border: 1px solid #e0e4ef;
  font-family: 'Kanit', 'Inter', sans-serif; font-size: 13px; font-weight: 600;
  color: #555; cursor: pointer; transition: all 0.2s;
}
.btn-sm:hover { background: #555859; color: #f8d247; border-color: #555859; }
.btn-xs {
  padding: 3px 10px; border-radius: 6px;
  background: #f7f7f7; border: 1px solid #e0e4ef;
  font-family: 'Kanit', 'Inter', sans-serif; font-size: 12px; font-weight: 600;
  color: #555; cursor: pointer; transition: all 0.2s;
}
.btn-xs:hover { background: #555859; color: #fff; }
.btn-xs.danger:hover { background: #ef4444; border-color: #ef4444; color: #fff; }
.btn-export {
  padding: 7px 16px; border-radius: 8px;
  background: #555859; color: #f8d247;
  border: none; font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 13px; font-weight: 700; cursor: pointer;
}
.btn-save {
  padding: 9px 20px; border-radius: 8px;
  background: #f8d247; color: #555859;
  border: none; font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 14px; font-weight: 700; cursor: pointer;
}
.save-confirm { font-size: 13px; color: #22c55e; font-weight: 700; }

/* ── Incidents View ── */
.view-incidents { display: flex; flex-direction: column; gap: 16px; }
.urgent-banner {
  background: #fef2f2; border: 1.5px solid #fca5a5;
  border-radius: 10px; padding: 10px 16px;
  display: flex; align-items: center; gap: 10px;
  font-size: 14px; font-weight: 700; color: #991b1b;
}
.ub-pulse {
  width: 10px; height: 10px; border-radius: 50%;
  background: #ef4444; flex-shrink: 0;
  animation: blink 0.8s ease infinite alternate;
}
.filter-row {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.search-wrap {
  flex: 1; min-width: 200px;
  position: relative; display: flex; align-items: center;
}
.search-icon {
  position: absolute; left: 12px; color: #aaa; font-size: 14px; pointer-events: none;
}
.search-input {
  width: 100%;
  border: 1.5px solid #e0e4ef; border-radius: 8px;
  padding: 8px 14px 8px 34px; font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 14px; color: #555859; outline: none;
}
.search-input:focus { border-color: #f8d247; }
.filter-select {
  border: 1.5px solid #e0e4ef; border-radius: 8px;
  padding: 8px 12px; font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 13px; color: #555; outline: none; cursor: pointer;
  background: #fff;
}
.filter-count { font-size: 13px; color: #888; font-weight: 600; white-space: nowrap; }

/* ── Map View ── */
.view-map { display: flex; flex-direction: column; gap: 16px; }
.btn-add-zone {
  padding: 7px 16px; border-radius: 8px;
  background: #22c55e; color: #fff;
  border: none; font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 13px; font-weight: 700; cursor: pointer;
}
.add-zone-form { margin-bottom: 4px; }
.zone-form-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.zone-input {
  flex: 1; min-width: 160px;
  border: 1.5px solid #e0e4ef; border-radius: 8px;
  padding: 8px 12px; font-family: 'Kanit', 'Inter', sans-serif; font-size: 14px;
  outline: none;
}
.zone-input:focus { border-color: #f8d247; }
.btn-save-zone {
  padding: 8px 16px; border-radius: 8px;
  background: #555859; color: #f8d247;
  border: none; font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 13px; font-weight: 700; cursor: pointer;
}
.btn-cancel {
  padding: 8px 14px; border-radius: 8px;
  background: #f7f7f7; border: 1px solid #e0e4ef;
  font-family: 'Kanit', 'Inter', sans-serif; font-size: 13px; cursor: pointer;
}

.map-section {
  display: grid; grid-template-columns: 240px 1fr; gap: 16px; align-items: start;
}
.zone-list { display: flex; flex-direction: column; gap: 8px; }
.zone-item {
  display: flex; align-items: center; gap: 10px;
  background: #fff; border-radius: 10px;
  padding: 12px 14px; cursor: pointer;
  border: 2px solid transparent;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
  transition: all 0.15s;
}
.zone-item:hover { border-color: #e0e4ef; }
.zone-item.selected { border-color: #f8d247; background: #fdf6d8; }
.zone-level-dot {
  width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
}
.zone-level-dot.high   { background: #ef4444; }
.zone-level-dot.medium { background: #f59e0b; }
.zone-level-dot.low    { background: #22c55e; }
.zone-item-info { flex: 1; }
.zone-name { font-size: 13px; font-weight: 700; color: #555859; }
.zone-level-label { font-size: 12px; color: #888; }
.zone-badge {
  padding: 3px 8px; border-radius: 999px;
  font-size: 11px; font-weight: 700;
}
.zone-badge.high   { background: #fee2e2; color: #dc2626; }
.zone-badge.medium { background: #fef3c7; color: #d97706; }
.zone-badge.low    { background: #dcfce7; color: #16a34a; }

/* ── Risk Map ── */
.map-legend-row { display: flex; gap: 14px; align-items: center; }
.ml-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #555; }
.ml-dot {
  width: 12px; height: 12px; border-radius: 50%;
}
.ml-dot.high   { background: rgba(239,68,68,0.6); }
.ml-dot.medium { background: rgba(245,158,11,0.6); }
.ml-dot.low-z  { background: rgba(34,197,94,0.6); }

.risk-map {
  height: 420px;
  background: #e8f4f8;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  margin-top: 10px;
}
.map-bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(100,140,180,0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100,140,180,0.12) 1px, transparent 1px);
  background-size: 40px 40px;
}
.road {
  position: absolute; background: #d4c8aa;
}
.map-area-label {
  position: absolute;
  font-size: 11px; font-weight: 700; color: #555;
  background: rgba(255,255,255,0.7);
  padding: 2px 6px; border-radius: 4px;
}
.map-poi {
  position: absolute;
  font-size: 11px; color: #555859;
  background: rgba(255,255,255,0.9);
  padding: 3px 7px; border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  white-space: nowrap;
}

.risk-circle {
  position: absolute;
  border-radius: 50%;
  display: flex; align-items: flex-end; justify-content: center;
  padding-bottom: 6px;
  transition: all 0.3s;
}
.risk-circle.high {
  background: rgba(239,68,68,0.22);
  border: 2.5px solid rgba(239,68,68,0.6);
}
.risk-circle.medium {
  background: rgba(245,158,11,0.2);
  border: 2.5px solid rgba(245,158,11,0.55);
}
.risk-circle.low {
  background: rgba(34,197,94,0.18);
  border: 2.5px solid rgba(34,197,94,0.5);
}
.risk-circle.selected-zone {
  box-shadow: 0 0 0 4px rgba(248,210,71,0.5);
  animation: zone-pulse 1.5s ease-out infinite;
}
@keyframes zone-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(248,210,71,0.5); }
  100% { box-shadow: 0 0 0 12px rgba(248,210,71,0); }
}
.risk-zone-label {
  font-size: 11px; font-weight: 700; color: #555859;
  background: rgba(255,255,255,0.85);
  padding: 2px 8px; border-radius: 999px;
  text-align: center; white-space: nowrap;
}
.caution-badge {
  position: absolute; top: 12px; right: 12px;
  background: #fef3c7; color: #92400e;
  border: 1.5px solid #fbbf24;
  border-radius: 8px; padding: 4px 10px;
  font-size: 12px; font-weight: 700;
}
.map-compass {
  position: absolute; bottom: 12px; left: 12px;
  background: rgba(255,255,255,0.92);
  border-radius: 6px; padding: 4px 10px;
  font-size: 12px; font-weight: 800; color: #555859;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  letter-spacing: 1px;
}

/* ── Config View ── */
.view-config { display: flex; flex-direction: column; gap: 16px; }
.config-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 0; border-bottom: 1px solid #f0f2f8;
}
.config-row:last-of-type { border-bottom: none; }
.config-label { font-size: 14px; color: #444; font-weight: 600; }
.sla-input-wrap { display: flex; align-items: center; gap: 8px; }
.sla-input {
  width: 70px; border: 1.5px solid #e0e4ef; border-radius: 8px;
  padding: 6px 10px; font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 15px; font-weight: 700; text-align: center; outline: none;
}
.sla-input:focus { border-color: #f8d247; }
.sla-unit { font-size: 13px; color: #888; }
.config-save-row {
  display: flex; align-items: center; gap: 12px; margin-top: 14px;
}
.user-cell { display: flex; align-items: center; gap: 8px; }
.user-small-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  background: #f8d247; color: #555859;
  font-weight: 800; font-size: 13px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.role-badge {
  background: #eff6ff; color: #2563eb;
  padding: 3px 8px; border-radius: 999px;
  font-size: 12px; font-weight: 700;
}
.active-badge {
  padding: 3px 10px; border-radius: 999px;
  font-size: 12px; font-weight: 700;
}
.active-badge.on  { background: #dcfce7; color: #16a34a; }
.active-badge.off { background: #f3f4f6; color: #9ca3af; }

/* ── Footer ── */
.admin-footer {
  background: #555859; color: #556;
  text-align: center; padding: 12px;
  font-size: 12px;
}

/* ══════════════════════════════════════
   RESPONSIVE — Tablet (≤ 900px)
══════════════════════════════════════ */
@media (max-width: 900px) {
  /* Topbar */
  .admin-topbar-sub { display: none; }
  .admin-topbar-title { font-size: 15px; }
  .admin-name { font-size: 13px; }
  .admin-role { display: none; }

  /* Sidebar → icon only */
  .admin-sidebar { width: 56px; padding: 16px 8px; }
  .sidebar-label { display: none; }
  .sidebar-item { justify-content: center; padding: 10px 0; }
  .sidebar-icon { font-size: 18px; }

  /* Layout */
  .admin-main { padding: 16px; }
  .overview-grid { grid-template-columns: 1fr; }
  .map-section { grid-template-columns: 1fr; }
  .stats-row { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .stat-num { font-size: 22px; }
  .view-title { font-size: 19px; }

  /* Config */
  .config-row { flex-wrap: wrap; gap: 8px; }
}

@media (max-width: 720px) {
  /* Zone list stacks under map */
  .zone-list { flex-direction: row; flex-wrap: wrap; gap: 8px; }
  .zone-item { flex: 1; min-width: 140px; }
  .risk-map { height: 320px; }
}

/* ══════════════════════════════════════
   RESPONSIVE — Mobile (≤ 600px)
══════════════════════════════════════ */
@media (max-width: 600px) {
  /* Topbar */
  .admin-topbar { height: 52px; padding: 0 12px; }
  .admin-logo-icon { font-size: 18px; }
  .admin-topbar-title { font-size: 13px; }
  .admin-user-chip { display: none; }
  .admin-bell { font-size: 17px; width: 32px; height: 32px; }

  /* Layout — bottom nav */
  .admin-layout { flex-direction: column; padding-bottom: 64px; }

  /* Sidebar → fixed bottom tab bar */
  .admin-sidebar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    width: 100%; height: 60px;
    flex-direction: row;
    justify-content: space-around;
    align-items: stretch;
    padding: 0;
    gap: 0;
    box-shadow: 0 -2px 16px rgba(0,0,0,0.25);
    z-index: 150;
  }
  .sidebar-item {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    flex: 1;
    padding: 8px 4px;
    border-radius: 0;
    color: rgba(255,255,255,0.4);
    font-size: 9px;
  }
  .sidebar-label {
    display: block;
    font-size: 9px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 60px;
    text-align: center;
  }
  .sidebar-icon { font-size: 20px; }
  .sidebar-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
  .sidebar-item.active {
    background: transparent;
    color: #f8d247;
  }

  /* Main */
  .admin-main { padding: 12px 12px 16px; }

  /* View header */
  .view-header { flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  .view-title { font-size: 16px; width: 100%; order: -1; }
  .view-date { font-size: 11px; }

  /* Stats */
  .stats-row { grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
  .stat-card { padding: 12px 12px; border-radius: 10px; }
  .stat-icon { font-size: 18px; margin-bottom: 4px; }
  .stat-num { font-size: 20px; }
  .stat-label { font-size: 10px; }

  /* Cards */
  .card { padding: 12px 12px; border-radius: 10px; }
  .card-head { font-size: 13px; margin-bottom: 10px; }
  .card-head-row { margin-bottom: 10px; }

  /* Table — smaller text + horizontal scroll */
  .table-wrap { border-radius: 8px; }
  .admin-table { font-size: 11px; }
  .admin-table th { padding: 7px 8px; font-size: 10px; }
  .admin-table td { padding: 7px 8px; font-size: 11px; }
  .urgency-badge { font-size: 10px; padding: 2px 7px; }
  .status-pill { font-size: 10px; padding: 2px 7px; }
  .td-loc { max-width: 100px; }

  /* Filter row */
  .filter-row { flex-direction: column; gap: 8px; align-items: stretch; }
  .search-wrap { min-width: unset; width: 100%; }
  .search-input { font-size: 13px; padding: 8px 12px 8px 34px; }
  .filter-select { width: 100%; font-size: 13px; padding: 8px 10px; }
  .filter-count { text-align: right; font-size: 12px; }

  /* Urgent banner */
  .urgent-banner { font-size: 12px; padding: 8px 12px; }

  /* Overview charts side-by-side */
  .charts-col { flex-direction: row; gap: 10px; }
  .chart-card { flex: 1; min-width: 0; }
  .donut-svg { width: 90px; height: 90px; }

  /* Map */
  .risk-map { height: 280px; }

  /* Config */
  .config-row { flex-direction: column; align-items: flex-start; gap: 6px; padding: 12px 0; }
  .config-label { font-size: 13px; }
  .sla-unit { font-size: 12px; }
  .zone-form-row { flex-direction: column; align-items: stretch; }
  .zone-input { min-width: unset; }
  .btn-save-zone, .btn-cancel { width: 100%; text-align: center; }

  /* RBAC table — hide less important cols */
  .admin-table th:nth-child(3),
  .admin-table td:nth-child(3) { display: none; }

  /* Buttons */
  .btn-export { font-size: 12px; padding: 6px 12px; }
  .btn-sm { font-size: 12px; padding: 5px 10px; }
  .btn-save { font-size: 13px; padding: 8px 16px; }

  /* Footer */
  .admin-footer { font-size: 11px; padding: 10px 12px 72px; }

  /* Alert dropdown */
  .alert-dropdown { right: 0; width: 260px; }
}

/* ══════════════════════════════════════
   INCIDENT DETAIL MODAL
══════════════════════════════════════ */
.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.55);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
}
.modal-panel {
  background: #fff;
  border-radius: 18px;
  width: 100%; max-width: 680px;
  max-height: 90vh;
  display: flex; flex-direction: column;
  box-shadow: 0 24px 80px rgba(0,0,0,0.3);
  overflow: hidden;
}

/* Header */
.modal-hd {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px 14px;
  border-bottom: 1px solid #f0f2f8;
  flex-shrink: 0;
}
.modal-hd-left { display: flex; align-items: center; gap: 12px; }
.modal-case-id { font-size: 20px; font-weight: 800; color: #555859; }
.modal-close-btn {
  width: 34px; height: 34px; border-radius: 8px;
  border: 1.5px solid #e0e4ef; background: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; color: #888; cursor: pointer;
  transition: all 0.15s;
}
.modal-close-btn:hover { border-color: #ef4444; color: #ef4444; background: #fff5f5; }

/* Status Stepper */
.modal-stepper {
  display: flex; align-items: center;
  padding: 14px 24px;
  background: #f8f9fc;
  border-bottom: 1px solid #e8eaf0;
  flex-shrink: 0;
}
.stepper-seg {
  display: flex; align-items: center; flex: 1;
}
.stepper-seg:last-child { flex: none; }
.stepper-btn {
  display: flex; flex-direction: column; align-items: center;
  gap: 4px; padding: 8px 10px;
  border: none; background: none; cursor: pointer;
  border-radius: 10px; color: #bbb;
  font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 11px; font-weight: 700;
  transition: all 0.2s; white-space: nowrap;
}
.stepper-icon { font-size: 20px; line-height: 1; }
.stepper-btn:hover { color: #555; background: rgba(0,0,0,0.05); }
.stepper-btn.past { color: #22c55e; }
.stepper-btn.current {
  color: #555859; background: #f8d247;
  box-shadow: 0 2px 10px rgba(248,210,71,0.4);
}
.stepper-line {
  flex: 1; height: 3px; background: #e8eaf0;
  border-radius: 2px; margin: 0 6px 14px;
  transition: background 0.3s;
}
.stepper-line.filled { background: #22c55e; }

/* Body */
.modal-body {
  flex: 1; overflow-y: auto;
  padding: 20px 24px;
  display: flex; flex-direction: column; gap: 20px;
}

/* Info Grid */
.modal-info-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
}
.modal-info-sect {
  background: #f8f9fc;
  border-radius: 12px; padding: 14px 16px;
}
.modal-sect-title {
  font-size: 12px; font-weight: 800;
  color: #555859; margin-bottom: 12px;
  text-transform: uppercase; letter-spacing: 0.5px;
  display: flex; align-items: center; gap: 6px;
}
.mfield {
  display: flex; align-items: flex-start;
  gap: 8px; margin-bottom: 8px;
  font-size: 13px;
}
.mf-lbl { color: #aaa; font-weight: 600; min-width: 72px; flex-shrink: 0; }
.mf-val { color: #333; font-weight: 500; word-break: break-word; }
.mf-phone {
  color: #2563eb; text-decoration: none; font-weight: 600;
  display: flex; align-items: center; gap: 5px;
}
.mf-phone:hover { text-decoration: underline; }

/* Images */
.modal-images-sect { }
.modal-img-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 8px; margin-top: 10px;
}
.modal-img-thumb {
  position: relative; aspect-ratio: 1;
  border-radius: 10px; overflow: hidden;
  cursor: pointer; background: #f0f2f8;
}
.modal-img-thumb img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.2s;
}
.modal-img-thumb:hover img { transform: scale(1.06); }
.modal-img-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 18px;
  opacity: 0; transition: opacity 0.2s;
}
.modal-img-thumb:hover .modal-img-overlay { opacity: 1; }

/* Timeline */
.modal-tl-sect { }
.modal-tl {
  display: flex; flex-direction: column; gap: 0;
  margin-top: 10px;
}
.tl-ev { display: flex; gap: 12px; }
.tl-ev-col { display: flex; flex-direction: column; align-items: center; width: 14px; }
.tl-ev-dot {
  width: 14px; height: 14px; border-radius: 50%;
  background: #e0e4ef; border: 2px solid #e0e4ef;
  flex-shrink: 0;
}
.tl-ev-dot.latest { background: #22c55e; border-color: #22c55e; }
.tl-ev-line {
  width: 2px; flex: 1; background: #e8eaf0;
  margin: 2px 0; min-height: 18px;
}
.tl-ev-body { padding-bottom: 14px; }
.tl-ev-label { font-size: 13px; font-weight: 700; color: #333; }
.tl-ev-time { font-size: 11px; color: #aaa; margin-top: 2px; }

/* Footer */
.modal-ft {
  display: flex; align-items: center; justify-content: flex-end;
  gap: 10px; padding: 14px 24px;
  border-top: 1px solid #f0f2f8;
  flex-shrink: 0;
}
.modal-btn-outline {
  padding: 9px 20px; border-radius: 8px;
  border: 1.5px solid #e0e4ef; background: #fff;
  font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 14px; font-weight: 600;
  color: #555; cursor: pointer; transition: all 0.15s;
}
.modal-btn-outline:hover { border-color: #aaa; color: #222; }
.modal-btn-primary {
  padding: 9px 20px; border-radius: 8px;
  border: none; background: #555859; color: #fff;
  font-family: 'Kanit', 'Inter', sans-serif;
  font-size: 14px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; gap: 8px;
  transition: background 0.15s;
}
.modal-btn-primary:hover { background: #3d3f40; }

/* Table row hover */
.row-clickable { cursor: pointer; }
.row-clickable:hover td { background: #f5f7ff !important; }
.btn-eye {
  width: 30px; height: 30px; border-radius: 8px;
  border: 1.5px solid #e0e4ef; background: #fff;
  color: #555; font-size: 14px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.btn-eye:hover { background: #555859; color: #f8d247; border-color: #555859; }

/* Lightbox */
.lb-overlay { background: rgba(0,0,0,0.88); }
.lb-img { max-width: 90vw; max-height: 85vh; border-radius: 8px; display: block; }
.lb-close {
  position: absolute; top: 20px; right: 20px;
  width: 40px; height: 40px; border-radius: 50%;
  border: none; background: rgba(255,255,255,0.15);
  color: #fff; font-size: 18px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.lb-close:hover { background: rgba(255,255,255,0.3); }

/* Modal transition */
.modal-fade-enter-active { animation: modal-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-fade-leave-active { animation: modal-out 0.18s ease-in; }
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.93); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes modal-out {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.95); }
}

/* Modal responsive — tablet (≤600px) */
@media (max-width: 600px) {
  .modal-panel { border-radius: 14px; max-height: 95vh; }
  .modal-info-grid { grid-template-columns: 1fr; }
  .modal-img-grid { grid-template-columns: repeat(2, 1fr); }
  .modal-hd { padding: 14px 16px 10px; }
  .modal-body { padding: 14px 16px; -webkit-overflow-scrolling: touch; }
  .modal-stepper { padding: 10px 12px; }
  .stepper-btn { font-size: 10px; padding: 6px 8px; min-width: 60px; }
  .stepper-icon { font-size: 16px; }
  .modal-ft {
    padding: 12px 16px;
    flex-direction: column; gap: 8px;
  }
  .modal-btn-outline,
  .modal-btn-primary { width: 100%; justify-content: center; }
}

/* Modal responsive — mobile bottom-sheet (≤480px) */
@media (max-width: 480px) {
  .modal-overlay { align-items: flex-end; padding: 0; }
  .modal-panel {
    border-radius: 20px 20px 0 0;
    max-height: 88vh;
    width: 100%;
  }
  .modal-panel::before {
    content: '';
    display: block;
    width: 36px; height: 4px;
    background: #ddd; border-radius: 2px;
    margin: 10px auto 0;
    flex-shrink: 0;
  }
  .modal-img-grid { grid-template-columns: repeat(2, 1fr); }
  .mf-lbl { min-width: 64px; }
}
</style>
