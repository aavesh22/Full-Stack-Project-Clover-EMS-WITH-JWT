import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../shared/employee.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-bench',
  templateUrl: './bench.component.html',
  styleUrl: './bench.component.css'
})
export class BenchComponent implements OnInit {
  showUploadSuccessModal: boolean = false;
  uploadMessage: string = '';
  employeeToDelete: Employee | null = null;
  showDeleteModal: boolean = false;

  employeeList: Employee[] = [];
  filteredEmployeeList: Employee[] = [];
  employeeObj: Employee = { id: '', employeeCode: '', employeeName: '', cloverDoj: '', qualification: '', technology: '', lateralHireOrAcademy: '', experience: '', location: '' };
  id: string = '';
  employeeCode: string = '';
  employeeName: string = '';
  cloverDoj: string = '';
  qualification: string = '';
  technology: string = '';
  lateralHireOrAcademy: string = '';
  experience: string = '';
  location: string = '';
  searchText: string = '';
  isEditing: boolean = false;
  editingEmployeeId: string | null = null;
  benchCount: number = 0;
  itemsPerPage: number = 5;
  currentPage: number = 1;
  selectedDate: string = '';

  constructor(private auth: AuthService, private employeeService: EmployeeService, private router: Router) { }

  ngOnInit(): void {
    this.getAllEmployees();
  }


  getAllEmployees() {
    this.employeeService.getEmployees().subscribe(
      res => {
        this.employeeList = res;
        this.filteredEmployeeList = this.employeeList.slice(0, this.itemsPerPage);
        this.benchCount = this.employeeList.length;
        this.employeeService.updateBenchCount(this.benchCount);
        this.updateBenchCount();
      },
      err => {
        console.error('Error while fetching employee data', err);
      }
    );
  }


  resetForm() {
    this.id = '';
    this.employeeCode = '';
    this.employeeName = '';
    this.cloverDoj = '';
    this.qualification = '';
    this.technology = '';
    this.lateralHireOrAcademy = '';
    this.experience = '';
    this.location = '';
    this.isEditing = false;
    this.editingEmployeeId = null;
    this.searchText = '';
    this.filteredEmployeeList = [...this.employeeList];
  }

  addEmployee() {
    if (this.employeeCode === '' || this.employeeName === '' || this.cloverDoj === '' || this.qualification === '' || this.technology === '' || this.lateralHireOrAcademy === '' || this.experience === '' || this.location === '') {
      alert('Please fill all input fields');
      return;
    }

    this.employeeObj = {
      id: '',
      employeeCode: this.employeeCode,
      employeeName: this.employeeName,
      cloverDoj: this.cloverDoj,
      qualification: this.qualification,
      technology: this.technology,
      lateralHireOrAcademy: this.lateralHireOrAcademy,
      experience: this.experience,
      location: this.location
    };

    this.employeeService.addEmployee(this.employeeObj).subscribe(() => {
      this.resetForm();
      this.getAllEmployees();
      this.updateBenchCount();
      this.updateFilteredEmployeeList();
    });
  }

  editEmployee(employee: Employee) {
    this.isEditing = true;
    this.editingEmployeeId = employee.id;
    this.id = employee.id;
    this.employeeCode = employee.employeeCode;
    this.employeeName = employee.employeeName;
    this.cloverDoj = employee.cloverDoj;
    this.qualification = employee.qualification;
    this.technology = employee.technology;
    this.lateralHireOrAcademy = employee.lateralHireOrAcademy;
    this.experience = employee.experience;
    this.location = employee.location;
  }

  updateEmployee() {
    if (this.editingEmployeeId) {
      const updatedEmployee: Employee = {
        id: this.editingEmployeeId,
        employeeCode: this.employeeCode,
        employeeName: this.employeeName,
        cloverDoj: this.cloverDoj,
        qualification: this.qualification,
        technology: this.technology,
        lateralHireOrAcademy: this.lateralHireOrAcademy,
        experience: this.experience,
        location: this.location
      };

      this.employeeService.updateEmployee(updatedEmployee).subscribe(() => {
        this.resetForm();
        this.getAllEmployees();
        this.updateBenchCount();
        this.updateFilteredEmployeeList();
      });
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  openDeleteModal(employee: Employee) {
    this.employeeToDelete = employee;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  confirmDeleteEmployee() {
    if (this.employeeToDelete) {
      this.employeeService.deleteEmployee(this.employeeToDelete.id).subscribe(
        () => {
          this.employeeList = this.employeeList.filter(emp => emp.id !== this.employeeToDelete!.id);
          this.updateBenchCount();
          this.updateFilteredEmployeeList();
          this.closeDeleteModal();
        },
        error => {
          console.error("Error deleting employee:", error);
          this.closeDeleteModal();
        }
      );
    }
  }
  updateBenchCount() {
    this.benchCount = this.employeeList.length;
  }

  exportexcel() {
    // Step 1: Prepare the data array from filteredEmployeeList
    const data = this.filteredEmployeeList.map((employee, index) => ({
      'Sr.No': index + 1,
      'Employee Code': employee.employeeCode,
      'Employee Name': employee.employeeName,
      'Clover DOJ': employee.cloverDoj,
      'Qualification': employee.qualification,
      'Technology': employee.technology,
      'Lateral Hire / Academy': employee.lateralHireOrAcademy,
      'Experience': employee.experience,
      'Location': employee.location
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
    XLSX.writeFile(wb, 'BenchSheet.xlsx');
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
        employeeCode: row[0],
        employeeName: row[1],
        cloverDoj: row[2],
        qualification: row[3],
        technology: row[4],
        lateralHireOrAcademy: row[5],
        experience: row[6],
        location: row[7]
      } as Employee;
    });

    this.employeeService.uploadEmployees(formattedData).subscribe(
      (response: any) => {
        this.getAllEmployees();
        this.uploadMessage = `${response.message} (${response.count} employees added)`;
        this.showUploadSuccessModal = true;
      },
      (error: any) => {
        console.error('Error uploading data', error);
        this.uploadMessage = error.error.message || 'Error uploading data. Please try again.';
        this.showUploadSuccessModal = true;
      }
    );
  }

  closeUploadSuccessModal() {
    this.showUploadSuccessModal = false;
    this.uploadMessage = '';
  }


  searchEmployee(): void {
    if (this.searchText.trim() === '') {
      this.filteredEmployeeList = [...this.employeeList];
    } else {
      this.filteredEmployeeList = this.employeeList.filter(employee =>
        employee.employeeName.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  updateFilteredEmployeeList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredEmployeeList = this.employeeList.slice(startIndex, endIndex);
  }
  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updateFilteredEmployeeList();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredEmployeeList();
    }
  }

  totalPages(): number {
    return Math.ceil(this.employeeList.length / this.itemsPerPage);
  }

  onDateChange(event: any) {
    this.selectedDate = event.target.value;
    if (this.selectedDate) {
      const [year, month] = this.selectedDate.split('-');
      this.filteredEmployeeList = this.employeeList.filter(employee => {
        const doj = new Date(employee.cloverDoj);
        return doj.getFullYear() === parseInt(year) && (doj.getMonth() + 1) === parseInt(month);
      });
    } else {
      this.filteredEmployeeList = [...this.employeeList];
    }
  }
}