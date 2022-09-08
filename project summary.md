# 一、编程思想

## 1、三级联动

（1）路由跳转与传递参数

​	①编程式路由导航：避免卡顿现象，优化性能

（在使用多级菜单跳转路由时，由于声明式路由导航 <router-link to=""></router-link> 是组件 VueComponent 的实例对象，大量循环创建时相当于在执行 new VueComponent(options);，可能会造成卡顿现象，应该采用编程式路由导航）

​	②发送 Ajax 请求：在根组件的 mounted() 中调用 dispatch() 

（路由来回跳转时，父组件会频繁地进行挂载与销毁，导致子组件内的 mounted() 的会反复执行，同时三级联动是全局组件，因此，应该在根组件的 mounted() 中调用 dispatch() ）

​	②事件委派：优化性能

​	③自定义属性 data-xxxName、data-xxxId：区分哪一个标签、哪一级标签（通过自定义属性携带动态数据）

​	（e.target.dataset.xxxname、e.target.dataset.xxxid，注意都是小写）



（2）动态添加背景颜色

​	①鼠标移入：获取当前的 index，赋值给 data 中的 currentIndex（初始为 -1）

​	②判断：动态绑定类名 :class="{ current: index === currentIndex }"

​	③鼠标移出：事件委派（由具体效果决定），currentIndex = -1



（3）二三级分类的显示与隐藏

​	动态绑定样式 :style="{ display: index === currentIndex ? 'block' : 'none' }"



## 2、Swipper + Ajax

​	如果是父组件发送 Ajax 请求，并将数据传递给子组件，且子组件是基于父组件的数据渲染得到的（如对子组件 v-for），则能够直接在子组件的 mounted() 中初始化 Swiper，因为子组件存在时，其数据、结构也都已经存在（如果仍使用 watch + this.$nextTick()，则需要 immediate: true）

①watch：监视数据（保证数据已经存在，即服务器的数据已经获取到）

②this.$nextTick()：结构渲染完毕后初始化 Swiper（保证结构已经存在，即 v-for 已经执行完毕）

（当在同一组件内的 mounted() 中调用的 dispatch() 中涉及异步操作时（Ajax），直接在 mounted() 中初始化 Swiper 会导致 v-for 遍历时的结构不完全）



## 3、封装组件

​	结构、功能相似，且多个地方需要用到

（1）全局组件

①保证结构、行为、样式一致，数据不一致

②注册一次（index.js），任意地方使用

③全局组件的 dispatch() 放在根组件中，而不是全局组件的 mounted() 中



（2）局部组件

①可以嵌套 -> 局部组件里面嵌套局部组件

②整体结构一致，某些结构不一致 -> 插槽



## 4、修改当前的路由地址栏

​	路由跳转到自身，并携带需要的路由参数（通过 watch 监听 $route，路由参数改变时再次发起请求）



## 5、分页器

①当前页码：pageNo

②连续页码：continues（奇数）

③数据总数：total

④每页展示的数据个数：pageSize（计算出总页码）

⑤自定义事件：得到点击的页码，赋值给 pageNo，并再次发起请求

