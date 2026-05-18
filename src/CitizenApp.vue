<template>
  <div class="webapp">

    <!-- ══════════ NAVBAR ══════════ -->
    <nav class="navbar">
      <div class="navbar-inner">
        <div class="nav-logo" @click="currentView = 'landing'">
          <div class="logo-icon"><i class="bi bi-shield-fill"></i></div>
          <span class="logo-text">ระบบแจ้งเหตุภัยพิบัติ</span>
        </div>
        <div class="nav-links">
          <span
            v-for="v in views"
            :key="v.key"
            :class="['nav-link', currentView === v.key ? 'active' : '']"
            @click="currentView = v.key"
          >{{ v.label }}</span>
        </div>
        <div class="nav-right">
          <div class="user-badge">
            <div class="user-dot"></div>
            <span>ประชาชน</span>
          </div>
        </div>
        <!-- Hamburger (mobile only) -->
        <button
          type="button"
          class="navbar-toggler"
          @click="mobileMenuOpen = !mobileMenuOpen"
          :aria-expanded="String(mobileMenuOpen)"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
      <!-- Mobile Drawer -->
      <div class="mobile-drawer" v-if="mobileMenuOpen">
        <div class="drawer-user">
          <div class="drawer-user-avatar"><i class="bi bi-person-fill"></i></div>
          <div class="drawer-user-info">
            <div class="drawer-user-role">ประชาชน</div>
            <div class="drawer-user-status">ออนไลน์</div>
          </div>
        </div>
        <div class="drawer-nav">
          <span
            v-for="v in views"
            :key="v.key"
            :class="['drawer-link', currentView === v.key ? 'active' : '']"
            @click="currentView = v.key; mobileMenuOpen = false"
          >
            <span class="drawer-link-icon"><i :class="['bi', v.icon]"></i></span>
            <span class="drawer-link-body">
              <span class="drawer-link-label">{{ v.label }}</span>
              <span class="drawer-link-desc">{{ v.desc }}</span>
            </span>
            <span class="drawer-link-arrow">›</span>
          </span>
        </div>
        <div class="drawer-footer">
          <button class="drawer-report-btn" @click="currentView = 'form'; mobileMenuOpen = false">
            <i class="bi bi-exclamation-octagon-fill"></i> แจ้งเหตุด่วน
          </button>
        </div>
      </div>
    </nav>

    <!-- ══════════ LANDING PAGE ══════════ -->
    <div v-if="currentView === 'landing'" class="page-landing">

      <!-- Hero -->
      <section class="hero">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="hero-badge">ระบบรายงานเหตุฉุกเฉิน</div>
          <h1 class="hero-title">แจ้งเหตุภัยพิบัติ<br />ได้ทุกที่ ทุกเวลา</h1>
          <p class="hero-sub">ระบบรับแจ้งเหตุและติดตามสถานะการช่วยเหลือสำหรับประชาชน<br />เชื่อมต่อกับเจ้าหน้าที่ผู้รับผิดชอบโดยตรง</p>
          <button class="btn-hero" @click="currentView = 'form'">
            กดแจ้งเหตุ
          </button>
        </div>
      </section>

      <!-- Stats Bar -->
      <!-- <div class="stats-bar">
        <div class="stat-item">
          <div class="stat-num">1,284</div>
          <div class="stat-label">เหตุการณ์ที่รับแจ้ง</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num">97%</div>
          <div class="stat-label">อัตราการให้ความช่วยเหลือ</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num">&lt; 15 นาที</div>
          <div class="stat-label">เวลาตอบสนองเฉลี่ย</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num">24/7</div>
          <div class="stat-label">พร้อมให้บริการตลอดเวลา</div>
        </div>
      </div> -->

      <!-- Banners -->
      <section class="banner-section">
        <div class="section-title-wrap">
          <h2 class="section-title">ข่าวสารและประกาศ</h2>
        </div>
        <div class="banner-grid">
          <div class="banner-card banner-1">
            <div class="banner-tag">ประกาศด่วน</div>
            <div class="banner-title">พื้นที่เสี่ยงน้ำท่วมฉับพลัน</div>
            <div class="banner-desc">เขตลาดกระบัง กรุงเทพฯ — ระดับน้ำสูงขึ้นอย่างต่อเนื่อง</div>
          </div>
          <div class="banner-card banner-2">
            <div class="banner-tag">อัปเดตล่าสุด</div>
            <div class="banner-title">แผนอพยพประชาชน 3 อำเภอ</div>
            <div class="banner-desc">จังหวัดนครปฐม — หน่วยงานเตรียมพร้อมรองรับ 5,000 ราย</div>
          </div>
          <div class="banner-card banner-3">
            <div class="banner-tag">คำแนะนำ</div>
            <div class="banner-title">วิธีปฏิบัติตนเมื่อเกิดภัยพิบัติ</div>
            <div class="banner-desc">อ่านคู่มือฉบับย่อจากกรมป้องกันและบรรเทาสาธารณภัย</div>
          </div>
        </div>
      </section>

      <!-- How it works -->
      <section class="how-section">
        <div class="how-inner">
          <div class="how-eyebrow">ขั้นตอนการใช้งาน</div>
          <h2 class="how-title">วิธีการใช้งาน</h2>
          <p class="how-subtitle">ง่าย รวดเร็ว และปลอดภัย — เพียง 4 ขั้นตอน</p>

          <div class="steps-grid">
            <div class="step-card" v-for="step in steps" :key="step.num">
              <div class="step-num-badge">{{ step.num }}</div>
              <div class="step-icon-box"><i :class="['bi', step.icon]"></i></div>
              <div class="step-title">{{ step.title }}</div>
              <div class="step-desc">{{ step.desc }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <h2 class="cta-title">พร้อมให้ความช่วยเหลือทันที</h2>
        <p class="cta-sub">หากพบเหตุฉุกเฉินหรือต้องการความช่วยเหลือ กดปุ่มด้านล่างได้เลย</p>
        <button class="btn-hero" @click="currentView = 'form'">
          แจ้งเหตุตอนนี้
        </button>
      </section>
    </div>

    <!-- ══════════ REPORT FORM ══════════ -->
    <div v-if="currentView === 'form'" class="page-form">
      <div class="page-header">
        <div class="page-header-inner">
          <button class="back-btn" @click="currentView = 'landing'"><i class="bi bi-arrow-left"></i> กลับ</button>
          <h1 class="page-title">กรอกข้อมูลเหตุการณ์</h1>
          <div></div>
        </div>
      </div>

      <div class="form-layout">
        <!-- Left: Map -->
        <div class="form-left">
          <div class="card">
            <div class="card-head"><i class="bi bi-geo-alt-fill"></i> ตำแหน่งที่เกิดเหตุ</div>
            <div class="map-area">
              <div class="map-mock">
                <div class="map-roads"></div>
                <div class="map-pin-web"><i class="bi bi-geo-alt-fill"></i></div>
                <div class="map-search">
                  <input type="text" v-model="form.location" placeholder="ค้นหาสถานที่..." class="map-search-input" />
                </div>
                <div class="map-credit">© OpenStreetMap</div>
              </div>
            </div>
            <div class="map-coords">
              <span class="coord-label">ละติจูด</span> <span class="coord-val">13.7563</span>
              <span class="coord-sep">|</span>
              <span class="coord-label">ลองจิจูด</span> <span class="coord-val">100.5018</span>
            </div>
          </div>

          <!-- Image Upload -->
          <div class="card mt-card">
            <div class="card-head"><i class="bi bi-camera-fill"></i> รูปภาพเหตุการณ์ <span class="upload-count">{{ previewImages.length }}/4</span></div>
            <div class="upload-grid">
              <div
                v-for="(img, idx) in previewImages"
                :key="idx"
                class="upload-thumb"
              >
                <img :src="img" class="upload-thumb-img" alt="preview" />
                <button class="upload-thumb-del" @click.stop="removeImage(idx)"><i class="bi bi-x"></i></button>
              </div>
              <div
                v-if="previewImages.length < 4"
                class="upload-add-btn"
                @click="triggerUpload"
              >
                <div class="upload-add-icon">+</div>
                <div class="upload-add-hint">เพิ่มรูป</div>
              </div>
            </div>
            <div class="upload-hint-sub upload-hint-bottom">PNG, JPG สูงสุด 10MB ต่อรูป</div>
            <input ref="fileInput" type="file" accept="image/*" hidden @change="handleImage" />
          </div>
        </div>

        <!-- Right: Form Fields -->
        <div class="form-right">
          <div class="card">
            <div class="card-head"><i class="bi bi-clipboard2-fill"></i> รายละเอียดเหตุการณ์</div>

            <!-- Urgency -->
            <div class="field-group">
              <label class="field-label">ระดับความเร่งด่วน</label>
              <div class="urgency-row">
                <button
                  v-for="(u, i) in urgencyLevels"
                  :key="i"
                  :class="['urgency-chip', urgency == i ? 'active-' + u.key : '']"
                  @click="urgency = i"
                ><i :class="['bi', u.icon]" :style="{ color: u.iconColor }"></i> {{ u.label }}</button>
              </div>
            </div>

            <!-- Needs -->
            <div class="field-group">
              <label class="field-label">ความต้องการให้ช่วยเหลือ</label>
              <div class="needs-row">
                <label class="need-chip" v-for="need in needs" :key="need.key">
                  <input type="checkbox" v-model="need.checked" hidden />
                  <span :class="['chip-inner', need.checked ? 'checked' : '']">
                    <i :class="['bi', need.icon]"></i> {{ need.label }}
                  </span>
                </label>
              </div>
            </div>

            <!-- People Count -->
            <div class="field-group">
              <label class="field-label">จำนวนคนที่ประสบภัย</label>
              <div class="counter-row">
                <button class="counter-btn" @click="peopleCount = Math.max(0, peopleCount - 1)">−</button>
                <div class="counter-display">
                  <span class="counter-num">{{ peopleCount }}</span>
                  <span class="counter-unit">คน</span>
                </div>
                <button class="counter-btn" @click="peopleCount++">+</button>
              </div>
            </div>

            <!-- Description -->
            <div class="field-group">
              <label class="field-label">รายละเอียดเพิ่มเติม <span class="optional">(ไม่บังคับ)</span></label>
              <textarea class="field-textarea" v-model="form.description" placeholder="ระบุรายละเอียดเพิ่มเติม เช่น ลักษณะเหตุการณ์ ความต้องการเร่งด่วน..." rows="3"></textarea>
            </div>
          </div>

          <!-- Contact Card -->
          <div class="card mt-card">
            <div class="card-head"><i class="bi bi-telephone-fill"></i> ข้อมูลผู้แจ้ง</div>

            <button class="btn-thaid-web">
              <img src="./assets/thai-id.webp" class="thaid-badge" alt="ThaiD" />
              ลงชื่อเข้าสู่ระบบด้วย ThaiD
            </button>

            <div class="divider-or"><span>หรือกรอกข้อมูลเอง</span></div>

            <div class="field-row">
              <div class="field-group flex-1">
                <label class="field-label">ชื่อผู้แจ้ง</label>
                <input v-model="form.name" type="text" class="field-input" placeholder="ชื่อ-นามสกุล" />
              </div>
              <div class="field-group flex-1">
                <label class="field-label">เบอร์โทรศัพท์</label>
                <input v-model="form.phone" type="tel" class="field-input" placeholder="0XX-XXX-XXXX" />
              </div>
            </div>

            <button class="btn-submit-web" @click="submitForm">
              <i class="bi bi-send-fill"></i> ยืนยันและส่งข้อมูล
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════ CONFIRMATION ══════════ -->
    <div v-if="currentView === 'confirm'" class="page-confirm">
      <div class="confirm-wrap">
        <div class="confirm-icon-wrap">
          <div class="confirm-icon"><i class="bi bi-check-circle-fill"></i></div>
        </div>
        <h1 class="confirm-title">ส่งข้อมูลสำเร็จ!</h1>
        <p class="confirm-sub">นำส่งข้อมูลให้เจ้าหน้าที่เรียบร้อยแล้ว<br />โปรดรอเจ้าหน้าที่แจ้งอัปเดตให้ทราบอีกครั้ง</p>

        <div class="case-box">
          <div class="case-box-label">หมายเลขเคส</div>
          <div class="case-box-num">NO.{{ caseNumber }}</div>
          <div class="case-box-hint">บันทึกหมายเลขนี้เพื่อใช้ติดตามสถานะ</div>
        </div>

        <div class="confirm-timeline">
          <div class="tl-step done">
            <div class="tl-dot"></div>
            <div class="tl-info">
              <div class="tl-label">รับเรื่อง</div>
              <div class="tl-time">เพิ่งส่ง</div>
            </div>
          </div>
          <div class="tl-line"></div>
          <div class="tl-step pending">
            <div class="tl-dot"></div>
            <div class="tl-info">
              <div class="tl-label">กำลังดำเนินการ</div>
              <div class="tl-time">รอดำเนินการ</div>
            </div>
          </div>
          <div class="tl-line"></div>
          <div class="tl-step pending">
            <div class="tl-dot"></div>
            <div class="tl-info">
              <div class="tl-label">เสร็จสิ้น</div>
              <div class="tl-time">รอดำเนินการ</div>
            </div>
          </div>
        </div>

        <div class="confirm-actions">
          <button class="btn-thaid-web" @click="currentView = 'tracking'">
            <img src="./assets/thai-id.webp" class="thaid-badge" alt="ThaiD" />
            เข้าสู่ระบบเพื่อติดตามเคส
          </button>
          <button class="btn-outline-web" @click="currentView = 'landing'">กลับไปหน้าหลัก</button>
        </div>
      </div>
    </div>

    <!-- ══════════ CASE TRACKING ══════════ -->
    <div v-if="currentView === 'tracking'" class="page-tracking">
      <div class="page-header">
        <div class="page-header-inner">
          <button class="back-btn" @click="currentView = 'landing'"><i class="bi bi-arrow-left"></i> กลับ</button>
          <h1 class="page-title">ประวัติการแจ้งเหตุ</h1>
          <button class="btn-new" @click="currentView = 'form'"><i class="bi bi-plus-lg"></i> แจ้งเหตุใหม่</button>
        </div>
      </div>

      <div class="tracking-layout">
        <!-- Filter Tabs -->
        <div class="filter-bar">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="['filter-tab', activeTab === tab.key ? 'active' : '']"
            @click="activeTab = tab.key"
          >
            <span class="tab-dot" :class="tab.key"></span>
            {{ tab.label }}
            <span class="tab-count">{{ cases.filter(c => caseStatus(c.status) === tab.key).length }}</span>
          </button>
          <button :class="['filter-tab', activeTab === 'all' ? 'active' : '']" @click="activeTab = 'all'">
            ทั้งหมด <span class="tab-count">{{ cases.length }}</span>
          </button>
        </div>

        <!-- Cases Table -->
        <div class="cases-table-wrap">
          <table class="cases-table">
            <thead>
              <tr>
                <th>หมายเลขเคส</th>
                <th>วันที่แจ้ง</th>
                <th>สถานที่</th>
                <th>ความเร่งด่วน</th>
                <th>สถานะ</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in filteredCases" :key="c.id" class="case-row">
                <td data-label="หมายเลขเคส"><span class="case-id-cell">{{ c.id }}</span></td>
                <td data-label="วันที่แจ้ง">{{ c.date }}</td>
                <td data-label="สถานที่">{{ c.location }}</td>
                <td data-label="ความเร่งด่วน">
                  <span :class="['urgency-badge', c.urgency]">{{ urgencyText(c.urgency) }}</span>
                </td>
                <td data-label="สถานะ">
                  <span :class="['status-pill', caseStatus(c.status)]">
                    <span class="pill-dot"></span>{{ statusLabel(caseStatus(c.status)) }}
                  </span>
                </td>
                <td data-label="">
                  <button class="btn-detail" @click="openDetail(c)">ดูรายละเอียด</button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="filteredCases.length === 0" class="empty-state">
            <div class="empty-icon"><i class="bi bi-inbox"></i></div>
            <div class="empty-text">ไม่มีรายการในหมวดนี้</div>
          </div>
        </div>

        <!-- Progress Card -->
        <div class="progress-card" v-if="filteredCases.length > 0">
          <div class="progress-title">สถิติเคสของคุณ</div>
          <div class="progress-row" v-for="tab in tabs" :key="tab.key">
            <span class="progress-label">{{ tab.label }}</span>
            <div class="progress-bar-wrap">
              <div
                class="progress-bar-fill"
                :class="tab.key"
                :style="{ width: (cases.filter(c => caseStatus(c.status) === tab.key).length / cases.length * 100) + '%' }"
              ></div>
            </div>
            <span class="progress-count">{{ cases.filter(c => caseStatus(c.status) === tab.key).length }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════ DETAIL MODAL ══════════ -->
    <div v-if="showDetailModal && selectedCase" class="modal-overlay" @click.self="showDetailModal = false">
      <div class="modal-box">
        <div class="modal-header">
          <div>
            <div class="modal-case-id">{{ selectedCase.id }}</div>
            <h2 class="modal-title">รายละเอียดเคส</h2>
          </div>
          <button class="modal-close" @click="showDetailModal = false"><i class="bi bi-x-lg"></i></button>
        </div>

        <div class="modal-body">
          <div class="modal-info-grid">
            <div class="modal-info-item">
              <div class="modal-info-label"><i class="bi bi-calendar3"></i> วันที่แจ้ง</div>
              <div class="modal-info-val">{{ selectedCase.date }}</div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-label"><i class="bi bi-geo-alt-fill"></i> สถานที่เกิดเหตุ</div>
              <div class="modal-info-val">{{ selectedCase.location }}</div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-label"><i class="bi bi-exclamation-circle-fill"></i> ความเร่งด่วน</div>
              <div class="modal-info-val">
                <span :class="['urgency-badge', selectedCase.urgency]">{{ urgencyText(selectedCase.urgency) }}</span>
              </div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-label"><i class="bi bi-flag-fill"></i> สถานะ</div>
              <div class="modal-info-val">
                <span :class="['status-pill', caseStatus(selectedCase.status)]">
                  <span class="pill-dot"></span>{{ statusLabel(caseStatus(selectedCase.status)) }}
                </span>
              </div>
            </div>
          </div>

          <div class="modal-section-title">ความคืบหน้า</div>
          <div class="modal-timeline">
            <div class="modal-tl-item">
              <div class="modal-tl-dot done"></div>
              <div class="modal-tl-line" :class="{ done: caseStatus(selectedCase.status) === 'processing' || caseStatus(selectedCase.status) === 'done' }"></div>
              <div class="modal-tl-content">
                <div class="modal-tl-label done">รับเรื่อง</div>
                <div class="modal-tl-time">{{ selectedCase.date }}</div>
              </div>
            </div>
            <div class="modal-tl-item">
              <div class="modal-tl-dot" :class="{ done: caseStatus(selectedCase.status) === 'processing' || caseStatus(selectedCase.status) === 'done' }"></div>
              <div class="modal-tl-line" :class="{ done: caseStatus(selectedCase.status) === 'done' }"></div>
              <div class="modal-tl-content">
                <div class="modal-tl-label" :class="{ done: caseStatus(selectedCase.status) === 'processing' || caseStatus(selectedCase.status) === 'done' }">กำลังดำเนินการ</div>
                <div class="modal-tl-time">{{ caseStatus(selectedCase.status) === 'processing' || caseStatus(selectedCase.status) === 'done' ? 'อยู่ระหว่างดำเนินการ' : 'รอดำเนินการ' }}</div>
              </div>
            </div>
            <div class="modal-tl-item last">
              <div class="modal-tl-dot" :class="{ done: caseStatus(selectedCase.status) === 'done' }"></div>
              <div class="modal-tl-content">
                <div class="modal-tl-label" :class="{ done: caseStatus(selectedCase.status) === 'done' }">เสร็จสิ้น</div>
                <div class="modal-tl-time">{{ caseStatus(selectedCase.status) === 'done' ? 'ดำเนินการเสร็จสิ้นแล้ว' : 'รอดำเนินการ' }}</div>
              </div>
            </div>
          </div>

          <!-- ผลการปฏิบัติงานของเจ้าหน้าที่ (แสดงเมื่อเคสเสร็จสิ้น) -->
          <div v-if="caseStatus(selectedCase.status) === 'done'" class="modal-result-sect">
            <div class="modal-section-title">ผลการปฏิบัติงานของเจ้าหน้าที่</div>
            <div class="modal-result-card">
              <div class="modal-result-row">
                <span class="modal-result-label"><i class="bi bi-flag-fill"></i> ผลการดำเนินการ</span>
                <span class="modal-result-outcome" :class="selectedCase.outcome || 'resolved'">
                  {{ outcomeLabel(selectedCase.outcome) }}
                </span>
              </div>
              <div class="modal-result-row" v-if="selectedCase.checkinTime">
                <span class="modal-result-label"><i class="bi bi-geo-alt-fill"></i> เวลาเช็คอิน</span>
                <span class="modal-result-val">{{ selectedCase.checkinTime }}</span>
              </div>
              <div class="modal-result-row" v-if="selectedCase.closeTime">
                <span class="modal-result-label"><i class="bi bi-clock-fill"></i> เวลาปิดเคส</span>
                <span class="modal-result-val">{{ selectedCase.closeTime }}</span>
              </div>
              <div class="modal-result-note" v-if="selectedCase.completionNote">
                <div class="modal-result-label"><i class="bi bi-chat-left-text-fill"></i> บันทึกการปฏิบัติงาน</div>
                <div class="modal-result-note-body">{{ selectedCase.completionNote }}</div>
              </div>
              <div class="modal-result-img-wrap" v-if="selectedCase.evidenceImage">
                <div class="modal-result-label"><i class="bi bi-camera-fill"></i> รูปภาพหลักฐาน</div>
                <img :src="selectedCase.evidenceImage" class="modal-result-img" alt="หลักฐาน" />
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-close-btn" @click="showDetailModal = false">ปิด</button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="footer-inner">
        <span>© 2568 ระบบแจ้งเหตุภัยพิบัติ </span>
        <!-- <span class="footer-sep">|</span>
        <span>สายด่วน 1784</span> -->
      </div>
    </footer>

  </div>
</template>

<script>
export default {
  name: 'CitizenApp',
  props: {
    submittedReports: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentView: 'landing',
      mobileMenuOpen: false,
      showDetailModal: false,
      selectedCase: null,
      urgency: 1,
      peopleCount: 0,
      previewImages: [],
      form: { name: '', phone: '', location: '', description: '' },
      caseNumber: '1111',
      activeTab: 'all',
      urgencyLevels: [
        { key: 'low', label: 'น้อย', icon: 'bi-circle-fill', iconColor: '#22c55e' },
        { key: 'mid', label: 'ปานกลาง', icon: 'bi-circle-fill', iconColor: '#f59e0b' },
        { key: 'high', label: 'ด่วนมาก', icon: 'bi-circle-fill', iconColor: '#ef4444' },
      ],
      needs: [
        { key: 'food', label: 'อาหาร', icon: 'bi-basket-fill', checked: false },
        { key: 'medical', label: 'แพทย์', icon: 'bi-hospital-fill', checked: false },
        { key: 'clothes', label: 'เสื้อผ้า', icon: 'bi-bag-fill', checked: false },
        { key: 'rescue', label: 'กู้ภัย', icon: 'bi-truck-front-fill', checked: false },
        { key: 'shelter', label: 'ที่พักพิง', icon: 'bi-house-fill', checked: false },
        { key: 'other', label: 'อื่นๆ', icon: 'bi-box-seam-fill', checked: false },
      ],
      tabs: [
        { key: 'received', label: 'รับเรื่อง' },
        { key: 'processing', label: 'กำลังดำเนินการ' },
        { key: 'done', label: 'เสร็จสิ้น' },
      ],
      demoCases: [
        { id: 'NO.1111', date: '1/1/2569', location: 'บ้านเก่า ลาดกระบัง', urgency: 'high', status: 'new' },
        { id: 'NO.1098', date: '28/12/2568', location: 'ตลาดเช้า นครปฐม', urgency: 'mid', status: 'assigned' },
        { id: 'NO.1045', date: '15/12/2568', location: 'โรงเรียนบ้านท่า', urgency: 'low', status: 'done' },
        { id: 'NO.1032', date: '10/12/2568', location: 'ชุมชนริมคลอง', urgency: 'high', status: 'done' },
      ],
      steps: [
        { num: '01', icon: 'bi-pencil-fill', title: 'กรอกข้อมูล', desc: 'ระบุตำแหน่ง ประเภทเหตุ และความต้องการ' },
        { num: '02', icon: 'bi-send-fill', title: 'ส่งข้อมูล', desc: 'ส่งข้อมูลถึงเจ้าหน้าที่ในพื้นที่ทันที' },
        { num: '03', icon: 'bi-bell-fill', title: 'รับการแจ้งเตือน', desc: 'ติดตามสถานะผ่านหมายเลขเคส' },
        { num: '04', icon: 'bi-people-fill', title: 'ได้รับความช่วยเหลือ', desc: 'หน่วยงานเข้าให้ความช่วยเหลือ' },
      ],
      views: [
        { key: 'landing', label: 'หน้าหลัก', icon: 'bi-house-door-fill', desc: 'หน้าแรกและข่าวสาร' },
        { key: 'form', label: 'แจ้งเหตุ', icon: 'bi-pencil-fill', desc: 'กรอกข้อมูลเหตุการณ์' },
        { key: 'tracking', label: 'ติดตามเคส', icon: 'bi-search', desc: 'ดูสถานะการช่วยเหลือ' },
      ],
    }
  },
  computed: {
    cases() {
      return [...this.submittedReports, ...this.demoCases]
    },
    filteredCases() {
      if (this.activeTab === 'all') return this.cases
      return this.cases.filter(c => this.caseStatus(c.status) === this.activeTab)
    },
  },
  methods: {
    triggerUpload() { this.$refs.fileInput.click() },
    handleImage(e) {
      const file = e.target.files[0]
      if (!file || this.previewImages.length >= 4) return
      const reader = new FileReader()
      reader.onload = ev => { this.previewImages.push(ev.target.result) }
      reader.readAsDataURL(file)
      e.target.value = ''
    },
    removeImage(idx) { this.previewImages.splice(idx, 1) },
    submitForm() {
      this.caseNumber = String(Math.floor(1000 + Math.random() * 9000))
      const urgencyMap = ['low', 'mid', 'high']
      const typeMap = {
        food: 'ขาดแคลนอาหาร', medical: 'ต้องการแพทย์',
        rescue: 'ต้องการกู้ภัย', shelter: 'ต้องการที่พัก',
        clothes: 'ขาดเครื่องนุ่งห่ม', other: 'เหตุฉุกเฉิน',
      }
      const checkedNeeds = this.needs.filter(n => n.checked)
      const checkedNeed = checkedNeeds[0]
      const now = new Date()
      const dateStr = `${now.getDate()}/${now.getMonth()+1}/${String(now.getFullYear()).slice(-2)} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
      const report = {
        id: 'NO.' + this.caseNumber,
        date: dateStr,
        location: this.form.location || 'ไม่ระบุสถานที่',
        type: checkedNeed ? (typeMap[checkedNeed.key] || 'เหตุฉุกเฉิน') : 'เหตุฉุกเฉิน',
        urgency: urgencyMap[this.urgency] || 'mid',
        status: 'new',
        contactName: this.form.name || 'ไม่ระบุ',
        contactPhone: this.form.phone || 'ไม่ระบุ',
        peopleCount: this.peopleCount,
        needs: checkedNeeds.map(n => ({ key: n.key, label: n.label })),
        description: this.form.description || '',
        images: [...this.previewImages],
      }
      this.$emit('report-submitted', report)
      this.currentView = 'confirm'
    },
    openDetail(c) {
      this.selectedCase = c
      this.showDetailModal = true
    },
    caseStatus(s) {
      return { new: 'received', assigned: 'processing', done: 'done' }[s] || 'received'
    },
    statusLabel(s) {
      return { received: 'รับเรื่อง', processing: 'กำลังดำเนินการ', done: 'เสร็จสิ้น' }[s]
    },
    urgencyText(u) {
      return { low: 'น้อย', mid: 'ปานกลาง', high: 'ด่วนมาก' }[u]
    },
    outcomeLabel(o) {
      return { resolved: 'แก้ไขสำเร็จ', transferred: 'ส่งต่อโรงพยาบาล', evacuated: 'อพยพแล้ว', pending: 'รอหน่วยสนับสนุน' }[o] || 'เสร็จสิ้น'
    },
  },
}
</script>

<style scoped>
/* ══ Base ══ */
* { box-sizing: border-box; }

.webapp {
  min-height: 100vh;
  font-family: 'Kanit', 'Inter', sans-serif;
  background: #f7f7f7;
  color: #555859;
  display: flex;
  flex-direction: column;
}

/* ══ Navbar ══ */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background: #555859;
  box-shadow: 0 2px 16px rgba(0,0,0,0.18);
}

.navbar-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex-shrink: 0;
}

.logo-icon { font-size: 24px; }

.logo-text {
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.3px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  transition: all 0.2s;
}

.nav-link:hover { color: #fff; background: rgba(255,255,255,0.08); }
.nav-link.active { color: #555859; background: #f8d247; font-weight: 700; }

.nav-right { flex-shrink: 0; }

.user-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  color: rgba(255,255,255,0.85);
}

.user-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
}

/* ══ Landing ══ */
.page-landing { flex: 1; }

.hero {
  position: relative;
  min-height: 480px;
  background: linear-gradient(135deg, #555859 0%, #6a6c6e 40%, #3d3f40 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero-content {
  position: relative;
  text-align: center;
  padding: 60px 24px;
  max-width: 720px;
}
.hero-content .hero-badge { animation: hero-fade-up 0.65s 0.10s cubic-bezier(0.22,1,0.36,1) both; }
.hero-content .hero-title { animation: hero-fade-up 0.65s 0.24s cubic-bezier(0.22,1,0.36,1) both; }
.hero-content .hero-sub   { animation: hero-fade-up 0.65s 0.38s cubic-bezier(0.22,1,0.36,1) both; }
.hero-content .btn-hero   { animation: hero-fade-up 0.65s 0.52s cubic-bezier(0.22,1,0.36,1) both; }
@keyframes hero-fade-up {
  from { opacity: 0; transform: translateY(26px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero-badge {
  display: inline-block;
  background: rgba(248,210,71,0.15);
  border: 1px solid rgba(248,210,71,0.4);
  color: #f8d247;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 18px;
  border-radius: 20px;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
}

.hero-title {
  font-size: 52px;
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  margin-bottom: 20px;
}

.hero-sub {
  font-size: 17px;
  color: rgba(255,255,255,0.65);
  line-height: 1.7;
  margin-bottom: 36px;
}

.btn-hero {
  background: #f8d247;
  color: #555859;
  border: none;
  border-radius: 14px;
  padding: 16px 40px;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 24px rgba(248,210,71,0.4);
}

.btn-hero:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(248,210,71,0.5);
}

.btn-hero-icon { font-size: 20px; }

/* Stats */
.stats-bar {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 0;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 28px 16px;
  max-width: 280px;
}

.stat-num {
  font-size: 32px;
  font-weight: 800;
  color: #555859;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 13px;
  color: #888;
}

.stat-divider {
  width: 1px;
  height: 50px;
  background: #e8e8e8;
}

/* Banner Section */
.banner-section, .cta-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 56px 32px;
  width: 100%;
}

.section-title-wrap { margin-bottom: 32px; }

.section-title {
  font-size: 28px;
  font-weight: 800;
  color: #555859;
  position: relative;
  padding-bottom: 12px;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 48px;
  height: 4px;
  background: #f8d247;
  border-radius: 2px;
}

.banner-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.banner-card {
  border-radius: 16px;
  padding: 32px 28px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  cursor: pointer;
  transition: transform 0.2s;
}

.banner-card:hover { transform: translateY(-4px); }

.banner-1 { background: linear-gradient(135deg, #e53e3e, #c53030); }
.banner-2 { background: linear-gradient(135deg, #555859, #3d3f40); }
.banner-3 { background: linear-gradient(135deg, #2d8b4e, #1a5c30); }

.banner-tag {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  margin-bottom: 10px;
  width: fit-content;
}

.banner-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
}

.banner-desc {
  font-size: 13px;
  color: rgba(255,255,255,0.75);
}

/* ── How It Works ── */
.how-section {
  background: linear-gradient(160deg, #1e2124 0%, #2d3035 45%, #3d3f40 100%);
  padding: 0 !important;
  max-width: 100% !important;
  position: relative;
  overflow: hidden;
}
.how-section::before {
  content: '';
  position: absolute; inset: 0;
  background-image: radial-gradient(rgba(248,210,71,0.07) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}
.how-section::after {
  content: '';
  position: absolute;
  top: -160px; right: -160px;
  width: 440px; height: 440px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(248,210,71,0.08) 0%, transparent 65%);
  pointer-events: none;
}
.how-inner {
  max-width: 1140px;
  margin: 0 auto;
  padding: 80px 32px;
  text-align: center;
  position: relative;
}
.how-eyebrow {
  display: inline-block;
  background: rgba(248,210,71,0.12);
  color: #f8d247;
  border: 1px solid rgba(248,210,71,0.25);
  border-radius: 999px;
  padding: 6px 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 18px;
}
.how-title {
  font-size: 40px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 12px;
  line-height: 1.2;
}
.how-subtitle {
  font-size: 15px;
  color: rgba(255,255,255,0.45);
  margin-bottom: 60px;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.step-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 36px 20px 32px;
  text-align: center;
  position: relative;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.step-card:hover {
  transform: translateY(-10px);
  background: rgba(248,210,71,0.07);
  border-color: rgba(248,210,71,0.3);
  box-shadow: 0 24px 64px rgba(248,210,71,0.12), inset 0 0 0 1px rgba(248,210,71,0.15);
}
.step-card:not(:last-child)::after {
  content: '→';
  position: absolute;
  right: -22px;
  top: 38%;
  transform: translateY(-50%);
  font-size: 20px;
  color: rgba(248,210,71,0.4);
  z-index: 2;
  pointer-events: none;
}

.step-num-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px; height: 34px;
  border-radius: 50%;
  background: #f8d247;
  color: #1e2124;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 20px;
  box-shadow: 0 0 0 5px rgba(248,210,71,0.18), 0 0 0 10px rgba(248,210,71,0.07);
}

.step-icon-box {
  width: 76px; height: 76px;
  border-radius: 22px;
  background: rgb(255, 255, 255);
  border: 1.5px solid rgba(255,255,255,0.1);
  display: flex; align-items: center; justify-content: center;
  font-size: 34px;
  margin: 0 auto 20px;
  transition: all 0.3s;
}
.step-card:hover .step-icon-box {
  background: rgba(248, 210, 71, 0.696);
  border-color: rgba(248,210,71,0.4);
  transform: scale(1.08) rotate(-4deg);
  box-shadow: 0 12px 32px rgba(248,210,71,0.12);
}

.step-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
}
.step-desc {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  line-height: 1.7;
}

/* CTA */
.cta-section {
  text-align: center;
  background: #555859;
  max-width: 100%;
  padding: 64px 32px;
  margin: 0;
}

.cta-title {
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 14px;
}

.cta-sub {
  font-size: 16px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 32px;
  line-height: 1.7;
}

/* ══ Form Page ══ */
.page-form { flex: 1; }

.page-header {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 32px;
}

.page-header-inner {
  max-width: 1280px;
  margin: 0 auto;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  background: none;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  color: #555;
  font-family: inherit;
  transition: all 0.2s;
}

.back-btn:hover { border-color: #aaa; color: #222; }

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #555859;
  margin: 0;
}

.btn-new {
  background: #f8d247;
  border: none;
  border-radius: 8px;
  padding: 9px 18px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s;
}

.btn-new:hover { opacity: 0.85; }

/* Form Layout */
.form-layout {
  max-width: 1280px;
  margin: 32px auto;
  padding: 0 32px 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

.mt-card { margin-top: 24px; }

.card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
}

.card-head {
  background: #f8f9fc;
  border-bottom: 1px solid #e8e8e8;
  padding: 16px 24px;
  font-size: 15px;
  font-weight: 700;
  color: #555859;
}

/* Map */
.map-area { padding: 0; }

.map-mock {
  height: 280px;
  background: linear-gradient(160deg, #c8e6c9 0%, #a5d6a7 30%, #81c784 60%, #c8e6c9 100%);
  position: relative;
  overflow: hidden;
}

.map-mock::before {
  content: '';
  position: absolute;
  top: 40%;
  left: 20%;
  width: 60%;
  height: 3px;
  background: rgba(255,255,255,0.6);
  border-radius: 2px;
}

.map-mock::after {
  content: '';
  position: absolute;
  top: 55%;
  left: 10%;
  width: 80%;
  height: 2px;
  background: rgba(255,255,255,0.4);
  border-radius: 2px;
}

.map-pin-web {
  font-size: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -65%);
  filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));
}

.map-search {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
}

.map-search-input {
  width: 100%;
  padding: 9px 14px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  font-family: inherit;
  outline: none;
}

.map-credit {
  position: absolute;
  bottom: 6px;
  right: 8px;
  font-size: 10px;
  color: #555;
  background: rgba(255,255,255,0.8);
  padding: 2px 6px;
  border-radius: 4px;
}

.map-coords {
  padding: 12px 20px;
  font-size: 12px;
  color: #888;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
  align-items: center;
}

.coord-label { color: #aaa; }
.coord-val { font-weight: 600; color: #555; }
.coord-sep { color: #ddd; }

/* Upload */
.upload-count {
  font-size: 11px;
  font-weight: 500;
  color: #aaa;
  margin-left: 6px;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 16px 20px 8px;
}

.upload-thumb {
  position: relative;
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  background: #f5f5f5;
}

.upload-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-thumb-del {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.55);
  color: #fff;
  font-size: 10px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Kanit', 'Inter', sans-serif;
}

.upload-add-btn {
  aspect-ratio: 1;
  border-radius: 10px;
  border: 2px dashed #d8d8d8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;
  gap: 4px;
}

.upload-add-btn:hover { border-color: #f8d247; background: #fdf6d8; }

.upload-add-icon {
  font-size: 22px;
  color: #bbb;
  line-height: 1;
}

.upload-add-hint {
  font-size: 11px;
  color: #bbb;
}

.upload-hint-bottom {
  text-align: center;
  padding: 0 20px 14px;
  font-size: 11px;
  color: #ccc;
}

/* Form Fields */
.field-group {
  padding: 0 24px;
  margin-bottom: 20px;
}

.field-group:first-of-type { padding-top: 20px; }

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #444;
  margin-bottom: 8px;
}

.optional { font-weight: 400; color: #aaa; }

.urgency-row {
  display: flex;
  gap: 8px;
}

.urgency-chip {
  flex: 1;
  padding: 10px 8px;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  color: #555;
}

.urgency-chip.active-low { border-color: #22c55e; background: #f0fdf4; color: #166534; }
.urgency-chip.active-mid { border-color: #f59e0b; background: #fffbeb; color: #92400e; }
.urgency-chip.active-high { border-color: #ef4444; background: #fef2f2; color: #991b1b; }

.needs-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.need-chip { cursor: pointer; }

.chip-inner {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  border: 1.5px solid #e8e8e8;
  border-radius: 20px;
  font-size: 13px;
  color: #555;
  transition: all 0.15s;
  background: #fff;
}

.chip-inner.checked {
  border-color: #f8d247;
  background: #fdf6d8;
  color: #555859;
  font-weight: 600;
}

.counter-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.counter-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e8e8e8;
  background: #fff;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  font-family: inherit;
}

.counter-btn:hover { border-color: #f8d247; background: #fdf6d8; }

.counter-display {
  min-width: 60px;
  text-align: center;
}

.counter-num { font-size: 28px; font-weight: 800; color: #555859; }
.counter-unit { font-size: 13px; color: #aaa; margin-left: 4px; }

.field-textarea {
  width: 100%;
  border: 1.5px solid #e8e8e8;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s;
}

.field-textarea:focus { border-color: #f8d247; }

.btn-thaid-web {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: calc(100% - 48px);
  margin: 20px 24px 0;
  padding: 13px;
  background: #555859;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s;
}

.btn-thaid-web:hover { opacity: 0.88; }

.thaid-badge {
  height: 35px;
  width: auto;
  border-radius: 4px;
  vertical-align: middle;
}

.divider-or {
  text-align: center;
  position: relative;
  margin: 16px 24px;
  font-size: 12px;
  color: #aaa;
}

.divider-or::before, .divider-or::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 38%;
  height: 1px;
  background: #e8e8e8;
}

.divider-or::before { left: 0; }
.divider-or::after { right: 0; }

.field-row {
  /* display: flex; */
  gap: 12px;
  padding: 0 24px;
  margin-bottom: 8px;
}

.flex-1 { flex: 1; padding: 0; }

.field-input {
  width: 100%;
  border: 1.5px solid #e8e8e8;
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  outline: none;
  transition: border-color 0.15s;
}

.field-input:focus { border-color: #f8d247; }
.field-input::placeholder { color: #bbb; }

.btn-submit-web {
  display: block;
  width: calc(100% - 48px);
  margin: 16px 24px 24px;
  padding: 15px;
  background: #555859;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
}

.btn-submit-web:hover { background: #3d3f40; }

/* ══ Confirmation ══ */
.page-confirm {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}

.confirm-wrap {
  max-width: 560px;
  width: 100%;
  text-align: center;
}

.confirm-icon-wrap {
  margin-bottom: 24px;
}

.confirm-icon {
  font-size: 72px;
  line-height: 1;
  color: #22c55e;
}

.confirm-title {
  font-size: 36px;
  font-weight: 800;
  color: #555859;
  margin-bottom: 12px;
}

.confirm-sub {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 32px;
}

.case-box {
  background: #555859;
  border-radius: 16px;
  padding: 28px 32px;
  margin-bottom: 32px;
}

.case-box-label {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 6px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.case-box-num {
  font-size: 40px;
  font-weight: 800;
  color: #f8d247;
  margin-bottom: 8px;
}

.case-box-hint {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
}

/* Timeline */
.confirm-timeline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 32px;
}

.tl-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.tl-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 3px solid #e8e8e8;
  background: #fff;
}

.tl-step.done .tl-dot {
  background: #22c55e;
  border-color: #22c55e;
}

.tl-info { text-align: center; }
.tl-label { font-size: 12px; font-weight: 700; color: #333; }
.tl-time { font-size: 11px; color: #aaa; }
.tl-step.done .tl-label { color: #22c55e; }

.tl-line {
  flex: 1;
  height: 2px;
  background: #e8e8e8;
  margin: 0 8px;
  margin-bottom: 24px;
  min-width: 60px;
}

.confirm-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.confirm-actions .btn-thaid-web {
  width: 100%;
  margin: 0;
}

.btn-outline-web {
  width: 100%;
  padding: 13px;
  background: #fff;
  color: #555;
  border: 1.5px solid #ddd;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.btn-outline-web:hover { border-color: #aaa; color: #222; }

/* ══ Tracking ══ */
.page-tracking { flex: 1; }

.tracking-layout {
  max-width: 1280px;
  margin: 32px auto;
  padding: 0 32px 48px;
}

.filter-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1.5px solid #e8e8e8;
  border-radius: 10px;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  color: #555;
  transition: all 0.15s;
}

.filter-tab:hover { border-color: #f8d247; }
.filter-tab.active { background: #f8d247; border-color: #f8d247; color: #555859; }

.tab-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.tab-dot.received { background: #6b7280; }
.tab-dot.processing { background: #3b82f6; }
.tab-dot.done { background: #22c55e; }

.tab-count {
  background: rgba(0,0,0,0.08);
  border-radius: 10px;
  padding: 1px 8px;
  font-size: 12px;
}

.filter-tab.active .tab-count { background: rgba(0,0,0,0.1); }

/* Table */
.cases-table-wrap {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
  margin-bottom: 24px;
}

.cases-table {
  width: 100%;
  border-collapse: collapse;
}

.cases-table thead {
  background: #f8f9fc;
  border-bottom: 1px solid #e8e8e8;
}

.cases-table th {
  padding: 14px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: #888;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.case-row {
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.15s;
}

.case-row:last-child { border-bottom: none; }
.case-row:hover { background: #fafafa; }

.cases-table td {
  padding: 16px 20px;
  font-size: 14px;
  color: #333;
}

.case-id-cell {
  font-weight: 700;
  color: #555859;
}

.urgency-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
}

.urgency-badge.low { background: #f0fdf4; color: #166534; }
.urgency-badge.mid { background: #fffbeb; color: #92400e; }
.urgency-badge.high { background: #fef2f2; color: #991b1b; }

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 20px;
}

.status-pill.received { background: #f3f4f6; color: #374151; }
.status-pill.processing { background: #eff6ff; color: #1d4ed8; }
.status-pill.done { background: #f0fdf4; color: #166534; }

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.btn-detail {
  padding: 7px 16px;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  color: #555;
  transition: all 0.15s;
}

.btn-detail:hover { border-color: #f8d247; color: #555859; }

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.empty-icon { font-size: 48px; margin-bottom: 12px; }
.empty-text { font-size: 15px; color: #aaa; }

/* Progress */
.progress-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e8e8e8;
  padding: 24px 28px;
}

.progress-title {
  font-size: 15px;
  font-weight: 700;
  color: #555859;
  margin-bottom: 20px;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.progress-label {
  font-size: 13px;
  color: #555;
  width: 160px;
  flex-shrink: 0;
}

.progress-bar-wrap {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.progress-bar-fill.received { background: #9ca3af; }
.progress-bar-fill.processing { background: #3b82f6; }
.progress-bar-fill.done { background: #22c55e; }

.progress-count {
  font-size: 13px;
  font-weight: 700;
  color: #555859;
  width: 20px;
  text-align: right;
}

/* ══ Footer ══ */
.site-footer {
  background: #555859;
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 18px 32px;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-sep { color: rgba(255,255,255,0.15); }

/* ══ Bootstrap Navbar Toggler (mobile only) ══ */
.navbar-toggler {
  display: none;
  --bs-navbar-toggler-icon-bg: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255,255,255,0.85)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
  border-color: rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 6px 10px;
  flex-shrink: 0;
  transition: background 0.15s, border-color 0.15s;
}

.navbar-toggler:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.35);
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 3px rgba(248,210,71,0.35);
  outline: none;
}

.navbar-toggler[aria-expanded="true"] {
  background: rgba(248,210,71,0.1);
  border-color: rgba(248,210,71,0.4);
}

.navbar-toggler[aria-expanded="true"] .navbar-toggler-icon {
  --bs-navbar-toggler-icon-bg: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%23FFD006' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

/* ══ Mobile Drawer ══ */
.mobile-drawer {
  width: 100%;          /* ทำให้เต็มแถวใน Bootstrap flex navbar */
  flex-shrink: 0;
  background: linear-gradient(180deg, #555859 0%, #6a6c6e 100%);
  border-top: 2px solid rgba(248,210,71,0.25);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  animation: drawer-in 0.2s ease-out;
}

@keyframes drawer-in {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.drawer-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.drawer-user-avatar {
  width: 38px;
  height: 38px;
  background: rgba(248,210,71,0.12);
  border: 1.5px solid rgba(248,210,71,0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  flex-shrink: 0;
}

.drawer-user-role {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
}

.drawer-user-status {
  font-size: 11px;
  color: #22c55e;
  display: flex;
  align-items: center;
  gap: 5px;
}

.drawer-user-status::before {
  content: '';
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  display: inline-block;
}

.drawer-nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 12px 8px;
  box-sizing: border-box;
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s;
  box-sizing: border-box;
  border: 1px solid transparent;
}

.drawer-link-icon {
  font-size: 19px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.06);
  border-radius: 10px;
  flex-shrink: 0;
  transition: all 0.15s;
}

.drawer-link-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.drawer-link-label {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255,255,255,0.8);
  transition: color 0.15s;
}

.drawer-link-desc {
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  transition: color 0.15s;
}

.drawer-link-arrow {
  font-size: 20px;
  font-weight: 300;
  color: rgba(255,255,255,0.2);
  transition: all 0.15s;
}

.drawer-link:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.08); }
.drawer-link:hover .drawer-link-label { color: #fff; }
.drawer-link:hover .drawer-link-arrow { color: rgba(255,255,255,0.5); transform: translateX(2px); }

.drawer-link.active {
  background: rgba(248,210,71,0.1);
  border-color: rgba(248,210,71,0.2);
}
.drawer-link.active .drawer-link-icon { background: rgba(248,210,71,0.15); }
.drawer-link.active .drawer-link-label { color: #f8d247; font-weight: 700; }
.drawer-link.active .drawer-link-desc { color: rgba(248,210,71,0.5); }
.drawer-link.active .drawer-link-arrow { color: #f8d247; }

.drawer-footer {
  padding: 4px 12px 20px;
}

.drawer-report-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 15px;
  background: #f8d247;
  color: #555859;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 4px 20px rgba(248,210,71,0.3);
  transition: opacity 0.15s, transform 0.15s;
}

.drawer-report-btn:hover { opacity: 0.9; transform: translateY(-1px); }

/* ══════════════════════════════════════
   RESPONSIVE — Tablet (≤ 1024px)
══════════════════════════════════════ */
@media (max-width: 1024px) {
  /* Navbar */
  .navbar-inner { padding: 0 20px; }
  .nav-links, .nav-right { display: none; }
  .navbar-toggler { display: inline-flex; }

  /* Landing */
  .hero-title { font-size: 40px; }
  .banner-section { padding: 48px 20px; }
  .banner-grid { grid-template-columns: repeat(2, 1fr); }
  .steps-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .step-card:nth-child(2n):not(:last-child)::after { display: none; }
  .how-inner { padding: 56px 20px; }
  .how-title { font-size: 28px; }
  .how-subtitle { font-size: 14px; }
  .cta-section { padding: 48px 20px; }
  .cta-title { font-size: 30px; }

  /* Form */
  .form-layout {
    grid-template-columns: 1fr;
    padding: 0 20px 40px;
    margin: 24px auto;
  }

  /* Tracking */
  .tracking-layout { padding: 0 20px 40px; }
  .page-header { padding: 0 20px; }
}

/* ══════════════════════════════════════
   RESPONSIVE — Mobile (≤ 640px)
══════════════════════════════════════ */
@media (max-width: 640px) {
  /* Navbar */
  .logo-icon { font-size: 20px; }
  .logo-text { font-size: 14px; }
  .navbar-inner { padding: 0 16px; height: 56px; }

  /* Hero */
  .hero { min-height: auto; }
  .hero-content { padding: 40px 16px 36px; }
  .hero-badge { font-size: 11px; padding: 5px 14px; }
  .hero-title { font-size: 26px; line-height: 1.2; }
  .hero-sub { font-size: 13px; margin-bottom: 28px; }
  .hero-sub br { display: none; }
  .btn-hero { font-size: 15px; padding: 13px 24px; width: 100%; justify-content: center; }

  /* Stats */
  .stats-bar { flex-wrap: wrap; }
  .stat-divider { display: none; }
  .stat-item { min-width: 50%; flex: none; padding: 20px 12px; border-bottom: 1px solid #e8e8e8; }
  .stat-num { font-size: 24px; }

  /* Banners */
  .banner-section { padding: 28px 16px; }
  .section-title { font-size: 20px; }
  .section-title-wrap { margin-bottom: 16px; }
  .banner-grid { grid-template-columns: 1fr; gap: 12px; }
  .banner-card { padding: 20px 18px; min-height: 120px; }
  .banner-title { font-size: 15px; }
  .banner-desc { font-size: 12px; }

  /* Steps / How */
  .how-inner { padding: 36px 16px 28px; }
  .how-title { font-size: 22px; }
  .how-subtitle { font-size: 12px; margin-bottom: 32px; }
  .steps-grid { grid-template-columns: 1fr; gap: 10px; }
  .step-card { padding: 24px 20px 20px; border-radius: 16px; }
  .step-card:not(:last-child)::after { display: none; }
  .step-num-badge { margin-bottom: 14px; }
  .step-icon-box { width: 60px; height: 60px; font-size: 26px; border-radius: 16px; margin-bottom: 14px; }
  .step-title { font-size: 15px; margin-bottom: 6px; }
  .step-desc { font-size: 12px; line-height: 1.6; }

  /* CTA */
  .cta-section { padding: 36px 16px; }
  .cta-title { font-size: 22px; }
  .cta-sub { font-size: 13px; }
  .cta-sub br { display: none; }

  /* Page Header */
  .page-header { padding: 0 16px; }
  .page-header-inner { height: auto; padding: 12px 0; gap: 8px; }
  .page-title { font-size: 17px; order: -1; width: 100%; }
  .back-btn, .btn-new { font-size: 13px; padding: 7px 12px; }

  /* Form */
  .form-layout { padding: 0 16px 32px; margin: 16px auto; gap: 16px; }
  .mt-card { margin-top: 16px; }
  .card-head { padding: 12px 16px; font-size: 13px; }
  .map-mock { height: 200px; }
  .field-group { padding: 0 16px; margin-bottom: 14px; }
  .field-group:first-of-type { padding-top: 14px; }
  .field-label { font-size: 12px; margin-bottom: 6px; }
  .field-input { font-size: 14px; padding: 10px 12px; }
  .field-textarea { font-size: 13px; padding: 10px 12px; }
  .urgency-chip { font-size: 12px; padding: 8px 4px; }
  .chip-inner { font-size: 12px; padding: 6px 10px; }
  .counter-num { font-size: 24px; }
  .counter-unit { font-size: 12px; }
  .field-row { flex-direction: column; padding: 0 16px; gap: 0; }
  .flex-1 { width: 100%; }
  .btn-thaid-web { width: calc(100% - 32px); margin: 14px 16px 0; font-size: 14px; }
  .divider-or { margin: 12px 16px; font-size: 11px; }
  .btn-submit-web { width: calc(100% - 32px); margin: 12px 16px 20px; font-size: 15px; }

  /* Confirmation */
  .page-confirm { padding: 28px 16px; align-items: flex-start; }
  .confirm-icon { font-size: 52px; }
  .confirm-title { font-size: 24px; }
  .confirm-sub { font-size: 13px; }
  .case-box { padding: 18px; }
  .case-box-label { font-size: 11px; }
  .case-box-num { font-size: 30px; }
  .case-box-hint { font-size: 12px; }
  .confirm-timeline { flex-direction: column; align-items: flex-start; gap: 0; }
  .tl-step { flex-direction: row; gap: 12px; padding: 8px 0; }
  .tl-line { width: 2px; height: 24px; margin: 0 0 0 8px; min-width: unset; }
  .tl-info { text-align: left; }

  /* Tracking */
  .tracking-layout { padding: 0 16px 32px; margin: 16px auto; }
  .filter-bar { gap: 6px; }
  .filter-tab { padding: 7px 10px; font-size: 12px; gap: 5px; }
  .tab-count { font-size: 11px; padding: 1px 6px; }
  .progress-title { font-size: 14px; }
  .progress-label { font-size: 12px; width: 90px; }

  /* Table → Cards on mobile */
  .cases-table-wrap { border-radius: 12px; }
  .cases-table thead { display: none; }
  .cases-table,
  .cases-table tbody,
  .case-row { display: block; width: 100%; }
  .case-row {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    position: relative;
  }
  .cases-table td {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    border: none;
    font-size: 13px;
  }
  .cases-table td::before {
    content: attr(data-label);
    font-size: 11px;
    font-weight: 700;
    color: #aaa;
    min-width: 88px;
    flex-shrink: 0;
  }
  .cases-table td[data-label=""]::before { display: none; }
  .cases-table td[data-label=""] { justify-content: flex-end; margin-top: 8px; }

  /* Progress */
  .progress-label { width: 110px; font-size: 12px; }

  /* Footer */
  .site-footer { padding: 16px; }
  .footer-inner { flex-direction: column; gap: 4px; text-align: center; }
  .footer-sep { display: none; }
}

/* ══ Detail Modal ══ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  padding: 20px;
}

.modal-box {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: modal-in 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modal-in {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 24px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fc;
}

.modal-case-id {
  font-size: 12px;
  font-weight: 700;
  color: #f8d247;
  background: #555859;
  display: inline-block;
  padding: 3px 10px;
  border-radius: 6px;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.modal-title {
  font-size: 20px;
  font-weight: 800;
  color: #555859;
  margin: 0;
}

.modal-close {
  background: none;
  border: 1.5px solid #e8e8e8;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  color: #888;
  flex-shrink: 0;
  transition: all 0.15s;
}

.modal-close:hover { border-color: #ccc; color: #333; background: #f5f5f5; }

.modal-body { padding: 24px; overflow-y: auto; flex: 1; }

.modal-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 28px;
}

.modal-info-item {
  background: #f8f9fc;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 14px 16px;
}

.modal-info-label {
  font-size: 11px;
  font-weight: 700;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.modal-info-val {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.modal-section-title {
  font-size: 13px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

.modal-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.modal-tl-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  position: relative;
}

.modal-tl-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2.5px solid #e8e8e8;
  background: #fff;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.3s;
  z-index: 1;
}

.modal-tl-dot.done {
  background: #22c55e;
  border-color: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
}

.modal-tl-line {
  position: absolute;
  left: 8px;
  top: 20px;
  width: 2px;
  height: 36px;
  background: #e8e8e8;
  transition: background 0.3s;
}

.modal-tl-line.done { background: #22c55e; }

.modal-tl-content {
  padding-bottom: 28px;
}

.modal-tl-item.last .modal-tl-content { padding-bottom: 0; }

.modal-tl-label {
  font-size: 14px;
  font-weight: 600;
  color: #aaa;
  margin-bottom: 2px;
}

.modal-tl-label.done { color: #22c55e; }

.modal-tl-time {
  font-size: 12px;
  color: #bbb;
}

.modal-result-sect { margin-top: 4px; }

.modal-result-card {
  background: #f0fdf4;
  border: 1.5px solid #86efac;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}

.modal-result-label {
  color: #555;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.modal-result-val {
  font-weight: 700;
  color: #166534;
  font-size: 13px;
}

.modal-result-outcome {
  font-size: 12px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
  background: #dcfce7;
  color: #166534;
}

.modal-result-outcome.transferred,
.modal-result-outcome.evacuated {
  background: #eff6ff;
  color: #1d4ed8;
}

.modal-result-outcome.pending {
  background: #fef3c7;
  color: #d97706;
}

.modal-result-note { font-size: 13px; }

.modal-result-note-body {
  margin-top: 6px;
  background: #fff;
  border-radius: 8px;
  padding: 10px 12px;
  color: #374151;
  font-size: 13px;
  line-height: 1.6;
  border: 1px solid #bbf7d0;
}

.modal-result-img-wrap { font-size: 13px; }

.modal-result-img {
  margin-top: 8px;
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
  max-height: 200px;
  border: 1px solid #bbf7d0;
}

.modal-footer {
  padding: 16px 24px 24px;
  display: flex;
  justify-content: flex-end;
}

.modal-close-btn {
  padding: 10px 28px;
  background: #555859;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s;
}

.modal-close-btn:hover { opacity: 0.85; }

@media (max-width: 640px) {
  .modal-overlay { padding: 12px; align-items: flex-end; }
  .modal-box { border-radius: 20px 20px 0 0; max-width: 100%; }
  .modal-info-grid { grid-template-columns: 1fr; gap: 10px; }
  .modal-header { padding: 18px 18px 14px; }
  .modal-body { padding: 18px; }
  .modal-footer { padding: 12px 18px 20px; }
}
</style>
