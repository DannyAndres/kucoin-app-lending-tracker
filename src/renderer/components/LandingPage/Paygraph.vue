<template>
  <div id="chart">
    <div class="mb-4 padding-horizontal tile is-child no-bg-box notification-box box">
      <div class="notification-element">
        <span class="notification-number">Money return<br><small><small> by date</small></small></span>
      </div>
    </div>
    <apexchart ref="realtimeChartTotal" height="450" type="bar" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
  const os = require('os')
  const low = require('lowdb')
  const FileSync = require('lowdb/adapters/FileSync')
  const API = require('kucoin-node-sdk')
  export default {
    data () {
      return {
        lendData: null,
        series: [{
          name: 'USDT',
          data: []
        }, {
          name: 'Accrued w / o fees',
          data: []
        }],
        chartOptions: {
          chart: {
            height: 450,
            type: 'bar',
            toolbar: {
              show: true,
              offsetX: 0,
              offsetY: 0,
              tools: {
                download: false,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: false
              },
              autoSelected: 'zoom'
            }
          },
          stroke: {
            width: 2,
            curve: 'smooth'
          },
          title: {
            text: 'USDT',
            align: 'left',
            style: {
              color: '#8b949e'
            }
          },
          annotations: {
            xaxis: [
              // {
              //   x: '12 Apr 2021',
              //   borderColor: '#2e792e',
              //   label: {
              //     borderColor: '#2e792e',
              //     style: {
              //       fontSize: '12px',
              //       color: '#dedede',
              //       background: '#161c22'
              //     },
              //     orientation: 'horizontal',
              //     offsetY: 7,
              //     text: 'Annotation Test'
              //   }
              // }
            ]
          },
          tooltip: {
            enabled: true,
            theme: 'dark'
          },
          xaxis: {
            type: 'category',
            labels: {
              formatter: function (val) {
                return val
              },
              minHeight: 160,
              style: {
                colors: '#595f65'
              }
            }
          },
          yaxis: {
            seriesName: 'USDT',
            opposite: true,
            tooltip: {
              enabled: true
            },
            labels: {
              style: {
                colors: '#595f65'
              }
            }
          }
        }
      }
    },
    methods: {
      addAnno () {
        this.chartOptions = {
          ...this.chartOptions,
          ...{
            annotations: {
              yaxis: [
                {
                  y: 0,
                  marker: {
                    size: 8,
                    fillColor: '#fff',
                    strokeColor: 'red',
                    radius: 2
                  },
                  label: {
                    borderColor: '#FF4560',
                    offsetY: 0,
                    style: {
                      color: '#fff',
                      background: '#FF4560'
                    },

                    text: '0'
                  }
                }
              ]
            }
          }
        }
      },
      replaceAnno (amount, color) {
        this.chartOptions = {
          ...this.chartOptions,
          ...{
            annotations: {
              yaxis: [
                {
                  y: amount,
                  // y2: amount + 1000,
                  strokeDashArray: 1,
                  offsetX: 0,
                  borderColor: color,
                  fillColor: color,
                  width: '100%',
                  label: {
                    borderColor: color,
                    textAnchor: 'start',
                    position: 'right',
                    offsetX: 0,
                    offsetY: 0,
                    borderWidth: 1,
                    borderRadius: 2,
                    style: {
                      color: '#fff',
                      background: color
                    },
                    text: amount.toString()
                  }
                }
              ]
            }
          }
        }
      },
      async initData () {
        const adapter = new FileSync(os.homedir() + '/config.json')
        const config = low(adapter)

        config.defaults({
          keys: {
            baseUrl: 'https://api.kucoin.com',
            apiAuth: {
              key: '',
              secret: '',
              passphrase: ''
            },
            authVersion: 2
          },
          settings: {
            update: 5,
            goal: 10,
            cryptograph: false
          }
        }).write()

        var keys = config.get('keys').value()
        API.init(keys)

        this.lendData = await API.rest.Margin.BorrowAndLend.getActiveLendOrdersList('USDT')
        if (this.lendData.data && this.lendData.data.totalPage > 1) {
          // add to this.lendData.data.items
          for (let i = 2; i <= this.lendData.data.totalPage; i++) {
            let temp = await API.rest.Margin.BorrowAndLend.getActiveLendOrdersList('USDT', {
              currentPage: i
            })
            if (temp.data) {
              temp.data.items.forEach(item => {
                this.lendData.data.items.push(item)
              })
            }
          }
        }

        var graphData = []
        var graphData2 = []
        var hashData = []
        var sumData = []
        var apyData = []
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        function compare (a, b) {
          if (a.maturityTime < b.maturityTime) {
            return -1
          }
          if (a.maturityTime > b.maturityTime) {
            return 1
          }
          return 0
        }
        if (this.lendData.data && this.lendData.data.items) {
          this.lendData.data.items.sort(compare).forEach(lend => {
            let year = new Date(lend.maturityTime).getFullYear()
            let month = new Date(lend.maturityTime).getUTCMonth()
            let day = new Date(lend.maturityTime).getDate()
            if ((day + '/' + monthNames[month] + '/' + year) in hashData) {
              hashData[day + '/' + monthNames[month] + '/' + year].push(parseFloat(lend.dailyIntRate))
            } else {
              hashData[day + '/' + monthNames[month] + '/' + year] = [parseFloat(lend.dailyIntRate)]
            }
            if (graphData.length === 0 || day + '/' + monthNames[month] + '/' + year !== graphData[graphData.length - 1].x) {
              // create a new one
              graphData.push({
                x: day + '/' + monthNames[month] + '/' + year,
                y: parseFloat(lend.size) + (parseFloat(lend.accruedInterest) - (parseFloat(lend.accruedInterest) * 0.15)) - (parseFloat(lend.repaid))
              })
              graphData2.push({
                x: day + '/' + monthNames[month] + '/' + year,
                y: (parseFloat(lend.accruedInterest) - (parseFloat(lend.accruedInterest) * 0.15))
              })
            } else {
              graphData[graphData.length - 1] = {
                x: graphData[graphData.length - 1].x,
                y: graphData[graphData.length - 1].y + (parseFloat(lend.size) + (parseFloat(lend.accruedInterest) - (parseFloat(lend.accruedInterest) * 0.15)) - (parseFloat(lend.repaid)))
              }
              graphData2[graphData2.length - 1] = {
                x: graphData2[graphData2.length - 1].x,
                y: graphData2[graphData2.length - 1].y + (parseFloat(lend.accruedInterest) - (parseFloat(lend.accruedInterest) * 0.15))
              }
            }
          })
        }

        Object.keys(hashData).forEach(key => {
          let value = hashData[key]
          let sum = 0
          value.forEach(rate => {
            sum += ((rate - (rate * 0.15)) * 100)
          })
          sumData[key] = (sum / value.length).round(3) + '%'
          apyData[key] = ((sum / value.length) * 365).round(3) + '%'
        })

        graphData = graphData.map(lend => {
          return {
            x: lend.x + ' - ' + sumData[lend.x] + ' - ' + apyData[lend.x] + ' apy',
            y: (lend.y).round(3)
          }
        })

        graphData2 = graphData2.map(lend => {
          return {
            x: lend.x + ' - ' + sumData[lend.x] + ' - ' + apyData[lend.x] + ' apy',
            y: (lend.y).round(3)
          }
        })

        this.series[0].data = graphData
        // this.$refs.realtimeChartTotal.updateSeries([{
        //   data: this.series[0].data
        // }], false, true)
        this.series[1].data = graphData2
        this.$refs.realtimeChartTotal.updateSeries([{
          data: this.series[0].data
        }, {
          data: this.series[1].data
        }], false, true)
      }
    },
    watch: {
      update () {
        if (this.update) {
          this.initData()
        }
      }
    },
    computed: {
      interval () {
        return this.$store.getters.getInterval
      },
      update () {
        return this.$store.getters.getUpdategraph
      }
    }
  }
</script>

<style lang="scss" scoped>
.mb-4 {
  padding-bottom: 40px !important;
  border: 0px transparent !important;
}
</style>