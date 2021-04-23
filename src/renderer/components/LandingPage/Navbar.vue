<template>
  <div class="titlebar navbar-container">
    <div>
      <a class="button button-pure is-primary">
        <img id="logo" src="~@/assets/tether.svg" width="20px" alt="electron-vue">
        <small>USDT</small>
      </a>
      <a v-if="$router.history.current.name === 'landing-page'" @click="updateNow()" class="button button-pure is-primary">
        <small>Updating in {{ timeLeft }}:{{ secondsString }}</small>
      </a>
      <a v-if="$router.history.current.name === 'settings-page'" @click="updateNow()" class="button button-pure is-primary">
        <small>Updating in -:--</small>
      </a>
      <a v-if="$router.history.current.name === 'landing-page'" @click="goTo('/settings')" class="button button-primary is-primary">
        <b-icon
          pack="fas"
          icon="cog"
          custom-class="fa-spin"
          size="is-small">
        </b-icon>
      </a>
      <a v-if="$router.history.current.name === 'settings-page'" @click="goTo('/')" class="button button-primary is-primary">
        <b-icon
          pack="fas"
          icon="home"
          size="is-small">
        </b-icon>
      </a>
    </div>
    <div class="buttons">
      <a
        @mouseover="hover = true"
        @mouseleave="hover = false"
        class="titlebar button button-black is-dark"
        :class="!hover ? 'button-black' : 'button-black-selected'"
      >
        <b-icon
          pack="fas"
          :icon="!hover ? 'hand-sparkles' : 'hand-rock'"
          size="is-small">
        </b-icon>
      </a>
      <a @click="maximize()" class="button button-black is-dark">
        <b-icon
          pack="fas"
          icon="expand-alt"
          size="is-small">
        </b-icon>
      </a>
      <a @click="minimize()" class="button button-black is-dark">
        <b-icon
          pack="fas"
          icon="window-minimize"
          size="is-small">
        </b-icon>
      </a>
      <a @click="close()" class="button button-black is-dark">
        <b-icon
          pack="fas"
          icon="times"
          size="is-small">
        </b-icon>
      </a>
    </div>
  </div>
</template>

<script>
  const remote = require('electron').remote
  export default {
    data () {
      return {
        w: remote.getCurrentWindow(),
        timeLeft: this.$store.getters.getInterval / (1000 * 60), // minutes left
        seconds: 0,
        hover: false
      }
    },
    mounted () {
      if (this.$router.history.current.name === 'landing-page') {
        this.reloadData()
        setInterval(() => {
          if (this.seconds === 0) {
            this.seconds = 60
            if (this.timeLeft === 0) {
              this.timeLeft = (this.$store.getters.getInterval / (1000 * 60)) - 1
              // timer got to zero
              this.reloadData()
            } else {
              this.timeLeft = this.timeLeft - 1
            }
          } else {
            this.seconds = this.seconds - 1
          }
        }, 1000)
      }
    },
    methods: {
      goTo (path) {
        this.$router.replace(path)
      },
      updateNow () {
        this.timeLeft = 0
        this.seconds = 1
      },
      close () {
        this.w.close()
      },
      minimize () {
        this.w.minimize()
      },
      maximize () {
        var window = remote.BrowserWindow.getFocusedWindow()
        window.setFullScreen(!window.isFullScreen())
      },
      reloadData () {
        this.$store.dispatch('update').then(() => {
          this.$store.dispatch('stop')
        })
      }
    },
    computed: {
      secondsString () {
        if (this.seconds > 9) {
          return this.seconds.toString()
        } else {
          return '0' + this.seconds.toString()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  .titlebar {
    -webkit-user-select: none;
    -webkit-app-region: drag;
  }

  .titlebar-button {
    -webkit-app-region: no-drag;
  }

  #logo {
    margin-right: 10px;
  }

  .navbar-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    position: fixed;
    width: 100%;
    background: rgba(#161c22, 0.9) !important;
    backdrop-filter: blur(8px) !important; 
    border-bottom: 1px solid #30363d !important;
    z-index: 20;
  }

  .navbar-image {
    width: 100px;
  }

  .button-primary {
    background: rgba(56,139,253,0.1) !important;
    color: #58a6ff !important;
  }

  .button-secondary {
    background: #161c22 !important;
  }

  .button-black {
    background: #0d1117;
  }

  .button-pure {
    background: #0d1117 !important;
  }

  .button-black:hover {
    background: #0b0e13;
  }

  .button-black-selected {
    background: rgba(56,139,253,0.1) !important;
  }
</style>