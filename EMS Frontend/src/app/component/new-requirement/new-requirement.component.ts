import { Component, OnInit } from '@angular/core';
import { NewRequirementService } from '../../shared/new-requirement.service';
import { NewRequirement } from '../../model/newrequirement';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-new-requirement',
  templateUrl: './new-requirement.component.html',
  styleUrls: ['./new-requirement.component.css']
})
export class NewRequirementComponent implements OnInit {
  showUploadSuccessModal: boolean = false;
  uploadMessage: string = '';

  newRequirementList: NewRequirement[] = [];
  filteredNewRequirementList: NewRequirement[] = [];
  newRequirementObj: NewRequirement = {
    id: '', salesPerson: '', deliveryHead: '', requirementRecordDate: '', customerName: '', opportunity: '', ltc: '',
    poReceived: '', experience: '', numberOfRequirements: '', perMonthValue: '', deliveryGroup: '', closed: '', location: ''
  };
  id: string = '';
  salesPerson: string = '';
  deliveryHead: string = '';
  requirementRecordDate: string = '';
  customerName: string = '';
  opportunity: string = '';
  ltc: string = '';
  poReceived: string = '';
  experience: string = '';
  numberOfRequirements: string = '';
  perMonthValue: string = '';
  deliveryGroup: string = '';
  closed: string = '';
  location: string = '';
  searchText: string = '';
  isEditing: boolean = false;
  editingNewRequirementId: string | null = null;
  newRequirementCount: number = 0;
  itemsPerPage: number = 5;
  currentPage: number = 1;
  selectedDate: string = '';

  constructor(private newRequirementService: NewRequirementService, private router: Router) { }

  ngOnInit(): void {
    this.getAllNewRequirements();
  }

  getAllNewRequirements() {
    this.newRequirementService.getNewRequirements().subscribe(
      res => {
        this.newRequirementList = res;
        this.newRequirementCount = this.newRequirementList.length;
        this.newRequirementService.updateNewRequirementCount(this.newRequirementCount);
        this.filteredNewRequirementList = this.newRequirementList;
      },
      err => {
        console.error('Error while fetching new requirement data', err);
      }
    );
  }

  resetForm() {
    this.id = '';
    this.salesPerson = '';
    this.deliveryHead = '';
    this.requirementRecordDate = '';
    this.customerName = '';
    this.opportunity = '';
    this.ltc = '';
    this.poReceived = '';
    this.experience = '';
    this.numberOfRequirements = '';
    this.perMonthValue = '';
    this.deliveryGroup = '';
    this.closed = '';
    this.location = '';
    this.isEditing = false;
    this.editingNewRequirementId = null;
    this.searchText = '';
    this.filteredNewRequirementList = [...this.newRequirementList];
  }

  addNewRequirement() {
    if (this.salesPerson === '' || this.deliveryHead === '' || this.requirementRecordDate === '' || this.customerName === '' || this.opportunity === '' || this.ltc === '' || this.poReceived === '' || this.experience === '' || this.numberOfRequirements === '' || this.perMonthValue === '' || this.deliveryGroup === '' || this.closed === '' || this.location === '') {
      alert('Please fill all input fields');
      return;
    }

    this.newRequirementObj = {
      id: '',
      salesPerson: this.salesPerson,
      deliveryHead: this.deliveryHead,
      requirementRecordDate: this.requirementRecordDate,
      customerName: this.customerName,
      opportunity: this.opportunity,
      ltc: this.ltc,
      poReceived: this.poReceived,
      experience: this.experience,
      numberOfRequirements: this.numberOfRequirements,
      perMonthValue: this.perMonthValue,
      deliveryGroup: this.deliveryGroup,
      closed: this.closed,
      location: this.location
    };

    this.newRequirementService.addNewRequirement(this.newRequirementObj).subscribe(() => {
      this.resetForm();
      this.getAllNewRequirements();
    });
  }

  editNewRequirement(newRequirement: NewRequirement) {
    this.isEditing = true;
    this.editingNewRequirementId = newRequirement.id;
    this.id = newRequirement.id;
    this.salesPerson = newRequirement.salesPerson;
    this.deliveryHead = newRequirement.deliveryHead;
    this.requirementRecordDate = newRequirement.requirementRecordDate;
    this.customerName = newRequirement.customerName;
    this.opportunity = newRequirement.opportunity;
    this.ltc = newRequirement.ltc;
    this.poReceived = newRequirement.poReceived;
    this.experience = newRequirement.experience;
    this.numberOfRequirements = newRequirement.numberOfRequirements;
    this.perMonthValue = newRequirement.perMonthValue;
    this.deliveryGroup = newRequirement.deliveryGroup;
    this.closed = newRequirement.closed;
    this.location = newRequirement.location;
  }

