<template>
  <div>
    <Tabs type="card">
      <TabPane label="代理结算">
        <div class="dt-search-cells" style="margin-bottom:15px;">
          <div
            class="dt-search-cell"
            style="width:260px;float:left;margin-right:30px;margin-left:20px;"
          >
            <Input v-model="params.keyword" class="dt-search-input" placeholder="请输入关键字"/>
          </div>
          <div class="dt-search-cell dt-search-settle" style>
            <Button type="ghost" @click="handleSearch">查询</Button>
          </div>
        </div>
        <dt-table ref="table" url="mallgoods/list" :params="params" :columns="columns"></dt-table>
      </TabPane>
      <TabPane label="场所结算">
        <div class="dt-search-cells" style="margin-bottom:15px;">
          <div
            class="dt-search-cell"
            style="width:260px;float:left;margin-right:30px;margin-left:20px;"
          >
            <Input v-model="params.keyword" class="dt-search-input" placeholder="请输入关键字"/>
          </div>
          <div class="dt-search-cell dt-search-settle" style>
            <Button type="ghost" @click="handleSearch">查询</Button>
          </div>
        </div>
        <dt-table ref="table" url="mallgoods/list" :params="params" :columns="columns"></dt-table>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      params: {
        keyword: "",
        category_id: ""
      },
      columns: [
        {
          title: "序号",
          key: "sort",
          width: 60,
          render: (h, params) => {
            const label = params.index + 1;
            return h("span", {}, label);
          }
        },
        { title: "代理商", key: "goods_name" },

        { title: "结算金额", key: "price_now" },
        { title: "结算月份", key: "price_original" },
        { title: "结算编号", key: "sale_total" },
        { title: "结算时间", key: "sale_total" },
        {
          title: "操作",
          width: 200,
          key: "operation",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  class: "span-active",
                  on: {
                    click: () => {
                      this.handleEdit(params.row);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "span",
                {
                  class: "span-del",
                  on: {
                    click: () => {
                      this.handleRemove("mallgoods/del", { id: params.row.id });
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ]
    };
  }
};
</script>
<style lang="less" scoped>
.table {
  margin-bottom: 40px;
}

.table-flex {
  display: flex;
  justify-content: center;
  align-content: center;
  margin: 10px 0px;
  line-height: 32px;
  .table-name {
    width: 60px;
  }
  .table-input {
    flex: 1;
  }
  .table-button {
    margin: 0px 10px;
  }
}
</style>