```vue
  // 点击分页器 -> pageNo 传给父组件 -> 发送请求，数据更新 —> 新数据传给分页器 ——> 结构更新

  // 父组件
  <Pagination
    :pageNo="searchParams.pageNo"
    :pageSize="searchParams.pageSize"
    :total="total"
    :continues="5"
    @getPageNo="getPageNo"		
  ></Pagination>

  methods: {
	// 通过自定义事件，进行子 -> 父组件通信
    getPageNo(pageNo) {
      this.searchParams.pageNo = pageNo;
      this.getData();
    }
  }


  // 子组件
  <div class="pagination">
    <button :disabled="pageNo === 1" @click="changePageNo(pageNo - 1)">
      上一页
    </button>
    <button
      v-show="startNumAndEndNum.start > 1"
      :class="{ active: pageNo === 1 }"
      @click="changePageNo(1)"
    >
      1
    </button>
    <button v-show="startNumAndEndNum.start > 2">···</button>

    <button
      v-for="(page, index) in startNumAndEndNum.end"
      :key="index"
      v-show="page >= startNumAndEndNum.start"
      :class="{ active: pageNo === page }"
      @click="changePageNo(page)"
    >
      {{ page }}
    </button>

    <button v-show="startNumAndEndNum.end < totalPage - 1">···</button>
    <button
      v-show="startNumAndEndNum.end < totalPage"
      :class="{ active: pageNo === totalPage }"
      @click="changePageNo(totalPage)"
    >
      {{ totalPage }}
    </button>
    <button
      :disabled="pageNo === totalPage"
      @click="changePageNo(pageNo + 1)"
    >
      下一页
    </button>
    <button style="margin-left: 30px">共 {{ total }} 条</button>
  </div>

	props: ["pageNo", "pageSize", "total", "continues"],
	computed: {
        // 总页码
        totalPage() {
            return Math.ceil(this.total / this.pageSize);
        },
        // 起始页码和结束页码
        startNumAndEndNum() {
        	let start = 0, end = 0;
            if (this.totalPage < this.continues) {
            	start = 1;
                end = this.totalPage;
            } else {
            	start = this.pageNo - parseInt(this.continues / 2);
                end = this.pageNo + parseInt(this.continues / 2);
                	if (start < 1) {
                    	start = 1;
                        end = this.continues;
                    };
                    if (end > this.totalPage) {
                        start = this.totalPage - this.continues + 1;
                        end = this.totalPage;
                    };
            };
            return {
            	start,
                end
            };
         }
    },
  	methods: {
    	// 当前页码
    	changePageNo(pageNo) {
      		this.$emit("getPageNo", pageNo);
    	}
  	}
```



## 6、排它思想

①传入当前所点击的对象 + 当前区域内的所有对象，而不是传入 id

②先改变所有的对象，再改变点击的对象



## 7、获取用户信息 

​	this.$store.dispatch("user/getUserInfo"); 应该放在全局前置路由守卫中

（1）放在根组件的 mounted() 中：初次不渲染，刷新后渲染

①根组件只会挂载一次，因此其子组件 Header 也只挂载一次

②进入登录页面时，根组件及其子组件早已挂载完毕，即获取用户信息早于获得 token，此时无法获取数据

③登录成功后，获得了 token 并存在本地存储中，但是由于根组件只会挂载一次，因此没有重新获取数据

④页面刷新后，根组件重新挂载，且重新挂载能发生多次，此时由于能够从本地存储中获得 token，因此能够获取数据、进行渲染



（2）放在登录成功时：初次渲染，刷新后不渲染

①登录成功后，获得了 token 并存在本地存储中，之后获取用户信息，即获得 token 早于获取用户信息

②computed 依赖的数据发生改变，因此能够再次执行、进行渲染

③页面刷新后，vuex 中的数据丢失，且登陆成功只发生一次，此时无法获取数据

```javascript
	router.beforeEach(async (to, from, next) => {
    	let token = store.state.user.token;
    	let name = store.state.user.userInfo.name;
    	// 已登录且在线
    	if (token && navigator.onLine) {
        	// 登陆页面
        	if (to.path == "/login")
            	next(false);
        	// 其它页面
        	else {
            	// 有用户名
            	if (name)
                	next();
            	// 没有用户名
            	else {
                	// 获取成功
                	try {
                    	await store.dispatch("user/getUserInfo");
                    	next();
                    // 获取失败（token过期）
                	} catch (err) {
                    	alert("token失效");
                    	try {
                        	await store.dispatch("user/userLogout");
                    	} catch (err) {
                    	} finally {
                        	next("/login");
                    	}
                	}
            	}
        	}
        // 未登录
    	} else {
        	let permissionPaths = ["/center"];
        	let illegalPaths = ["/trade", "/addcartsuccess", "/pay", "/paysuccess"];
        	let checkPaths = [...permissionPaths, ...illegalPaths];
        	if (checkPaths.some(item => to.path.indexOf(item) != -1)) {
            	alert("请登录账号");
            	let toPath = to.path;
            	if (illegalPaths.some(item => to.path.indexOf(item) != -1))
                	toPath = "/home";
            	next(`/login?redirect=${toPath}`);
        	}
        	else
            	next();
    	}
	});
```



## 8、登录后跳转

​	想去的页面需要登录才能访问，登录成功后，路由跳转到原本想去的页面

①全局前置路由守卫：将想去页面的路径存储于路由之中（如在 query 中携带 redirect 参数）

②登陆成功后跳转：若携带 redirect 参数，则跳转指定页面，否则跳转首页

③组件内路由守卫：若重定向到非法路由，则跳转首页，否则跳转指定页面

