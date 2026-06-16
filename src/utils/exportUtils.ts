import * as ExcelJS from 'exceljs';

export const downloadExcel = async (data: any[], filename: string) => {
  if (!data || !data.length) return;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  
  const headers = Object.keys(data[0]);
  worksheet.columns = headers.map(header => ({ header, key: header }));
  
  data.forEach(row => {
    worksheet.addRow(row);
  });
  
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  if (!filename.endsWith('.xlsx')) filename += '.xlsx';
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadCSV = (data: any[], filename: string) => {
  if (!data || !data.length) {
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Format rows
  const csvRows = [];
  
  // Add header row
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      // Escape quotes and wrap in quotes if contains comma
      const stringVal = val !== null && val !== undefined ? String(val) : '';
      if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
        return `"${stringVal.replace(/"/g, '""')}"`;
      }
      return stringVal;
    });
    csvRows.push(values.join(','));
  }
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
