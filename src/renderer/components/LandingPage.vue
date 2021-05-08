<template>
  <div id="wrapper">
    <navbar/>
    <main class="first-main">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <div class="tile is-child no-bg-box box">
              <div class="padding-horizontal tile is-child new-box notification-box box">
                <div class="notification-element">
                  <span :class="dailyColorPercentage >= 0 ? (dailyColorPercentage !== 0 ? 'green-color' : '') : 'red-color'" class="notification-number">{{ dailyColorPercentage }}%</span>
                  <span class="notification-text">Daily</span>
                </div>
                <div class="notification-element">
                  <span :class="weekColorPercentage >= 0 ? (weekColorPercentage !== 0 ? 'green-color' : '') : 'red-color'" class="notification-number">{{ weekColorPercentage }}%</span>
                  <span class="notification-text">weekly</span>
                </div>
                <div class="notification-element">
                  <span :class="monthColorPercentage >= 0 ? (monthColorPercentage !== 0 ? 'green-color' : '') : 'red-color'" class="notification-number">{{ monthColorPercentage }}%</span>
                  <span class="notification-text">Monthly</span>
                </div>
                <div class="notification-element">
                  <span :class="differencePercentage >= 0 ? (differencePercentage !== 0 ? 'green-color' : '') : 'red-color'" class="notification-number">{{ differencePercentage }}%</span>
                  <span class="notification-text">Market</span>
                </div>
              </div>
              <div class="padding-top">
                <dailychart v-if="updateGraph"/>
              </div>
            </div>
          </div>
          <div class="tile is-5 is-vertical is-parent">
            <div class="tile is-child new-box box">
              <p v-if="auth" class="subtitle text-center mb-0">
                <span>
                  <span class="span">Daily </span>{{ daily }}<small class="small">USDT</small>
                </span>
              </p>
              <p v-if="auth" class="subtitle text-center">
                <span>
                  <span class="span">Earned </span>{{ earn }}<small class="small">USDT</small>
                </span>
              </p>
              <div v-if="auth" class="self-table">
                <div class="self-item">
                  <span class="self-first">deposits</span>
                  <span class="self-second">{{ main.deposits }}</span>
                </div>
                <div class="self-item">
                  <span class="self-first">total</span>
                  <span class="self-second">{{ main.total }}</span>
                </div>
                <div class="self-item">
                  <span class="self-first">balance</span>
                  <span class="self-second">{{ main.balance }}</span>
                </div>
                <div class="self-item">
                  <span class="self-first">lent</span>
                  <span class="self-second">{{ main.lent }}</span>
                </div>
                <div class="self-item">
                  <span class="self-first">orders ( active )</span>
                  <span class="self-second">{{ lendData.data.totalNum }}</span>
                </div>
                <div class="self-item">
                  <span class="self-first">first deposit date</span>
                  <span class="self-second">{{ history['first deposit date'] }}</span>
                </div>
                <div class="self-item">
                  <span class="self-first">days since first deposit</span>
                  <span class="self-second">{{ history['days since first deposit'] }}</span>
                </div>
                <div class="self-item">
                  <span class="self-first">accrued ( w/ fees ) ( w/o fees )</span>
                  <span class="self-second">{{ earnings.accrued }} / {{ earnings.accruednofees }}</span>
                </div>
                <div class="self-item">
                  <span class="self-first">total fees</span>
                  <span class="self-second">{{ history['last payment fee'] }}</span>
                </div>
                <div class="self-item">
                  <span class="self-first">paid</span>
                  <span class="self-second">{{ earnings.paid }}</span>
                </div>
                <div class="self-item">
                  <span class="self-first">paid total percentage</span>
                  <span class="self-second">{{ earnings.percentage }}</span>
                </div>
              </div>
              <b-loading :is-full-page="isFullPage" v-model="loading" :can-cancel="true">
                <b-icon
                  class="icon-color"
                  pack="fas"
                  icon="lock"
                  size="is-large">
                </b-icon>
              </b-loading>
            </div>
            <div class="tile is-child new-box box">
              <p v-if="auth" class="subtitle">Projections <small>( w/ fees ) ( w/o fees )</small></p>
              <b-table class="table-font" v-if="auth" :data="payments" :columns="payments.length > 0 ? Object.keys(payments[0]).map(value => ({field: value, label: value, centered: true})) : []"></b-table>
              <b-loading :is-full-page="isFullPage" v-model="loading" :can-cancel="true">
                <b-icon
                    pack="fas"
                    icon="sync-alt"
                    size="is-large"
                    custom-class="fa-spin">
                </b-icon>
              </b-loading>
            </div>
          </div>
        </div>
    </main>
    <main class="second-main">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <div class="tile is-child no-bg-box box">
              <candlechart v-if="updateGraph"/>
            </div>
          </div>
          <div class="tile is-4 is-vertical is-parent">
            <div class="tile is-child new-box box">
              <p v-if="auth" class="subtitle">Market</p>
              <b-table class="table-font" v-if="auth" :data="market" :columns="market.length > 0 ? Object.keys(market[0]).map(value => ({field: value, label: value, centered: true})) : []"></b-table>
              <b-loading :is-full-page="isFullPage" v-model="loading" :can-cancel="true">
                <b-icon
                    pack="fas"
                    icon="sync-alt"
                    size="is-large"
                    custom-class="fa-spin">
                </b-icon>
              </b-loading>
            </div>
            <div class="tile is-child new-box box">
              <p v-if="auth" class="subtitle">Orders</p>
              <b-table class="table-font" v-if="auth" :data="orders" :columns="orders.length > 0 ? Object.keys(orders[0]).map(value => ({field: value, label: value, centered: true})) : []"></b-table>
              <b-loading :is-full-page="isFullPage" v-model="loading" :can-cancel="true">
                <b-icon
                    pack="fas"
                    icon="sync-alt"
                    size="is-large"
                    custom-class="fa-spin">
                </b-icon>
              </b-loading>
            </div>
          </div>
        </div>
    </main>
    <main class="second-main">
        <div class="tile is-ancestor">
          <div class="tile is-12 is-parent">
            <div class="tile is-child no-bg-box box">
              <projectionchart :c="c" :apy="apy" :days="7" :years="1" v-if="updateGraph"/>
            </div>
          </div>
        </div>
    </main>
    <main class="second-main">
        <div class="tile is-ancestor">
          <div class="tile is-12 is-parent">
            <div class="tile is-child no-bg-box box">
              <dailyapygraph v-if="updateGraph"/>
            </div>
          </div>
        </div>
    </main>
    <main v-if="cryptograph" class="second-main">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <div class="tile is-child no-bg-box box">
              <cryptochart :symbol="currentSymbol" period="4hour" :days="30"/>
            </div>
          </div>
          <div class="tile is-4 is-vertical is-parent">
            <div class="tile is-child new-box box">
              <p class="subtitle">Crypto Prices <small>( Kucoin exchange )</small></p>
              <cryptoprices :symbol="currentSymbol" @graph="changeGraph"/>
            </div>
          </div>
        </div>
    </main>
    <main class="second-main">
        <div class="tile is-ancestor">
          <div class="tile is-6 is-parent">
            <div class="tile is-child no-bg-box box">
              <apygraph v-if="updateGraph"/>
            </div>
          </div>
          <div class="tile is-6 is-parent">
            <div class="tile is-child no-bg-box box">
              <lastapygraph v-if="updateGraph"/>
            </div>
          </div>
        </div>
    </main>
    <main class="second-main">
        <div class="tile is-ancestor">
          <div class="tile is-parent">
            <div class="tile is-child no-bg-box box">
              <paygraph v-if="updateGraph"/>
            </div>
          </div>
        </div>
    </main>
  </div>
