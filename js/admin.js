/* ══════════════════════════════════════════════
   STATE
══════════════════════════════════════════════ */
let bookings = [];
let selectedIds = new Set();
let pendingDeleteFn = null;
let viewingId = null;

const STORAGE_KEY = 'blackpoint_bookings';

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('topbarDate').textContent =
    new Date().toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' }).toUpperCase();

  loadBookings();
  render();
});

/* ══════════════════════════════════════════════
   STORAGE
══════════════════════════════════════════════ */
function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    bookings = raw ? JSON.parse(raw) : [];
  } catch(e) { bookings = []; }
}

function saveBookings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

/* ══════════════════════════════════════════════
   SAMPLE DATA
══════════════════════════════════════════════ */
function loadSampleData() {
  const samples = [
    { id: uid(), name:'Adaeze Okonkwo', company:'Rhythm Lagos', email:'adaeze@rhythmlagos.ng', phone:'+234 801 234 5678', service:'recording', projectName:'Afrobeats EP', projectType:'music-video', description:'Full EP recording session, 6 tracks, afrobeats/R&B crossover. Looking for premium production.', budget:'15k-50k', references:'spotify.com/artist/xyz', startDate:'2026-04-10', deliveryDate:'2026-06-01', urgency:'standard', location:'Blackpoint Studio, Lagos', referral:'instagram', newsletter:'yes', submittedAt: new Date(Date.now()-86400000*2).toISOString() },
    { id: uid(), name:'Kelechi Nwachukwu', company:'', email:'kele@gmail.com', phone:'+234 802 987 6543', service:'mixing', projectName:'Debut Album Mix', projectType:'other', description:'Need a professional mix for my 12-track debut album. Heavy on Afropop and highlife elements.', budget:'5k-15k', references:'', startDate:'2026-03-20', deliveryDate:'2026-04-15', urgency:'rush', location:'Remote', referral:'referral', newsletter:'no', submittedAt: new Date(Date.now()-3600000*5).toISOString() },
    { id: uid(), name:'Funmilayo Adeyemi', company:'LookBook NG', email:'fumi@lookbookng.com', phone:'+234 805 111 2233', service:'photo', projectName:'Summer Collection 2026', projectType:'fashion', description:'Outdoor & studio lookbook shoot for our summer fashion line. 3 outfits, 2 models. Clean editorial aesthetic.', budget:'15k-50k', references:'vogue.com/gallery/summer24', startDate:'2026-04-01', deliveryDate:'2026-04-20', urgency:'flexible', location:'TBD – Lagos Island', referral:'google', newsletter:'yes', submittedAt: new Date(Date.now()-86400000*5).toISOString() },
    { id: uid(), name:'Emeka Obi', company:'The Pulse Media', email:'emeka@thepulse.ng', phone:'+234 806 555 4444', service:'podcast', projectName:'The Lagos Hustle', projectType:'other', description:'Weekly interview-style podcast covering Lagos entrepreneurs. Need full setup, recording, and editing for 8-episode season.', budget:'5k-15k', references:'', startDate:'2026-03-25', deliveryDate:'2026-07-01', urgency:'flexible', location:'Blackpoint Studio', referral:'behance', newsletter:'yes', submittedAt: new Date(Date.now()-86400000*10).toISOString() },
    { id: uid(), name:'Chidinma Eze', company:'', email:'chidinma.eze@yahoo.com', phone:'+234 808 777 9900', service:'mastering', projectName:'Singles Pack Vol.1', projectType:'music-video', description:'5 singles ready for mastering before distribution to Spotify, Apple Music and Boomplay.', budget:'5k-15k', references:'', startDate:'2026-03-18', deliveryDate:'2026-03-30', urgency:'rush', location:'N/A', referral:'instagram', newsletter:'no', submittedAt: new Date(Date.now()-3600000*12).toISOString() },
    { id: uid(), name:'Babatunde Sanni', company:'PanAfrican Docs', email:'bsanni@pafd.com', phone:'+234 809 333 1212', service:'live', projectName:'Heritage Night Live', projectType:'event', description:'Live recording of a 2-hour cultural performance event with multiple acts. Requires multi-camera video + audio setup.', budget:'50k-100k', references:'youtube.com/watch?v=example', startDate:'2026-05-15', deliveryDate:'2026-05-30', urgency:'standard', location:'Eko Hotel, Lagos', referral:'previous', newsletter:'yes', submittedAt: new Date(Date.now()-86400000*1).toISOString() },
  ];
  bookings = [...bookings, ...samples];
  saveBookings();
  render();
  toast('Demo data loaded — 6 sample bookings added.', 'success');
}

