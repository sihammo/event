function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Wait up to 10 seconds for other processes to finish

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const masterSheet = ss.getSheetByName("registrations") || ss.insertSheet("registrations");
    const data = JSON.parse(e.postData.contents);
    
    // Setup headers for master sheet if empty
    if (masterSheet.getLastRow() === 0) {
      masterSheet.appendRow([
        'Timestamp', 'Type', 'Full Name/Member 1', 'Email', 'Phone', 'Gender',
        'Member 2', 'Email 2', 'Member 3', 'Email 3',
        'Member 4', 'Email 4', 'Member 5', 'Email 5'
      ]);
    }

    const timestamp = new Date();
    let rowData = [];

    if (data.type === 'solo') {
      rowData = [
        timestamp, 'solo', data.data.firstName + ' ' + data.data.lastName,
        data.data.email, data.data.phone, data.data.gender,
        '', '', '', '', '', '', '', ''
      ];
    } else if (data.type === 'visitor') {
      rowData = [
        timestamp, 'visitor', data.data.name, data.data.email,
        data.data.phone, 'N/A',
        '', '', '', '', '', '', '', ''
      ];
    } else if (data.type === 'team') {
      const m = data.data.members;
      rowData = [
        timestamp, 'team', m[0].firstName + ' ' + m[0].lastName, m[0].email,
        m[0].phone, m[0].gender,
        m[1].firstName + ' ' + m[1].lastName, m[1].email,
        m[2].firstName + ' ' + m[2].lastName, m[2].email,
        m[3].firstName + ' ' + m[3].lastName, m[3].email,
        m[4].firstName + ' ' + m[4].lastName, m[4].email
      ];
    }

    // Append to master sheet
    masterSheet.appendRow(rowData);

    return returnJson({ status: 'success' });
      
  } catch (error) {
    return returnJson({ status: 'error', message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("registrations") || ss.getSheets()[0];
    
    if (!sheet) return returnJson([]);
    
    const values = sheet.getDataRange().getValues();
    if (values.length < 2) return returnJson([]);
    
    const registrations = [];
    const rows = values.slice(1);
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const type = row[1] ? row[1].toLowerCase() : '';
      if (!type) continue;
      
      const timestamp = row[0];
      let data = {};
      
      if (type === 'solo') {
        data = {
          firstName: row[2].split(' ')[0],
          lastName: row[2].split(' ').slice(1).join(' '),
          email: row[3],
          phone: row[4],
          gender: row[5]
        };
      const response = await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ type, data }),
      });
      console.log('Submission attempt complete for:', type);
      return true;
      } else if (type === 'visitor') {
        data = {
          name: row[2],
          email: row[3],
          phone: row[4]
        };
      } else if (type === 'team') {
        data = {
          members: [
            { firstName: row[2], lastName: '', email: row[3], phone: row[4], gender: row[5] },
            { firstName: row[6], lastName: '', email: row[7], phone: '', gender: '' },
            { firstName: row[8], lastName: '', email: row[9], phone: '', gender: '' },
            { firstName: row[10], lastName: '', email: row[11], phone: '', gender: '' },
            { firstName: row[12], lastName: '', email: row[13], phone: '', gender: '' }
          ]
        };
      }
      
      registrations.push({
        type: type,
        timestamp: timestamp,
        data: data
      });
    }
    
    return returnJson(registrations);
  } catch (error) {
    return returnJson({ status: 'error', message: error.toString() });
  }
}

function returnJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
