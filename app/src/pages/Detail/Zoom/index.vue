<template>
  <div class="spec-preview">
    <img :src="skuImageList[currentIndex].imgUrl" />
    <div class="event" @mousemove="handler" ref="move"></div>
    <div class="big" ref="big">
      <img :src="skuImageList[currentIndex].imgUrl" ref="bigImg" />
    </div>
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
import throttle from "lodash/throttle";

export default {
  name: "Zoom",
  props: ["skuImageList"],
  data() {
    return {
      currentIndex: 0,
    };
  },
  methods: {
    // 遮罩层移动，节流
    handler: throttle(function (e) {
      let move = this.$refs.move; // 移动区域
      let mask = this.$refs.mask; // 遮罩层
      let bigImg = this.$refs.bigImg; // 图片
      let big = this.$refs.big; // 放大区域

      // 移动区域大小
      let moveWidth = move.clientWidth;
      let moveHeight = move.clientHeight;
      // 遮罩层大小
      let maskWidth = mask.clientWidth;
      let maskHeight = mask.clientHeight;
      // 图片大小
      let bigImgWidth = bigImg.clientWidth;
      let bigImgHeight = bigImg.clientHeight;
      // 放大区域大小
      let bigWidth = big.clientWidth;
      let bigHeight = big.clientHeight;

      // 遮罩层最大移动距离
      let maskMaxLeft = moveWidth - maskWidth;
      let maskMaxTop = moveHeight - maskHeight;
      // 遮罩层移动距离
      let maskLeft = e.offsetX - maskWidth / 2;
      let maskTop = e.offsetY - maskHeight / 2;
      // 限制遮罩层移动
      if (maskLeft <= 0) maskLeft = 0;
      else if (maskLeft >= maskWidth) maskLeft = maskMaxLeft;
      if (maskTop <= 0) maskTop = 0;
      else if (maskTop >= maskHeight) maskTop = maskMaxTop;

      // 放大区域最大移动距离
      let bigMaxLeft = bigImgWidth - bigWidth;
      let bigMaxTop = bigImgHeight - bigHeight;
      // 放大区域移动距离
      let bigLeft = (-bigMaxLeft * maskLeft) / maskMaxLeft;
      let bigTop = (-bigMaxTop * maskTop) / maskMaxTop;

      mask.style.left = maskLeft + "px";
      mask.style.top = maskTop + "px";
      bigImg.style.left = bigLeft + "px";
      bigImg.style.top = bigTop + "px";
    }),
  },
  mounted() {
    this.$bus.$on("getIndex", (index) => {
      this.currentIndex = index;
    });
  },
  beforeDestroy() {
    this.$bus.$off("getIndex");
  },
};
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover ~ .mask,
  .event:hover ~ .big {
    display: block;
  }
}
</style>