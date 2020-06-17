<template>
  <el-container>
    <el-header>
      <div style="color: #fff;" class="left_logo">
        <img src="~assets/logoT.png" alt style="width: 45px;" />
        安心兑-后台管理
      </div>
      <div class="top_user">
        <!--        <img src="~assets/main-logo.png" alt="">-->
        <el-dropdown @command="signOut" style="cursor: pointer">
          <span class="el-dropdown-link" style="color: #fff;">
            {{powerName}}：{{loginUserName}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="退出" icon="el-icon-s-promotion">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <el-row>
          <el-col :span="24">
            <div class="my-collapse" @click="changeCollapse">
              <i :class="[iscollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"></i>
            </div>
            <el-menu
              router
              :collapse="iscollapse"
              unique-opened
              :default-active="changeActiveRoute"
              :collapse-transition="false"
              background-color="#313743"
              text-color="#fff"
              active-text-color="#359BFF"
            >
              <!--              一级菜单-->
              <el-submenu :index="item.index" v-for="item in asideNavList" :key="item.index">
                <template slot="title">
                  <i :class="asideNavListIcon[item.index]"></i>
                  <span>{{item.title}}</span>
                </template>
                <!--                二级菜单-->
                <el-menu-item
                  :index="cItem.index"
                  v-for="cItem in item.childeren"
                  :key="cItem.title"
                >
                  <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{cItem.title}}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <transition
          enter-active-class="fadeIn animated"
          leave-active-class="fadeOut animated"
          :duration="{enter:100,leave:100}"
          mode="out-in"
        >
          <keep-alive include="CommandCoin,CommandProducts,OrderList,WithDrawList">
            <router-view />
          </keep-alive>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { Base64 } from "js-base64";

export default {
  name: "Home",
  created() {},
  computed: {},
  data() {
    return {
      adminPower: null,
      asideNavList: [],
      asideNavListIcon: {
        "1": "el-icon-s-custom",
        "2": "el-icon-user-solid",
        "3": "el-icon-s-help",
        "4": "el-icon-edit-outline",
        "5": "el-icon-money",
        "6": "el-icon-bank-card",
        "7": "el-icon-message-solid",
        "8": "el-icon-edit"
      },
      iscollapse: false,
      loginUserName: "",
      powerName: "",
      changeActiveRoute: ""
    };
  },
  methods: {
    // 获取是否是超级管理员
    //获取管理员权限
    getPowerByAdmin() {
      let power = Base64.decode(localStorage.getItem("power"));
      this.adminPower = parseInt(power.replace(/lancer/g, ""));
      if (this.adminPower === 1) {
        this.asideNavList = [
          {
            title: "管理员管理",
            childeren: [
              {
                title: "管理员管理",
                index: "/home/superusers"
              },
              {
                title: "修改密码",
                index: "/home/changeAdminPsd"
              }
            ],
            index: "1"
          },
          {
            title: "用户管理",
            childeren: [
              {
                title: "用户列表",
                index: "/home/users"
              }
            ],
            index: "2"
          },
          {
            title: "兑换银行管理",
            childeren: [
              {
                title: "兑换银行管理",
                index: "/home/commandBank"
              },
              {
                title: "兑换卷管理",
                index: "/home/commandCoin"
              },
              {
                title: "兑换产品管理",
                index: "/home/commandProducts"
              }
            ],
            index: "3"
          },
          {
            title: "报单记录表",
            childeren: [
              {
                title: "报单记录表",
                index: "/home/orderList"
              }
            ],
            index: "4"
          },
          {
            title: "提现记录表",
            childeren: [
              {
                title: "提现记录表",
                index: "/home/withdrawList"
              }
            ],
            index: "5"
          },
          {
            title: "收入记录表",
            childeren: [
              {
                title: "收入记录表",
                index: "/home/incomeList"
              }
            ],
            index: "6"
          },
          {
            title: "公告管理",
            childeren: [
              {
                title: "公告管理",
                index: "/home/noticeList"
              }
            ],
            index: "7"
          },
          {
            title: "客服报单",
            childeren: [
              {
                title: "客服报单",
                index: "/home/manualOrder"
              }
            ],
            index: "8"
          }
        ];
      } else {
        this.asideNavList = [
          {
            title: "管理员管理",
            childeren: [
              {
                title: "修改密码",
                index: "/home/changeAdminPsd"
              }
            ],
            index: "1"
          },
          {
            title: "客服报单",
            childeren: [
              {
                title: "客服报单",
                index: "/home/manualOrder"
              },
              {
                title: "报单记录表",
                index: "/home/orderList"
              }
            ],
            index: "8"
          }
        ];
      }
    },

    changeCollapse() {
      this.iscollapse = !this.iscollapse;
    },
    //获取登录来的用户名
    getUserName() {
      this.loginUserName = Base64.decode(localStorage.getItem("adminAcc"));
      this.powerName =
        parseInt(
          Base64.decode(localStorage.getItem("power")).replace(/lancer/g, "")
        ) === 1
          ? "超级管理员"
          : "管理员";
    },
    //退出点击
    signOut(c) {
      if (c === "退出") {
        window.sessionStorage.clear();
        this.$message({
          type: "success",
          message: "您已安全退出！",
          duration: 2000
        });
        localStorage.removeItem("token");
        localStorage.removeItem("adminAcc");
        localStorage.removeItem("adminNam");
        localStorage.removeItem("power");
        this.$router.push("/login");
      }
    }
  },
  created() {
    this.getPowerByAdmin();
    this.getUserName();
    let name = this.loginUserName;
    this.$message({
      type: "success",
      message: `欢迎回来${name}`
    });
  },
  watch: {
    $route: {
      immediate: true,
      handler(newV) {
        this.changeActiveRoute = newV.fullPath;
      }
    }
  }
};
</script>

<style scoped lang="less">
.el-header,
.el-aside {
  background-color: #313743;
}

.el-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.el-aside {
  min-height: 100vh;
}

.el-menu {
  border-right: none;
}

/deep/ .el-submenu__title {
  line-height: 65px;
  height: 65px;
}

.el-main {
  background-color: #e9edf1;
}

.my-collapse {
  height: 40px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  text-align: center;
  cursor: pointer;

  > i {
    color: #fff;
    font-size: 25px;
    line-height: 40px;
  }
}

.top_user img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
}

.left_logo {
  font-size: 24px;
  font-weight: 700;
  color: #e9edf1;
}
</style>