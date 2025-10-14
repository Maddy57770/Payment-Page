const STORAGE_KEY = 'payflow:transactions';

const tbody = document.getElementById('tbody');
const tableWrap = document.getElementById('tableWrap');
const emptyState = document.getElementById('emptyState');

const q = document.getElementById('q');
const brandSel = document.getElementById('brand');
const statusSel = document.getElementById('status');
const fromDate = document.getElementById('fromDate');
const toDate = document.getElementById('toDate');
const sortSel = document.getElementById('sort');

const exportCsvBtn = document.getElementById('exportCsv');
const clearAllBtn = document.getElementById('clearAll');

const modal = document.getElementById('receiptModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const closeModalBtn = document.getElementById('closeModal');
const closeFooterBtn = document.getElementById('closeFooter');
const printBtn = document.getElementById('printReceipt');
const copyIdBtn = document.getElementById('copyId');
const receiptBody = document.getElementById('receiptBody');

const cardLogos = {
  visa: 'https://img.icons8.com/color/48/000000/visa.png',
  mastercard: 'https://img.icons8.com/color/48/000000/mastercard.png',
  amex: 'https://img.icons8.com/color/48/000000/amex.png',
  discover: 'https://img.icons8.com/color/48/000000/discover.png'
};

function loadTxns() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function saveTxns(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

let txns = loadTxns();
let currentReceipt = null;

function formatCurrency(cents, currency = 'USD', locale = 'en-US') {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format((cents || 0) / 100);
  } catch {
    return `$${((cents || 0) / 100).toFixed(2)}`;
  }
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString([], { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function shortId(id) {
  return id.length > 10 ? id.slice(0, 4) + '…' + id.slice(-4) : id;
}

function matchesFilters(t) {
  const query = (q.value || '').toLowerCase().trim();
  const brand = brandSel.value;
  const status = statusSel.value;
  const from = fromDate.value ? new Date(fromDate.value + 'T00:00:00') : null;
  const to = toDate.value ? new Date(toDate.value + 'T23:59:59') : null;

  if (query) {
    const hay = [t.id, t.cardholder, t.last4, t.brand, t.masked].join(' ').toLowerCase();
    if (!hay.includes(query)) return false;
  }
  if (brand && t.brand !== brand) return false;
  if (status && t.status !== status) return false;
  if (from && new Date(t.timestamp) < from) return false;
  if (to && new Date(t.timestamp) > to) return false;

  return true;
}

function sortTxns(list) {
  const mode = sortSel.value;
  const c = [...list];
  switch (mode) {
    case 'oldest': c.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp)); break;
    case 'amountDesc': c.sort((a,b) => (b.amountCents||0)-(a.amountCents||0)); break;
    case 'amountAsc': c.sort((a,b) => (a.amountCents||0)-(b.amountCents||0)); break;
    case 'nameAsc': c.sort((a,b) => (a.cardholder||'').localeCompare(b.cardholder||'')); break;
    case 'newest':
    default: c.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)); break;
  }
  return c;
}

function render() {
  txns = loadTxns();
  const filtered = sortTxns(txns.filter(matchesFilters));

  if (filtered.length === 0) {
    tableWrap.hidden = true;
    emptyState.hidden = false;
    tbody.innerHTML = '';
    return;
  }

  emptyState.hidden = true;
  tableWrap.hidden = false;

  tbody.innerHTML = filtered.map(t => {
    const logo = cardLogos[t.brand] || '';
    const amount = formatCurrency(t.amountCents, t.currency || 'USD');
    return `
      <tr>
        <td title="${t.id}">${shortId(t.id)}</td>
        <td>${formatDate(t.timestamp)}</td>
        <td>${amount}</td>
        <td>
          <span class="brand">
            ${logo ? `<img src="${logo}" alt="${t.brand}">` : ''}
            <span>${(t.brand || 'card').toUpperCase()} · •••• ${t.last4 || '----'}</span>
          </span>
        </td>
        <td>${t.cardholder || '-'}</td>
        <td><span class="badge success">Success</span></td>
        <td class="row-actions">
          <button class="icon-btn" data-action="view" data-id="${t.id}" title="View Receipt">🧾</button>
          <button class="icon-btn" data-action="delete" data-id="${t.id}" title="Delete">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openReceipt(id) {
  const t = txns.find(x => x.id === id);
  if (!t) return;

  currentReceipt = t;
  receiptBody.innerHTML = `
    <div class="receipt">
      <div class="receipt-row"><strong>Transaction ID</strong><span>${t.id}</span></div>
      <div class="receipt-row"><strong>Date</strong><span>${formatDate(t.timestamp)}</span></div>
      <div class="receipt-row"><strong>Status</strong><span>Success</span></div>
      <div class="receipt-row"><strong>Amount</strong><span>${formatCurrency(t.amountCents, t.currency || 'USD')}</span></div>
      <div class="receipt-row"><strong>Method</strong><span>${(t.brand || 'Card').toUpperCase()}</span></div>
      <div class="receipt-row"><strong>Card</strong><span>${t.masked || ('**** **** **** ' + (t.last4 || ''))}</span></div>
      <div class="receipt-row"><strong>Cardholder</strong><span>${t.cardholder || '-'}</span></div>
      <div class="receipt-row"><strong>ZIP</strong><span>${t.zip || '-'}</span></div>
      <div class="receipt-row"><strong>Environment</strong><span>Simulation</span></div>
    </div>
  `;

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  currentReceipt = null;
}

function deleteTxn(id) {
  const list = loadTxns().filter(t => t.id !== id);
  saveTxns(list);
  render();
}

function exportCSV() {
  const list = sortTxns(loadTxns().filter(matchesFilters));
  if (!list.length) return;

  const headers = [
    'id','timestamp','status','method','currency','amountCents','cardholder','brand','last4','masked','zip'
  ];
  const rows = [
    headers.join(',')
  ].concat(
    list.map(t => headers.map(h => {
      const val = t[h] != null ? String(t[h]).replace(/"/g, '""') : '';
      return `"${val}"`;
    }).join(','))
  );

  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `payflow-transactions-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function clearAll() {
  if (!confirm('Clear all transactions? This cannot be undone.')) return;
  localStorage.removeItem(STORAGE_KEY);
  render();
}

// Events
[q, brandSel, statusSel, fromDate, toDate, sortSel].forEach(el => {
  el.addEventListener('input', render);
  el.addEventListener('change', render);
});

tbody.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;
  if (action === 'view') openReceipt(id);
  if (action === 'delete') deleteTxn(id);
});

[closeModalBtn, modalBackdrop, closeFooterBtn].forEach(el => el.addEventListener('click', closeModal));
printBtn.addEventListener('click', () => window.print());
copyIdBtn.addEventListener('click', async () => {
  if (!currentReceipt) return;
  try { await navigator.clipboard.writeText(currentReceipt.id); alert('Transaction ID copied!'); }
  catch { alert('Could not copy to clipboard.'); }
});

exportCsvBtn.addEventListener('click', exportCSV);
clearAllBtn.addEventListener('click', clearAll);

// Listen to changes from other tabs or the main page
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) render();
});

// Initial render
render();