```javascript
	let permissionPaths = ["/center"];
	let illegalPaths = ["/trade", "/addcartsuccess", "/pay", "/paysuccess"];
	let checkPaths = [...permissionPaths, ...illegalPaths];
	if (checkPaths.some(item => to.path.indexOf(item) != -1)) {
		alert("请登录账号");
		let toPath = to.path;
		if (illegalPaths.some(item => to.path.indexOf(item) != -1))
			toPath = "/home";
            next(`/login?redirect=${toPath}`);
	}
	else
		next();


    let toPath = this.$route.query.redirect || "/home";
    this.$router.push(toPath);


	...
	if (from.path == "/" || from.path == "/login")	next("/home");
	...
```



## 9、限制页面直接进入

​	某些页面只能从特定的页面进入，当进入了这些页面时，只判断 from.path 会导致各种问题

①从指定页面进入：合法

②从地址栏直接进入：白屏

③从登录后重定向进入：白屏

④进入后刷新页面：白屏（from.path 为 /）

```javascript
    {
        path: '/paysuccess',
        component: () => import('@/pages/PaySuccess'),
        beforeEnter(to, from, next) {
            if (from.path == "/pay" || (from.path == "/" && to.path == "/paysuccess" && window.performance.navigation.type == 1))
                next();
            else if (from.path == "/" || from.path == "/login")
                next("/home");
            else
                next(false);
        },
        meta: {
            isFooterShow: true
        }
    }
```



## 10、修改单元格数据

（1）不能将单元格内容直接赋值给表单双向绑定的数据，而是应该用浅拷贝（单层数据、简单数据）或深拷贝（多层数据、复杂数据）

​	this.tmForm 是双向绑定的数据，直接赋值时，this.tmForm 和 row 的指向相同，因此改动 this.tmForm 内的数据，row 内的数据也会改变

​	分为指向不同展示对象和操作对象，前者由插槽得到，后者由自定义得到（发送给服务器）

```javascript
	import cloneDeep from "lodash/cloneDeep";

	methods: {
        // 修改
        updateTradeMark(row) {
            this.dialogFormVisible = true;
            // this.tmForm = row;					// 错误						
            Object.assign(this.tmForm, row);		// 浅拷贝
            // this.tmForm = { ...row };			// 浅拷贝
            // this.tmForm = cloneDeep(row);		// 深拷贝
        }   
	}
```



（2）不能将单元格内容直接与 data 中的数据进行双向绑定，而是应该与每行的数据进行双向绑定（每行的数据通过作用域插槽获取）

​	不能用一个变量控制所有行的数据，而是应该用每行的变量控制每行的数据，否则所有单元格的变化将同步

 （涉及单元格数据的添加、修改、删除时需要注意）（添加 / 删除单元行一般是向 data 中的数组 push / splice）

```vue
	<el-table-column label="属性值名称" width="width">
    	<template slot-scope="{ row }">
			<el-input
          		v-model.trim="row.valueName"
          		placeholder="请输入属性值名称"
          		size="mini"
          	></el-input>
    	</template>
	</el-table-column>
```



（3）给循环创建的单元格的 input 实现自动聚焦时，不能给 ref 设置常量，而是应该设置变量

​	单元格有多个时，给 ref 设置常量，会导致 $refs 中的数据覆盖，得到的只是单个 input（最后一个）

```vue
	<el-table-column label="属性值名称" width="width">
    	<template slot-scope="{ row, $index }">
        	<el-input
            	v-show="row.flag"
                v-model.trim="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                :ref="$index"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
            ></el-input>
            <div
                v-show="!row.flag"
                @click="toUpdate(row, $index)"
                height="28px"
            >
                {{ row.valueName }}
            </div>
		</template>
	</el-table-column>
```



## 11、收集搜索框数据

​	如果将搜索对象直接与搜索框绑定，则每次翻页时，搜索框中的数据都会直接发送给服务器，然而搜索的触发条件是点击。因此，应该将搜索对象与发送对象分开，当点击之后，再将搜索对象浅拷贝 / 深拷贝给发送对象

```vue
	<el-form-item>
    	<el-input v-model="tempSearchInfo.username" placeholder="用户名" />
	</el-form-item>
	<el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>


	methods: {
		async getUserList() {
			...
      		await this.$API.getUserList(this.pageNo, this.pageSize, this.tempSearchInfo);
			...
    	},
    	search() {
      		this.searchInfo = { ...this.tempSearchInfo };
      		this.getUserList();
		}
    }
```



