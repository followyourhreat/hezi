<template>
  <div class="page">
    <div class="dt-search-top">
      <div class="dt-search-cells">
        <div class="dt-search-cell">
          <Input v-model="params.keyword" class="dt-search-input" placeholder="输入账号、用户名"/>
        </div>
        <div class="dt-search-cell">
          性别：
          <dt-select v-model="params.sex" class="dt-search-select" url="userSex"/>
        </div>
        <div class="dt-search-cell">
          地区：
          <dt-select v-model="params.province_code" class="dt-search-select" url="userProvince"/>
        </div>
        <div class="dt-search-cell">
          参加任务：
          <dt-select v-model="params.is_join_task" class="dt-search-select" url="userTask"/>
        </div>
        <div class="dt-search-cell">
          购买过商品：
          <dt-select v-model="params.is_buy_goods" class="dt-search-select" url="userShop"/>
        </div>
        <!-- <div class="dt-search-cell">
          
        </div>-->
      </div>
      <div class="dt-search-operation">
        <Button type="primary" @click="handleSearch">查询</Button>
        <Button type="info" @click="handleExport">导出</Button>
      </div>
    </div>
    <dt-table ref="table" url="user/list" :params="params" :columns="columns"></dt-table>
    <Modal v-model="modal1" :title="modelTitle" :mask-closable="false">
      <Form ref="form" :model="formData" :rules="rule" :label-width="100">
        <FormItem label="角色名称" prop="form1" required>
          <Input v-model="formData.form1" placeholder="请输入角色名称"></Input>
        </FormItem>
        <FormItem label="角色权限" prop="form2" required>
          <div style="height: 300px;overflow-y: auto;border: 1px solid #dddee1;">
            <Tree :data="data2" show-checkbox></Tree>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="handleSubmit()">保存</Button>
        <Button type="text" @click="modal1 = false" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      params: {
        keyword: "",
        sex: "0",
        province_code: "0",
        is_join_task: "0",
        is_buy_goods: "0"
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
        { title: "账号", key: "username" },
        { title: "用户名", key: "nickname" },
        {
          title: "性别",
          key: "sex",
          render: (h, params) => {
            const obj = { "0": "未知", "1": "男", "2": "女" };
            const label = obj[params.row.sex];
            return h("span", {}, label);
          }
        },
        { title: "出生年月", key: "birthday" },
        { title: "地区", key: "province" },
        {
          title: "参加任务",
          key: "is_join_task",
          render: (h, params) => {
            const obj = { "1": "是", "2": "否" };
            const label = obj[params.row.is_join_task];
            return h("span", {}, label);
          }
        },
        {
          title: "购买过商品",
          key: "is_buy_goods",
          render: (h, params) => {
            const obj = { "1": "是", "2": "否" };
            const label = obj[params.row.is_buy_goods];
            return h("span", {}, label);
          }
        },
        {
          title: "注册时间",
          key: "ctime",
          width: 150,
          render: (h, params) => {
            const label = new Date(params.row.ctime * 1000).Format(
              "yyyy-MM-dd hh:mm:ss"
            );
            return h("span", {}, label);
          }
        },
        {
          title: "最后一次登录时间",
          key: "last_login_time",
          width: 150,
          render: (h, params) => {
            const label = new Date(params.row.last_login_time * 1000).Format(
              "yyyy-MM-dd hh:mm:ss"
            );
            return h("span", {}, label);
          }
        },
        {
          title: "操作",
          width: 150,
          key: "operation",
          render: (h, params) => {
            const obj = { "2": "启用", "1": "禁用" };
            const label = obj[params.row.status];
            return h("div", [
              h(
                "span",
                {
                  class: "span-del",
                  on: {
                    click: () => {
                      this.handleRemove("user/del", { id: params.row.id });
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      itemId: 0,
      modal1: false,
      formData: {
        form1: "",
        form2: "",
        form3: ""
      },
      rule: {},
      data2: [
        {
          title: "首页",
          expand: true
        },
        {
          title: "用户管理",
          expand: true
        },
        {
          title: "权限管理",
          expand: true,
          children: [
            {
              title: "账号管理",
              expand: true
            },
            {
              title: "角色管理",
              expand: true
            }
          ]
        }
      ]
    };
  },
  computed: {
    modelTitle() {
      return this.itemId ? "编辑" : "新增";
    }
  },
  mounted() {},
  methods: {
    handleAdd() {
      this.modal1 = true;
      this.itemId = 0;
    },
    handleEdit() {
      this.modal1 = true;
      this.itemId = 1;
    },
    handleSubmit() {},
    handleExport() {
      this.$Modal.confirm({
        title: "温馨提示",
        content: "确定导出数据 ?",
        onOk: () => {
          this.$post("user/list", {
            ...this.params,
            export: 1
          }).then(res => {
            window.location.href = res.data.filename;
          });
        },
        onCancel: () => {}
      });
    }
  }
};
</script>