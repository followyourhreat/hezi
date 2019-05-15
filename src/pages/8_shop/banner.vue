<template>
  <div>
    <div class="dt-search-top">
      <div class="dt-search-cells">
        <!-- <div class="dt-search-cell">
          <Input v-model="params.key1" class="dt-search-input" placeholder="请输入账号" />
        </div>
        <div class="dt-search-cell">
          <dt-select v-model="params.key2" class="dt-search-select" url="authorityStatus"/>
        </div>
        <div class="dt-search-cell">
          <Button type="ghost" @click="handleSearch">查询</Button>
        </div>-->
      </div>
      <div class="dt-search-operation">
        <Button type="info" @click="handleOrder">排序</Button>
        <Button type="info" @click="handleAdd">新增</Button>
      </div>
    </div>
    <dt-table ref="table" url="mallbanner/list" :params="params" :columns="columns"></dt-table>
    <Modal v-model="modal1" :title="modelTitle" :mask-closable="false">
      <Form ref="form" :model="formData" :rules="rule" :label-width="100">
        <FormItem label="图片" prop="image">
          <img v-if="formData.image" class="formItemImg" :src="formData.image">
          <Upload
            type="drag"
            action="http://120.24.55.58:8147/index.php/admin/upload/upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :data="uploadData"
            name="image"
            accept=".png, .jpg, .jpeg, .gif"
            :on-success="onSuccess"
          >
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>上传图片</p>
            </div>
          </Upload>
        </FormItem>
        <FormItem label="关联商品" prop="goods_id">
          <Select v-model="formData.goods_id" style="width:200px">
            <Option v-for="item in taskList" :value="item.id" :key="item.id">{{ item.goods_name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="handleSubmit()">保存</Button>
        <Button type="text" @click="modal1 = false" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal v-model="modal2" title="排序" :mask-closable="false">
      <table style="width: 100%;text-align: left;">
        <tr>
          <th>名称</th>
          <th>序号</th>
        </tr>
        <tr v-for="item in list2">
          <td>
            <img class="span-img" :src="item.image">
          </td>
          <td>
            <Input v-model="item.sort" placeholder="请输入序号"></Input>
          </td>
        </tr>
      </table>
      <div slot="footer">
        <Button type="ghost" @click="handleSubmit2()">保存</Button>
        <Button type="text" @click="modal2 = false" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      uploadData: {
        target: "mallbanner"
      },
      params: {},
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
        {
          title: "图片",
          key: "image",
          render: (h, params) => {
            const label = params.row.image;
            return h("img", {
              class: "span-img",
              attrs: {
                src: "http://120.24.55.58:8147" + label
              }
            });
          }
        },
        {
          title: "关联商品",
          key: "goods",
          render: (h, params) => {
            console.log(params);
            const label = params.row.goods.goods_name;
            return h("span", {}, label);
          }
        },
        {
          title: "操作",
          width:180,
          key: "operation",
          render: (h, params) => {
            return h("div", [
               h(
                "span",
                {
                  class: "span-active",
                  on: {
                    click: () => {
                      this.handleUp(params.row);
                    }
                  }
                },
                "上移"
              ),
               h(
                "span",
                {
                  class: "span-active",
                  on: {
                    click: () => {
                      this.handleDown(params.row);
                    }
                  }
                },
                "下移"
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
                      this.handleRemove("mallbanner/del", {
                        id: params.row.id
                      });
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
      taskList: [],
      defaultList: [],
      formData: {
        image: "",
        goods_id: ""
      },
      rule: {},
      modal2: false,
      list2: []
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
      this.getMallList();
      this.$refs.form.resetFields();
    },
    handleEdit(item) {
      this.modal1 = true;
      this.itemId = item.id;
      this.getMallList();
      this.formData = Object.assign(this.formData, item);
    },
    handleSubmit() {
      if (this.itemId) {
        this.$post("mallbanner/edit", {
          id: this.itemId,
          image: this.formData.image,
          goods_id: this.formData.goods_id
        }).then(res => {
          this.modal1 = false;
          this.handleSearch();
        });
      } else {
        this.$post("mallbanner/add", {
          image: this.formData.image,
          goods_id: this.formData.goods_id
        }).then(res => {
          this.modal1 = false;
          this.handleSearch();
        });
      }
    },
    onSuccess(response, file, fileList) {
      this.formData.image = response.data.path;
    },
    getMallList() {
      this.$post("mallgoods/list", { page_size: 0 }).then(res => {
        this.taskList = res.data;
      });
    },
    handleOrder() {
      this.modal2 = true;
      this.$post("mallbanner/list", {}).then(res => {
        this.list2 = res.data.list;
      });
    },
    handleSubmit2() {
      const params = this.list2.map(item => {
        return {
          id: item.id,
          sort: item.sort
        };
      });
      this.$post("mallbanner/sort", {
        params: JSON.stringify(params)
      }).then(res => {
        this.modal2 = false;
        this.handleSearch();
      });
    },
    handleUp(row){
      let params = {
        id: row.id,
        trend:1
      }
      this.$post("mallbanner/move", params).then(res => {
          this.$Message.success("上移成功");
          this.handleSearch();
        });
    },
    handleDown(row){
       let params = {
          id: row.id,
          trend:2
        }
     this.$post("mallbanner/move", params).then(res => {
        this.$Message.success("下移成功");
        this.handleSearch();
      });
      
       
    }
  }
};
</script>