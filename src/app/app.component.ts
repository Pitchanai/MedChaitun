import { Component, ViewChild, ElementRef } from '@angular/core'
import * as Chart from 'chart.js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('pieChart') pieChartRef: ElementRef

  title = 'app'
  textCitizenId: any = ''
  citizenIdLength = 0
  chartLength = 250
  showChart = false
  pieChart = null
  totalCase = 0
  getZeroCount = 0
  getZeroSet = []
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

  getDigitcount() {
    let idLength = 0
    if (!this.textCitizenId) {
      return ''
    }

    let textCitizenIdString = this.textCitizenId.toString()
    if (textCitizenIdString) {
      idLength = textCitizenIdString.length
    }

    this.citizenIdLength = idLength

    if (this.citizenIdLength > 13) {
      return '(เกิน)'
    } else if (this.citizenIdLength == 13) {
      return '(ครบ)'
    }

    return `(ขาด ${13 - this.citizenIdLength} หลัก)`
  }

  isDisableCalculate() {
    return !(this.citizenIdLength == 13)
    // return true
  }

  setRange(range: number) {
    this.chartLength = range
    if (!this.isDisableCalculate()) {
      this.submitCalculate()
    }
  }

  submitCalculate() {
    if (!this.textCitizenId) {
      console.log('validate 1 error')
      return
    }

    let citizenId = this.textCitizenId
    let scoreTotal = []

    this.getZeroCount = 0
    this.getZeroSet = []

    for (let i = 101; i < 1000; i++) {
      if (i % 10 == 0) continue
      this.totalCase++
      let j = i / 10
      // if (j.toPrecision(3).includes('0')) continue
      let score = Math.round((citizenId * 10000) / j) % 10000
      scoreTotal.push(score)

      if (score == 0) {
        this.getZeroCount++
        this.getZeroSet.push(j)
      }
    }

    const range = this.chartLength
    const rangeMax = 10000
    let labelTotal = []
    let rangeTotal = []

    for (let i = 0; i < rangeMax; i = i + range) {
      labelTotal.push(`[${i},${i+range})`)
      rangeTotal.push(scoreTotal.filter((x) => x >= i && x < i + range).length)
    }

    console.log(labelTotal)
    console.log(rangeTotal)

    this.showChart = true

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
              label: (tooltipItem, data) => {
                let percent = parseFloat(tooltipItem.value) / this.totalCase
                percent = percent * 100

                return `${tooltipItem.value} (${percent.toFixed(2)}%)`
              },
            },
          },
        },
      }) 
    } else {
      this.pieChart.data = data
      this.pieChart.update()
    }
  }
}
