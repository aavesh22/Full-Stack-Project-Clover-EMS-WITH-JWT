import { Component, OnInit } from '@angular/core';
import { ReplacementService } from '../../shared/replacement.service';
import { Replacement } from '../../model/replacement';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-replacement',
  templateUrl: './replacement.component.html',
  styleUrl: './replacement.component.css'
})

export class ReplacementComponent implements OnInit {
  showUploadSuccessModal: boolean = false;
  uploadMessage: string = '';

  replacementList: Replacement[] = [];
  filteredReplacementList: Replacement[] = [];
  replacementObj: Replacement = {
    id: '',
    replacementNeededBefore: '',
    billingRate: '',
    accountType: '',
    yetToJoin: '',
    location: '',
    deliveryGroup: '',
    type: '',
    techGroup: '',
    monthGroup: '',
    currentStatus: ''
  };
  id: string = '';
  replacementNeededBefore: string = '';
  billingRate: string = '';
  accountType: string = '';
  yetToJoin: string = '';
  location: string = '';
  deliveryGroup: string = '';
  type: string = '';
  techGroup: string = '';
  monthGroup: string = '';
  currentStatus: string = '';
  searchText: string = '';
  isEditing: boolean = false;
  editingReplacementId: string | null = null;
  replacementCount: number = 0;
  itemsPerPage: number = 5;
  currentPage: number = 1;
  selectedDate: string = '';

  constructor(private replacementService: ReplacementService, private router: Router) { }

  ngOnInit(): void {
    this.getAllReplacements();
  }

  getAllReplacements() {
    this.replacementService.getReplacements().subscribe(
      res => {
        this.replacementList = res;
        this.replacementCount = this.replacementList.length;
        this.replacementService.updateReplacementCount(this.replacementCount);
        this.filteredReplacementList = this.replacementList;
      },
      err => {
        console.error('Error while fetching replacement data', err);
      }
    );
  }

  resetForm() {
    this.id = '';
    this.replacementNeededBefore = '';
    this.billingRate = '';
    this.accountType = '';
    this.yetToJoin = '';
    this.location = '';
    this.deliveryGroup = '';
    this.type = '';
    this.techGroup = '';
    this.monthGroup = '';
    this.currentStatus = '';
    this.isEditing = false;
    this.editingReplacementId = null;
    this.searchText = '';
    this.filteredReplacementList = [...this.replacementList];
  }

  addReplacement() {
    if (this.replacementNeededBefore === '' || this.billingRate === '' || this.accountType === '' || this.yetToJoin === '' || this.location === '' || this.deliveryGroup === '' || this.type === '' || this.techGroup === '' || this.monthGroup === '' || this.currentStatus === '') {
      alert('Please fill all input fields');
      return;
    }

    this.replacementObj = {
      id: '',
      replacementNeededBefore: this.replacementNeededBefore,
      billingRate: this.billingRate,
      accountType: this.accountType,
      yetToJoin: this.yetToJoin,
      location: this.location,
      deliveryGroup: this.deliveryGroup,
      type: this.type,
      techGroup: this.techGroup,
      monthGroup: this.monthGroup,
      currentStatus: this.currentStatus
    };

    this.replacementService.addReplacement(this.replacementObj).subscribe(() => {
      this.resetForm();
      this.getAllReplacements();
    });
  }

  editReplacement(replacement: Replacement) {
    this.isEditing = true;
    this.editingReplacementId = replacement.id;
    this.id = replacement.id;
    this.replacementNeededBefore = replacement.replacementNeededBefore;
    this.billingRate = replacement.billingRate;
    this.accountType = replacement.accountType;
    this.yetToJoin = replacement.yetToJoin;
    this.location = replacement.location;
    this.deliveryGroup = replacement.deliveryGroup;
    this.type = replacement.type;
    this.techGroup = replacement.techGroup;
    this.monthGroup = replacement.monthGroup;
    this.currentStatus = replacement.currentStatus;
  }

