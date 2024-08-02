import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
import { EmployeeService } from '../../shared/employee.service';
import { NewRequirementService } from '../../shared/new-requirement.service';
import { ReplacementService } from '../../shared/replacement.service';
import { CountUp } from 'countup.js';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

// Register all necessary chart components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChart') private pieChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChart') private barChartRef!: ElementRef<HTMLCanvasElement>;

  benchCount: number = 0;
  newRequirementCount: number = 0;
  replacementCount: number = 0;

  yearlyData: any[] = [];
  pieChart: Chart | null = null;
  barChart: Chart | null = null;

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private newRequirementService: NewRequirementService,
    private replacementService: ReplacementService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadCounts();
    this.loadYearlyData();
  }

  ngAfterViewInit(): void {
    this.createPieChart();
    this.createBarChart();
  }

  loadCounts(): void {
    forkJoin({
      employees: this.employeeService.getEmployees(),
      newRequirements: this.newRequirementService.getNewRequirements(),
      replacements: this.replacementService.getReplacements()
    }).subscribe({
      next: (result) => {
        this.benchCount = result.employees.length;
        this.newRequirementCount = result.newRequirements.length;
        this.replacementCount = result.replacements.length;

        this.employeeService.updateBenchCount(this.benchCount);
        this.newRequirementService.updateNewRequirementCount(this.newRequirementCount);
        this.replacementService.updateReplacementCount(this.replacementCount);

        this.animateCount('benchCount', this.benchCount);
        this.animateCount('newRequirementCount', this.newRequirementCount);
        this.animateCount('replacementCount', this.replacementCount);

        this.updateCharts();
      },
      error: (error) => console.error('Error fetching counts:', error)
    });
  }

  loadYearlyData(): void {
    // Mock data - replace with actual API call if available
    const currentYear = new Date().getFullYear();
    this.yearlyData = [
      { year: currentYear - 2, bench: 50, newRequirement: 30, replacement: 20 },
      { year: currentYear - 1, bench: 60, newRequirement: 40, replacement: 25 },
      { year: currentYear, bench: 0, newRequirement: 0, replacement: 0 }
    ];
  }

  animateCount(elementId: string, endValue: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const countUp = new CountUp(elementId, endValue);
      if (!countUp.error) {
        countUp.start();
      } else {
        console.error(countUp.error);
      }
    }
  }

  createPieChart(): void {
    if (this.pieChartRef) {
      const ctx = this.pieChartRef.nativeElement.getContext('2d');
      if (ctx) {
        const data: ChartData = {
          labels: ['Bench', 'New Requirement', 'Replacement'],
          datasets: [{
            data: [this.benchCount, this.newRequirementCount, this.replacementCount],
            backgroundColor: ['#FF5733', '#3498DB', '#27AE60']
          }]
        };

        const config: ChartConfiguration = {
          type: 'pie',
          data: data,
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'Distribution of Resources' }
            }
          }
        };

        this.pieChart = new Chart(ctx, config);
      }
    }
  }

  createBarChart(): void {
    if (this.barChartRef) {
      const ctx = this.barChartRef.nativeElement.getContext('2d');
      if (ctx) {
        const data: ChartData = {
          labels: this.yearlyData.map(d => d.year.toString()),
          datasets: [
            {
              label: 'Bench',
              data: this.yearlyData.map(d => d.bench),
              backgroundColor: '#FF5733'
            },
            {
              label: 'New Requirement',
              data: this.yearlyData.map(d => d.newRequirement),
              backgroundColor: '#3498DB'
            },
            {
              label: 'Replacement',
              data: this.yearlyData.map(d => d.replacement),
              backgroundColor: '#27AE60'
            }
          ]
        };

        const config: ChartConfiguration = {
          type: 'bar',
          data: data,
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
              title: { display: true, text: 'Employee Count by Category and Year' }
            },
            scales: {
              x: { stacked: true },
              y: { stacked: true, beginAtZero: true }
            }
          }
        };

        this.barChart = new Chart(ctx, config);
      }
    }
  }

  updateCharts(): void {
    if (this.pieChart) {
      this.pieChart.data.datasets[0].data = [this.benchCount, this.newRequirementCount, this.replacementCount];
      this.pieChart.update();
    }

    if (this.barChart) {
      const currentYear = new Date().getFullYear();
      const currentYearData = this.yearlyData.find(d => d.year === currentYear);
      if (currentYearData) {
        currentYearData.bench = this.benchCount;
        currentYearData.newRequirement = this.newRequirementCount;
        currentYearData.replacement = this.replacementCount;
      }

      this.barChart.data.datasets.forEach((dataset, index) => {
        if (dataset.data) {
          dataset.data = this.yearlyData.map(d => 
            index === 0 ? d.bench : 
            index === 1 ? d.newRequirement : 
            d.replacement
          );
        }
      });
      this.barChart.update();
    }
  }

  navigateTo(path: string) {
    this.router.navigate([`dashboard/${path}`]);
  }
}
