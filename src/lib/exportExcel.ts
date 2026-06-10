'use client';

import * as XLSX from 'xlsx';
import { Product, Booking, CATEGORIES } from '@/lib/types';

function downloadWorkbook(wb: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(wb, filename);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function exportProductsToExcel(products: Product[]) {
  const data = products.map(p => ({
    'Product ID': p.id,
    'Name': p.name,
    'Category': CATEGORIES.find(c => c.slug === p.category)?.name || p.category,
    'Subcategory': p.subcategory,
    'Price (₹)': p.price,
    'Original Price (₹)': p.originalPrice,
    'Discount (%)': p.originalPrice > p.price
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : 0,
    'SKU': p.sku,
    'Serial Number': p.serialNumber,
    'Material': p.material,
    'Size': p.size,
    'Color': p.color,
    'Pattern': p.pattern,
    'Status': p.status.replace(/_/g, ' ').toUpperCase(),
    'Visible': p.isVisible ? 'Yes' : 'No',
    'Images Count': p.images?.length || 0,
    'Care Instructions': p.careInstructions,
    'Cities': p.cities.join(', '),
    'Created': formatDate(p.createdAt),
    'Updated': formatDate(p.updatedAt),
  }));

  const ws = XLSX.utils.json_to_sheet(data);

  // Auto-size columns
  const colWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.max(key.length, ...data.map(row => String((row as Record<string, unknown>)[key] || '').length)).toString().length + 2,
  }));
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Products');

  // Add summary sheet
  const summaryData = [
    { 'Metric': 'Total Products', 'Value': products.length },
    { 'Metric': 'Available', 'Value': products.filter(p => p.status === 'available').length },
    { 'Metric': 'Reserved', 'Value': products.filter(p => p.status === 'reserved').length },
    { 'Metric': 'Out for Trial', 'Value': products.filter(p => p.status === 'out_for_trial').length },
    { 'Metric': 'Sold', 'Value': products.filter(p => p.status === 'sold').length },
    { 'Metric': 'Damaged', 'Value': products.filter(p => p.status === 'damaged').length },
    { 'Metric': 'Total Catalog Value (₹)', 'Value': products.reduce((s, p) => s + p.price, 0) },
    { 'Metric': 'Avg Product Price (₹)', 'Value': products.length ? Math.round(products.reduce((s, p) => s + p.price, 0) / products.length) : 0 },
    { 'Metric': 'Visible Products', 'Value': products.filter(p => p.isVisible).length },
    { 'Metric': 'Products with Images', 'Value': products.filter(p => p.images && p.images.length > 0).length },
    { 'Metric': 'Export Date', 'Value': new Date().toLocaleString('en-IN') },
  ];
  const summaryWs = XLSX.utils.json_to_sheet(summaryData);
  summaryWs['!cols'] = [{ wch: 25 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  // Category breakdown sheet
  const catData = CATEGORIES.map(cat => ({
    'Category': cat.name,
    'Total': products.filter(p => p.category === cat.slug).length,
    'Available': products.filter(p => p.category === cat.slug && p.status === 'available').length,
    'Sold': products.filter(p => p.category === cat.slug && p.status === 'sold').length,
    'Revenue (₹)': products.filter(p => p.category === cat.slug && p.status === 'sold').reduce((s, p) => s + p.price, 0),
  }));
  const catWs = XLSX.utils.json_to_sheet(catData);
  catWs['!cols'] = [{ wch: 18 }, { wch: 8 }, { wch: 10 }, { wch: 8 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, catWs, 'By Category');

  const dateStr = new Date().toISOString().split('T')[0];
  downloadWorkbook(wb, `QuickLoom_Products_${dateStr}.xlsx`);
}

export function exportBookingsToExcel(bookings: Booking[], getProductById: (id: string) => Product | undefined) {
  const data = bookings.map(b => ({
    'Booking ID': b.id,
    'Customer Name': b.customerName,
    'Phone': b.customerPhone,
    'City': b.city,
    'Address': b.address,
    'Preferred Slot': b.preferredSlot,
    'Status': b.status.replace(/_/g, ' ').toUpperCase(),
    'Total Items': b.items.length,
    'Items Bought': b.items.filter(i => i.itemStatus === 'bought').length,
    'Items Returned': b.items.filter(i => i.itemStatus === 'returned').length,
    'Items Damaged': b.items.filter(i => i.itemStatus === 'damaged').length,
    'Booking Value (₹)': b.items.reduce((sum, item) => {
      const p = getProductById(item.productId);
      return sum + (p?.price || 0);
    }, 0),
    'Revenue (₹)': b.items
      .filter(i => i.itemStatus === 'bought')
      .reduce((sum, item) => {
        const p = getProductById(item.productId);
        return sum + (p?.price || 0);
      }, 0),
    'Notes': b.notes || '',
    'Created': formatDate(b.createdAt),
    'Updated': formatDate(b.updatedAt),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = Object.keys(data[0] || {}).map(key => ({ wch: Math.max(key.length + 2, 12) }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Bookings');

  // Booking items detail sheet
  const itemsData: Record<string, unknown>[] = [];
  bookings.forEach(b => {
    b.items.forEach(item => {
      const p = getProductById(item.productId);
      itemsData.push({
        'Booking ID': b.id,
        'Customer': b.customerName,
        'Product': p?.name || 'Unknown',
        'SKU': p?.sku || '-',
        'Price (₹)': p?.price || 0,
        'Item Status': item.itemStatus.replace(/_/g, ' ').toUpperCase(),
        'Booking Date': formatDate(b.createdAt),
      });
    });
  });

  if (itemsData.length > 0) {
    const itemsWs = XLSX.utils.json_to_sheet(itemsData);
    itemsWs['!cols'] = Object.keys(itemsData[0]).map(key => ({ wch: Math.max(key.length + 2, 12) }));
    XLSX.utils.book_append_sheet(wb, itemsWs, 'Booking Items');
  }

  // Summary
  const totalRevenue = bookings.reduce((sum, b) =>
    sum + b.items.filter(i => i.itemStatus === 'bought').reduce((s, item) => {
      const p = getProductById(item.productId);
      return s + (p?.price || 0);
    }, 0), 0);

  const summaryData = [
    { 'Metric': 'Total Bookings', 'Value': bookings.length },
    { 'Metric': 'Pending', 'Value': bookings.filter(b => b.status === 'pending').length },
    { 'Metric': 'Confirmed', 'Value': bookings.filter(b => b.status === 'confirmed').length },
    { 'Metric': 'Out for Trial', 'Value': bookings.filter(b => b.status === 'out_for_trial').length },
    { 'Metric': 'Completed', 'Value': bookings.filter(b => b.status === 'completed').length },
    { 'Metric': 'Cancelled', 'Value': bookings.filter(b => b.status === 'cancelled').length },
    { 'Metric': 'Total Items Trialed', 'Value': bookings.reduce((s, b) => s + b.items.length, 0) },
    { 'Metric': 'Total Revenue (₹)', 'Value': totalRevenue },
    { 'Metric': 'Export Date', 'Value': new Date().toLocaleString('en-IN') },
  ];
  const summaryWs = XLSX.utils.json_to_sheet(summaryData);
  summaryWs['!cols'] = [{ wch: 22 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  const dateStr = new Date().toISOString().split('T')[0];
  downloadWorkbook(wb, `QuickLoom_Bookings_${dateStr}.xlsx`);
}

export function exportInventoryToExcel(products: Product[]) {
  const data = products.map(p => ({
    'SKU': p.sku,
    'Serial Number': p.serialNumber,
    'Product Name': p.name,
    'Category': CATEGORIES.find(c => c.slug === p.category)?.name || p.category,
    'Status': p.status.replace(/_/g, ' ').toUpperCase(),
    'Price (₹)': p.price,
    'Color': p.color,
    'Size': p.size,
    'Material': p.material,
    'Visible': p.isVisible ? 'Yes' : 'No',
    'Cities': p.cities.join(', '),
    'Last Updated': formatDate(p.updatedAt),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = Object.keys(data[0] || {}).map(key => ({ wch: Math.max(key.length + 2, 12) }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventory');

  // Status summary
  const statusCounts: Record<string, number> = {};
  products.forEach(p => {
    const label = p.status.replace(/_/g, ' ').toUpperCase();
    statusCounts[label] = (statusCounts[label] || 0) + 1;
  });

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    'Status': status,
    'Count': count,
    'Percentage': `${Math.round((count / products.length) * 100)}%`,
  }));
  const statusWs = XLSX.utils.json_to_sheet(statusData);
  statusWs['!cols'] = [{ wch: 18 }, { wch: 8 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, statusWs, 'Status Summary');

  const dateStr = new Date().toISOString().split('T')[0];
  downloadWorkbook(wb, `QuickLoom_Inventory_${dateStr}.xlsx`);
}

export function exportFullReportToExcel(
  products: Product[],
  bookings: Booking[],
  getProductById: (id: string) => Product | undefined,
) {
  const wb = XLSX.utils.book_new();
  const dateStr = new Date().toISOString().split('T')[0];

  // 1. Dashboard Summary
  const soldProducts = products.filter(p => p.status === 'sold');
  const totalRevenue = soldProducts.reduce((s, p) => s + p.price, 0);

  const dashData = [
    { 'Metric': '--- PRODUCTS ---', 'Value': '' },
    { 'Metric': 'Total Products', 'Value': products.length },
    { 'Metric': 'Available', 'Value': products.filter(p => p.status === 'available').length },
    { 'Metric': 'Reserved', 'Value': products.filter(p => p.status === 'reserved').length },
    { 'Metric': 'Out for Trial', 'Value': products.filter(p => p.status === 'out_for_trial').length },
    { 'Metric': 'Sold', 'Value': soldProducts.length },
    { 'Metric': 'Returned Pending', 'Value': products.filter(p => p.status === 'returned_pending').length },
    { 'Metric': 'Damaged', 'Value': products.filter(p => p.status === 'damaged').length },
    { 'Metric': '', 'Value': '' },
    { 'Metric': '--- REVENUE ---', 'Value': '' },
    { 'Metric': 'Total Revenue (₹)', 'Value': totalRevenue },
    { 'Metric': 'Avg Order Value (₹)', 'Value': soldProducts.length ? Math.round(totalRevenue / soldProducts.length) : 0 },
    { 'Metric': 'Total Catalog Value (₹)', 'Value': products.reduce((s, p) => s + p.price, 0) },
    { 'Metric': '', 'Value': '' },
    { 'Metric': '--- BOOKINGS ---', 'Value': '' },
    { 'Metric': 'Total Bookings', 'Value': bookings.length },
    { 'Metric': 'Active Bookings', 'Value': bookings.filter(b => !['completed', 'cancelled'].includes(b.status)).length },
    { 'Metric': 'Completed', 'Value': bookings.filter(b => b.status === 'completed').length },
    { 'Metric': 'Cancelled', 'Value': bookings.filter(b => b.status === 'cancelled').length },
    { 'Metric': 'Conversion Rate', 'Value': bookings.length > 0 ? `${Math.round((soldProducts.length / bookings.length) * 100)}%` : '0%' },
    { 'Metric': '', 'Value': '' },
    { 'Metric': '--- CATALOG HEALTH ---', 'Value': '' },
    { 'Metric': 'Products with Images', 'Value': `${products.filter(p => p.images && p.images.length > 0).length} / ${products.length}` },
    { 'Metric': 'Visible on Site', 'Value': `${products.filter(p => p.isVisible).length} / ${products.length}` },
    { 'Metric': '', 'Value': '' },
    { 'Metric': 'Report Generated', 'Value': new Date().toLocaleString('en-IN') },
  ];
  const dashWs = XLSX.utils.json_to_sheet(dashData);
  dashWs['!cols'] = [{ wch: 25 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, dashWs, 'Dashboard');

  // 2. Products
  const prodData = products.map(p => ({
    'ID': p.id, 'Name': p.name,
    'Category': CATEGORIES.find(c => c.slug === p.category)?.name || p.category,
    'Price (₹)': p.price, 'Original (₹)': p.originalPrice,
    'SKU': p.sku, 'Status': p.status.replace(/_/g, ' '),
    'Color': p.color, 'Size': p.size, 'Material': p.material,
    'Visible': p.isVisible ? 'Yes' : 'No',
  }));
  const prodWs = XLSX.utils.json_to_sheet(prodData);
  XLSX.utils.book_append_sheet(wb, prodWs, 'Products');

  // 3. Bookings
  const bookData = bookings.map(b => ({
    'ID': b.id, 'Customer': b.customerName, 'Phone': b.customerPhone,
    'City': b.city, 'Address': b.address, 'Slot': b.preferredSlot,
    'Status': b.status.replace(/_/g, ' '), 'Items': b.items.length,
    'Bought': b.items.filter(i => i.itemStatus === 'bought').length,
    'Created': formatDate(b.createdAt),
  }));
  const bookWs = XLSX.utils.json_to_sheet(bookData);
  XLSX.utils.book_append_sheet(wb, bookWs, 'Bookings');

  // 4. Category breakdown
  const catData = CATEGORIES.map(cat => ({
    'Category': cat.name,
    'Total': products.filter(p => p.category === cat.slug).length,
    'Available': products.filter(p => p.category === cat.slug && p.status === 'available').length,
    'Sold': products.filter(p => p.category === cat.slug && p.status === 'sold').length,
    'Revenue (₹)': products.filter(p => p.category === cat.slug && p.status === 'sold').reduce((s, p) => s + p.price, 0),
  }));
  const catWs = XLSX.utils.json_to_sheet(catData);
  XLSX.utils.book_append_sheet(wb, catWs, 'By Category');

  downloadWorkbook(wb, `QuickLoom_FullReport_${dateStr}.xlsx`);
}
