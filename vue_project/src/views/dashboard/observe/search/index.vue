<template>
  <div class="search">
    <!-- 卡片 -->
    <el-card>
      <div slot="header" class="search-header">
        <span>线上热门搜索</span>
        <!-- 下拉菜单 -->
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="searchWord in searchWordList"
              :key="searchWord.word"
              >{{ searchWord.word }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div>
        <!-- Layout 布局 -->
        <el-row :gutter="10">
          <el-col :span="12">
            <SearchLineChart title="搜索用户数">
              <template #main>
                <span>12321</span>
                <span>
                  17.1%
                  <i class="el-icon-caret-top" style="color: red"></i>
                </span>
              </template>
            </SearchLineChart>
          </el-col>
          <el-col :span="12">
            <SearchLineChart title="人均搜索次数">
              <template #main>
                <span>2.7</span>
                <span>
                  -26.2%
                  <i
                    class="el-icon-caret-bottom"
                    style="color: yellowgreen"
                  ></i>
                </span>
              </template>
            </SearchLineChart>
          </el-col>
        </el-row>
        <el-table
          :data="searchWordList"
          style="width: 100%; margin: 10px 0"
          :default-sort="{ prop: 'date', order: 'descending' }"
          border
        >
          <el-table-column type="index" label="排名" width="80" align="center">
          </el-table-column>
          <el-table-column prop="word" label="搜索关键字" width="width">
          </el-table-column>
          <el-table-column prop="count" label="用户数" sortable width="width">
          </el-table-column>
          <el-table-column prop="user" label="周涨幅" sortable width="width">
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
          :total="info.searchWord.length"
          layout="prev, pager, next"
          style="text-align: center"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import SearchLineChart from "./searchLineChart";

export default {
  name: "Search",
  props: ["info"],
  data() {
    return {
      pageNum: 1,
      pageSize: 3,
    };
  },
  computed: {
    // 搜索关键字列表
    searchWordList() {
      return this.info.searchWord.slice(
        (this.pageNum - 1) * this.pageSize,
        this.pageNum * this.pageSize
      );
    },
  },
  methods: {
    // 当前页码
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
    },
    // 每页展示条数
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
    },
  },
  components: {
    SearchLineChart,
  },
};
</script>

<style>
.search .search-header {
  display: flex;
  justify-content: space-between;
}

.search .el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.search .el-icon-arrow-down {
  font-size: 12px;
}
</style>