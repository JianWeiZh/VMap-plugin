import vueMap from './map'

let map = {}

const createScript = function (src, callBack) {
  const scriptDom = document.createElement('script')
  scriptDom.type = 'text/javascript'
  scriptDom.src = src
  scriptDom.onload = callBack
  document.querySelector('body').appendChild(scriptDom)
}

const loadMapScript = function (options, callBack) {
  if (!window.AMap) {
    const src = '//webapi.amap.com/maps?v=1.4.15&key=' + options.key
    if (options.loadMapUI && !window.AMapUI) {
      createScript(src, function () {
        const UISrc = '//webapi.amap.com/ui/1.0/main.js'
        createScript(UISrc, callBack)
      })
    } else {
      createScript(src, callBack)
    }
  }
}

map.install = function (Vue, options, callBack) {
  if (map.installed) return
  loadMapScript(options, function () {
    const mapFn = vueMap.mapFn
    const mapUIFn = vueMap.mapUIFn
    const mapObj = !options.loadMapUI ? { ...mapFn } : { ...mapFn, ...mapUIFn}
    Vue.prototype.$VMap = mapObj
    callBack()
  })
}

const install = function (Vue, opts = {}) {
  if (install.installed) return
  map.install(Vue, opts, callBack)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default map
