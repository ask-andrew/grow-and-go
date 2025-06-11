export const parseCSV = (csv) => {
  const lines = csv.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    const values = currentLine.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(item => item.replace(/"/g, '').trim());
    if (values && values.length === headers.length) {
      const entry = {};
      headers.forEach((header, index) => {
        entry[header] = values[index];
      });
      data.push(entry);
    }
  }
  return data;
};