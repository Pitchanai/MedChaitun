import { Component, ViewChild, ElementRef } from '@angular/core'
import * as Chart from 'chart.js'

const CITIZEN_ID_MAX_LENGTH = 13

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('pieChart') pieChartRef: ElementRef

  textCitizenId: any = ''
  get citizenIdLength(): number {
    let idLength = 0
    let textCitizenIdString = '' + this.textCitizenId
    if (textCitizenIdString) {
      idLength = textCitizenIdString.length
    }
    return idLength
  }
  chartLength = 250
  showChart = false
  loading = false
  pieChart = null
  totalCase = 0
  getZeroSet = []
  scoreSum = 0
  scoreMean = 0
  chartData = {
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
    labels: [],
  }
  private chartRedrawConfig = {
    duration: 1000,
    easing: 'easeOutQuart',
    lazy: false,
  }

  ngOnInit() {
    let localCitizen = localStorage.getItem('citizenId')
    if (localCitizen) {
      this.textCitizenId = localCitizen
      this.getDigitcount()
    }
  }

  getDigitcount(): string {
    if (!this.textCitizenId) {
      return ''
    }

    if (this.citizenIdLength > CITIZEN_ID_MAX_LENGTH) {
      return '(เกิน)'
    } else if (this.citizenIdLength == CITIZEN_ID_MAX_LENGTH) {
      return '(ครบ)'
    }

    return `(ขาด ${CITIZEN_ID_MAX_LENGTH - this.citizenIdLength} หลัก)`
  }

  isDisableCalculate(): boolean {
    return !(this.citizenIdLength == CITIZEN_ID_MAX_LENGTH)
  }

  setRange(range: number): void {
    this.chartLength = range
    if (!this.isDisableCalculate()) {
      this.submitCalculate()
    }
  }

  submitCalculate(): void {
    if (!this.textCitizenId) {
      console.log('validate 1 error')
      return
    }

    this.loading = true

    let citizenId = this.textCitizenId
    let citizenCal = citizenId % 1000000
    let scoreTotal = []

    let allCitizenCal = this.getCitizenCal(citizenCal)

    localStorage.setItem('citizenId', citizenId)

    this.clearChartValue()

    let scoreSumPv = 0

    for (let i = 1000; i < 10000; i++) {
      
      for (let j = 0; j < allCitizenCal.length; j++) {
        this.totalCase++
        let score = (allCitizenCal[j] * i) % 10000
        scoreTotal.push(score)
        scoreSumPv += score

        if (score == 0) {
          this.getZeroSet.push(i)
        }
      }
    }

    this.scoreSum = scoreSumPv
    this.scoreMean = Math.round(scoreSumPv / this.totalCase)

    let { labelTotal, rangeTotal } = this.getLabelTotalAndRangeTotal(scoreTotal)

    console.log(labelTotal)
    console.log(rangeTotal)

    this.showChart = true
    this.setChartData(labelTotal, rangeTotal)
    this.loading = false
  }

  private setChartData(labelTotal: any[], rangeTotal: any[]) {
    let canvas = this.pieChartRef.nativeElement
    let ctx = canvas.getContext('2d')
    let data = {
      labels: labelTotal,
      datasets: [
        {
          label: 'Score Distribution',
          data: rangeTotal,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'gba(54, 162, 235, 1)',
          // backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
          // borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1,
        },
      ],
    }
    if (!this.pieChart) {
      this.pieChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          tooltips: {
            callbacks: {
              label: (tooltipItem) => {
                let percent = parseFloat(tooltipItem.value) / this.totalCase
                percent = percent * 100
                return `${tooltipItem.value} (${percent.toFixed(2)}%)`
              },
            },
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  suggestedMin: 0,
                  beginAtZero: true
                },
              },
            ],
          },
        },
      })
    }
    else {
      this.pieChart.data = data
      this.pieChart.update()
    }
  }

  private getCitizenCal(citizenCal: number) {
    let allCase = []
    let citizenCalString = citizenCal.toString()
    console.log(citizenCalString)
    let position = [0, 1, 2, 3, 4, 5]
    for (let a = 0; a < 6; a++) {
      let cal = citizenCalString[position[a]]
      let positionForB = [...position]
      positionForB.splice(a, 1)
      for (let b = 0; b < 5; b++) {
        let calB = citizenCalString[positionForB[b]] + cal
        let positionForC = [...positionForB]
        positionForC.splice(b, 1)
        for (let c = 0; c < 4; c++) {
          let calC = citizenCalString[positionForC[c]] + calB
          let positionForD = [...positionForC]
          positionForD.splice(c, 1)
          for (let d = 0; d < 3; d++) {
            let calD = citizenCalString[positionForD[d]] + calC
            allCase.push(parseInt(calD))
          }
        }
      }
    }
    console.log(allCase)
    return allCase
  }

  private getLabelTotalAndRangeTotal(scoreTotal: any[]) {
    const range = this.chartLength
    const rangeMax = 10000
    let labelTotal = []
    let rangeTotal = []
    for (let i = 0; i < rangeMax; i = i + range) {
      labelTotal.push(`[${i},${i + range})`)
      rangeTotal.push(scoreTotal.filter((x) => x >= i && x < i + range).length)
    }
    return { labelTotal, rangeTotal }
  }

  clearValue(): void {
    this.textCitizenId = ''
    this.chartLength = 250
    this.showChart = false
    this.loading = false

    this.clearChartValue();

    localStorage.removeItem('citizenId')
  }

  clearChartValue(): void {
    this.getZeroSet = []
    this.totalCase = 0
    this.scoreSum = 0
    this.scoreMean = 0
  }
}
