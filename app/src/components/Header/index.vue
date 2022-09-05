<template>
  <!-- 头部 -->
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <p v-show="!userName">
            <span>请</span>
            <router-link to="/login">登录</router-link>
            <router-link to="/register" class="register">免费注册</router-link>
          </p>
          <p v-show="userName">
            <span>{{ userName }}</span>
            <a class="register" @click="logout">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          <router-link to="/home">我的尚品汇</router-link>
          <a href="javascript:void(0);">尚品汇会员</a>
          <a href="javascript:void(0);">企业采购</a>
          <a href="javascript:void(0);">关注尚品汇</a>
          <a href="javascript:void(0);">合作招商</a>
          <a href="javascript:void(0);">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <!-- SEO优化 -->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" title="尚品汇" to="/home">
          <!-- <img src="./images/logo.png" alt="" /> -->
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model.trim="keyword"
            @keyup.enter="goSearch"
          />
          <button
            class="sui-btn btn-xlarge btn-danger"
            type="button"
            @click="goSearch"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Header",
  data() {
    return {
      keyword: "",
    };
  },
  computed: {
    ...mapGetters("user", ["userName"]),
  },
  methods: {
    // 搜索
    goSearch() {
      let location = {
        name: "search",
        params: { keyword: this.keyword || undefined },
      };
      if (this.$route.query) location.query = this.$route.query;
      this.$router.push(location);
    },
    // 退出登录
    async logout() {
      if (confirm("是否确认退出登录？")) {
        try {
          await this.$store.dispatch("user/userLogout");
          this.$router.push("/home");
        } catch (err) {
          alert(err.message ? err.message : "失败");
        }
      }
    },
  },
  mounted() {
    this.$bus.$on("clearKeyword", () => {
      this.keyword = undefined;
    });
  },
  beforeDestroy() {
    this.$bus.$off("clearKeyword");
  },
};
</script>

<style lang="less" scoped>
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
            cursor: pointer;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        display: block;
        overflow: hidden;
        width: 175px;
        height: 55px;
        margin: 28px 45px;
        background: url("./images/logo.png") no-repeat;
        text-indent: -9999px;
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>