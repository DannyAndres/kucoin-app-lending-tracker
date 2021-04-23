<template>
  <div id="wrapper">
    <navbar/>
    <main class="first-main">
        <div class="tile is-ancestor">
          <div class="tile is-4 is-vertical is-parent">
            <div class="tile is-child new-box box">
              <p class="subtitle">
                <span>Support the creator <small>Click to copy</small></span>
                <br>
                <small class="creator-message"><small><small>working on this app on my free time, getting to code updates very frequently, totally for free so if you want to support ;) thank you. Any suggestions will be welcome on the github repo</small></small></small>
              </p>
              <div class="self-table">
                <div class="self-item">
                  <span class="self-first">BTC</span>
                  <a @click="copyString('3Qepdqb2yADmJuosRtQ7zjqPH1ggqUwpFZ')" class="self-second link">3Qepdqb2yADmJuosRtQ7zjqPH1ggqUwpFZ</a>
                </div>
                <div class="self-item">
                  <span class="self-first">USDT</span>
                  <a @click="copyString('0x58e1a9f31485606aa4ffe2b228dd95a4f5ddcdc7')" class="self-second link">0x58e1a9f31485606aa4ffe2b228dd95a4f5ddcdc7</a>
                </div>
                <div class="self-item">
                  <span class="self-first">ETH</span>
                  <a @click="copyString('0x92345ae2fa88f72b4b5cefff8e5c8afabdbdaa53')" class="self-second link">0x92345ae2fa88f72b4b5cefff8e5c8afabdbdaa53</a>
                </div>
                <div class="self-item">
                  <span class="self-first">LTC</span>
                  <a @click="copyString('MWL9UNGwAxGnfozGX273NbvggyqmVXiCkw')" class="self-second link">MWL9UNGwAxGnfozGX273NbvggyqmVXiCkw</a>
                </div>
              </div>
            </div>
          </div>
          <div class="tile is-parent">
            <div class="tile is-child no-bg-box box">
              <h1 class="title">Settings</h1>
              <b-field label="Crypto graph (May slow down the app due to the constant real time checkout of the graph)">
                <b-checkbox v-model="cryptograph">
                  <span v-if="cryptograph">Activated</span>
                  <span v-if="!cryptograph">Not Activated</span>
                </b-checkbox>
              </b-field>
              <div class="is-divider"></div>
              <b-field label="Key">
                <b-input type="password"
                  v-model="key"
                  password-reveal>
                </b-input>
              </b-field>
              <b-field label="Secret">
                <b-input type="password"
                  v-model="secret"
                  password-reveal>
                </b-input>
              </b-field>
              <b-field label="Passphrase">
                <b-input type="password"
                  v-model="passphrase"
                  password-reveal>
                </b-input>
              </b-field>
              <div class="justify-end">
                <a @click="remove()" class="button button-danger is-dark">
                  <b-icon
                    pack="fas"
                    icon="trash"
                    size="is-small">
                  </b-icon>
                  <span class="button-text">remove credentials</span>
                </a>
                <a @click="test()" class="button button-semi-pure is-dark">
                  test credentials
                </a>
                <a @click="save()" class="button button-primary is-dark">
                  <b-icon
                    pack="fas"
                    icon="save"
                    size="is-small">
                  </b-icon>
                  <span class="button-text">save</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="tile is-ancestor">
          <div class="tile is-4 is-vertical is-parent">
            <div class="tile is-child new-box box">
              <p class="subtitle text-center">
                <span class="first-center">
                  <span class="span">Version {{ version }}</span>
                </span>
              </p>
              <p class="subtitle">
                <span>Database info</span>
                <br>
                <small class="creator-message"><small><small>The database as well as the config file are stored in the home directory, the database keeps all the records of daily payment graph also the apy graph, in case you have another copy from another computer you can import that db.json file to this section on the right. Keep in mind that the config file contains your secret keys from kucoin, because of this is important that you shut down the api from kucoin or delete this file once you uninstall the app, in case you want to keep the file and then install the app again in the future, the app will use the same files and will start as soon as it can. Again the app does not send any information to the internet except for kucoin so in any case of your keys getting leaked could mean that some third party program got to your files, in that case shut down the api from kucoin, the permissions only must be trading (for the lending information) and general (for user data), withdrawal permissions must be off to protect yourself of getting your funds stolen.</small></small></small>
              </p>
              <p class="subtitle">
                <span>What if I close the app for days or weeks?</span>
                <br>
                <small class="creator-message"><small><small>Due to security reasons all data is being processed in the same computer, avoiding sending the data to any online database at all, the kucoin data can be fetch at any moment but the graph data is data that the app itself creates over time to check the improvements of the daily payments or the apy in kucoin, at this moment in time kucoin does not offer this data to fetch and the app does not store this data anywhere else online, only in the local device.</small></small></small>
              </p>
              <p class="subtitle">
                <small class="creator-message"><small><small>If you don't open the app for more than a day, there is gonna be a gap in the graph where that corresponding day should be, is not world breaking because is gonna keep tracking the next days and in the long run will look like a small gap, but if you care a lot about this kind of information, keeping the app minimized is your best option.</small></small></small>
              </p>
            </div>
          </div>
          <div class="tile is-parent">
            <div class="tile is-child no-bg-box box">
              <h1 class="title">Advance</h1>
              <b-field class="file is-primary" :class="{'has-name': !!file}">
                <b-upload v-model="file" class="file-label">
                  <span class="file-cta button-semi-pure">
                    <b-icon class="file-icon" icon="upload"></b-icon>
                    <span class="file-label">Click to upload</span>
                  </span>
                  <span class="button-primary file-name no-border" v-if="file">
                    {{ file.name }}
                  </span>
                </b-upload>
              </b-field>
              <div class="justify-end">
                <a :disable="file === null" @click="updatedb()" class="button button-primary is-dark">
                  <b-icon
                    pack="fas"
                    icon="save"
                    size="is-small">
                  </b-icon>
                  <span class="button-text">update database</span>
                </a>
              </div>
              <div class="is-divider"></div>
              <h1 class="title">Address <small v-if="authData !== null">( red {{ authData.chain }} )</small>
                <small>
                  <b-icon
                    v-if="authData === null"
                    pack="fas"
                    icon="sync-alt"
                    size="is-small"
                    custom-class="fa-spin">
                  </b-icon>
                </small>
              </h1>
              <p class="subtitle">
                <span class="small-text">
                  This is your USDT main account address, any deposit here will appear on your auto lend balance also will appear on the deposits section.
                </span>
              </p>
              <b-field grouped>
                <b-input :value="authData !== null ? authData.address : ''" readonly expanded></b-input>
                <p class="control">
                  <b-button @click="copy()" label="Copy" type="button-primary is-dark is-primary" />
                </p>
              </b-field>
              <div class="is-divider"></div>
              <h1 class="title">Total <small v-if="depositList !== null && transferList !== null"><span> deposit + transfers = {{ fullTotal }}</span> ( {{ depositList.length + transferList.length }} )</small>
                <small>
                  <b-icon
                    v-if="depositList === null"
                    pack="fas"
                    icon="sync-alt"
                    size="is-small"
                    custom-class="fa-spin">
                  </b-icon>
                </small>
              </h1>
              <div class="is-divider"></div>
              <h1 class="title">Deposits <small v-if="depositList !== null"><span v-if="depositTotal !== null"> total {{ depositTotal }}</span> ( {{ depositList.length }} )</small>
                <small>
                  <b-icon
                    v-if="depositList === null"
                    pack="fas"
                    icon="sync-alt"
                    size="is-small"
                    custom-class="fa-spin">
                  </b-icon>
                </small>
              </h1>
              <b-table class="table-font" :data="depositList !== null ? depositList : []" :columns="( depositList !== null && depositList.length > 0) ? Object.keys(depositList[0]).map(value => ({field: value, label: value, centered: true})) : []"></b-table>
              <div class="is-divider"></div>
              <h1 class="title">Transfers <small v-if="transferList !== null"><span v-if="transferList !== null"> total {{ transferTotal }}</span> ( {{ transferList.length }} )</small>
                <small>
                  <b-icon
                    v-if="transferList === null"
                    pack="fas"
                    icon="sync-alt"
                    size="is-small"
                    custom-class="fa-spin">
                  </b-icon>
                </small>
              </h1>
              <b-table class="table-font" :data="transferList !== null ? transferList : []" :columns="( transferList !== null && transferList.length > 0) ? Object.keys(transferList[0]).map(value => ({field: value, label: value, centered: true})) : []"></b-table>
              <div class="is-divider"></div>
              <h1 class="title">Goal <span v-if="goalPercentage !== null" class="second-color">{{ goalPercentage }}%</span>
                <small>
                  <b-icon
                    v-if="goalPercentage === null"
                    pack="fas"
                    icon="sync-alt"
                    size="is-small"
                    custom-class="fa-spin">
                  </b-icon>
                </small>
              </h1>
              <p class="subtitle">
                <span class="small-text">
                  This is your goal for monthly salary with passive income, it will show you the percentage of your current monthly payment with the goal one.
                </span>
              </p>
              <b-field grouped>
                <b-input
                  v-model="goal"
                  type="number"
                  min="1">
                </b-input>
                <p class="control">
                  <b-button @click="setGoal()" label="save" type="button-primary is-dark is-primary" />
                </p>
              </b-field>
            </div>
          </div>
        </div>
    </main>
  </div>