</template>

<script>
  import Navbar from './LandingPage/Navbar'
  import Candlechart from './LandingPage/Candlechart'
  import Totalchart from './LandingPage/Totalchart'
  import Apygraph from './LandingPage/Apygraph'
  import Dailygraph from './LandingPage/Dailygraph'
  import Dailyapygraph from './LandingPage/Dailyapygraph'
  import Lastapygraph from './LandingPage/Lastapygraph'
  import Paygraph from './LandingPage/Paygraph'
  import Projectionchart from './LandingPage/Projectionchart'
  import Dailychart from './LandingPage/Dailychart'
  import Cryptochart from './LandingPage/Cryptochart'
  import Cryptoprices from './LandingPage/Cryptoprices'
  const os = require('os')
  const low = require('lowdb')
  const FileSync = require('lowdb/adapters/FileSync')
  const API = require('kucoin-node-sdk')

  export default {
    name: 'landing-page',
    components: {
      Navbar,
      Candlechart,
      Totalchart,
      Apygraph,
      Dailygraph,
      Dailyapygraph,
      Paygraph,
      Lastapygraph,
      Dailychart,
      Cryptochart,
      Cryptoprices,
      Projectionchart
    },
    data () {
      return {
        currentSymbol: 'BTC-USDT',
        auth: null,
        getLends: null,
        getAccountList: null,
        depositList: null,
        lendData: null,
        marketData: null,
        repayData: null,
        activeData: null,
        main: null,
        history: null,
        earnings: null,
        payments: null,
        market: null,
        orders: null,
        dailyColorPercentage: null,
        weekColorPercentage: null,
        monthColorPercentage: null,
        differencePercentage: null,
        daily: 0,
        earn: 0,
        loading: true,
        isFullPage: false,
        pastOrders: 0,
        updateGraph: true,
        cryptograph: false,
        apy: 0,
        c: 0
      }
    },
    methods: {
      changeGraph (event) {
        if (this.currentSymbol !== event) {
          this.currentSymbol = event
        }
      },
      computeData () {
        /* eslint no-extend-native: ["error", { "exceptions": ["Number", "Date"] }] */
        Number.prototype.round = function (places) {
          return +(Math.round(this + 'e+' + places) + 'e-' + places)
        }

        Date.prototype.getWeekNumber = function () {
          var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()))
          var dayNum = d.getUTCDay() || 7
          d.setUTCDate(d.getUTCDate() + 4 - dayNum)
          var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
          return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
        }

        function getPercentageOfDailyPayment (selection, array) {
          let basket = []
          let stringDate = ''
          array.forEach(item => {
            let tempStringDate = ''
            let a = new Date(item.date)
            a.setHours(0)
            a.setMinutes(0)
            a.setSeconds(0)
            if (selection === 'day') {
              tempStringDate = (a.getUTCDate()) + '-' + (a.getUTCMonth() + 1) + '-' + (a.getUTCFullYear())
            } else if (selection === 'week') {
              tempStringDate = (a.getWeekNumber()) + '-' + (a.getUTCFullYear())
            } else if (selection === 'month') {
              tempStringDate = (a.getUTCMonth() + 1) + '-' + (a.getUTCFullYear())
            }
            if (tempStringDate !== stringDate) {
              basket.push([])
              basket[basket.length - 1].push(item)
              stringDate = tempStringDate
            } else {
              basket[basket.length - 1].push(item)
            }
          })

          if (basket.length === 0 || basket.length === 1) {
            return 0
          } else {
            let first = basket[basket.length - 2][basket[basket.length - 2].length - 1]
            let last = basket[basket.length - 1][basket[basket.length - 1].length - 1]
            let output = ((last.value * 100) / first.value) - 100
            return output
          }
        }

        function getDate (miliseconds) {
          Number.prototype.padLeft = function (base, chr) {
            var len = (String(base || 10).length - String(this).length) + 1
            return len > 0 ? new Array(len).join(chr || '0') + this : this
          }
          var d = new Date()
          if (miliseconds != null) {
            d = new Date(miliseconds)
          }
          let month = (d.getMonth() + 1).padLeft()
          let day = d.getDate().padLeft()
          var dformat = [day,
            month,
            d.getFullYear()].join('/') + ' ' +
                    [d.getHours().padLeft(),
                      d.getMinutes().padLeft(),
                      d.getSeconds().padLeft()].join(':')
          return dformat
        }

        let coin = 'USDT'
        let lended = 0
        let accrued = 0
        let dailyPercentage = 0
        let orders = {
          'total orders lent': 0,
          '7 days': {
            quantity: this.lendData.data.items.filter(item => item.term === 7).length.toString(),
            dates: []
          },
          '14 days': {
            quantity: this.lendData.data.items.filter(item => item.term === 14).length.toString(),
            dates: []
          },
          '28 days': {
            quantity: this.lendData.data.items.filter(item => item.term === 28).length.toString(),
            dates: []
          }
        }
        let market = []

        const accountCoin = this.getAccountList.data.find(item => item.currency === coin)
        const balance = parseFloat(accountCoin.balance)

        this.lendData.data.items.forEach(item => {
          accrued += parseFloat(item.accruedInterest)
          dailyPercentage += parseFloat(item.dailyIntRate)
          if (item.term === 7) {
            if (orders['7 days'].dates.length === 0) {
              orders['7 days'].dates.push(getDate(item.maturityTime))
            }
          }
          if (item.term === 14) {
            if (orders['14 days'].dates.length === 0) {
              orders['14 days'].dates.push(getDate(item.maturityTime))
            }
          }
          if (item.term === 28) {
            if (orders['28 days'].dates.length === 0) {
              orders['28 days'].dates.push(getDate(item.maturityTime))
            }
          }
        })

        dailyPercentage = dailyPercentage / this.lendData.data.items.length

        let first = this.marketData.data.find(item => item.term === 7)
        market.push({
          days: 7,
          percentage: (parseFloat(first.dailyIntRate) * 100).round(3) + '%',
          amount: first.size,
          apy: (parseFloat(first.dailyIntRate) * 100 * 365).round(3) + '%'
        })
        let second = this.marketData.data.find(item => item.term === 14)
        market.push({
          days: 14,
          percentage: (parseFloat(second.dailyIntRate) * 100).round(3) + '%',
          amount: second.size,
          apy: (parseFloat(second.dailyIntRate) * 100 * 365).round(3) + '%'
        })
        let third = this.marketData.data.find(item => item.term === 28)
        market.push({
          days: 28,
          percentage: (parseFloat(third.dailyIntRate) * 100).round(3) + '%',
          amount: third.size,
          apy: (parseFloat(third.dailyIntRate) * 100 * 365).round(3) + '%'
        })
        var firstDeposit = {}
        this.activeData.data.items.forEach(item => {
          if (item.currency === coin) {
            lended += (parseFloat(item.size) - parseFloat(item.repaid))
          }
        })
        lended = -1 * lended
        let coinDeposits = this.depositList.data.items.filter(item => item.currency === 'USDT')
        firstDeposit = coinDeposits[coinDeposits.length - 1]
        this.getLends.data.items.forEach(item => {
          if (
            item.currency === coin
          ) {
            if (item.bizType === 'Loans Repaid' && item.accountType === 'MAIN' && item.currency === coin) {
              // lended += parseFloat(item.amount)
              orders['total orders lent'] += 1
            }
            // if (item.bizType === 'Loans' && item.accountType === 'MAIN' && item.currency === coin) {
            //   lended -= parseFloat(item.amount)
            // }
          }
        })

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

        db.set('updated_at', new Date().getTime()).write()

        db.get('percentages')
          .push({
            value: (parseFloat(first.dailyIntRate) * 100 * 365),
            date: new Date().getTime()
          })
          .write()

        db.get('data')
          .push({
            value: ((-1 * lended) * dailyPercentage),
            date: new Date().getTime()
          })
          .write()

        // var accruedDB = db.get('accrued').value()
        // if (accrued < parseFloat(accruedDB.value)) {
        //   // I got paid
        //   db.get('payments')
        //     .push({
        //       value: parseFloat(accruedDB.value) - accrued,
        //       date: accruedDB.date
        //     })
        //     .write()
        // }
        // db.set('accrued', {
        //   value: accrued,
        //   date: new Date().getTime()
        // }).write()

        let repaidTotal = 0
        let moneyBackTotal = 0
        let originalSize = 0
        // let rateMedium = 0
        this.repayData.data.items.forEach(item => {
          repaidTotal += parseFloat(item.interest)
          moneyBackTotal += parseFloat(item.repaid)
          originalSize += parseFloat(item.size)
          // rateMedium += parseFloat(item.dailyIntRate)
        })
        // rateMedium = rateMedium / repayData.data.items.length

        this.main = {
          coin: coin,
          deposits: (((balance - lended) - (moneyBackTotal - originalSize)).round(3)).toString(),
          total: ((balance - lended).round(3)).toString(),
          balance: (balance.round(3)).toString(),
          lent: ((-1 * lended).round(3)).toString(),
          'total past orders lent': orders['total orders lent'],
          'active orders': this.lendData.data.totalNum
        }

        db.get('total')
          .push({
            value: (balance - lended),
            date: new Date().getTime()
          })
          .write()

        this.c = (balance - lended)

        this.history = {
          'first deposit date': getDate(firstDeposit.createdAt),
          'days since first deposit': (((new Date().getTime()) - firstDeposit.createdAt) / (1000 * 60 * 60 * 24)).round(3),
          'last payment fee': ((repaidTotal - (moneyBackTotal - originalSize)).round(3)).toString()
        }

        this.earnings = {
          accrued: (accrued.round(3)).toString(),
          accruednofees: ((accrued - (accrued * 0.15)).round(3)).toString(),
          paid: ((moneyBackTotal - originalSize).round(3)).toString(),
          percentage: ((((moneyBackTotal - originalSize) + (accrued - (accrued * 0.15))) * 100) / ((balance - lended) - (moneyBackTotal - originalSize))).round(3).toString() + '%'
        }

        this.payments = [
          {
            name: 'daily',
            days: '1',
            amount: (((-1 * lended) * dailyPercentage).round(3)).toString() + ' / ' + ((((-1 * lended) * dailyPercentage) - (((-1 * lended) * dailyPercentage) * 0.15)).round(3)).toString(),
            percentage: ((dailyPercentage * 100).round(3)).toString() + '%' + ' / ' + (((dailyPercentage * 100) - ((dailyPercentage * 100) * 0.15)).round(3)).toString() + '%'
          },
          {
            name: 'weekly',
            days: '7',
            amount: ((((-1 * lended) * dailyPercentage) * 7).round(3)).toString() + ' / ' + (((((-1 * lended) * dailyPercentage) * 7) - (((((-1 * lended) * dailyPercentage) * 7)) * 0.15)).round(3)).toString(),
            percentage: ((dailyPercentage * 7 * 100).round(3)).toString() + '%' + ' / ' + (((dailyPercentage * 7 * 100) - (((dailyPercentage * 7 * 100)) * 0.15)).round(3)).toString() + '%'
          },
          {
            name: 'monthly',
            days: '30',
            amount: ((((-1 * lended) * dailyPercentage) * 30).round(2)).toString() + ' / ' + (((((-1 * lended) * dailyPercentage) * 30) - ((((-1 * lended) * dailyPercentage) * 30) * 0.15)).round(2)).toString(),
            percentage: ((dailyPercentage * 30 * 100).round(2)).toString() + '%' + ' / ' + (((dailyPercentage * 30 * 100) - ((dailyPercentage * 30 * 100) * 0.15)).round(2)).toString() + '%'
          },
          {
            name: 'yearly',
            days: '365',
            amount: ((((-1 * lended) * dailyPercentage) * 365).round(1)).toString() + ' / ' + (((((-1 * lended) * dailyPercentage) * 365) - ((((-1 * lended) * dailyPercentage) * 365) * 0.15)).round(1)).toString(),
            percentage: ((dailyPercentage * 365 * 100).round(1)).toString() + '%' + ' / ' + (((dailyPercentage * 365 * 100) - ((dailyPercentage * 365 * 100) * 0.15)).round(1)).toString() + '%'
          }
        ]

        let totalDailyInRate = 0
        this.repayData.data.items.forEach(lend => {
          totalDailyInRate += ((parseFloat(lend.dailyIntRate) - (parseFloat(lend.dailyIntRate) * 0.15)) * 100 * 365)
        })
        totalDailyInRate = (totalDailyInRate / this.repayData.data.items.length).round(3)
        // current -> this.apy = ((dailyPercentage * 365 * 100) - ((dailyPercentage * 365 * 100) * 0.15))
        // average from past lending
        this.apy = totalDailyInRate

        this.market = market

        this.orders = [
          {
            days: 7,
            quantity: parseInt(orders['7 days'].quantity),
            'last date': orders['7 days'].dates
          },
          {
            days: 14,
            quantity: parseInt(orders['14 days'].quantity),
            'last date': orders['14 days'].dates
          },
          {
            days: 28,
            quantity: parseInt(orders['28 days'].quantity),
            'last date': orders['28 days'].dates
          }
        ]

        this.pastOrders = orders['total orders lent']
  
        var dataDB = db.get('data').value()
  
        var dailyColorPercentage = getPercentageOfDailyPayment('day', dataDB)
        var weekColorPercentage = getPercentageOfDailyPayment('week', dataDB)
        var monthColorPercentage = getPercentageOfDailyPayment('month', dataDB)

        if (Math.abs(dailyColorPercentage) < 0.00001) {
          this.dailyColorPercentage = 0
        } else {
          this.dailyColorPercentage = dailyColorPercentage.round(3)
        }

        if (Math.abs(weekColorPercentage) < 0.00001) {
          this.weekColorPercentage = 0
        } else {
          this.weekColorPercentage = weekColorPercentage.round(3)
        }

        if (Math.abs(monthColorPercentage) < 0.00001) {
          this.monthColorPercentage = 0
        } else {
          this.monthColorPercentage = monthColorPercentage.round(3)
        }

        let myNumber = (dailyPercentage * 100)
        let marketNumber = (parseFloat(first.dailyIntRate) * 100)
        let differencePercentage = (((marketNumber * 100) / myNumber) - 100)
        this.differencePercentage = differencePercentage.round(3)
        if (isNaN(this.differencePercentage)) {
          this.differencePercentage = 0
        }

        this.daily = (((((-1 * lended) * dailyPercentage)) - ((((-1 * lended) * dailyPercentage)) * 0.15)).round(2)).toString()
        this.earn = (((moneyBackTotal - originalSize) + (this.earnings.accrued - (this.earnings.accrued * 0.15))).round(2)).toString()
        this.$store.dispatch('updategraph').then(() => {
          this.$store.dispatch('stopgraph')
        })
      },
      open (link) {
        this.$electron.shell.openExternal(link)
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
            goal: 10,
            cryptograph: false
          }
        }).write()

        var keys = config.get('keys').value()
        var settings = config.get('settings').value()
        this.cryptograph = settings.cryptograph
        return keys
      },
      async checkKeys (keys) {
        this.$buefy.snackbar.open({
          duration: 5000,
          message: `Updating <b>Kucoin</b> data`,
          type: 'is-success',
          position: 'is-bottom-left',
          actionText: null,
          queue: false
        })
        if (this.auth) {
          try {
            this.getLends = await API.rest.User.Account.getAccountLedgers()
            this.getAccountList = await API.rest.User.Account.getAccountsList()
            this.depositList = await API.rest.User.Deposit.getDepositList()
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
            this.marketData = await API.rest.Margin.BorrowAndLend.getLendingMarketData('USDT')
            this.repayData = await API.rest.Margin.BorrowAndLend.getSettledLendOrderHistory('USDT', {})
            if (this.repayData.data && this.repayData.data.totalPage > 1) {
              // add to this.repayData.data.items
              for (let i = 2; i <= this.repayData.data.totalPage; i++) {
                let temp = await API.rest.Margin.BorrowAndLend.getSettledLendOrderHistory('USDT', {
                  currentPage: i
                })
                if (temp.data) {
                  temp.data.items.forEach(item => {
                    this.repayData.data.items.push(item)
                  })
                }
              }
            }
            this.activeData = await API.rest.Margin.BorrowAndLend.getActiveLendOrdersList()
            this.computeData()
          } catch (error) {
            console.log(error)
            this.auth = false
          }
          return
        }
        if (keys.apiAuth && keys.apiAuth.key !== '' && keys.apiAuth.secret !== '' && keys.apiAuth.passphrase !== '') {
          API.init(keys)
          try {
            this.getLends = await API.rest.User.Account.getAccountLedgers()
            this.getAccountList = await API.rest.User.Account.getAccountsList()
            this.depositList = await API.rest.User.Deposit.getDepositList()
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
            this.marketData = await API.rest.Margin.BorrowAndLend.getLendingMarketData('USDT')
            this.repayData = await API.rest.Margin.BorrowAndLend.getSettledLendOrderHistory('USDT', {})
            if (this.repayData.data && this.repayData.data.totalPage > 1) {
              // add to this.repayData.data.items
              for (let i = 2; i <= this.repayData.data.totalPage; i++) {
                let temp = await API.rest.Margin.BorrowAndLend.getSettledLendOrderHistory('USDT', {
                  currentPage: i
                })
                if (temp.data) {
                  temp.data.items.forEach(item => {
                    this.repayData.data.items.push(item)
                  })
                }
              }
            }
            this.activeData = await API.rest.Margin.BorrowAndLend.getActiveLendOrdersList()
            this.auth = true
            this.$buefy.snackbar.open({
              duration: 5000,
              message: `Authentication Success`,
              type: 'is-success',
              position: 'is-bottom-left',
              actionText: null,
              queue: false
            })
            this.computeData()
          } catch (error) {
            console.log(error)
            this.auth = false
          }
        } else {
          this.auth = false
          this.$buefy.snackbar.open({
            duration: 10000,
            message: `Authentication Failed`,
            type: 'is-danger',
            position: 'is-bottom-left',
            actionText: null,
            queue: false
          })
        }
      }
    },
    watch: {
      update () {
        if (this.update) {
          this.checkKeys(this.getKeys())
        }
      },
      auth () {
        this.loading = !this.auth
      }
    },
    computed: {
      interval () {
        return this.$store.getters.getInterval
      },
      update () {
        return this.$store.getters.getUpdate
      }
    }
  }
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  body { font-family: 'Roboto', sans-serif; }

  .divider {
    border-bottom: 1px solid #30363d !important;
    width: 80%;
  }

  #wrapper {
    background: #0d1117;
    width: 100vw;
    min-height: 100vh;
  }

  main {
    padding: 20px;
  }

  .text-center {
    text-align: center;
    width: 100%;
    .first-center {
      margin-right: 15px;
    }
    .small {
      color: rgba(#FFFFFF, 0.5);
      margin-left: 5px;
      font-size: 10px;
    }
    span .span {
      font-weight: 100;
      color: rgba(#FFFFFF, 0.5);
    }
  }

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
        color: rgba(#FFFFFF, 0.6) !important;
        font-weight: 200 !important;
      }
      .self-first {
        color: rgba(#FFFFFF, 0.6) !important;
      }
    }
  }

  .subtitle {
    color: rgba(#FFFFFF, 0.5) !important;
    small {
      color: rgba(#FFFFFF, 0.3) !important;
      font-size: 11px !important;
    }
  }

  .first-main {
    padding-top: 90px !important;
  }

  .second-main {
    padding-top: 5px !important;
  }

  .icon-color {
    color: #7c7c7c !important;
  }

  .center-box {
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    .title {
      color: rgba(#FFFFFF, 0.8);
    }
    .icon {
      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;
      align-items: center !important;
      width: 100%;
    }
  }

  .table-font {
    font-size: 12px !important;
  }

  .table-font {
    /deep/ table.table {
      padding: 0px;
      border: 0px !important;
      background-color: transparent;
    }
    tr {
      color: rgba(#FFFFFF, 0.6) !important;
      font-weight: 200 !important;
    }
    th {
      border-width: 0px !important;
    }
    .th-wrap {
      color: rgba(#FFFFFF, 0.6) !important;
    }
    td {
      border-color: #30363d !important;
    }
  }

  .new-box {
    background: #161c22 !important;
    box-shadow: none !important;
    border: 1px solid #30363d !important;
    position: relative;
    overflow: hidden;
  }

  .no-bg-box {
    border: 1px solid #30363d !important;
    background: #0d1117 !important;
    box-shadow: none !important;
  }

  .padding-top {
    padding-top: 60px;
  }

  .padding-horizontal {
    padding: 1.25rem 2rem !important;
  }

  .notification-box {
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: center !important;
    .notification-item {
      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;
      align-items: center !important;
    }
    .notification-text {
      color: rgba(#FFFFFF, 0.6);
    }

    .notification-number {
      color: rgba(#FFFFFF, 0.3);
    }
  }

  .green-color {
    color: rgb(46, 121, 46) !important;
  }

  .red-color {
    color: rgb(185, 54, 54) !important;
  }
</style>