/* ══════════════════════════════════════════════
   RENDER
══════════════════════════════════════════════ */
function getFiltered() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const sv = document.getElementById('serviceFilter').value;
  const uv = document.getElementById('urgencyFilter').value;
  return bookings.filter(b => {
    const matchQ = !q || [b.name,b.email,b.projectName,b.company].join(' ').toLowerCase().includes(q);
    const matchS = !sv || b.service === sv;
    const matchU = !uv || b.urgency === uv;
    return matchQ && matchS && matchU;
  });
}

function render() {
  const filtered = getFiltered();
  const tbody = document.getElementById('tableBody');
  const empty = document.getElementById('emptyState');

  // stats
  document.getElementById('statTotal').textContent = bookings.length;
  document.getElementById('navBadge').textContent  = bookings.length;
  document.getElementById('statRush').textContent  = bookings.filter(b=>b.urgency==='rush').length;

  const now = new Date();
  document.getElementById('statMonth').textContent = bookings.filter(b=>{
    const d = new Date(b.submittedAt);
    return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
  }).length;

  const svcCount = {};
  bookings.forEach(b => svcCount[b.service] = (svcCount[b.service]||0)+1);
  const topSvc = Object.entries(svcCount).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById('statTop').textContent = topSvc ? topSvc[0].toUpperCase() : '—';

  if (!filtered.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = filtered.map(b => `
    <tr class="${selectedIds.has(b.id)?'selected':''}" onclick="openModal('${b.id}')">
      <td onclick="event.stopPropagation()">
        <input type="checkbox" ${selectedIds.has(b.id)?'checked':''} onchange="toggleSelect('${b.id}', this.checked)">
      </td>
      <td>
        <div class="td-name">${esc(b.name)}</div>
        <div class="td-email">${esc(b.email)}</div>
      </td>
      <td><span class="service-tag ${b.service}">${svcLabel(b.service)}</span></td>
      <td>${esc(b.projectName||'—')}</td>
      <td><span class="budget-pill">${b.budget||'—'}</span></td>
      <td>
        <span class="urgency-badge ${b.urgency}">
          ${urgencyIcon(b.urgency)} ${cap(b.urgency||'—')}
        </span>
      </td>
      <td class="date-cell">${formatDate(b.submittedAt)}</td>
      <td onclick="event.stopPropagation()">
        <div class="action-btns">
          <button class="icon-btn pdf" title="Download PDF" onclick="exportSinglePDF('${b.id}')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </button>
          <button class="icon-btn del" title="Delete" onclick="confirmDelete('${b.id}')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  updateBulkBar();
}

/* ══════════════════════════════════════════════
   FILTERS
══════════════════════════════════════════════ */
function applyFilters() { render(); }

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('serviceFilter').value = '';
  document.getElementById('urgencyFilter').value = '';
  render();
}

function filterByUrgency(u) {
  document.getElementById('urgencyFilter').value = u;
  render();
}

/* ══════════════════════════════════════════════
   SELECTION
══════════════════════════════════════════════ */
function toggleSelect(id, checked) {
  checked ? selectedIds.add(id) : selectedIds.delete(id);
  render();
}

function toggleSelectAll() {
  const filtered = getFiltered();
  if (selectedIds.size === filtered.length) {
    selectedIds.clear();
  } else {
    filtered.forEach(b => selectedIds.add(b.id));
  }
  render();
}

function updateBulkBar() {
  const bar = document.getElementById('bulkBar');
  const count = selectedIds.size;
  document.getElementById('bulkCount').textContent = `${count} selected`;
  bar.classList.toggle('visible', count > 0);
}

/* ══════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════ */
function openModal(id) {
  viewingId = id;
  const b = bookings.find(x => x.id === id);
  if (!b) return;

  document.getElementById('modalName').textContent  = b.name;
  document.getElementById('modalMeta').textContent  = `${svcLabel(b.service)} · ${formatDate(b.submittedAt)}`;

  document.getElementById('modalBody').innerHTML = `
    <div class="modal-section">
      <div class="modal-section-title">Client Info</div>
      <div class="detail-grid">
        <div class="detail-item"><label>Full Name</label><span>${esc(b.name)}</span></div>
        <div class="detail-item"><label>Company</label><span>${esc(b.company||'—')}</span></div>
        <div class="detail-item"><label>Email</label><span class="mono-val">${esc(b.email)}</span></div>
        <div class="detail-item"><label>Phone</label><span class="mono-val">${esc(b.phone||'—')}</span></div>
        <div class="detail-item"><label>Source</label><span>${esc(b.referral||'—')}</span></div>
        <div class="detail-item"><label>Newsletter</label><span>${b.newsletter==='yes'?'✓ Subscribed':'—'}</span></div>
      </div>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">Project Details</div>
      <div class="detail-grid">
        <div class="detail-item"><label>Service</label><span><span class="service-tag ${b.service}">${svcLabel(b.service)}</span></span></div>
        <div class="detail-item"><label>Project Name</label><span>${esc(b.projectName||'—')}</span></div>
        <div class="detail-item"><label>Type</label><span>${esc(b.projectType||'—')}</span></div>
        <div class="detail-item"><label>Budget</label><span class="mono-val">${esc(b.budget||'—')}</span></div>
        <div class="detail-item full"><label>Description</label><span>${esc(b.description||'—')}</span></div>
        ${b.references ? `<div class="detail-item full"><label>References</label><span class="mono-val" style="word-break:break-all">${esc(b.references)}</span></div>` : ''}
      </div>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">Timeline</div>
      <div class="detail-grid">
        <div class="detail-item"><label>Start Date</label><span class="mono-val">${esc(b.startDate||'—')}</span></div>
        <div class="detail-item"><label>Delivery Date</label><span class="mono-val">${esc(b.deliveryDate||'—')}</span></div>
        <div class="detail-item"><label>Urgency</label><span class="urgency-badge ${b.urgency}">${urgencyIcon(b.urgency)} ${cap(b.urgency||'—')}</span></div>
        <div class="detail-item"><label>Location</label><span>${esc(b.location||'—')}</span></div>
      </div>
    </div>
  `;

  document.getElementById('modalDeleteBtn').onclick = () => { closeModal(); confirmDelete(id); };
  document.getElementById('modalPdfBtn').onclick = () => exportSinglePDF(id);

  document.getElementById('detailModal').classList.add('open');
}

function closeModal() {
  document.getElementById('detailModal').classList.remove('open');
  viewingId = null;
}

document.getElementById('detailModal').addEventListener('click', e => {
  if (e.target === document.getElementById('detailModal')) closeModal();
});

/* ══════════════════════════════════════════════
   DELETE
══════════════════════════════════════════════ */
function confirmDelete(id) {
  const b = bookings.find(x => x.id === id);
  document.getElementById('confirmMsg').textContent =
    `Delete booking from ${b?.name || 'this client'}? This cannot be undone.`;
  pendingDeleteFn = () => {
    bookings = bookings.filter(x => x.id !== id);
    selectedIds.delete(id);
    saveBookings();
    render();
    toast('Booking deleted.', 'info');
  };
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmOkBtn').onclick = () => { pendingDeleteFn?.(); closeConfirm(); };
}

function deleteSelected() {
  if (!selectedIds.size) return;
  document.getElementById('confirmMsg').textContent =
    `Delete ${selectedIds.size} selected booking(s)? This cannot be undone.`;
  pendingDeleteFn = () => {
    bookings = bookings.filter(b => !selectedIds.has(b.id));
    selectedIds.clear();
    saveBookings();
    render();
    toast('Selected bookings deleted.', 'info');
  };
  document.getElementById('confirmOverlay').classList.add('open');
  document.getElementById('confirmOkBtn').onclick = () => { pendingDeleteFn?.(); closeConfirm(); };
}

function closeConfirm() {
  document.getElementById('confirmOverlay').classList.remove('open');
  pendingDeleteFn = null;
}

document.getElementById('confirmOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('confirmOverlay')) closeConfirm();
});

/* ══════════════════════════════════════════════
   PDF EXPORT
══════════════════════════════════════════════ */
function buildPDF(list) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'mm', format:'a4', orientation:'portrait' });
  const W = 210, H = 297;

  list.forEach((b, idx) => {
    if (idx > 0) doc.addPage();

    // BG
    doc.setFillColor(10,10,10);
    doc.rect(0,0,W,H,'F');

    // RED TOP BAR
    doc.setFillColor(185,28,28);
    doc.rect(0,0,W,6,'F');

    // HEADER
    doc.setTextColor(240,237,232);
    doc.setFontSize(28);
    doc.setFont('helvetica','bold');
    doc.text('BLACKPOINT STUDIO', 18, 24);

    doc.setFontSize(8);
    doc.setFont('helvetica','normal');
    doc.setTextColor(107,107,107);
    doc.text('BOOKING INQUIRY — CONFIDENTIAL', 18, 30);
    doc.text(`REF: ${b.id.toUpperCase()}`, W-18, 30, {align:'right'});

    // divider
    doc.setDrawColor(34,34,34);
    doc.setLineWidth(0.3);
    doc.line(18, 34, W-18, 34);

    // CLIENT NAME big
    doc.setTextColor(240,237,232);
    doc.setFontSize(22);
    doc.setFont('helvetica','bold');
    doc.text(b.name.toUpperCase(), 18, 45);

    doc.setFontSize(9);
    doc.setFont('helvetica','normal');
    doc.setTextColor(185,28,28);
    doc.text(`${svcLabel(b.service).toUpperCase()}  ·  ${formatDate(b.submittedAt)}`, 18, 51);

    // divider
    doc.setDrawColor(34,34,34);
    doc.line(18, 55, W-18, 55);

    const sections = [
      {
        title: 'CLIENT INFORMATION',
        fields: [
          ['Full Name', b.name], ['Company', b.company||'—'],
          ['Email', b.email], ['Phone', b.phone||'—'],
          ['Referral Source', b.referral||'—'], ['Newsletter', b.newsletter==='yes'?'Subscribed':'—'],
        ]
      },
      {
        title: 'PROJECT DETAILS',
        fields: [
          ['Service', svcLabel(b.service)], ['Project Name', b.projectName||'—'],
          ['Project Type', b.projectType||'—'], ['Budget', b.budget||'—'],
          ['Description', b.description||'—', true],
          ['References', b.references||'—', true],
        ]
      },
      {
        title: 'TIMELINE',
        fields: [
          ['Start Date', b.startDate||'—'], ['Delivery Date', b.deliveryDate||'—'],
          ['Urgency', cap(b.urgency||'—')], ['Location', b.location||'—'],
        ]
      },
    ];

    let y = 64;
    const COL_LEFT = 18, COL_RIGHT = 18 + 85;

    sections.forEach(section => {
      // section title
      doc.setFillColor(24,24,24);
      doc.roundedRect(COL_LEFT, y-4, W-36, 7, 1, 1, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica','bold');
      doc.setTextColor(185,28,28);
      doc.text(section.title, COL_LEFT+4, y+0.5);
      y += 8;

      const pairs = section.fields.filter(f=>!f[2]);
      const full  = section.fields.filter(f=>f[2]);

      // two columns for pairs
      for (let i=0; i<pairs.length; i+=2) {
        const left  = pairs[i];
        const right = pairs[i+1];
        doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(107,107,107);
        doc.text(left[0].toUpperCase(), COL_LEFT, y);
        if (right) doc.text(right[0].toUpperCase(), COL_RIGHT, y);
        y += 4;
        doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(240,237,232);
        doc.text(String(left[1]).substring(0,38), COL_LEFT, y);
        if (right) doc.text(String(right[1]).substring(0,38), COL_RIGHT, y);
        y += 6;
      }

      // full-width fields (description, refs)
      full.forEach(f => {
        doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(107,107,107);
        doc.text(f[0].toUpperCase(), COL_LEFT, y);
        y += 4;
        doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(200,200,200);
        const lines = doc.splitTextToSize(String(f[1]), W-36);
        lines.slice(0,4).forEach(line => { doc.text(line, COL_LEFT, y); y+=5; });
      });

      y += 4;
    });

    // FOOTER
    doc.setDrawColor(34,34,34);
    doc.line(18, H-18, W-18, H-18);
    doc.setFontSize(7);
    doc.setFont('helvetica','normal');
    doc.setTextColor(70,70,70);
    doc.text('hello@blackpoint.studio  ·  blackpoint.studio', 18, H-12);
    doc.text(`Generated ${new Date().toLocaleDateString('en-GB')}`, W-18, H-12, {align:'right'});
  });

  return doc;
}

function exportSinglePDF(id) {
  const b = bookings.find(x=>x.id===id);
  if (!b) return;
  const doc = buildPDF([b]);
  doc.save(`Blackpoint_Booking_${b.name.replace(/\s+/g,'_')}.pdf`);
  toast('PDF downloaded.', 'success');
}

function exportSelectedPDF() {
  const list = bookings.filter(b=>selectedIds.has(b.id));
  if (!list.length) return;
  const doc = buildPDF(list);
  doc.save(`Blackpoint_Selected_Bookings_${Date.now()}.pdf`);
  toast(`PDF with ${list.length} booking(s) downloaded.`, 'success');
}

function exportAllPDF() {
  if (!bookings.length) { toast('No bookings to export.', 'error'); return; }
  const doc = buildPDF(bookings);
  doc.save(`Blackpoint_All_Bookings_${Date.now()}.pdf`);
  toast(`PDF with ${bookings.length} booking(s) downloaded.`, 'success');
}

/* ══════════════════════════════════════════════
   CSV EXPORT
══════════════════════════════════════════════ */
function exportCSV() {
  if (!bookings.length) { toast('No bookings to export.', 'error'); return; }
  const headers = ['ID','Name','Company','Email','Phone','Service','Project Name','Project Type','Budget','Urgency','Start Date','Delivery Date','Location','Referral','Newsletter','Submitted At','Description'];
  const rows = bookings.map(b => [
    b.id, b.name, b.company||'', b.email, b.phone||'',
    b.service, b.projectName||'', b.projectType||'', b.budget||'',
    b.urgency||'', b.startDate||'', b.deliveryDate||'', b.location||'',
    b.referral||'', b.newsletter||'', b.submittedAt,
    (b.description||'').replace(/"/g,'""'),
  ]);
  const csv = [headers, ...rows].map(r => r.map(v=>`"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Blackpoint_Bookings_${Date.now()}.csv`;
  a.click();
  toast('CSV exported.', 'success');
}

/* ══════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════ */
function toast(msg, type='info') {
  const stack = document.getElementById('toastStack');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icons = { success:'✓', error:'✗', info:'↓' };
  el.innerHTML = `<span>${icons[type]||'·'}</span> ${msg}`;
  stack.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function uid() { return Math.random().toString(36).slice(2,10) + Date.now().toString(36); }
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
}

function svcLabel(s) {
  const map = { recording:'Recording', live:'Live Session', rehearsal:'Rehearsal', mixing:'Mixing', mastering:'Mastering', photo:'Photo Shoot', podcast:'Podcast' };
  return map[s] || cap(s);
}

function urgencyIcon(u) {
  return u==='rush' ? '⚡' : u==='standard' ? '⏱' : '📅';
}

/* ══════════════════════════════════════════════
   INTEGRATION HOOK
   The booking.js form can call this to save:
   window.BlackpointAdmin.saveBooking(formData)
══════════════════════════════════════════════ */
window.BlackpointAdmin = {
  saveBooking(data) {
    const entry = { id: uid(), submittedAt: new Date().toISOString(), ...data };
    bookings.unshift(entry);
    saveBookings();
    render();
  }
};