</template>

<script>
  import Navbar from './LandingPage/Navbar'
  const os = require('os')
  const low = require('lowdb')
  const FileSync = require('lowdb/adapters/FileSync')
  const API = require('kucoin-node-sdk')
  
  export default {
    name: 'landing-page',
    components: {
      Navbar
    },
    data () {
      return {
        auth: false,
        tested: false,
        authData: null,
        loading: true,
        key: '',
        secret: '',
        passphrase: '',
        file: null,
        depositList: null,
        depositListInterval: null,
        transferList: null,
        transferListInterval: null,
        goal: 1,
        goalPercentage: null,
        goalPercentageInterval: null,
        cryptograph: false,
        version: '0.1.0-beta'
      }
    },
    created () {
      /* eslint no-extend-native: ["error", { "exceptions": ["Number", "Date"] }] */
      Number.prototype.round = function (places) {
        return +(Math.round(this + 'e+' + places) + 'e-' + places)
      }
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
      this.goal = settings.goal
      this.cryptograph = settings.cryptograph
      this.keys = keys
      this.key = keys.apiAuth.key
      this.secret = keys.apiAuth.secret
      this.passphrase = keys.apiAuth.passphrase
      this.test().then(() => {
        if (this.tested) {
          this.auth = true
        }
      })
    },
    methods: {
      setGoal () {
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
        var settings = config.get('settings').value()
        settings.goal = this.goal
        config.set('settings', settings).write()
        clearInterval(this.goalPercentageInterval)
        this.goalPercentageInterval = null
        this.saveAuthGoal()
        this.$buefy.snackbar.open({
          duration: 5000,
          message: `Saving <b>Goal</b>`,
          type: 'is-success',
          position: 'is-bottom-left',
          actionText: null,
          queue: false
        })
      },
      copy () {
        const el = document.createElement('textarea')
        let str = (this.authData !== null ? this.authData.address : '')
        el.value = str
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        this.$buefy.snackbar.open({
          duration: 5000,
          message: `<b>Copied</b> ` + str + ` to Clipboard`,
          type: 'is-success',
          position: 'is-bottom-left',
          actionText: null,
          queue: false
        })
      },
      copyString (string) {
        const el = document.createElement('textarea')
        let str = string
        el.value = str
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        this.$buefy.snackbar.open({
          duration: 5000,
          message: `<b>Copied</b> ` + str + ` to Clipboard`,
          type: 'is-success',
          position: 'is-bottom-left',
          actionText: null,
          queue: false
        })
      },
      updatedb () {
        if (this.file !== null && this.file.type === 'application/json') {
          var reader = new FileReader()
          reader.readAsText(this.file, 'UTF-8')
          reader.onload = (evt) => {
            var database = JSON.parse(evt.target.result)

            const adapter = new FileSync(os.homedir() + '/db.json')
            console.log(adapter)
            const db = low(adapter)

            db.defaults({
              data: [],
              updated_at: 0,
              percentages: [],
              accrued: {
                value: 0,
                date: 0
              },
              payments: []
            }).write()

            if (database.data && database.updated_at && database.percentages && database.accrued && database.payments) {
              db.set('data', database.data).write()
              db.set('updated_at', database.updated_at).write()
              db.set('percentages', database.percentages).write()
              db.set('accrued', database.accrued).write()
              db.set('payments', database.payments).write()

              this.$buefy.snackbar.open({
                duration: 5000,
                message: `Database <b>loaded and saved</b>`,
                type: 'is-success',
                position: 'is-bottom-left',
                actionText: null,
                queue: false
              })
            } else {
              this.$buefy.snackbar.open({
                duration: 5000,
                message: `<b>Missing</b> data on loaded json`,
                type: 'is-danger',
                position: 'is-bottom-left',
                actionText: null,
                queue: false
              })
            }
          }
          reader.onerror = function () {
            console.log('err')
          }
        }
      },
      async saveAuth () {
        API.init(this.keys)
        if (this.authData === null) {
          let authData = await API.rest.User.Deposit.getDepositAddress('USDT')
          this.authData = authData.data
        }
        if (this.depositListInterval === null) {
          const createIntervalDeposit = async () => {
            let depositList = await API.rest.User.Deposit.getDepositList({
              currency: 'USDT'
            })
            if (depositList.data && depositList.data.totalPage > 1) {
              // add to transferList.data.items
              for (let i = 2; i <= depositList.data.totalPage; i++) {
                let temp = await API.rest.User.Deposit.getDepositList({
                  currency: 'USDT'
                })
                if (temp.data) {
                  temp.data.items.forEach(item => {
                    depositList.data.items.push(item)
                  })
                }
              }
            }
            depositList = depositList.data.items
            this.depositList = depositList.map(item => {
              return {
                status: item.status,
                amount: item.amount,
                fee: item.fee,
                created: this.getDate(item.createdAt),
                updated: this.getDate(item.updatedAt)
              }
            })
          }
          createIntervalDeposit()
          this.depositListInterval = setInterval(createIntervalDeposit, 1000 * 60 * 5)
        }
        if (this.transferListInterval === null) {
          const createIntervalTransfer = async () => {
            let transferList = await API.rest.User.Account.getAccountLedgers({
              currency: 'USDT',
              bizType: 'TRANSFER',
              direction: 'in'
            })
            if (transferList.data && transferList.data.totalPage > 1) {
              // add to transferList.data.items
              for (let i = 2; i <= transferList.data.totalPage; i++) {
                let temp = await API.rest.User.Account.getAccountLedgers({
                  currency: 'USDT',
                  bizType: 'TRANSFER',
                  direction: 'in'
                })
                if (temp.data) {
                  temp.data.items.forEach(item => {
                    transferList.data.items.push(item)
                  })
                }
              }
            }
            transferList = transferList.data.items.filter(item => item.accountType === 'MAIN')
            this.transferList = transferList.map(item => {
              return {
                status: 'SUCCESS',
                amount: item.amount,
                fee: item.fee,
                created: this.getDate(item.createdAt),
                updated: this.getDate(item.createdAt)
              }
            })
          }
          createIntervalTransfer()
          this.transferListInterval = setInterval(createIntervalTransfer, 1000 * 60 * 5)
        }
      },
      async saveAuthGoal () {
        API.init(this.keys)
        if (this.goalPercentageInterval === null) {
          const createIntervalGoal = async () => {
            let dailyPercentage = 0
            let lended = 0
            let lendData = await API.rest.Margin.BorrowAndLend.getActiveLendOrdersList()
            let activeData = await API.rest.Margin.BorrowAndLend.getActiveLendOrdersList()
            lendData.data.items.forEach(item => {
              dailyPercentage += parseFloat(item.dailyIntRate)
            })
            dailyPercentage = dailyPercentage / lendData.data.items.length
            activeData.data.items.forEach(item => {
              if (item.currency === 'USDT') {
                lended += parseFloat(item.size)
              }
            })
            lended = -1 * lended
            let daily = ((((-1 * lended) * dailyPercentage)) - ((((-1 * lended) * dailyPercentage)) * 0.15))
            this.goalPercentage = (((daily * 30) * 100) / this.goal).round(2)
          }
          createIntervalGoal()
          this.goalPercentageInterval = setInterval(createIntervalGoal, 1000 * 60 * 5)
        }
      },
      save () {
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

        config.set('keys', {
          baseUrl: 'https://api.kucoin.com',
          apiAuth: {
            key: this.key,
            secret: this.secret,
            passphrase: this.passphrase
          },
          authVersion: 2
        }).write()
        this.$buefy.snackbar.open({
          duration: 5000,
          message: `Saving <b>Credentials</b>`,
          type: 'is-success',
          position: 'is-bottom-left',
          actionText: null,
          queue: false
        })
        this.test().then(() => {
          if (this.tested) {
            this.auth = true
          }
        })
      },
      getDate (miliseconds) {
        /* eslint no-extend-native: ["error", { "exceptions": ["Number", "Date"] }] */
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
      },
      async test () {
        if (this.key !== '' && this.secret !== '' && this.passphrase !== '') {
          let keys = this.keys
          keys.apiAuth.key = this.key
          keys.apiAuth.secret = this.secret
          keys.apiAuth.passphrase = this.passphrase
          API.init(keys)
          try {
            await API.rest.User.Account.getAccountLedgers()
            await API.rest.User.Account.getAccountsList()
            await API.rest.Margin.BorrowAndLend.getActiveLendOrdersList()
            await API.rest.Margin.BorrowAndLend.getLendingMarketData('USDT')
            await API.rest.Margin.BorrowAndLend.getSettledLendOrderHistory()
            await API.rest.Margin.BorrowAndLend.getActiveLendOrdersList()
            await API.rest.User.Deposit.getDepositAddress('USDT')
            await API.rest.User.Deposit.getDepositList()
            this.tested = true
            this.$buefy.snackbar.open({
              duration: 5000,
              message: `Authentication Success`,
              type: 'is-success',
              position: 'is-bottom-left',
              actionText: null,
              queue: false
            })
          } catch (error) {
            console.log(error)
            this.tested = false
            this.$buefy.snackbar.open({
              duration: 5000,
              message: `Bad Credentials`,
              type: 'is-danger',
              position: 'is-bottom-left',
              actionText: null,
              queue: false
            })
          }
        } else {
          this.tested = false
          this.$buefy.snackbar.open({
            duration: 5000,
            message: `Bad Credentials`,
            type: 'is-danger',
            position: 'is-bottom-left',
            actionText: null,
            queue: false
          })
        }
      },
      remove () {
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

        config.set('keys', {
          baseUrl: 'https://api.kucoin.com',
          apiAuth: {
            key: '',
            secret: '',
            passphrase: ''
          },
          authVersion: 2
        }).write()

        this.key = ''
        this.secret = ''
        this.passphrase = ''

        this.$buefy.snackbar.open({
          duration: 5000,
          message: `Credentials Removed`,
          type: 'is-success',
          position: 'is-bottom-left',
          actionText: null,
          queue: false
        })
      }
    },
    beforeDestroy () {
      clearInterval(this.depositListInterval)
      clearInterval(this.transferListInterval)
      clearInterval(this.goalPercentageInterval)
    },
    watch: {
      cryptograph () {
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

        var settings = config.get('settings').value()
        settings.cryptograph = this.cryptograph
        config.set('settings', settings).write()
      },
      file () {
        if (this.file !== null && this.file.type !== 'application/json') {
          this.$buefy.snackbar.open({
            duration: 5000,
            message: `Only json files`,
            type: 'is-danger',
            position: 'is-bottom-left',
            actionText: null,
            queue: false
          })
          this.file = null
        }
      },
      update () {
        if (this.update) {
          // this.checkKeys(this.getKeys())
        }
      },
      auth () {
        // this.loading = !this.auth
        if (this.auth) {
          this.saveAuth()
          this.saveAuthGoal()
        } else {
          this.authData = null
          this.depositList = null
          clearInterval(this.depositListInterval)
          this.depositListInterval = null
          this.transferList = null
          clearInterval(this.transferListInterval)
          this.transferListInterval = null
          this.goalPercentage = null
          clearInterval(this.goalPercentageInterval)
          this.goalPercentageInterval = null
        }
      }
    },
    computed: {
      update () {
        return this.$store.getters.getUpdate
      },
      depositTotal () {
        if (this.depositList === null) {
          return null
        }
        let total = 0
        this.depositList.forEach(item => {
          total += parseFloat(item.amount)
        })
        return total.round(3)
      },
      transferTotal () {
        if (this.transferList === null) {
          return null
        }
        let total = 0
        this.transferList.forEach(item => {
          total += parseFloat(item.amount)
        })
        return total.round(3)
      },
      fullTotal () {
        return (this.depositTotal + this.transferTotal).round(3)
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
    .small-text {
      color: rgba(#FFFFFF, 0.5) !important;
      font-size: 12px !important;
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

  .title {
    color: rgba(#FFFFFF, 0.7) !important;
    small {
      color: rgba(#FFFFFF, 0.5) !important;
      font-size: 11px !important;
    }
    .second-color {
      color: #58a6ff !important;
    }
  }
  
  .fa-eye, .fa-eye-slash {
    color: rgba(30, 96, 189, 0.7) !important;
  }
  
  .label {
    color: rgba(#FFFFFF, 0.6) !important;
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

  .justify-end {
    margin-top: 40px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    a {
      margin-left: 10px;
    }
  }

  .button-primary {
    background: rgba(56,139,253,0.1) !important;
    color: #58a6ff !important;
  }

  .button-danger {
    background: rgba(253, 56, 56, 0.1) !important;
    color: #ff5858 !important;
  }

  .button-semi-pure {
    background: #1a222e !important;
    color: rgba(#ffffff, 0.6) !important;
  }

  .button-black {
    background: #0d1117;
  }

  .button-text {
    margin-right: 0px;
  }

  .button-black:hover {
    background: #0b0e13;
  }

  .no-border {
    border: 0px !important;
  }

  .creator-message {
    color: rgba(#ffffff, 0.4) !important;
    line-height: 0.2 !important;
  }

  .is-divider {
    margin-top: 30px;
    margin-bottom: 30px;
    border-bottom: 1px solid #30363d !important;
    width: 100%;
  }

  .link {
    text-decoration: underline !important;
  }
</style>
