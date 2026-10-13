/**
 * NEGARAKU: RHYTHM HEROES
 * Google Apps Script receiver for teacher-owned Google Sheets.
 * Create this as a script bound to the destination Sheet (Extensions > Apps Script).
 */
const SHEET_NAME = 'Markah Murid';
const HEADERS = [
  'Tarikh dan masa', 'Nama murid', 'Kelas', 'Jumlah XP', 'Jumlah bintang',
  'Misi 1 XP', 'Misi 1 bintang', 'Misi 2 XP', 'Misi 2 bintang',
  'Misi 3 XP', 'Misi 3 bintang', 'Misi 4 XP', 'Misi 4 bintang',
  'ID pengembaraan'
];
const MAX_XP = [150, 150, 150, 250];

function doGet() {
  return output_({ ok: true, message: 'Penerima markah Rhythm Heroes aktif.' });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) throw new Error('Data kosong.');
    const result = JSON.parse(e.postData.contents);
    const row = makeRow_(result);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = getSheet_();
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        const existingIds = sheet.getRange(2, HEADERS.length, lastRow - 1, 1).getDisplayValues().flat();
        if (existingIds.includes(row[row.length - 1])) return output_({ ok: true, duplicate: true });
      }
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }
    return output_({ ok: true });
  } catch (error) {
    return output_({ ok: false, message: String(error && error.message || error) });
  }
}

function makeRow_(data) {
  const name = cleanText_(data.name, 80);
  const className = cleanText_(data.className, 40);
  const sessionId = String(data.sessionId || '').trim();
  if (!name || !className) throw new Error('Nama dan kelas diperlukan.');
  if (!/^[A-Za-z0-9-]{8,80}$/.test(sessionId)) throw new Error('ID pengembaraan tidak sah.');
  if (!Array.isArray(data.missions) || data.missions.length !== 4) throw new Error('Rekod empat misi diperlukan.');

  const scores = data.missions.map((mission, index) => {
    if (Number(mission.missionId) !== index + 1) throw new Error('Urutan misi tidak sah.');
    return [boundedInteger_(mission.xp, 0, MAX_XP[index]), boundedInteger_(mission.stars, 0, 3)];
  });
  const totalXp = scores.reduce((sum, item) => sum + item[0], 0);
  const totalStars = scores.reduce((sum, item) => sum + item[1], 0);
  if (boundedInteger_(data.totalXp, 0, 700) !== totalXp) throw new Error('Jumlah XP tidak sepadan.');
  if (boundedInteger_(data.totalStars, 0, 12) !== totalStars) throw new Error('Jumlah bintang tidak sepadan.');

  return [new Date(), safeCellText_(name), safeCellText_(className), totalXp, totalStars]
    .concat(scores.flat(), [sessionId]);
}

function boundedInteger_(value, min, max) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) throw new Error('Markah di luar julat.');
  return number;
}

function cleanText_(value, maxLength) {
  return String(value || '').trim().replace(/[\u0000-\u001F\u007F]/g, '').slice(0, maxLength);
}

// Prevent student-entered text from being interpreted as a spreadsheet formula.
function safeCellText_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('Gunakan Apps Script yang dibuka dari Google Sheet cikgu.');
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function output_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