## 12、收集 select 数据

​	因为 select 收集的是 option 的 value 值，因此，option 的 value 值可以根据需要自定义

```vue
	<!-- 只有一个 Select -->
	<!-- 可以收集到 data 中，后续进行处理 -->
	<el-select
    	v-model="saleAttrIdAndSaleAttrName"
		:placeholder="`还有${unSelectSaleAttrList.length}个未选择`"
        style="margin: 0 12px 22px 0"
    >
    	<el-option
        	v-for="unSelect in unSelectSaleAttrList"
            :key="unSelect.id"
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
        >
        </el-option>
	</el-select>


	<!-- 有多个循环得到的 Select -->
	<!-- 不能收集到 data 中，而是每个单元格的对象上，后续进行处理 -->
	<!-- 因为收集的数据不需要响应式效果，因此可以在对象上直接追加属性 -->
	<el-select v-model="attr.attrIdAndAttrValueId" placeholder="请选择">
		<el-option
			:label="attrValue.valueName"
            :value="`${attr.id}:${attrValue.id}`"
            v-for="attrValue in attr.attrValueList"
            :key="attrValue.id"
        ></el-option>
   	</el-select>
```



## 13、切换子组件时发请求

​	子组件通过 v-show 进行切换时，发送的请求不能写在子组件的 mounted() 中，因为其结构一直在 DOM 树中，并未移除。因此，父组件挂载完毕时子组件也挂载完毕，子组件的 mounted() 在父组件挂载完毕时已经执行一次（此时未进行切换操作），此后的切换不会触发子组件的 mounted() 执行

①子组件定义获取数据的方法

②父组件定义切换子组件的方法，并在该方法中，通过 this.$refs.xxx.xxx() 调用子组件的方法，并传入参数



## 14、动态路由

​	根据不同用户的权限（服务器返回），动态注册路由

```javascript
	// 常量路由（包括404）
	export const constantRoutes = [{ ... }];

	// 异步路由
    export const asyncRoutes = [{ ... }];

    // 任意路由（404重定向）
    export const anyRoutes = { path: '*', redirect: '/404', hidden: true };

	
	const createRouter = () => new Router({
  		scrollBehavior: () => ({ y: 0 }),
  		routes: constantRoutes
	})
	const router = createRouter();

	// 重置路由
	export function resetRouter() {
  		const newRouter = createRouter()
  		router.matcher = newRouter.matcher // reset router
	};

	export default router


	
  	getInfo({ commit, state }) {
   		...
        commit('SET_USERINFO', data);
        commit("SET_RESULTASYNCROUTES", computedAsyncRoutes(asyncRoutes, data.routes));
		...
  	}
        
	SET_RESULTASYNCROUTES(state, value) {
        // 异步路由
    	state.resultAsyncRoutes = value;
        // 所有路由（供开源项目遍历路由使用）
    	state.resultAllRoutes = constantRoutes.concat(value, anyRoutes);
        // 动态添加的路由
    	state.resultAddRoutes = state.resultAsyncRoutes.concat(anyRoutes);
    	router.addRoutes(state.resultAddRoutes);
  	} 
        
   	const computedAsyncRoutes = (asyncRoutes, routes) => {
  		return asyncRoutes.filter(item => {
    		if (routes.indexOf(item.name) != -1) {
                // 递归（当 item.children 不存在时，直接判断 item.children.length 会报错）
      			if (item.children && item.children.length)
        			item.children = computedAsyncRoutes(item.children, routes)
      			return true
    		}
  		})
	}
```



## 15、多级路由刷新空白

```javascript
	// 解决使用动态路由时，多级路由刷新空白问题
	router.beforeEach(async (to, from, next) => {
		const hasGetUserInfo = store.getters.name;
  		const hasResultAsyncRoutes = store.state.user.resultAsyncRoutes;
  		let flag = hasResultAsyncRoutes.length ? 1 : 0;
  		if (hasGetUserInfo && hasResultAsyncRoutes.length) {
  			next();
  		} else {
  			try {
      			await store.dispatch('user/getInfo')
      			if (flag == 0) {
        			resetRouter();
                	// 常量路由已经存在，重复添加会报警告
        			router.addRoutes(store.state.user.resultAddRoutes);
        			next(to.path);
      			} else
        			next();
   			} catch (error) {
   				...
   			}
  		}
	})
```



## 16、css效果

