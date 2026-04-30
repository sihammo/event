function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const masterSheet = ss.getSheetByName("registrations") || ss.insertSheet("registrations");
    const data = JSON.parse(e.postData.contents);
    
    // Setup headers for master sheet if empty
    if (masterSheet.getLastRow() === 0) {
      masterSheet.appendRow([
        'Timestamp', 'Type', 'First Name', 'Last Name', 'Phone', 'Email', 'Gender',
        'Team Member 2 Name', 'Team Member 2 Email',
        'Team Member 3 Name', 'Team Member 3 Email',
        'Team Member 4 Name', 'Team Member 4 Email',
        'Team Member 5 Name', 'Team Member 5 Email'
      ]);
    }

    const timestamp = new Date();
    let rowData = [];
    let specificSheetName = "";
    let specificRowData = [];

    if (data.type === 'solo') {
      specificSheetName = "Solo_Registrations";
      rowData = [
        timestamp, data.type, data.data.firstName, data.data.lastName,
        data.data.phone, data.data.email, data.data.gender,
        '', '', '', '', '', '', '', ''
      ];
      specificRowData = [
        timestamp, data.data.firstName, data.data.lastName,
        data.data.phone, data.data.email, data.data.gender
      ];
    } else if (data.type === 'visitor') {
      specificSheetName = "Visitor_Registrations";
      rowData = [
        timestamp, data.type, data.data.name, '',
        data.data.phone, data.data.email, '',
        '', '', '', '', '', '', '', ''
      ];
      specificRowData = [
        timestamp, data.data.name, data.data.phone, data.data.email
      ];
    } else if (data.type === 'team') {
      specificSheetName = "Team_Registrations";
      const m = data.data.members;
      rowData = [
        timestamp, 'team', m[0].firstName + ' ' + m[0].lastName, '',
        m[0].phone, m[0].email, m[0].gender,
        m[1].firstName + ' ' + m[1].lastName, m[1].email,
        m[2].firstName + ' ' + m[2].lastName, m[2].email,
        m[3].firstName + ' ' + m[3].lastName, m[3].email,
        m[4].firstName + ' ' + m[4].lastName, m[4].email
      ];
      specificRowData = rowData.slice(); // Copy for team
    }

    // Append to master sheet
    masterSheet.appendRow(rowData);

    // Append to specific sheet
    if (specificSheetName) {
      let specificSheet = ss.getSheetByName(specificSheetName) || ss.insertSheet(specificSheetName);
      if (specificSheet.getLastRow() === 0) {
        if (data.type === 'solo') {
          specificSheet.appendRow(['Timestamp', 'First Name', 'Last Name', 'Phone', 'Email', 'Gender']);
        } else if (data.type === 'visitor') {
          specificSheet.appendRow(['Timestamp', 'Name', 'Phone', 'Email']);
        } else {
          specificSheet.appendRow(masterSheet.getRange(1, 1, 1, 15).getValues()[0]);
        }
      }
      specificSheet.appendRow(specificRowData);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("registrations");
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const values = sheet.getDataRange().getValues();
    if (values.length < 2) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const rows = values.slice(1);
    
    const registrations = rows.map(row => {
      const type = row[1];
      const timestamp = row[0];
      let data = {};
      
      if (type === 'solo') {
        data = {
          firstName: row[2],
          lastName: row[3],
          phone: row[4],
          email: row[5],
          gender: row[6]
        };
      } else if (type === 'visitor') {
        data = {
          name: row[2],
          phone: row[4],
          email: row[5]
        };
      } else if (type === 'team') {
        data = {
          members: [
            { firstName: row[2], lastName: '', phone: row[4], email: row[5], gender: row[6] },
            { firstName: row[7], lastName: '', email: row[8], phone: '', gender: 'male' },
            { firstName: row[9], lastName: '', email: row[10], phone: '', gender: 'male' },
            { firstName: row[11], lastName: '', email: row[12], phone: '', gender: 'male' },
            { firstName: row[13], lastName: '', email: row[14], phone: '', gender: 'male' }
          ]
        };
      }
      
      return {
        type: type,
        timestamp: timestamp,
        data: data
      };
    });
    
    return ContentService.createTextOutput(JSON.stringify(registrations))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