  updateNewRequirement() {
    if (this.editingNewRequirementId) {
      const updatedNewRequirement: NewRequirement = {
        id: this.editingNewRequirementId,
        salesPerson: this.salesPerson,
        deliveryHead: this.deliveryHead,
        requirementRecordDate: this.requirementRecordDate,
        customerName: this.customerName,
        opportunity: this.opportunity,
        ltc: this.ltc,
        poReceived: this.poReceived,
        experience: this.experience,
        numberOfRequirements: this.numberOfRequirements,
        perMonthValue: this.perMonthValue,
        deliveryGroup: this.deliveryGroup,
        closed: this.closed,
        location: this.location
      };

      this.newRequirementService.updateNewRequirement(updatedNewRequirement).subscribe(() => {
        this.resetForm();
        this.getAllNewRequirements();
      });
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  deleteNewRequirement(newRequirement: NewRequirement) {
    if (window.confirm(`Are you sure you want to delete the requirement for ${newRequirement.customerName}?`)) {
      this.newRequirementService.deleteNewRequirement(newRequirement.id).subscribe(() => {
        this.newRequirementList = this.newRequirementList.filter(req => req.id !== newRequirement.id);
        this.updateFilteredNewRequirementList();
      }, error => {
        console.error("Error deleting new requirement:", error);
      });
    }
  }



  exportexcel() {
    // Step 1: Prepare the data array from filteredNewRequirementList
    const data = this.filteredNewRequirementList.map((newRequirement, index) => ({
      'Sr.No': index + 1,
      'Sales Person': newRequirement.salesPerson,
      'Delivery Head': newRequirement.deliveryHead,
      'Requirement Record Date': newRequirement.requirementRecordDate,
      'Customer Name': newRequirement.customerName,
      'Opportunity': newRequirement.opportunity,
      'LTC': newRequirement.ltc,
      'PO Received': newRequirement.poReceived,
      'Experience': newRequirement.experience,
      'Number of Requirements': newRequirement.numberOfRequirements,
      'Per Month Value': newRequirement.perMonthValue,
      'Delivery Group': newRequirement.deliveryGroup,
      'Closed': newRequirement.closed,
      'Location': newRequirement.location
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
    XLSX.writeFile(wb, 'NewRequirements.xlsx');
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
        salesPerson: row[0],
        deliveryHead: row[1],
        requirementRecordDate: row[2],
        customerName: row[3],
        opportunity: row[4],
        ltc: row[5],
        poReceived: row[6],
        experience: row[7],
        numberOfRequirements: row[8],
        perMonthValue: row[9],
        deliveryGroup: row[10],
        closed: row[11],
        location: row[12]
      } as NewRequirement;
    });

    this.newRequirementService.uploadNewRequirements(formattedData).subscribe(
      (response: any) => {
        this.getAllNewRequirements();
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


  searchNewRequirement(): void {
    if (this.searchText.trim() === '') {
      this.filteredNewRequirementList = [...this.newRequirementList];
    } else {
      this.filteredNewRequirementList = this.newRequirementList.filter(newRequirement =>
        newRequirement.customerName.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }



  updateFilteredNewRequirementList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredNewRequirementList = this.newRequirementList.slice(startIndex, endIndex);
  }
  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updateFilteredNewRequirementList();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredNewRequirementList();
    }
  }

  totalPages(): number {
    return Math.ceil(this.newRequirementList.length / this.itemsPerPage);
  }

  onDateChange(event: any) {
    this.selectedDate = event.target.value; // Format: YYYY-MM
    if (this.selectedDate) {
      const [year, month] = this.selectedDate.split('-');
      this.filteredNewRequirementList = this.newRequirementList.filter(newrequirement => {
        const recordDate = new Date(newrequirement.requirementRecordDate);
        return recordDate.getFullYear() === parseInt(year) && (recordDate.getMonth() + 1) === parseInt(month);
      });
    } else {
      this.filteredNewRequirementList = [...this.newRequirementList];
    }
  }
}
