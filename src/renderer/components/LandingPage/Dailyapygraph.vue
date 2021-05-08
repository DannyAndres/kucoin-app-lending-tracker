<template>
  <div id="chart">
    <div class="mb-4 padding-horizontal tile is-child no-bg-box notification-box box">
      <div class="notification-element">
        <span class="notification-number">Real used APY <br><small><small>7 days w / o fees</small></small></span>
      </div>
    </div>
    <apexchart ref="realtimeChartTotal" height="300" type="line" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
  const os = require('os')
  var dayjs = require('dayjs')
  const low = require('lowdb')
  const FileSync = require('lowdb/adapters/FileSync')
  const API = require('kucoin-node-sdk')
  export default {
    data () {
      return {
        lendData: null,
        series: [{
          name: '%',
          data: []
        }],
        chartOptions: {
          chart: {
            height: 300,
            type: 'line',
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
            width: 3,
            curve: 'smooth'
          },
          title: {
            text: '%',
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
                return dayjs(val).format('DD MMM YYYY')
              },
              style: {
                colors: '#595f65'
              }
            }
          },
          yaxis: {
            seriesName: '%',
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

        this.lendData = await API.rest.Margin.BorrowAndLend.getSettledLendOrderHistory('USDT')
        if (this.lendData.data && this.lendData.data.totalPage > 1) {
          // add to this.lendData.data.items
          for (let i = 2; i <= this.lendData.data.totalPage; i++) {
            let temp = await API.rest.Margin.BorrowAndLend.getSettledLendOrderHistory('USDT', {
              currentPage: i
            })
            if (temp.data) {
              temp.data.items.forEach(item => {
                this.lendData.data.items.push(item)
              })
            }
          }
        }

        var groupData = []
        var graphData = []
        function compare (a, b) {
          if (a.settledAt < b.settledAt) {
            return -1
          }
          if (a.settledAt > b.settledAt) {
            return 1
          }
          return 0
        }

        var sorted = this.lendData.data.items.sort(compare)

        // remove hours
        sorted = sorted.map(item => {
          let temp = new Date(item.settledAt)
          item.settledAt = temp.setHours(0, 0, 0, 0)
          return item
        })

        var counterDay = new Date()
        counterDay.setHours(0, 0, 0, 0)
        counterDay.setDate(counterDay.getDate() - 365)

        for (let i = 0; i < 366; i++) {
          var copiedDate = new Date(counterDay.getTime())
          copiedDate.setDate(copiedDate.getDate() + i)
          var now = copiedDate.setHours(0, 0, 0, 0)
          var copiedDate7 = new Date(counterDay.getTime())
          copiedDate7.setDate(copiedDate7.getDate() + i + 7)
          var future = copiedDate7.setHours(0, 0, 0, 0)
          var tempArray = []
          let index = 0
          while (index < sorted.length && sorted[index].settledAt <= future) {
            if (sorted[index].settledAt >= now) {
              tempArray.push(sorted[index])
            }
            index += 1
          }
          groupData.push({
            array: tempArray,
            date: now
          })
        }

        groupData.forEach(array => {
          // graphData
          if (array.array.length !== 0) {
            var rate = 0
            array.array.forEach(item => {
              rate += (parseFloat(item.dailyIntRate) - (parseFloat(item.dailyIntRate) * 0.15))
            })
            rate = ((rate / array.array.length) * 365 * 100).round(3)
            graphData.push({
              x: new Date(array.date),
              y: rate
            })
          }
        })
        this.replaceAnno(graphData[graphData.length - 1].y, '#2e792e')
        this.series[0].data = graphData
        this.$refs.realtimeChartTotal.updateSeries([{
          data: this.series[0].data
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