  updateReplacement() {
    if (this.editingReplacementId) {
      const updatedReplacement: Replacement = {
        id: this.editingReplacementId,
        replacementNeededBefore: this.replacementNeededBefore,
        billingRate: this.billingRate,
        accountType: this.accountType,
        yetToJoin: this.yetToJoin,
        location: this.location,
        deliveryGroup: this.deliveryGroup,
        type: this.type,
        techGroup: this.techGroup,
        monthGroup: this.monthGroup,
        currentStatus: this.currentStatus
      };

      this.replacementService.updateReplacement(updatedReplacement).subscribe(() => {
        this.resetForm();
        this.getAllReplacements();
      });
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  deleteReplacement(replacement: Replacement) {
    if (window.confirm(`Are you sure you want to delete the replacement for ${replacement.location}?`)) {
      this.replacementService.deleteReplacement(replacement.id).subscribe(() => {
        this.replacementList = this.replacementList.filter(req => req.id !== replacement.id);
        this.updateFilteredReplacementList();
      }, error => {
        console.error("Error deleting replacement:", error);
      });
    }
  }

  exportexcel() {
    // Step 1: Prepare the data array from filteredReplacementList
    const data = this.filteredReplacementList.map((replacement, index) => ({
      'Sr.No': index + 1,
      'Replacement Needed Before': replacement.replacementNeededBefore,
      'Billing Rate': replacement.billingRate,
      'Account Type': replacement.accountType,
      'Yet To Join': replacement.yetToJoin,
      'Location': replacement.location,
      'Delivery Group': replacement.deliveryGroup,
      'Type': replacement.type,
      'Tech Group': replacement.techGroup,
      'Month Group': replacement.monthGroup,
      'Current Status': replacement.currentStatus
    }));

    // Step 2: Convert the data array to a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Step 3: Generate the sheet name based on the selected date
    let sheetName = 'Sheet1';
    if (this.selectedDate) {
      const [year, month] = this.selectedDate.split('-');
      const monthName = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleString('default', { month: 'long' });
      sheetName = `${monthName} ${year}`;
    }

    // Step 4: Generate workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Step 5: Save to file
    XLSX.writeFile(wb, 'Replacements.xlsx');
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      alert('Cannot use multiple files');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      this.uploadExcelData(data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  uploadExcelData(data: any[]) {
    const formattedData = data.slice(1).map((row: any[]) => {
      return {
        id: '',
        replacementNeededBefore: row[0],
        billingRate: row[1],
        accountType: row[2],
        yetToJoin: row[3],
        location: row[4],
        deliveryGroup: row[5],
        type: row[6],
        techGroup: row[7],
        monthGroup: row[8],
        currentStatus: row[9]
      } as Replacement;
    });

    this.replacementService.uploadReplacement(formattedData).subscribe(
      (response: any) => {
        this.getAllReplacements();
        this.uploadMessage = `${response.message} (${response.count} employees added)`;
        this.showUploadSuccessModal = true;
      }, (error: any) => {
        console.error('Error uploading data', error);
        this.uploadMessage = error.error.message || 'Error uploading data. Please try again.';
        this.showUploadSuccessModal = true;
      });
  }
  closeUploadSuccessModal() {
    this.showUploadSuccessModal = false;
    this.uploadMessage = '';
  }


  searchReplacement(): void {
    if (this.searchText.trim() === '') {
      this.filteredReplacementList = [...this.replacementList];
    } else {
      this.filteredReplacementList = this.replacementList.filter(replacement =>
        replacement.location.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  updateFilteredReplacementList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredReplacementList = this.replacementList.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updateFilteredReplacementList();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredReplacementList();
    }
  }

  totalPages(): number {
    return Math.ceil(this.replacementList.length / this.itemsPerPage);
  }

  onDateChange(event: any) {
    this.selectedDate = event.target.value; // Format: YYYY-MM
    if (this.selectedDate) {
      const [year, month] = this.selectedDate.split('-');
      this.filteredReplacementList = this.replacementList.filter(replacement => {
        const rnb = new Date(replacement.replacementNeededBefore);
        return rnb.getFullYear() === parseInt(year) && (rnb.getMonth() + 1) === parseInt(month);
      });
    } else {
      this.filteredReplacementList = [...this.replacementList];
    }
  }
}