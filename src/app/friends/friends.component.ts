import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import * as Chart from 'chart.js'

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
})
export class FriendsComponent implements OnInit {
  @ViewChild('pieChart') pieChartRef: ElementRef

  textCitizenId: any = ''
  citizenIdLength: number = 0
  friendsCitizenId = [
    { value: null },
  ]
  chartLength = 2000
  showChart = false
  pieChart = null
  totalCase = 0

  backgroundColor = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
  ]

  borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ]

  constructor() {}

  ngOnInit() {
    let localCitizen = localStorage.getItem('citizenId')
    if (localCitizen) {
      this.textCitizenId = localCitizen
      this.getDigitcount()
    }
  }

  clearValue() {
    this.friendsCitizenId = [{ value: null }]
    this.citizenIdLength = 0
    this.textCitizenId = ''
    this.chartLength = 2000
    this.showChart = false
    this.pieChart = null
    this.totalCase = 0
    localStorage.removeItem('citizenId')
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

  addFriends() {
    this.friendsCitizenId.push({value: null})
  }
  
  deleteFriend(index) {
    this.friendsCitizenId.splice(index, 1)
  }

  setRange(range: number) {
    this.chartLength = range
    if (!this.isDisableCalculate()) {
      this.submitCalculate()
    }
  }

  getDigitFriendCount(index) {
    if (!this.friendsCitizenId[index].value) {
      return ''
    }

    let friendCitiId = this.friendsCitizenId[index].value
    let idLength = 0

    let textCitizenIdString = friendCitiId.toString()
    if (textCitizenIdString) {
      idLength = textCitizenIdString.length
    }

    if (idLength > 13) {
      return '(เกิน)'
    } else if (idLength == 13) {
      return '(ครบ)'
    }

    return `(ขาด ${13 - idLength} หลัก)`
  }

  isDisableCalculate() {
    let isEnable = this.citizenIdLength == 13
    isEnable = isEnable && this.friendsCitizenId.length > 0
    if (!isEnable) {
      return !isEnable
    }
    for (let i = 0; i < this.friendsCitizenId.length; i++) {
      if (!this.friendsCitizenId[i].value) {
        isEnable = false
        break
      }
      if (this.friendsCitizenId[i].value.toString().length != 13) {
        isEnable = false
        break
      }
    }
    return !isEnable
  }

  submitCalculate() {
    if (!this.textCitizenId) {
      console.log('validate 1 error')
      return
    }

    let citizenId = this.textCitizenId
    let citizenCal = citizenId % 10000
    let friendsCitizenCal = []
    let scoreTotal = []
    let scoreFriends = []
    let scoreFriendsDiff = []
    let rangeFriendsTotal = []

    for (let i = 0; i < this.friendsCitizenId.length; i++) {
      friendsCitizenCal.push(this.friendsCitizenId[i].value % 10000)
      scoreFriends.push([])
      scoreFriendsDiff.push([])
      rangeFriendsTotal.push([])
    }

    // localStorage.setItem('citizenId', citizenId)

    // this.getZeroCount = 0
    // this.getZeroSet = []
    this.totalCase = 0
    // this.scoreSum = 0
    // this.scoreMean = 0

    let scoreSumPv = 0

    for (let i = 1000; i < 10000; i++) {
      // if (i % 10 == 0) continue
      this.totalCase++
      // let score = Math.round((citizenId * 10000) / j) % 10000
      let score = (citizenCal * i) % 10000
      scoreTotal.push(score)
      scoreSumPv += score

      for (let j = 0; j < friendsCitizenCal.length; j++) {
        let scoreFriend = (friendsCitizenCal[j] * i) % 1000
        scoreFriends[j].push(scoreFriend)
        scoreFriendsDiff[j].push(Math.abs(score - scoreFriend))
      }

      if (score == 0) {
        // this.getZeroCount++
        // this.getZeroSet.push(i)
      }
    }

    // this.scoreSum = scoreSumPv
    // this.scoreMean = Math.round(scoreSumPv / this.totalCase)

    const range = this.chartLength
    const rangeMax = 10000
    let labelTotal = []
    let rangeTotal = []

    for (let i = 0; i < rangeMax; i = i + range) {
      labelTotal.push(`[${i},${i + range})`)
      rangeTotal.push(scoreTotal.filter((x) => x >= i && x < i + range).length)
      for (let j = 0; j < rangeFriendsTotal.length; j++) {
        rangeFriendsTotal[j].push(
          scoreFriendsDiff[j].filter((x) => x >= i && x < i + range).length
        )
      }
    }

    console.log(labelTotal)
    console.log(rangeTotal)
    console.log(rangeFriendsTotal)

    this.showChart = true

    let datasets = []
    for (let i = 0; i < rangeFriendsTotal.length; i++) {
      datasets.push({
        label: `Friend No.${i + 1}`,
        data: rangeFriendsTotal[i],
        backgroundColor: this.backgroundColor[i % this.backgroundColor.length],
        borderColor: this.borderColor[i % this.borderColor.length],
        borderWidth: 1,
      })
    }

    let canvas = this.pieChartRef.nativeElement
    let ctx = canvas.getContext('2d')
    let data = {
      labels: labelTotal,
      datasets: datasets,
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
          scales: {
            yAxes: [
              {
                ticks: {
                  suggestedMin: 0,
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      })
    } else {
      this.pieChart.data = data
      this.pieChart.update()
    }
  }
}