```less
	// 鼠标滑过图片放大
	img {
    	transition: all 0.2s;
    	&:hover {
        	opacity: 0.8;
        	transform: scale(1.1);
    	}
	}

	// 鼠标滑过图片左移
	img {
		transition: all 0.2s;
		&:hover {
			margin-left: 8px;
		}
	}
```



------



# 二、注意点

1、JS 中 keydown 会重复触发，导致重复提交的问题，应该使用 keyup



2、箭头函数简写成 () => {} 且将 {} 作为返回的对象时，应该在外面加上括号，即 () => ({})



3、对象之间判等或判不等时，是在判断是否是同一个对象（地址相同）



4、对象的属性如果是变量，必须使用 [] 且没有引号

​		  obj['age']	  // 常量，加引号				

​		  obj.chars	  // 常量，不是变量

​		  obj[key]		// 变量，不加引号



5、避免嵌套使用 flex 布局，可以使用整体 flex 布局 + 局部 定位 position（浮动 float 失效）



6、某些场景下，过渡动画会导致出现 / 消失的速度过慢，应该禁用



7、获取元素的大小

```javascript
	let mask = this.$refs.mask; 

	// 错误
	let width = mask.style.width;	// 类中样式，非行内样式

	// 正确
	let width = mask.clientWidth;
	// clientWidth：可读可改，border + padding + 内容
	// offsetWidth：可读不可改，padding + 内容

	// 通过 style 修改，需要和 "px" 拼接字符串
```



8、Ajax 请求传参

①params、query

②请求头（get、post)：uuid / nanoid

③请求体（post）



9、提交到服务器的图片地址，应该是 url 地址，而不是本地地址



10、params 传递空串时，传递的应该是 undefined，防止路径产生问题，导致无法调整

​	  使用占位符声明接收 params 参数时，后面的 ? 表明该参数可传可不传

​	  params 和 path 不能同时使用

```javascript
    methods: {
        goSearch() {
            let location = {
                name: "search",
                params: { keyword: this.keyword || undefined },
            };
            if (this.$route.query) location.query = this.$route.query;
            this.$router.push(location);
        }
    }       
```



11、重置路由数据时，字符串数据清空（undefined)，数组 / 对象数据根据 id / index 删除（不能直接清空）



12、编程式路由导航在参数不变时，多次跳转同一地址会抛出错误 NavigationDuplicated

​	Vue-router 3.1.0 之后将 $router.push() / $router.replace() 用 Promise 改写，如果路由跳转时的路径和参数没有改变，就会返回一个失败的 promise，如果不对其进行处理，则会报错（声明式路由导航在 Vue 底层已经处理好）

```javascript
	// 给 push、replace 传递成功、失败的回调，捕获错误
  	methods: {
    	goSearch() {
      		this.$router.push(
        		{
          			name: "search",
          			params: { keyword: this.keyword || undefined },
        		},
        		() => {},
        		(err) => {
          			console.log(err);
        		}
      		);
   		}
  	}


	// 重写 push、replace
    const originPush = VueRouter.prototype.push;
    const originReplace = VueRouter.prototype.replace;
    VueRouter.prototype.push = function push(location, resolve, reject) {
        if (resolve && reject)
            return originPush.call(this, location, resolve, reject);
        else
            return originPush.call(this, location, () => { }, () => { });
    }
    VueRouter.prototype.replace = function replace(location, resolve, reject) {
        if (resolve && reject)
            return originPush.call(this, location, resolve, reject);
        else
            return originPush.call(this, location, () => { }, () => { });
    }
```



13、滚动行为的设置

```javascript
	const router = new VueRouter({
    	routes,
    	scrollBehavior(to, from, savedPosition) {
        	return {
            	x: 0,
            	y: 0
        	}
    	}
	});
```


14、父子组件执行顺序

​	父 beforeCreate() -> 父 created() -> 子 beforeCreate()-> 子 created() -> 子 mounted() -> 父 mounted()

​	（子组件的 mounted() 早于父组件的 mounted() 执行）



15、在自定义事件中，无法传递和接收事件对象

​	  父组件接收数据时，第一个参数的默认名称为 $event



16、调用 undefined / null 的属性或方法会出错，经常需要设置初始值和附加其它判断条件

①父 -> 子组件通信 props

​	skuInfo 在 vuex 中初始值为 {}，初始化时 skuInfo.skuImageList 为 undefined，如果不设置初始值，则在子组件中访问 undefined[0].imgUrl 会报错（初始化结束后，能够得到数据，使得子组件正常显示，但是仍然会报错）

