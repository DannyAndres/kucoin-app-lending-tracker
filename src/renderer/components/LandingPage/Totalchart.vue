<template>
  <div id="chart">
    <div class="mb-4 padding-horizontal tile is-child new-box notification-box box">
      <div class="notification-element">
        <span class="notification-number">Total balance <br><small><small>w / o accrued amount</small></small></span>
      </div>
    </div>
    <apexchart ref="realtimeChartTotal" height="400" type="line" :options="chartOptions" :series="series"></apexchart>
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
          name: 'amount',
          data: []
        }],
        chartOptions: {
          chart: {
            height: 400,
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
                return dayjs(val).format('DD MMM YYYY')
              },
              style: {
                colors: '#595f65'
              }
            }
          },
          yaxis: {
            seriesName: 'amount',
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
      updatingToast () {
        this.$buefy.snackbar.open({
          duration: 5000,
          message: `Updating <b>Total amount</b> chart data`,
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

        var total = db.get('total').value()
        var percentages = []
        var last = 0
        total.forEach(item => {
          if (item.value !== last) {
            percentages.push(item)
            last = item.value
          }
        })
        percentages = percentages.map(item => {
          return {
            x: new Date(item.date),
            y: item.value.round(3)
          }
        })
        this.replaceAnno(last.round(3), '#2e792e')
        this.series[0].data = percentages
        this.$refs.realtimeChartTotal.updateSeries([{
          data: this.series[0].data
        }], false, true)
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
.mb-4 {
  padding-bottom: 40px !important;
  border: 0px transparent !important;
}
</style>