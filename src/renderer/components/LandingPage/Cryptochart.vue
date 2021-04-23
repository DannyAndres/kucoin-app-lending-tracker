<template>
  <div id="chart">
    <apexchart ref="realtimeChartCrypto" type="candlestick" height="400" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
  var dayjs = require('dayjs')
  const API = require('kucoin-node-sdk')
  const os = require('os')
  const low = require('lowdb')
  const FileSync = require('lowdb/adapters/FileSync')
  export default {
    props: {
      symbol: {
        type: String,
        required: true,
        default: 'BTC-USDT'
      },
      period: {
        type: String,
        required: true,
        default: '4hour'
      },
      days: {
        type: Number,
        required: true,
        default: 30
      }
    },
    data () {
      return {
        viewClosed: false,
        topic: '',
        callbackId: 0,
        datafeed: null,
        seriesHash: {},
        series: [{
          name: 's-1',
          data: []
        }],
        chartOptions: {
          chart: {
            height: 350,
            type: 'candlestick',
            toolbar: {
              show: false,
              offsetX: 0,
              offsetY: 0,
              tools: {
                download: false,
                selection: false,
                zoom: false,
                zoomin: false,
                zoomout: false,
                pan: false
              },
              autoSelected: 'zoom'
            }
          },
          title: {
            text: this.symbol,
            align: 'left',
            style: {
              color: '#8b949e'
            }
          },
          tooltip: {
            enabled: true,
            theme: 'dark'
          },
          xaxis: {
            type: 'category',
            labels: {
              formatter: function (val) {
                return dayjs(val).format('DD MMM YYYY HH:mm')
              },
              style: {
                colors: '#595f65'
              }
            }
          },
          yaxis: {
            seriesName: 's-1',
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
    created () {
      // this.addAnno()
      this.fillData().then(() => {
        this.initData()
      })
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
      getKeys () {
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
            goal: 10
          }
        }).write()

        var keys = config.get('keys').value()
        return keys
      },
      async fillData () {
        API.init(this.getKeys())
        let ago = new Date()
        ago.setDate(ago.getDate() - (1 * (parseInt(this.days / 6))))
        let dates = {
          startAt: parseInt(ago.getTime() / 1000),
          endAt: parseInt((new Date()).getTime() / 1000)
        }
        const candles = await API.rest.Market.Histories.getMarketCandles(this.symbol, this.period, dates)
        if (candles.data) {
          candles.data.reverse().forEach(candle => {
            let item = {
              x: new Date(parseInt(candle[0]) * 1000),
              y: [
                parseFloat(candle[1]),
                parseFloat(candle[3]),
                parseFloat(candle[4]),
                parseFloat(candle[2])
                // open high low close
              ]
            }
            this.seriesHash[candle[0]] = item
          })
        }
      },
      async cleanGraph () {
        this.seriesHash = {}
        this.series[0].data = []
        this.$refs.realtimeChartCrypto.updateSeries([{
          data: this.series[0].data
        }], false, true)
      },
      async initData () {
        API.init(this.getKeys())

        this.datafeed = new API.websocket.Datafeed()

        this.datafeed.onClose(() => {
          console.log('ws closed, status ', this.datafeed.trustConnected)
          // if (!this.viewClosed) {
          //   this.suscribe()
          // }
        })

        this.suscribe()
      },
      suscribe () {
        this.datafeed.connectSocket()

        this.topic = `/market/candles:${this.symbol}_${this.period}`
        this.callbackId = this.datafeed.subscribe(this.topic, (message) => {
          if (message.topic === this.topic) {
            // console.log(message.data.candles[0], new Date(parseInt(message.data.candles[0])))
            var data = []
            if (message.data) {
              // {
              //   x: date,
              //   y: graphItem => open high low close
              // }
              // example {
              //   symbol: 'BTC-USDT',
              //   candles: [
              //     '1618707600', open time 0
              //     '59372.6', open price 1
              //     '59469', close price 2
              //     '59718.1', high price 3
              //     '58820.6', low price 4
              //     '364.73468704', transaction volume 5
              //     '21635679.70457891' transaction amount 6
              //   ],
              //   time: 1618710513127310300 -> server time now
              // }
              this.seriesHash[message.data.candles[0]] = {
                x: new Date(parseInt(message.data.candles[0]) * 1000),
                y: [
                  parseFloat(message.data.candles[1]),
                  parseFloat(message.data.candles[3]),
                  parseFloat(message.data.candles[4]),
                  parseFloat(message.data.candles[2])
                  // open high low close
                ]
              }
              let keysToDelete = []
              Object.keys(this.seriesHash).forEach((item, index) => {
                if (index >= (Object.keys(this.seriesHash).length - this.days)) {
                  data.push(this.seriesHash[item])
                } else {
                  keysToDelete.push(item)
                }
              })
              keysToDelete.forEach(key => {
                delete this.seriesHash[key]
              })
              this.replaceAnno(parseFloat(message.data.candles[2]), (parseFloat(message.data.candles[2]) >= parseFloat(message.data.candles[1])) ? '#2e792e' : '#b93636')
              this.series[0].data = data
              this.$refs.realtimeChartCrypto.updateSeries([{
                data: this.series[0].data
              }], false, true)
            }
          }
        })

        console.log(`subscribe id: ${this.callbackId}`)
      }
    },
    beforeDestroy () {
      // unsuscribe
      this.viewClosed = true
      this.datafeed.unsubscribe(this.topic, this.callbackId)
      console.log(`unsubscribed: ${this.topic} ${this.callbackId}`)
    },
    watch: {
      symbol () {
        console.log(`Changing to: ${this.symbol}`)
        this.chartOptions.title.text = this.symbol
        this.datafeed.unsubscribe(this.topic, this.callbackId)
        console.log(`unsubscribed: ${this.topic} ${this.callbackId}`)
        this.cleanGraph().then(() => {
          this.fillData().then(() => {
            this.initData()
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>