②访问 vuex 中的 state、getters 

③访问 组件 中的 computed

④条件判断（三元表达式赋值、if）

```vue
	// 父组件
	// [] 保证 skuImageList 不是 undefined，[{}] 保证 skuImageList[0] 不是 undefined
	// 即保证 skuImageList[0] 是对象
	<Zoom :skuImageList="skuInfo.skuImageList || [{}]"></Zoom>

	// 子组件
	<img :src="skuImageList[0].imgUrl " />

	// 数据
	skuInfo: [
		skuImageList:[
			{ imgUrl: "XXX" }
		]
	]


	// todos: JSON.parse(localStorage.getItem("todos")) || []				
	// let a = obj.arr && obj.arr.length ? true : false;
	// if (obj.arr && obj.arr.length)
```



17、在使用插槽时，父组件传递结构，子组件渲染结构，因此，样式在父组件中且有 scoped 时，需要使用样式穿透，或者将样式放在子组件中（例如 element-ui 的作用域插槽）



18、父组件中使用 scoped，则子组件的根结点与父组件的结点具有相同的自定义属性，而子组件的子结点不具有，此时若在父组件中该根结点具有样式，则会影响子组件的根结点样式，但是不会影响子组件的子结点样式。因此，如果父组件使用了 scoped，但是需要在父组件中改变子组件的子结点样式，需要使用深度选择器来实现样式穿透，即在选择器前加上 >>>（css）、/deep/（less / scss）或 ::v-deep（less / scss）



19、如果在组件内不使用 scoped，则应该在选择器前都加上当前组件根结点的类名（不会与其他组件重复），尤其是组件库的选择器前，从而避免对其它组件造成影响



20、el-table-column 的数据显示不正常时，可尝试加上 key，避免错误复用（虚拟 DOM 中对象的标识）



21、Tree 组件获取父结点 ID

```javascript
	// 非按需引入
  	// node_modules\element-ui\lib\element-ui.common.js    
	// 25382行修改源码  去掉 "includeHalfChecked &&"
    // if ((child.checked || includeHalfChecked && child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf))
	if ((child.checked || child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) 


	// 按需引入
	// node_modules\element-ui\lib\tree.js    
    // 1051行修改源码  去掉 "includeHalfChecked &&"
    // if ((child.checked || includeHalfChecked && child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf))
	if ((child.checked || child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf))
```



22、清除表单的校验结果必须在界面更新之后

​	this.$nextTick(() => this.$refs.permission.clearValidate());



23、删除分页的单元格时，注意页码的变化

```javascript
	// 单个删除
	if (this.pageList.length <= 1 && this.pageNum > 1) 
        this.pageNum--;

	// 批量删除
	if (this.userList.length <= this.selectedUsersIds.length && this.pageNum > 1) 		
        this.pageNum--;
```



24、清除 data 中的数据（解决表单数据回显问题）

```javascript
	Object.assign(this._data, this.$options.data());

	// this._data：响应式数据来源
	// this.$options：当前组件的配置对象
	// 组件的 data 是函数式的，因此可以执行 data()，返回值即为初始值
	// Object.assign() 合并对象
```



25、去除对象中的多余项

```javascript
	// 通过剩余参数，接收除 pname 之外的所有变量，组成一个新的对象（可用于数组）
	const { pname, ...perm } = this.permissionInfo;
```



26、ECharts 中除了绘图之外其他部分，都可抽象为组件（可复用），因此，在更新图表时，series 必须要传入完整的参数，其余部分传入改动的参数



------



# 三、优化

1、在使用多级菜单跳转路由时，由于声明式路由导航 <router-link to=""></router-link> 是组件 VueComponent 的实例对象，大量循环创建时相当于在执行 new VueComponent(options);，可能会造成卡顿现象，应该采用编程式路由导航



2、切换路由时，在全局组件的 mounted() 中调用 dispatch() 来发送 Ajax 请求，会执行多次

①多个组件都会用到全局组件，当这些组件由于切换导致反复挂载时，都会调用全局组件中的 dispatch()

②根组件只会挂载一次，将 dispatch() 放在根组件的 mounted() 中，只会调用一次

（根组件只会挂载一次：不刷新 -> vuex 的数据不丢失，刷新 -> vuex 的数据重新获取）

