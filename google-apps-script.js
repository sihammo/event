function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Type',
        'First Name',
        'Last Name',
        'Phone',
        'Email',
        'Gender',
        'Team Member 2 Name',
        'Team Member 2 Email',
        'Team Member 3 Name',
        'Team Member 3 Email',
        'Team Member 4 Name',
        'Team Member 4 Email',
        'Team Member 5 Name',
        'Team Member 5 Email'
      ]);
    }

    const timestamp = new Date();
    
    if (data.type === 'solo') {
      sheet.appendRow([
        timestamp,
        data.type,
        data.data.firstName,
        data.data.lastName,
        data.data.phone,
        data.data.email,
        data.data.gender,
        '', '', '', '', '', '', '', ''
      ]);
    } else if (data.type === 'visitor') {
      sheet.appendRow([
        timestamp,
        data.type,
        data.data.name,
        '',
        data.data.phone,
        data.data.email,
        '',
        '', '', '', '', '', '', '', ''
      ]);
    } else if (data.type === 'team') {
      const members = data.data.members;
      sheet.appendRow([
        timestamp,
        'team',
        members[0].firstName + ' ' + members[0].lastName,
        '', // Last name included in previous column for simplicity, or split it
        members[0].phone,
        members[0].email,
        members[0].gender,
        members[1].firstName + ' ' + members[1].lastName,
        members[1].email,
        members[2].firstName + ' ' + members[2].lastName,
        members[2].email,
        members[3].firstName + ' ' + members[3].lastName,
        members[3].email,
        members[4].firstName + ' ' + members[4].lastName,
        members[4].email
      ]);
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
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
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
