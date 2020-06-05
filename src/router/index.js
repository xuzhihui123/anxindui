import Vue from "vue";
import VueRouter from "vue-router";

import {Base64} from 'js-base64'

Vue.use(VueRouter);


//vue-router 3.1之后使用push方法要调用异常处理 加这个不需要
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const Login = () => import("views/login/Login");
const Home = () => import("views/home/Home");
const SuperUsers = () => import("views/superusers/SuperUsers");
const Users = () => import("views/users/Users");
const NotFind = () => import('views/404')
const CommandBank = () => import('views/commandBank/CommandBank')


//导入utils
import {getToken, isToken} from "utils/getToken"
import ChangeAdminPsd from "views/changeAdminPsd/ChangeAdminPsd";
import CommandCoin from "views/commandCoin/CommandCoin";
import AddCoin from "views/addCoin/AddCoin";
import EditCoin from "views/editCoin/EditCoin";
import CommandProducts from "views/commandProducts/CommandProducts";
import AddProducts from "views/addProducts/AddProducts";
import EditProducts from "views/editProduvts/EditProducts";
import OrderList from "views/orderList/OrderList";
import EditOrderList from "views/editOrderList/EditOrderList";
import WithdrawList from "views/withdrawList/WithdrawList";
import WithDrawListEdit from "views/withdrawListEdit/WithDrawListEdit";
import Income from "views/incomeList/Income";
import NoticeList from "views/noticeList/NoticeList";
import AddNotice from "views/addNotice/AddNotice";
import EditNotice from "views/editNotice/EditNotice";
import ManualOrder from "views/manualOrder/ManualOrder";
import AddManualOrder from "views/addManualOrder/AddManualOrder";

const routes = [
  {
    path: "/home",
    component: Home,
    children: [
      {path: "superusers", component: SuperUsers},
      {path: "users", component: Users},
      {path: 'commandBank', component: CommandBank},
      {
        path: 'changeAdminPsd', component: ChangeAdminPsd
      },
      {
        path: 'commandCoin', component: CommandCoin
      },
      {
        path: 'addCoin/:bankId', component: AddCoin
      },
      {
        path: 'editCoin/:coinId', component: EditCoin
      },
      {
        path: 'commandProducts', component: CommandProducts
      },
      {
        path: 'addPro/:coinId', component: AddProducts
      },
      {
        path: 'editPro/:itemId', component: EditProducts
      },
      {
        path: 'orderList', component: OrderList
      },
      {
        path: 'editOrderList/:orderId', component: EditOrderList
      },
      {
        path: 'withdrawList', component: WithdrawList
      },
      {
        path: 'editWithdrawList/:wid', component: WithDrawListEdit
      },
      {
        path:'incomeList',component:Income
      },
      {
        path:'noticeList',component:NoticeList
      },
      {
        path:'addNotice',component:AddNotice
      },
      {
        path:'editNotice/:id',component:EditNotice
      },
      {
        path:'manualOrder',component:ManualOrder
      },
      {
        path:'addManualOrder',component:AddManualOrder
      }
    ],
    meta: {
      name: "安心兑后台管理"
    },
    // redirect: "/home/superusers"
  },
  {
    path: "/login",
    component: Login,
    meta: {
      name: "安心兑后台登录"
    }
  },
  {path: "/", redirect: "/home"},
  {
    path: '/404',
    component: NotFind,
    meta: {
      name: '404'
    }
  },
  {
    path: '*',
    redirect: '/404'
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});


//全局导航守卫 判断路由进入之前做的事情
router.beforeEach(async (to, from, next) => {
  //设置title 标题
  document.title = to.matched[0].meta.name || '安心兑后台管理';



  if (to.path === "/login") return next();
  if (to.path.includes('/home')) {
    if (isToken()) {
      //拿到本地token
      try {
        let d = isToken()
        let data = await getToken(d)
        if (data.status === 200) {
          return next()
        } else {
          return next('/login')
        }
      } catch (e) {
        return next('/login')
      }
    } else {
      return next('/login')
    }
  }
  next();
});

export default router;
