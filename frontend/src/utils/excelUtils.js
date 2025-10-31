import * as XLSX from 'xlsx';

/**
 * Export products to Excel (without system fields)
 * @param {Array} products - Array of product objects
 * @param {string} filename - Output filename
 */
export const exportProductsToExcel = (products, filename = 'products.xlsx') => {
  // Prepare data for export
  const exportData = products.map((product) => ({
    'Product Name': product.name,
    'Category': product.category?.name || '',
    'Description': product.description || '',
    'Price (VND)': product.price,
    'Original Price (VND)': product.originalPrice,
    'Stock': product.stock,
    'SKU': product.sku || '',
    'Image URL': product.imageUrl || '',
  }));

  // Create workbook and worksheet
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Products');

  // Set column widths
  const colWidths = [
    { wch: 25 }, // Product Name
    { wch: 15 }, // Category
    { wch: 30 }, // Description
    { wch: 15 }, // Price
    { wch: 18 }, // Original Price
    { wch: 10 }, // Stock
    { wch: 12 }, // SKU
    { wch: 25 }, // Image URL
  ];
  ws['!cols'] = colWidths;

  // Write file
  XLSX.writeFile(wb, filename);
};

/**
 * Import products from Excel
 * @param {File} file - Excel file to import
 * @returns {Promise<Array>} - Array of product objects
 */
export const importProductsFromExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Map Excel columns to product object
        const products = jsonData.map((row) => ({
          name: row['Product Name']?.trim() || '',
          categoryName: row['Category']?.trim() || '',
          description: row['Description']?.trim() || '',
          price: parseFloat(row['Price (VND)']) || 0,
          originalPrice: parseFloat(row['Original Price (VND)']) || 0,
          stock: parseInt(row['Stock']) || 0,
          sku: row['SKU']?.trim() || '',
          imageUrl: row['Image URL']?.trim() || '',
        }));

        // Validate products
        const validProducts = products.filter(p => {
          if (!p.name || !p.categoryName || p.price <= 0 || p.stock < 0) {
            return false;
          }
          return true;
        });

        if (validProducts.length === 0) {
          reject(new Error('No valid products found in Excel file. Ensure Product Name, Category, Price > 0, and Stock >= 0 are filled.'));
          return;
        }

        resolve(validProducts);
      } catch (error) {
        reject(new Error(`Error reading Excel file: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Generate Excel template for product import with categories
 * @param {Array} categories - Array of category objects with id and name
 */
export const downloadProductTemplate = (categories = []) => {
  const template = [
    {
      'Product Name': 'Example Product 1',
      'Category': categories.length > 0 ? categories[0].name : 'Electronics',
      'Description': 'Product description here',
      'Price (VND)': 100000,
      'Original Price (VND)': 150000,
      'Stock': 50,
      'SKU': 'SKU001',
      'Image URL': 'https://example.com/image.jpg',
    },
    {
      'Product Name': 'Example Product 2',
      'Category': categories.length > 1 ? categories[1].name : 'Clothing',
      'Description': 'Another product description',
      'Price (VND)': 250000,
      'Original Price (VND)': 350000,
      'Stock': 30,
      'SKU': 'SKU002',
      'Image URL': 'https://example.com/image2.jpg',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(template);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');

  const colWidths = [
    { wch: 25 }, // Product Name
    { wch: 20 }, // Category
    { wch: 30 }, // Description
    { wch: 15 }, // Price
    { wch: 18 }, // Original Price
    { wch: 10 }, // Stock
    { wch: 12 }, // SKU
    { wch: 25 }, // Image URL
  ];
  ws['!cols'] = colWidths;

  // Add freeze panes for header
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  XLSX.writeFile(wb, 'product-import-template.xlsx');
};