（同理，多个子组件的 dispatch() 可以放在共同的父组件中）



3、路由参数为空字符串时，会传给服务器，占用额外的网络资源

​	将空字符串改为 undefined，则该参数不会带给服务器，但是为 undefined 时，调用该参数的属性或方法会出错，应该在调用时附加其它判断条件 

```vue
    <li class="with-x" v-show="searchParams.trademark">
        {{ (searchParams.trademark || "").split(":")[1]}}
        <i @click="removeTradeMark">×</i>
    </li>
```



4、防抖与节流节流

​	事件触发频繁，且每次触发都要执行回调函数，很可能出现浏览器卡顿的现象

（1）防抖

​	保证事件只有最后一次触发生效（前面所有的触发都被取消，最后一次执行是在规定的时间之后才会触发，即连续快速地触发，只会执行一次）

​	①修改商品的数量

​	②修改商品的勾选状态

```javascript
	import debounce from "lodash/debounce";

  	methods: {
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
    	}, 500)
	}
```



（2）节流

​	保证单位时间内只触发一次（在规定的间隔时间范围内不会重复触发回调，只有大于这个时间间隔才会触发回调，即把频繁触发变为少量触发）

​	①鼠标移入 / 移出

​	②图片放大镜的遮罩层移动

​	③点击搜索（此项目中，搜索后获取数据由路由监听完成，重复点击不会引起多次搜索）

```javascript
	import throttle from "lodash/throttle";

  	methods: {
    	changeIndex: throttle([async] function (index) {
      		this.currentIndex = index;
    	}, 50)
    }
```



5、在 async 中 写上多个 await 会打破并行操作

​	  应该将所有的 promise 用 await Promise.all([]) 组合起来

```javascript
	async getAddData(category3Id) {
    	let pTradeMark = this.$API.reqGetTradeMarkList();
      	let pBaseSaleAttr = this.$API.reqGetBaseSaleAttrList();

      	let [tradeMarkResult, baseSaleAttrResult] = await Promise.all([
        	pTradeMark,
        	pBaseSaleAttr,
      	]);

      	if (tradeMarkResult.code == 200)
        	this.tradeMarkList = tradeMarkResult.data;
      	if (baseSaleAttrResult.code == 200)
        	this.baseSaleAttrList = baseSaleAttrResult.data;
    }
   


     
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
    }


	delAllChecked(context, value) {
		let PromiseAll = [];
        context.getters.cartInfo.cartInfoList.forEach(item => {
			let p = item.isChecked == 1 ? context.dispatch("delCartById", item) : "";
            PromiseAll.push(p);
        });
        return Promise.all(PromiseAll);
    }

    async delCartById(context, value) {
        let result = await reqDelCartById(value.skuId);
        if (result.code == 200)
            return Promise.resolve("ok");
        else
            return Promise.reject(new Error(result.message));
    }
```



6、汇总

（1）按需加载：lodash（debounce、throttle、cloneDeep）、element-ui

（减小打包文件的体积）

（2）v-show / v-if：尽可能使用 v-show（前者通过操作 display 样式 控制，后者通过操作 DOM 树 控制）

（3）防抖与节流：前者在最后一次触发生效，后者在单位时间内只能触发一次

（优化高频触发事件）

（4）路由懒加载：把不同路由对应的组件分割成不同的代码块，当路由被访问的时候才加载对应的组件

（5）图片懒加载：在没有加载到目标图片时，先展示默认的 loading 图片

（6）用编程式路由导航代替声明式路由导航

（减少组件对象数量）

（7）事件委托

（提高事件处理效率）

（8）SEO：TDK + LOGO

（9）通过路由元信息 + v-show 控制组件的显示与隐藏

（10）将全局组件的 Ajax 请求放在根组件中执行

（减少请求次数）

（11）将路由参数的空字符串替换为 undefined，前者会传给服务器，后者不会

（提高请求性能）

（12）await Promise.all([])，避免多个 await 打破并行操作

（提高事件处理效率）



------



# 四、插件

1、lodash/debounce：防抖，lodash/throttle：节流，lodash/cloneDeep：深拷贝

2、mockjs：拦截 Ajax 请求，返回模拟的响应数据

3、nprogress：进度条

4、qrcode：二维码

5、swiper：轮播图

6、uuid：通用唯一识别码（v4）

7、vue-lazyload：图片懒加载

8、vee-validate：表单验证

9、dayjs：日期









