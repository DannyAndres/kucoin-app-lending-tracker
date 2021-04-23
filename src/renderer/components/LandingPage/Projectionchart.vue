<template>
  <div id="chart">
    <div v-if="chartData.length !== 0" class="no-border padding-horizontal tile is-child new-box notification-box box">
      <div v-for="(item, index) in chartData" :key="index" class="notification-element">
        <span class="notification-number">{{ item.value }}<small><small> usdt <br>{{ item.daily }} a day<br>{{ item.percentage }}% total</small></small></span>
        <br>
        <span class="notification-text">{{ item.name }} <small><small>years</small></small></span>
      </div>
    </div>
    <div v-else class="no-border padding-horizontal tile is-child new-box notification-box box">
      <div class="notification-element">
        <span class="notification-number">Projections <br><small><small>loading ...</small></small></span>
      </div>
    </div>
    <apexchart ref="realtimeChartProjection" height="400" type="line" :options="chartOptions" :series="series"></apexchart>
    <apexchart ref="realtimeChartYears" height="400" type="line" :options="chartOptions2" :series="series2"></apexchart>
  </div>
</template>

<script>
  var dayjs = require('dayjs')
  export default {
    props: {
      apy: {
        type: Number,
        required: true,
        default: 0
      },
      days: {
        type: Number,
        required: true,
        default: 0
      },
      years: {
        type: Number,
        required: true,
        default: 0
      },
      c: {
        type: Number,
        required: true,
        default: 0
      }
    },
    data () {
      return {
        chartData: [],
        series: [{
          name: 'amount',
          data: []
        }],
        series2: [{
          name: '%',
          data: []
        },
        {
          name: 'usdt',
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
            text: 'Projection on ' + this.years + ' year with current w / o fees ' + this.apy + '% apy',
            align: 'left',
            style: {
              color: '#8b949e'
            }
          },
          annotations: {
            xaxis: []
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
        },
        chartOptions2: {
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
            text: 'Percentage earned by year',
            align: 'left',
            style: {
              color: '#8b949e'
            }
          },
          annotations: {
            xaxis: []
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
          yaxis: [
            {
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
            },
            {
              seriesName: 'usdt',
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
          ]
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
        // this.$buefy.snackbar.open({
        //   duration: 5000,
        //   message: `Updating <b>Projectio</b> chart data`,
        //   type: 'is-success',
        //   position: 'is-bottom-left',
        //   actionText: null,
        //   queue: false
        // })
        console.log('Updating Projections chart data')
      },
      initData () {
        var percentages = [{
          value: this.c,
          date: (new Date()).getTime()
        }]
        var compound = (c, r, n) => {
          return c * ((1 + (r / 100)) ** n)
        }
        var divider = 365 / this.days // for 7 days is around 52
        for (let i = 1; i <= 365 * this.years; i++) {
          // compound interest formula
          const today = new Date(percentages[i - 1].date)
          const tomorrow = new Date(percentages[i - 1].date)

          // Add 1 Day
          tomorrow.setDate(today.getDate() + 1)
          percentages.push({
            value: compound(this.c, this.apy / divider, this.years * (i / (365 * this.years)) * divider),
            date: tomorrow.getTime()
          })
        }
        this.chartData = []
        this.chartData.push({
          name: '2',
          value: compound(this.c, this.apy / divider, 2 * divider).round(1),
          daily: (compound(this.c, this.apy / divider, 2 * divider) * ((this.apy / 365) / 100)).round(2),
          percentage: (((compound(this.c, this.apy / divider, 2 * divider) * 100) / this.c) - 100).round(2)
        })
        this.chartData.push({
          name: '5',
          value: compound(this.c, this.apy / divider, 5 * divider).round(1),
          daily: (compound(this.c, this.apy / divider, 5 * divider) * ((this.apy / 365) / 100)).round(2),
          percentage: (((compound(this.c, this.apy / divider, 5 * divider) * 100) / this.c) - 100).round(2)
        })
        this.chartData.push({
          name: '10',
          value: compound(this.c, this.apy / divider, 10 * divider).round(1),
          daily: (compound(this.c, this.apy / divider, 10 * divider) * ((this.apy / 365) / 100)).round(2),
          percentage: (((compound(this.c, this.apy / divider, 10 * divider) * 100) / this.c) - 100).round(2)
        })
        this.chartData.push({
          name: '20',
          value: compound(this.c, this.apy / divider, 20 * divider).round(1),
          daily: (compound(this.c, this.apy / divider, 20 * divider) * ((this.apy / 365) / 100)).round(2),
          percentage: (((compound(this.c, this.apy / divider, 20 * divider) * 100) / this.c) - 100).round(2)
        })
        percentages = percentages.map(item => {
          return {
            x: new Date(item.date),
            y: item.value.round(3)
          }
        })

        var d = new Date()
        var year = d.getFullYear()
        var month = d.getMonth()
        var day = d.getDate()
        var final = new Date('1 Jan 2041')
        var finalYear = final.getFullYear()
        let data2 = []
        let data3 = []
        for (let i = 1; i <= 20; i++) {
          if (year + i <= finalYear) {
            data2.push({
              x: new Date(year + i, month, day),
              y: (((compound(this.c, this.apy / divider, i * divider) * 100) / this.c) - 100).round(2)
            })
            data3.push({
              x: new Date(year + i, month, day),
              y: compound(this.c, this.apy / divider, i * divider).round(2)
            })
          }
        }
        this.chartOptions.title.text = 'Projection on ' + this.years + ' year with current w / o fees ' + this.apy.round(1) + '% apy'
        this.replaceAnno(percentages[percentages.length - 1].y, '#2e792e')
        this.series[0].data = percentages
        this.$refs.realtimeChartProjection.updateSeries([{
          data: this.series[0].data
        }], false, true)
        this.series2[0].data = data2
        this.series2[1].data = data3
        this.$refs.realtimeChartYears.updateSeries([{
          data: this.series2[0].data
        }, {
          data: this.series2[1].data
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
.no-border {
  margin-bottom: 0px !important;
  border: 0px transparent !important;
}
.notification-element {
  margin-right: 13px !important;
}
.blue-button {
  background: rgba(56, 139, 253, 0.1) !important;
  color: #58a6ff !important;
}
.blue-button-2 {
  background: rgba(56, 139, 253, 0.01) !important;
  color: #58a6ff !important;
}
</style>