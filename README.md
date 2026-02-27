# The Courtyard — Resident Directory
## Setup Guide

---

## The Directory

The directory table has the following columns:

| Address | First Name | Last Name | Mobile Number | Email Address |
|---------|------------|-----------|---------------|---------------|

- **Address** — dropdown showing 1 to 14 The Courtyard
- **First Name / Last Name** — split into two separate columns
- **Mobile Number** — shown before email
- **Email Address**
- Multiple residents can be added at the same address using the **＋** button on each row

---

## Step 1 — Change the Password

Open `index.html` in a text editor (Notepad works fine).

Find this line near the top of the `<script>` section:

```
password: 'courtyard2024',
```

Change `courtyard2024` to whatever password you want all residents to share. Save the file.

---

## Step 2 — Put it on GitHub Pages (free hosting)

1. Go to [github.com](https://github.com) and sign in
2. Click **New repository** (the green button)
3. Name it `courtyard-directory` — set it to **Public** — click **Create repository**
4. Click **uploading an existing file**
5. Drag and drop the file into the upload area — **make sure it is named `index.html`**
6. Click **Commit changes**
7. Go to **Settings** → **Pages** (left sidebar)
8. Under *Source*, select **Deploy from a branch** → branch: **main** → folder: **/ (root)**
9. Click **Save**

After a minute or two, your page will be live at:
`https://YOUR-USERNAME.github.io/courtyard-directory`

Share this link with all residents. They enter the password and can view/edit the directory.

---

## Step 3 — Connect Google Sheets (makes data permanent & shared)

Without this step, each person's browser saves data locally only — changes won't be visible to other residents. With Google Sheets connected, everyone shares the same live data.

### 3a — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank sheet
2. Rename the first tab to `Residents`
3. In row 1, add these headers in this exact order:

| A | B | C | D | E |
|---|---|---|---|---|
| Address | First Name | Last Name | Mobile | Email |

4. Copy the **Sheet ID** from the URL — it's the long string between `/d/` and `/edit`:
   `https://docs.google.com/spreadsheets/d/THIS-IS-THE-ID/edit`

### 3b — Get a Google API Key

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or use an existing one)
3. Go to **APIs & Services** → **Enable APIs** → search for and enable **Google Sheets API**
4. Go to **APIs & Services** → **Credentials** → **Create Credentials** → **API Key**
5. Copy the API key
6. (Optional but recommended) Click the key → **Restrict key** → under API restrictions select **Google Sheets API**

### 3c — Make the Sheet publicly readable

In your Google Sheet:
1. Click **Share** (top right)
2. Under *General access*, change to **Anyone with the link** → **Viewer**
3. Click **Done**

### 3d — Connect on the page

When you open the directory page and log in, you'll see the setup banner at the top.
Paste in your **Sheet ID** and **API Key** and click **Connect**.

The page will now load data from the sheet automatically.

---

## Step 4 — Enable Writing back to Google Sheets (optional advanced step)

Reading data from Google Sheets works with an API key alone.
**Writing** (saving changes back to the sheet) requires a Google Apps Script Web App. Here's how:

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete any existing code and paste this:

```javascript
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Residents');
  const data = JSON.parse(e.postData.contents);
  
  // Clear existing data (keep header row)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, 5).clearContent();
  
  // Write new data
  if (data.rows && data.rows.length > 0) {
    const values = data.rows.map(r => [r.address, r.firstName, r.lastName, r.mobile, r.email]);
    sheet.getRange(2, 1, values.length, 5).setValues(values);
  }
  
  return ContentService.createTextOutput(JSON.stringify({status:'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Deploy** → **New deployment** → Type: **Web app**
4. Set *Execute as*: **Me** — *Who has access*: **Anyone**
5. Click **Deploy** → copy the **Web App URL**
6. Open `index.html` in a text editor
7. Find `CONFIG` near the top and add your web app URL:
   ```
   scriptUrl: 'YOUR-WEB-APP-URL-HERE',
   ```

---

## Notes

- The password is stored in the HTML file — anyone who downloads the file can see it. This is fine for a friendly shared directory but not for sensitive data.
- Data auto-saves every time you click out of a field.
- The **💾 Save All** button forces an immediate save.
- The **🔒 Lock** button logs you out (useful on shared devices).
- **Export CSV** downloads a spreadsheet copy at any time with columns: Address, First Name, Last Name, Mobile, Email.
- In future this can be expanded into a multi-page website by adding further pages (notices, events, maintenance etc.) to the same GitHub repository.

---

*Built for The Courtyard Resident Directory*
