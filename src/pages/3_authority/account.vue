<template>
  <div>
    <div class="dt-search-top">
      <div class="dt-search-cells">
        <div class="dt-search-cell">
          <Input v-model="params.username" class="dt-search-input" placeholder="请输入账号、姓名"/>
        </div>
        <div class="dt-search-cell">
          状态：
          <dt-select v-model="params.status" class="dt-search-select" url="authorityStatus"/>
        </div>
        <div class="dt-search-cell">
          <Button type="ghost" @click="handleSearch">查询</Button>
        </div>
      </div>
      <div class="dt-search-operation">
        <Button type="info" @click="handleAdd">新增</Button>
      </div>
    </div>
    <dt-table ref="table" url="admin/list" :params="params" :columns="columns"></dt-table>
    <Modal v-model="modal1" :title="modelTitle" :mask-closable="false">
      <Form ref="form" :model="formData" :rules="rule" :label-width="100">
        <FormItem label="账号" prop="username">
          <Input v-model="formData.username" placeholder="请输入账号"></Input>
        </FormItem>
        <FormItem label="姓名" prop="real_name">
          <Input v-model="formData.real_name" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="角色" prop="role_id">
          <Select v-model="formData.role_id">
            <Option v-for="item in roleList" :value="item.id" :key="item.id">{{ item.role_name }}</Option>
          </Select>
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
        username: "",
        status: "0"
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
        { title: "姓名", key: "real_name" },
        {
          title: "角色",
          key: "role",
          render: (h, params) => {
            const label = params.row.role && params.row.role.role_name;
            return h("span", {}, label);
          }
        },
        {
          title: "状态",
          key: "status",
          render: (h, params) => {
            const obj = { "1": "启用", "2": "禁用" };
            const label = obj[params.row.status];
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
                  class: "span-active",
                  on: {
                    click: () => {
                      this.handleStatus(params.row);
                    }
                  }
                },
                label
              ),
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
                      this.handleRemove("admin/del", { id: params.row.id });
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
      roleList: [],
      formData: {
        username: "",
        real_name: "",
        role_id: ""
      },
      rule: {}
    };
  },
  computed: {
    modelTitle() {
      return this.itemId ? "编辑" : "新增";
    }
  },
  mounted() {},
  methods: {
    getRoleList() {
      this.$post("role/list", { page: 0 }).then(res => {
        this.roleList = res.data.list;
      });
    },
    handleStatus(item) {
      this.$post("admin/setstatus", {
        id: item.id,
        status: item.status == "1" ? "2" : "1"
      }).then(res => {
        this.handleSearch();
      });
    },
    handleAdd() {
      this.modal1 = true;
      this.itemId = 0;
      this.$refs.form.resetFields();
      this.getRoleList();
    },
    handleEdit(item) {
      this.modal1 = true;
      this.itemId = item.id;
      this.getRoleList();
      this.formData = Object.assign(this.formData, item);
      // this.$post('admin/detail',{id: item.id}).then( res => {
      //   var data = res.data;
      //   this.formData = Object.assign(this.formData,data);
      // })
    },
    handleSubmit() {
      // 自定义验证规则
      // let vArr = [
      //   [this.formData.username, '账号', 'empty'],
      //   [this.formData.real_name, '姓名', 'empty'],
      // ];
      // this.$validate(vArr).then(valid => {

      // });
      if (!/^1[0-9]{10}$/.test(this.formData.username)) {
        this.$Message.destroy();
        this.$Message.warning("请输入正确格式的手机号");
        return;
      }
      var params = {};
      if (this.itemId) {
        params = Object.assign({}, this.formData, { id: this.itemId });
        this.$post("admin/edit", params).then(res => {
          this.modal1 = false;
          this.handleSearch();
          this.$post("admin/detail", {}).then(res => {
            this.$store.dispatch("setUserInfoAction", res.data);
          });
        });
      } else {
        params = Object.assign({}, this.formData);
        this.$post("admin/add", params).then(res => {
          this.modal1 = false;
          this.handleSearch();
        });
      }
    }
  }
};
</script>