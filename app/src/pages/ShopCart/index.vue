<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="cart in cartInfoList" :key="cart.skuId">
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="cart.isChecked == 1"
              @change="updateChecked(cart)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl" />
            <div class="item-msg">
              {{ cart.skuName }}
            </div>
          </li>
          <li class="cart-list-con3">
            <span class="price">{{ cart.skuPrice }}.00</span>
          </li>
          <li class="cart-list-con4">
            <span class="mins" @click="handler('mins', -1, cart)">-</span>
            <input
              autocomplete="off"
              type="text"
              :value="cart.skuNum"
              minnum="1"
              class="itxt"
              @change="handler('change', $event.target.value * 1, cart)"
            />
            <span class="plus" @click="handler('plus', 1, cart)">+</span>
          </li>
          <li class="cart-list-con5">
            <span class="sum">{{ cart.skuNum * cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con6">
            <a
              href="javascript:void(0);"
              class="sindelet"
              @click="delCartById(cart.skuId)"
              >删除</a
            >
            <br />
            <a href="javascript:void(0);">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isAllChecked"
          @change="updateAllChecked"
        />
        <span> 全选</span>
      </div>
      <div class="option">
        <a href="javascript:void(0);" @click="delAllChecked">删除选中的商品</a>
        <a href="javascript:void(0);">移到我的关注</a>
        <a href="javascript:void(0);">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span> 件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <a class="sum-btn" href="javascript:void(0);" @click="goTrade"
            >结算</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import debounce from "lodash/debounce";

export default {
  name: "ShopCart",
  computed: {
    ...mapGetters("shopCart", ["cartInfo"]),
    // 购物车数据
    cartInfoList() {
      return this.cartInfo.cartInfoList || [];
    },
    // 总价
    totalPrice() {
      return this.cartInfoList.reduce(
        (total, item) =>
          item.isChecked == "1" ? total + item.skuNum * item.skuPrice : total,
        0
      );
    },
    // 总选状态
    isAllChecked() {
      return this.cartInfoList.length
        ? this.cartInfoList.every((item) => item.isChecked == 1)
        : false;
    },
  },
  methods: {
    getData() {
      this.$store.dispatch("shopCart/getCartList");
    },
    // 修改商品个数，防抖
    handler: debounce(async function (type, digNum, cart) {
      switch (type) {
        case "mins":
          digNum = cart.skuNum > 1 ? -1 : 0;
          break;
        case "plus":
          digNum = 1;
          break;
        case "change":
          digNum =
            isNaN(digNum) || digNum < 1 ? 0 : parseInt(digNum) - cart.skuNum;
          break;
      }
      try {
        await this.$store.dispatch("detail/addOrUpdateShopCart", {
          skuId: cart.skuId,
          skuNum: digNum,
        });
        this.getData();
      } catch (err) {
        alert(err.message ? err.message : "失败");
      }
    }, 500),
    // 删除单个商品
    async delCartById(skuId) {
      if (this.cartInfoList.length) {
        if (confirm("是否确认删除")) {
          try {
            await this.$store.dispatch("shopCart/delCartById", { skuId });
            this.getData();
          } catch (err) {
            alert(err.message ? err.message : "失败");
          }
        }
      }
    },
    // 删除所有选中商品
    async delAllChecked() {
      if (this.cartInfoList.length) {
        if (confirm("是否确认删除")) {
          try {
            await this.$store.dispatch("shopCart/delAllChecked");
            this.getData();
          } catch (err) {
            alert(err.message ? err.message : "失败");
          }
        }
      }
    },

    // 单个商品的选中状态
    updateChecked: debounce(async function (cart) {
      try {
        await this.$store.dispatch("shopCart/updateCheckedById", {
          skuId: cart.skuId,
          isChecked: cart.isChecked == "1" ? "0" : "1",
        });
        this.getData();
      } catch (err) {
        alert(err.message ? err.message : "失败");
      }
    }, 500),
    // 所有商品的选中状态
    updateAllChecked: debounce(async function (e) {
      if (this.cartInfoList.length) {
        let isChecked = e.target.checked ? "1" : "0";
        try {
          await this.$store.dispatch("shopCart/updateAllChecked", {
            isChecked,
          });
          this.getData();
        } catch (err) {
          alert(err.message ? err.message : "失败");
        }
      }
    }, 500),
    // 结算
    goTrade() {
      if (this.cartInfoList.every((item) => item.isChecked == 0))
        alert("请确保需要结算的商品数量正常");
      else this.$router.push("/trade");
    },
  },

  mounted() {
    this.getData();
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con3 {
          width: 10%;
        }

        .cart-list-con4 {
          width: 15%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
            cursor: pointer;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 31.7px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
            cursor: pointer;
          }
        }

        .cart-list-con5 {
          width: 12.5%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con6 {
          width: 12.5%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          text-decoration: none;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>