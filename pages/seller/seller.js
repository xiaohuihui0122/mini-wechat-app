// pages/seller/seller.js
Page({
  data: {
    markers: [{
      iconPath: "../../images/marker.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50,
      callout:{
        content:"北京海淀区苏州街109号",
        fontSize:12,
        borderRadius:5,
        bgColor:"#fff",
        display:"ALWAYS",
        padding:5,
        textAlign:"center",
        color:"#FA9603"
      }
    }],
   },
  markertap(e) {
    console.log(e)
  }
})