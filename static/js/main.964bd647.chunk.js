(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{106:function(t,n,e){t.exports={rolling:"rolling-item_rolling__1Uoa9",inner:"rolling-item_inner__2FpXf",box:"rolling-item_box__QwRFF"}},238:function(t,n,e){t.exports=e.p+"static/media/french-fries.9d33107d.png"},241:function(t,n,e){e(242),e(263),t.exports=e(552)},259:function(t,n,e){var o={"./log":260};function i(t){var n=a(t);return e(n)}function a(t){if(!e.o(o,t)){var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}return o[t]}i.keys=function(){return Object.keys(o)},i.resolve=a,t.exports=i,i.id=259},541:function(t,n){!function(){for(var t=0,n=["ms","moz","webkit","o"],e=0;e<n.length&&!window.requestAnimationFrame;++e)window.requestAnimationFrame=window[n[e]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[n[e]+"CancelAnimationFrame"]||window[n[e]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(n,e){var o=(new Date).getTime(),i=Math.max(0,16-(o-t)),a=window.setTimeout(function(){n(o+i)},i);return t=o+i,a}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(t){clearTimeout(t)})}()},546:function(t,n,e){},551:function(t,n,e){},552:function(t,n,e){"use strict";e.r(n);e(264),e(293),e(295),e(296),e(298),e(302),e(351),e(540),e(541);var o=e(4),i=e.n(o),a=e(234),r=e.n(a),s=(e(546),e(102)),c=e(79),u=e(104),l=e(103),m=e(62),f=e(105),p=e(145),d=e(63),h=e(106),g=e.n(h),b=e(64),v=e(235),w=e(107),x=e.n(w);function y(){var t=Object(d.a)(["\n        50% { transform: translate(0, ","px); }\n        100% { transform: translate(0, ","px); }\n      "]);return y=function(){return t},t}function k(){var t=Object(d.a)(["\n  background: url(",");\n  background-size: ",";\n  background-position: "," ",";\n  width: ",";\n  height: ",";\n"]);return k=function(){return t},t}function O(){var t=Object(d.a)(["animation: "," 0.6s ease-out 1"]);return O=function(){return t},t}function I(){var t=Object(d.a)(["\n  ",";\n"]);return I=function(){return t},t}function _(){var t=Object(d.a)(["\n  width: ",";\n  height: ",";\n"]);return _=function(){return t},t}var j=1,A=b.b.div(_(),function(t){return"".concat(t.width,"px")},function(t){return"".concat(t.height,"px")}),S=b.b.div.attrs(function(t){return{style:{transform:"translate(0px, ".concat(t.pos,"px)"),msTransform:"translate(0px, ".concat(t.pos,"px)")}}})(I(),function(t){return Object(b.a)(O(),t.animation)}),F=b.b.div(k(),function(t){return t.backgroundImage},function(t){return t.backgroundSize},function(t){return"number"===typeof t.pos.x?"".concat(t.pos.x,"px"):t.pos.x},function(t){return"number"===typeof t.pos.y?"".concat(t.pos.y,"px"):t.pos.y},function(t){return"".concat(t.width,"px")},function(t){return"".concat(t.height,"px")}),P=function(t){function n(t,e){var o;return Object(s.a)(this,n),(o=Object(u.a)(this,Object(l.a)(n).call(this,t,e))).rollingRafId=[],o.loopRafId=null,o.boxHeight=0,o.movePixel=[],o.stopDelay=[],o.resultId=[],o.shuffle=function(t){var n=Object(p.a)(t);return n.forEach(function(t,e){var o=Math.floor(Math.random()*(e+1)),i=[n[o],n[e]];n[e]=i[0],n[o]=i[1]}),n},o.animate=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=o.state.pos[t];o.state.on&&(o.rollingRafId[t]=requestAnimationFrame(function e(i){var a=(new Date).getTime();if(o.state.on||(0===o.stopDelay[t]&&(o.movePixel[t]>5?o.movePixel[t]=o.movePixel[t]-=1:o.state.pos[t]%o.props.height!==0?o.movePixel[t]=5:0!==t&&0!==o.movePixel[t-1]?o.movePixel[t]=5:o.movePixel[t]=0),o.stopDelay[t]>0&&o.stopDelay[t]--),("undefined"===typeof i||a>i)&&(o.setState({pos:o.state.pos.map(function(e,i){return i===t?Math.floor(n+=o.movePixel[t]):e})}),i=a+j),Math.floor(o.state.pos[t])>=0&&(o.setState({pos:o.state.pos.map(function(n,e){return e===t?-o.boxHeight:n})}),i=void 0,n=-o.boxHeight),0===o.movePixel[t]){var r=o.state.itemInfo[t];r.some(function(n,e){if(e+1===Math.abs(o.state.pos[t])/o.props.height){var i=r[e+1];return i||(i=r[0]),o.resultId[t]=i.id||e,!0}return!1}),o.setState({eachAnimationState:o.state.eachAnimationState.map(function(n,e){return t===e||!!n})}),o.cancel(t),o.props.onProgress&&o.rollingRafId.every(function(t){return null===t})&&(o.props.onProgress(!1,o.resultId),o.setState({animationState:!1}),o.resultId=[])}else o.rollingRafId[t]=requestAnimationFrame(e.bind(Object(m.a)(o),i))}))},o.cancel=function(t){cancelAnimationFrame(o.rollingRafId[t]),o.rollingRafId.splice(t,1,null)},o.state={on:!1,animationState:!1,eachAnimationState:[!1,!1,!1],pos:[],itemInfo:[]},o}return Object(f.a)(n,t),Object(c.a)(n,null,[{key:"getDerivedStateFromProps",value:function(t,n){return 0==n.pos.length?{pos:Array(t.row).fill(-t.height*t.itemInfo.length),itemInfo:Array(t.row).fill(Object(p.a)(t.itemInfo))}:t.on!==n.on?{on:t.on&&!n.animationState}:null}}]),Object(c.a)(n,[{key:"componentDidMount",value:function(){var t=this,n=this.state.itemInfo,e=[];this.boxHeight=this.props.height*this.props.itemInfo.length,n.forEach(function(n){e.push(t.shuffle(n))}),this.setState({itemInfo:e})}},{key:"componentDidUpdate",value:function(t,n){var e=this;if(n.on!==this.state.on&&this.state.on){this.setState({animationState:!0});var o=0;this.loopRafId=requestAnimationFrame(function t(n){var i=(new Date).getTime();("undefined"===typeof n||i>n&&o<e.props.row)&&(e.stopDelay[o]=50*o,e.cancel(o),e.movePixel[o]=("ie"===Object(v.detect)().name?20:10)*e.props.height*.01,e.animate(o),n=i),3===++o?cancelAnimationFrame(e.loopRafId):e.loopRafId=requestAnimationFrame(t.bind(e,n))}),this.props.onProgress&&this.props.onProgress(!0)}}},{key:"render",value:function(){var t=this,n=this.props,e=n.backgroundImage,i=n.backgroundSize,a=n.width,r=n.height,s=n.completionAnimation,c=void 0!==s&&s,u=this.state,l=u.itemInfo,m=u.eachAnimationState,f=[];return l.forEach(function(n,s){var u=m[s]&&c?Object(b.c)(y(),t.state.pos[s]+30,t.state.pos[s]):null;f.push(o.createElement(A,Object.assign({className:x()(g.a.box,"roll_box_item")},{width:a,height:r},{key:s}),o.createElement(S,Object.assign({pos:t.state.pos[s],animation:u},{key:"inner_".concat(s)}),n.map(function(t,n){return o.createElement(F,Object.assign({pos:t,backgroundImage:e,backgroundSize:i,width:a,height:r},{key:n}))}),o.createElement(F,Object.assign({pos:n[0],backgroundImage:e,backgroundSize:i,width:a,height:r},{key:s})))))}),o.createElement("div",{className:x()(g.a.rolling,"roll_box_wrap")},o.createElement("div",{className:x()(g.a.inner,"roll_box_inner")},f))}}]),n}(o.PureComponent),E=e(238),R=e.n(E),D=function(t){function n(t,e){var o;return Object(s.a)(this,n),(o=Object(u.a)(this,Object(l.a)(n).call(this,t,e))).onClick=function(t){o.setState({start:!o.state.start},function(){setTimeout(function(){o.setState({start:!o.state.start})},1500)})},o.state={start:!1},o.onClick=o.onClick.bind(Object(m.a)(o)),o}return Object(f.a)(n,t),Object(c.a)(n,[{key:"render",value:function(){return o.createElement(o.Fragment,null,o.createElement(P,{on:this.state.start,row:3,backgroundImage:R.a,backgroundSize:"1280px 640px",itemInfo:[{x:0,y:-63,id:"item_0"},{x:-267,y:-63,id:"item_1"},{x:-536,y:-63,id:"item_2"},{x:-803,y:-63,id:"item_3"},{x:-1070,y:-63,id:"item_4"},{x:0,y:-365,id:"item_5"},{x:-267,y:-365,id:"item_6"},{x:-536,y:-365,id:"item_7"},{x:-803,y:-365,id:"item_8"},{x:-1070,y:-365,id:"item_9"}],width:210,height:210,completionAnimation:!0,onProgress:function(t,n){console.log(n)}}),o.createElement("button",{className:"start_btn",onClick:this.onClick},this.state.start?"STOP":"START"))}}]),n}(o.PureComponent),T=(e(551),function(){return i.a.createElement("div",{className:"App"},i.a.createElement(D,null))});Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(i.a.createElement(T,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})}},[[241,1,2]]]);
//# sourceMappingURL=main.964bd647.chunk.js.map