<template>
  <div id="app">
  </div>
</template>

<script>
import posStart from './assets/pos_start.svg'
import posEnd from './assets/pos_end.svg'
export default {
  mounted () {
    this.$nextTick(() => {
      this.map = this.$VMap.loadMap({
        loadMapDom: 'app',
        mapOptions: {
          zoom: 20,
          center: [this.longitude, this.latitude]
        }
      })
      this.$VMap.getPosition().then(res => {
        this.longitude = res.position.lng
        this.latitude = res.position.lat
        this.map.setCenter(this.$VMap.createPosition(this.longitude, this.latitude))
        this.addPlugin()
        this.newStartMarker(this.longitude, this.latitude)
        this.map.add(this.startMarker)
        this.newDriving([this.longitude, this.latitude], [116.382697, 39.901297])
      }).catch(err => {
        console.log(err)
      })
    })
  },
  methods: {
    addPlugin () {
      this.$VMap.addPlugin(['AMap.Driving', 'AMap.Walking'])
    },
    newStartIcon () {
      const VMap = this.$VMap
      return VMap.createIcon({
        size: VMap.createSize(20, 50),
        image: posStart,
        imageSize: VMap.createSize(20, 50)
      })
    },
    newEndIcon () {
      const VMap = this.$VMap
      return VMap.createIcon({
        size: VMap.createSize(20, 50),
        image: posEnd,
        imageSize: VMap.createSize(20, 50)
      })
    },
    newStartMarker (lng, lat) {
      const VMap = this.$VMap
      this.startMarker = VMap.createMarker({
        position: VMap.createPosition(lng, lat),
        icon: this.newStartIcon(),
        // offset: VMap.createOffset(-25, -50)
      })
    },
    newEndMarker (lng, lat) {
      const VMap = this.$VMap
      this.startMarker = VMap.createMarker({
        position: VMap.createPosition(lng, lat),
        icon: this.newEndIcon()
      })
    },
    newDriving (startLngLat, endLngLat) { // startLngLat: 起点经纬度【lng, lat】 endLngLat: 终点经纬度【lng, lat】
      this.driving = this.$VMap.initRoutePlan({
        map: this.map,
        hideMarkers: true
      }, 1)
      setTimeout(() => {
        this.driving.search(startLngLat, endLngLat, (status, result) => {
          this.newEndMarker(endLngLat[0], endLngLat[1])
          this.map.add(this.startMarker)
        })
      }, 5000)
    }
  },
  name: 'app',
  data () {
    return {
      map: '',
      startMarker: '',
      driving: '',
      longitude: '116.382697',
      latitude: '39.901297'
    }
  }
}
</script>

<style>
html, body{
  width: 100%;
  height: 100%;
  margin: 0;
}
#app {
  width: 100%;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
