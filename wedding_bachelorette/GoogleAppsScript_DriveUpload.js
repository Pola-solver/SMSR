/**
 * ============================================================================
 * GOOGLE APPS SCRIPT BACKEND: WEDDING & BACHELORETTE PHOTO & GUESTBOOK UPLOADER
 * ============================================================================
 * 
 * INSTRUCTIONS:
 * 1. Open Google Drive (drive.google.com) and create a new Google Sheet named:
 *    "Bachelorette & Wedding Memories"
 * 2. In Google Sheets, click on Extensions > Apps Script (التطبيقات > Apps Script).
 * 3. Delete any default code in Code.gs and paste ALL the code below.
 * 4. (Optional) If you want photos saved to a specific Google Drive Folder:
 *    Paste the Folder ID below into DRIVE_FOLDER_ID.
 *    If left empty (""), the script will automatically create a folder named
 *    "Bachelorette & Wedding Photos 💍" in your Google Drive!
 * 5. Click "Deploy" (نشر) > "New deployment" (نشر جديد).
 * 6. Click the gear icon (Select type) > "Web app" (تطبيق ويب).
 * 7. Set:
 *    - Description: "Wedding & Bachelorette Web App"
 *    - Execute as: "Me" (حسابي)
 *    - Who has access: "Anyone" (أي مستخدم)   <--- IMPORTANT!
 * 8. Click "Deploy", authorize permissions when prompted.
 * 9. Copy the "Web app URL" and paste it into `script.js` in the APPS_SCRIPT_URL constant!
 */

// ─── CONFIGURATION ──────────────────────────────────────────────────────────
// Paste your Google Drive Folder ID if you have an existing folder, or leave empty:
const DRIVE_FOLDER_ID = ""; // e.g. "1a2b3c4d5e6f7g8h9i..."

// Folder name to create automatically if DRIVE_FOLDER_ID is left empty:
const AUTO_FOLDER_NAME = "Bachelorette & Wedding Photos 💍";

// ─── POST REQUEST HANDLER ───────────────────────────────────────────────────
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responseJSON({ status: "error", message: "No data received" });
    }

    var data = JSON.parse(e.postData.contents);

    var name = data.name || "مجهول";
    var tag = data.tag || "-";
    var message = data.message || "-";
    var timestamp = data.submittedAt || new Date().toISOString();
    var photos = data.photos || [];

    // 1. Get or Create Google Drive Folder
    var folder = getOrCreateFolder();

    // 2. Save Photos to Google Drive
    var photoUrls = [];
    if (photos.length > 0) {
      for (var i = 0; i < photos.length; i++) {
        var photo = photos[i];
        if (photo.base64) {
          try {
            var decodedBlob = Utilities.newBlob(
              Utilities.base64Decode(photo.base64),
              photo.mimeType || "image/jpeg",
              (name.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, "_") + "_" + (i + 1) + "_" + Date.now() + ".jpg")
            );
            var file = folder.createFile(decodedBlob);
            file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            photoUrls.push(file.getUrl());
          } catch (fileErr) {
            Logger.log("Error saving photo " + i + ": " + fileErr);
          }
        }
      }
    }

    // 3. Log to Google Sheet
    var sheet = getOrCreateSheet();
    var formattedDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "GMT+2", "yyyy-MM-dd HH:mm:ss");
    var photosCell = photoUrls.length > 0 ? photoUrls.join("\n") : "لا توجد صور";

    sheet.appendRow([
      formattedDate,
      name,
      tag,
      message,
      photoUrls.length,
      photosCell
    ]);

    return responseJSON({
      status: "success",
      message: "Data and photos saved successfully",
      photosUploaded: photoUrls.length
    });

  } catch (error) {
    Logger.log("doPost Error: " + error.toString());
    return responseJSON({
      status: "error",
      message: error.toString()
    });
  }
}

// ─── GET REQUEST HANDLER (For Health Check) ─────────────────────────────────
function doGet(e) {
  return ContentService.createTextOutput("Wedding & Bachelorette Drive Uploader is live and working! 💍✨");
}

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────
function getOrCreateFolder() {
  if (DRIVE_FOLDER_ID && DRIVE_FOLDER_ID.trim() !== "") {
    try {
      return DriveApp.getFolderById(DRIVE_FOLDER_ID.trim());
    } catch (e) {
      Logger.log("Invalid Folder ID, creating a new one: " + e);
    }
  }

  var folders = DriveApp.getFoldersByName(AUTO_FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    var newFolder = DriveApp.createFolder(AUTO_FOLDER_NAME);
    newFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return newFolder;
  }
}

function getOrCreateSheet() {
  var ss;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    ss = null;
  }

  if (!ss) {
    // If running as standalone script, look for or create a spreadsheet
    var files = DriveApp.getFilesByName("Bachelorette & Wedding Responses");
    if (files.hasNext()) {
      ss = SpreadsheetApp.open(files.next());
    } else {
      ss = SpreadsheetApp.create("Bachelorette & Wedding Responses");
    }
  }

  var sheet = ss.getActiveSheet();
  if (sheet.getLastRow() === 0) {
    // Add header row
    var headerRow = [
      "تاريخ الإرسال (Timestamp)",
      "الاسم (Name)",
      "الصلة / Tag",
      "الرسالة (Message)",
      "عدد الصور (Photos Count)",
      "روابط الصور في الدرايف (Drive Links)"
    ];
    sheet.appendRow(headerRow);
    sheet.getRange(1, 1, 1, headerRow.length).setFontWeight("bold").setBackground("#f7d794").setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
