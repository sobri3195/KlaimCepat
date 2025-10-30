import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportClaimsToPDF = (claims: any[], title: string = 'Claims Report') => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString('id-ID')}`, 14, 30);
  
  const tableData = claims.map(claim => [
    claim.claimNumber,
    claim.title,
    claim.status,
    `${claim.currency} ${claim.totalAmount.toLocaleString('id-ID')}`,
    new Date(claim.createdAt).toLocaleDateString('id-ID')
  ]);
  
  autoTable(doc, {
    head: [['Claim Number', 'Title', 'Status', 'Amount', 'Created Date']],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [79, 70, 229] }
  });
  
  doc.save(`${title.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};

export const exportClaimToDetailedPDF = (claim: any) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Expense Claim Detail', 14, 20);
  
  doc.setFontSize(12);
  doc.text(`Claim Number: ${claim.claimNumber}`, 14, 35);
  doc.text(`Title: ${claim.title}`, 14, 45);
  doc.text(`Status: ${claim.status}`, 14, 55);
  doc.text(`Total Amount: ${claim.currency} ${claim.totalAmount.toLocaleString('id-ID')}`, 14, 65);
  doc.text(`Created: ${new Date(claim.createdAt).toLocaleString('id-ID')}`, 14, 75);
  
  if (claim.description) {
    doc.setFontSize(10);
    doc.text(`Description: ${claim.description}`, 14, 85);
  }
  
  const itemsData = claim.items.map((item: any) => [
    new Date(item.date).toLocaleDateString('id-ID'),
    item.category,
    item.description,
    item.vendor || '-',
    `${claim.currency} ${item.amount.toLocaleString('id-ID')}`
  ]);
  
  autoTable(doc, {
    head: [['Date', 'Category', 'Description', 'Vendor', 'Amount']],
    body: itemsData,
    startY: 95,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [79, 70, 229] }
  });
  
  doc.save(`Claim_${claim.claimNumber}_${Date.now()}.pdf`);
};

export const exportClaimsToExcel = (claims: any[], filename: string = 'claims') => {
  const worksheet = XLSX.utils.json_to_sheet(
    claims.map(claim => ({
      'Claim Number': claim.claimNumber,
      'Title': claim.title,
      'Description': claim.description || '',
      'Status': claim.status,
      'Type': claim.claimType || 'N/A',
      'Currency': claim.currency,
      'Total Amount': claim.totalAmount,
      'Items Count': claim.items?.length || 0,
      'Created Date': new Date(claim.createdAt).toLocaleString('id-ID'),
      'Updated Date': new Date(claim.updatedAt).toLocaleString('id-ID'),
      'Has Violations': claim.hasViolations ? 'Yes' : 'No'
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Claims');
  
  XLSX.writeFile(workbook, `${filename}_${Date.now()}.xlsx`);
};

export const exportClaimDetailToExcel = (claim: any) => {
  const claimInfo = [{
    'Claim Number': claim.claimNumber,
    'Title': claim.title,
    'Description': claim.description || '',
    'Status': claim.status,
    'Type': claim.claimType || 'N/A',
    'Currency': claim.currency,
    'Total Amount': claim.totalAmount,
    'Created Date': new Date(claim.createdAt).toLocaleString('id-ID')
  }];
  
  const items = claim.items.map((item: any) => ({
    'Date': new Date(item.date).toLocaleDateString('id-ID'),
    'Category': item.category,
    'Description': item.description,
    'Vendor': item.vendor || '',
    'Amount': item.amount,
    'Currency': claim.currency
  }));
  
  const workbook = XLSX.utils.book_new();
  const claimSheet = XLSX.utils.json_to_sheet(claimInfo);
  const itemsSheet = XLSX.utils.json_to_sheet(items);
  
  XLSX.utils.book_append_sheet(workbook, claimSheet, 'Claim Info');
  XLSX.utils.book_append_sheet(workbook, itemsSheet, 'Items');
  
  XLSX.writeFile(workbook, `Claim_${claim.claimNumber}_Detail_${Date.now()}.xlsx`);
};

export const exportAnalyticsToExcel = (data: any) => {
  const workbook = XLSX.utils.book_new();
  
  if (data.categoryBreakdown) {
    const categorySheet = XLSX.utils.json_to_sheet(data.categoryBreakdown);
    XLSX.utils.book_append_sheet(workbook, categorySheet, 'Category Breakdown');
  }
  
  if (data.topSpenders) {
    const spendersData = data.topSpenders.map((s: any) => ({
      'User Name': s.user.name,
      'Total Amount': s.totalAmount,
      'Claim Count': s.claimCount,
      'Average Amount': s.avgClaimAmount
    }));
    const spendersSheet = XLSX.utils.json_to_sheet(spendersData);
    XLSX.utils.book_append_sheet(workbook, spendersSheet, 'Top Spenders');
  }
  
  if (data.stats) {
    const statsData = [{
      'Total Claims': data.stats.totalClaims,
      'Total Amount': data.stats.totalAmount,
      'Pending Approvals': data.stats.pendingApprovals,
      'Average Approval Time (hours)': data.stats.avgApprovalTime
    }];
    const statsSheet = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistics');
  }
  
  XLSX.writeFile(workbook, `Analytics_Report_${Date.now()}.xlsx`);
};
