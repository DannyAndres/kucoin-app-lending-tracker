<template>
  <div id="chart">
    <apexchart ref="realtimeChartDaily" type="candlestick" height="500" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
  var dayjs = require('dayjs')
  const os = require('os')
  const low = require('lowdb')
  const FileSync = require('lowdb/adapters/FileSync')
  export default {
    data () {
      return {
        series: [{
          name: 's-1',
          data: []
        }],
        chartOptions: {
          chart: {
            height: 500,
            type: 'candlestick',
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
          title: {
            text: 'Recorded Daily earnings w/ fees',
            align: 'left',
            style: {
              color: '#8b949e'
            }
          },
          annotations: {
            xaxis: [
              // {
              //   x: '06 Oct 2018',
              //   borderColor: '#00E396',
              //   label: {
              //     borderColor: '#00E396',
              //     style: {
              //       fontSize: '12px',
              //       color: '#fff',
              //       background: '#00E396'
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
            opposite: true,
            seriesName: 's-1',
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
      updatingToast () {
        this.$buefy.snackbar.open({
          duration: 5000,
          message: `Updating <b>Daily earnings</b> chart data`,
          type: 'is-success',
          position: 'is-bottom-left',
          actionText: null,
          queue: false
        })
      },
      initData () {
        const adapter = new FileSync(os.homedir() + '/db.json')
        const db = low(adapter)

        db.defaults({
          data: [],
          updated_at: 0,
          percentages: [],
          total: [],
          accrued: {
            value: 0,
            date: 0
          },
          payments: []
        }).write()

        var percentages = db.get('data').value()
        var percentagesTemp = this.reOrderData(percentages)
        if (percentagesTemp.length > 365) {
          percentages = []
          percentagesTemp.forEach((item, index) => {
            if (index >= (percentagesTemp.length - 365)) {
              percentages.push(item)
            }
          })
        } else {
          percentages = percentagesTemp
        }
        if (percentages.length > 0) {
          // open high low close
          var last = percentages[percentages.length - 1].y
          this.replaceAnno(last[3], (last[3] >= last[0]) ? '#2e792e' : '#b93636')
        }
        this.series[0].data = percentages
        this.$refs.realtimeChartDaily.updateSeries([{
          data: this.series[0].data
        }], false, true)
      },
      reOrderData (array) {
        var roundNumber = function (number, places) {
          return +(Math.round(number + 'e+' + places) + 'e-' + places)
        }

        let basket = []
        let stringDate = ''
        array.forEach(item => {
          let tempStringDate = ''
          let a = new Date(item.date)
          a.setHours(0)
          a.setMinutes(0)
          a.setSeconds(0)
          tempStringDate = (a.getUTCDate()) + '-' + (a.getUTCMonth() + 1) + '-' + (a.getUTCFullYear())
          if (tempStringDate !== stringDate) {
            basket.push([])
            basket[basket.length - 1].push(item)
            stringDate = tempStringDate
          } else {
            basket[basket.length - 1].push(item)
          }
        })
  
        // basket is now an array of all the values per day
        var output = []
  
        basket.forEach(item => {
          // open high low close
          let date = null
          let graphItem = [0, 0, null, 0]
          item.forEach((value, index) => {
            // open
            if (index === 0) {
              graphItem[0] = value.value
              date = new Date(value.date)
            }
            // close
            if (index === item.length - 1) {
              graphItem[3] = value.value
            }
            // high
            if (graphItem[1] < value.value) {
              graphItem[1] = value.value
            }
            // low
            if (graphItem[2] === null || graphItem[2] > value.value) {
              graphItem[2] = value.value
            }
          })
          if (graphItem[2] === null) {
            graphItem[2] = 0
          }
          if (date === null) {
            date = new Date(0)
          }
          graphItem = graphItem.map(e => {
            e = roundNumber(e, 3)
            return e
          })
          output.push({
            x: date,
            y: graphItem
          })
        })

        return output
      }
    },
    watch: {
      update () {
        if (this.update) {
          this.updatingToast()
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
</style>