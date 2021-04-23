<template>
  <div class="self-table">
    <div v-for="(item, index) in topics" :key="index" class="self-item">
      <a v-if="item in prices" class="self-first" @click="changeGraph(item)"><div v-if="symbol === item" class="green-dot"></div>{{ names[item] }}</a>
      <span v-if="render && item in prices" :class="directions[item] ? 'green-color' : 'red-color'" class="self-second">{{ prices[item] }} USDT</span>
    </div>
  </div>
</template>

<script>
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
      }
    },
    data () {
      return {
        topics: [
          'BTC-USDT'
          // 'ETH-USDT'
          // 'LTC-USDT',
          // 'ADA-USDT',
          // 'LINK-USDT'
        ],
        names: {
          'BTC-USDT': 'Bitcoin'
          // 'ETH-USDT': 'Ethereum'
          // 'LTC-USDT': 'Litecoin',
          // 'ADA-USDT': 'Cardano',
          // 'LINK-USDT': 'Chainlink'
        },
        prices: {},
        directions: {},
        topicsHash: {},
        callbackId: {},
        datafeed: null,
        render: true,
        viewClosed: false
      }
    },
    created () {
      this.topics.forEach(topic => {
        this.prices[topic] = 0
        this.directions[topic] = true
      })
      this.initData()
    },
    methods: {
      changeGraph (symbol) {
        this.$emit('graph', symbol)
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
      initData () {
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

        this.topics.forEach(topic => {
          this.topicsHash[topic] = `/market/ticker:${topic}`
          this.callbackId[topic] = this.datafeed.subscribe(this.topicsHash[topic], (message) => {
            if (message.topic === this.topicsHash[topic]) {
              if (message.data) {
                // {
                //   sequence: '1615386083070',
                //   bestAsk: '59142.8',
                //   size: '0.00074139',
                //   bestBidSize: '0.3021197',
                //   price: '59142.7',
                //   time: 1618713393340,
                //   bestAskSize: '0.12485334',
                //   bestBid: '59142.7'
                // }
                if (topic in this.prices) {
                  if (parseFloat(message.data.price) >= this.prices[topic]) {
                    this.directions[topic] = true
                  } else {
                    this.directions[topic] = false
                  }
                } else {
                  this.directions[topic] = true
                }
                this.prices[topic] = parseFloat(message.data.price)
                this.render = false
                this.render = true
                // console.log(this.prices)
              }
            }
          })
          console.log(`subscribe id: ${this.callbackId[topic]}`)
        })
      }
    },
    beforeDestroy () {
      // unsuscribe
      this.viewClosed = true
      this.topics.forEach(topic => {
        this.datafeed.unsubscribe(this.topicsHash[topic], this.callbackId[topic])
        console.log(`unsubscribed: ${this.topicsHash[topic]} ${this.callbackId[topic]}`)
      })
    }
  }
</script>

<style lang="scss" scoped>
  .self-table {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    .self-item:last-child {
      border-bottom: 0px !important;
    }
    .self-item {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #30363d;
      padding: 3px;
      font-size: 12px !important;
      .self-second {
        // color: rgba(#FFFFFF, 0.6);
        font-weight: 200 !important;
      }
      .self-first {
        color: rgba(#FFFFFF, 0.6) !important;
        text-decoration: underline !important;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .self-first:hover {
        color: rgba(#FFFFFF, 0.3) !important;
        text-decoration: underline !important;
      }
    }
  }
  .green-color {
    color: rgb(46, 121, 46) !important;
  }

  .red-color {
    color: rgb(185, 54, 54) !important;
  }

  .green-dot {
    height: 8px;
    width: 8px;
    background-color: rgb(46, 121, 46) !important;
    border-radius: 100%;
    margin-right: 8px;
  }
</style>