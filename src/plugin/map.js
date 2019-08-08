const mapFn = {
  loadMap: (options) => { // 加载地图
    const mapOptions = {
      resizeEnable: true,
      zoom: 11,
      ...options.mapOptions
    }
    const map = new AMap.Map(options.loadMapDom, mapOptions)
    return map
  },
  addPlugin: (pluginList) => {
    AMap.service(pluginList, () => {
      console.log('加载服务插件完成！')
    })
  },
  getPosition: (optionsData = {}, onComplete, onError) => { // 地图定位
    AMap.plugin('AMap.Geolocation', () => {
      if (AMap.UA.ios) {
        // 使用远程定位，见 remogeo.js
        const remoGeo = new window.RemoGeoLocation()

        // 替换方法
        navigator.geolocation.getCurrentPosition = function () {
          return remoGeo.getCurrentPosition.apply(remoGeo, arguments)
        }

        // 替换方法
        navigator.geolocation.watchPosition = function () {
          return remoGeo.watchPosition.apply(remoGeo, arguments)
        }
      }
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: false, // 是否使用高精度定位，默认:true
        timeout: 10000, // 超过10秒后停止定位，默认：无穷大
        maximumAge: 0, // 定位结果缓存0毫秒，默认：0
        convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true, // 显示定位按钮，默认：true
        buttonPosition: 'LB', // 定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        showMarker: false,
        ...optionsData
      })
      geolocation.getCurrentPosition()
      AMap.event.addListener(geolocation, 'complete', onComplete)
      AMap.event.addListener(geolocation, 'error', onError)
    })
  },
  createMarker: (options) => { // 创建marker
    const marker = new AMap.Marker(options)
    return marker
  },
  createIcon: (options) => { // 创建icon
    const icon = new AMap.Icon(options)
    return icon
  },
  createPosition: (lng, lat) => { // 创建地图经纬度，用于定位地图Marker
    const pos = new AMap.LngLat(lng, lat)
    return pos
  },
  createPX: (x, y) => { // 创建图像相对偏移量
    const px = new AMap.Pixel(x, y)
    return px
  },
  createSize: (x, y) => { // 创建图像大小尺寸（放大或压缩）
    const size = new AMap.Size(x, y)
    return size
  },
  setMarkerPosition: (marker, lngLat) => { // 设置marker在地图上的位置 marker: marker对象  lngLat：经过createPosition处理后的经纬度
    marker.setPosition(lngLat)
  }
}

const mapUIFn = {
  positionPicker: (options) => { // 地图拖拽选址
    return new Promise(function (resolve, reject) {
      AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
        const dragObj = new PositionPicker(options.dragOptions)
        dragObj.on('success', options.dragSuc)
        dragObj.on('err', options.dragErr)
        dragObj.start()
        resolve(dragObj)
      })
    })
  }
}

export default {
  mapFn,
  mapUIFn
}
