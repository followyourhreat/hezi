<template>
  <div>
    <div class="dt-search-top">
      <div class="dt-search-cells">
        <div class="dt-search-cell">
          <Input v-model="params.keyword" class="dt-search-input" placeholder="请输入商品名称"/>
        </div>
        <div class="dt-search-cell">
          分类：
          <Select v-model="params.category_id" class="dt-search-select" clearable>
            <Option
              v-for="item in categoryList"
              :value="item.id"
              :key="item.id"
            >{{ item.cate_name }}</Option>
          </Select>
        </div>
        <div class="dt-search-cell">
          <Button type="ghost" @click="handleSearch">查询</Button>
        </div>
      </div>
      <div class="dt-search-operation">
        <Button type="info" @click="handleOrder">排序</Button>
        <Button type="info" @click="handleAdd">新增</Button>
      </div>
    </div>
    <dt-table ref="table" url="mallgoods/list" :params="params" :columns="columns"></dt-table>
    <Modal v-model="modal1" :title="modelTitle" :mask-closable="false">
      <Form ref="form" :model="formData" :rules="rule" :label-width="100">
        <FormItem label="商品名称" prop="goods_name">
          <Input v-model="formData.goods_name" placeholder="请输入商品名称"></Input>
        </FormItem>
        <FormItem label="价格" prop="price_now">
          <Input v-model="formData.price_now" placeholder="请输入价格">
            <span slot="append">元</span>
          </Input>
        </FormItem>
        <FormItem label="原价" prop="price_original">
          <Input v-model="formData.price_original" placeholder="请输入原价">
            <span slot="append">元</span>
          </Input>
        </FormItem>
        <FormItem label="上架" prop="on_sale">
          <RadioGroup v-model="formData.on_sale">
            <Radio label="1">是</Radio>
            <Radio label="2">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="分类" prop="category_id">
          <Select v-model="formData.category_id">
            <Option
              v-for="item in categoryList"
              :value="item.id"
              :key="item.id"
            >{{ item.cate_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="商品属性" prop="form3">
          <span @click="handleProperty">添加属性</span>
        </FormItem>
        <FormItem label="商品主图" prop="form1">
          <div v-for="(item,index) in imageList" class="formListImg">
            <img class="formItemImg" :src="item">
            <Icon class="delImg" type="close" @click.native="delImg(imageList, index)"/>
          </div>
          <Upload
            type="drag"
            action="/index.php/admin/upload/upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :data="uploadData"
            name="image"
            accept=".png, .jpg, .jpeg, .gif"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
          >
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>上传图片</p>
            </div>
          </Upload>
        </FormItem>
        <FormItem label="商品详情" prop="descr">
          <span @click="handleEditor">添加详情</span>
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
          <td>{{item.goods_name}}</td>
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
    <Modal
      v-model="modal3"
      title="商品属性"
      :mask-closable="false"
      @on-cancel="modal3 = false, modal1 = true"
    >
      <Button type="ghost" @click="addList">添加属性</Button>
      <div class="table" v-for="(item,index) in propertyList">
        <div class="table-flex">
          <div class="table-name">属性名：</div>
          <Input class="table-input" v-model="item.name" placeholder="请输入属性名"></Input>
          <Button class="table-button" type="ghost" @click="addItem(item)">添加属性值</Button>
          <Button type="info" @click="delList(propertyList, index)">删除属性值</Button>
        </div>
        <table style="width: 100%;text-align: left;">
          <tr>
            <th>属性值</th>
            <th>属性价格</th>
            <th>操作</th>
          </tr>
          <tr v-for="(item2,index2) in item.detail">
            <td>
              <Input v-model="item2.value" placeholder="请输入属性值"></Input>
            </td>
            <td>
              <Input v-model="item2.price" placeholder="请输入属性价格"></Input>
            </td>
            <td>
              <span class="span-del" @click="delItem(item.detail, index2)">删除</span>
            </td>
          </tr>
        </table>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="handleSubmit3()">保存</Button>
        <Button type="text" @click="modal3 = false, modal1 = true" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="modal4"
      title="商品详情"
      :mask-closable="false"
      @on-cancel="modal4 = false, modal1 = true"
      width="1000"
    >
      <Row :gutter="100">
        <Col span="12">
          <div id="editor-toolbar2" class="editor-toolbar"></div>
          <div id="editor-content2" class="editor-content"></div>
        </Col>
        <Col span="8">
          <div class="preview-phone">
            <div class="preview-html">
              <span v-html="content"></span>
            </div>
          </div>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="ghost" @click="handleSubmit4()">保存</Button>
        <Button type="text" @click="modal4 = false, modal1 = true" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import WangeEditor from "wangeditor";
export default {
  data() {
    return {
      uploadData: {
        target: "mallbanner"
      },
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
        { title: "商品名称", key: "goods_name" },
        {
          title: "图片",
          key: "image",
          render: (h, params) => {
            const label = params.row.image;
            return h("img", {
              class: "span-img",
              attrs: {
                src: label
              }
            });
          }
        },
        { title: "价格", key: "price_now" },
        { title: "原价", key: "price_original" },
        { title: "销量", key: "sale_total" },
        {
          title: "上架",
          key: "on_sale",
          render: (h, params) => {
            const obj = { "1": "是", "2": "否" };
            const label = obj[params.row.on_sale];
            return h("span", {}, label);
          }
        },
        {
          title: "分类",
          key: "category",
          render: (h, params) => {
            const label = params.row.category && params.row.category.cate_name;
            return h("span", {}, label);
          }
        },
        {
          title: "操作",
          width: 200,
          key: "operation",
          render: (h, params) => {
            const obj = { "2": "上架", "1": "下架" };
            const label = obj[params.row.on_sale];
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
                      this.handleRemove("mallgoods/del", { id: params.row.id });
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
      categoryList: [],
      defaultList: [],
      imageList: [],
      formData: {
        goods_name: "",
        price_now: "",
        price_original: "",
        on_sale: "1",
        category_id: "",
        attr: [],
        image: "",
        descr: ""
      },
      rule: {},
      modal2: false,
      list2: [],
      modal3: false,
      propertyList: [
        {
          name: "",
          detail: [
            {
              value: "",
              price: ""
            }
          ]
        }
      ],
      modal4: false,
      editor: "",
      content: ""
    };
  },
  computed: {
    modelTitle() {
      return this.itemId ? "编辑" : "新增";
    }
  },
  mounted() {
    this.getCategoryList();
  },
  methods: {
    handleStatus(item) {
      this.$post("mallgoods/salestatus", {
        id: item.id,
        on_sale: item.on_sale == "1" ? "2" : "1"
      }).then(res => {
        this.handleSearch();
      });
    },
    handleAdd() {
      this.modal1 = true;
      this.itemId = 0;
      this.imageList = [];
      this.getCategoryList();
      this.$refs.form.resetFields();
    },
    handleEdit(item) {
      this.modal1 = true;
      this.itemId = item.id;
      this.getCategoryList();
      this.formData = Object.assign(this.formData, item);
      this.propertyList = Object.assign([], item.attr);
      this.imageList = Object.assign([], item.image && item.image.split(","));
    },
    getCategoryList() {
      this.$post("mallcategory/list", { page_size: 0 }).then(res => {
        this.categoryList = res.data;
        this.categoryList.push({
          cate_name: "全部",
          ctime: "0",
          id: "0"
        });
      });
    },
    beforeUpload() {
      if (this.imageList.length < 9) {
        return true;
      } else {
        return false;
      }
    },
    onSuccess(response, file, fileList) {
      this.imageList.push(response.data.path);
    },
    handleSubmit() {
      const params = {
        goods_name: this.formData.goods_name,
        price_now: this.formData.price_now,
        price_original: this.formData.price_original,
        on_sale: this.formData.on_sale,
        category_id: this.formData.category_id,
        attr: JSON.stringify(this.formData.attr),
        image: this.imageList.join(),
        descr: this.formData.descr
      };
      if (this.itemId) {
        this.$post("mallgoods/edit", {
          id: this.itemId,
          ...params
        }).then(res => {
          this.modal1 = false;
          this.handleSearch();
        });
      } else {
        this.$post("mallgoods/add", {
          ...params
        }).then(res => {
          this.modal1 = false;
          this.handleSearch();
        });
      }
    },
    delImg(list, index) {
      list.splice(index, 1);
    },
    handleOrder() {
      this.modal2 = true;
      this.$post("mallgoods/list", {}).then(res => {
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
      this.$post("mallgoods/sort", {
        params: JSON.stringify(params)
      }).then(res => {
        this.modal2 = false;
        this.handleSearch();
      });
    },
    // 添加商品属性
    handleProperty() {
      //新增时,初始化列表
      if (!this.itemId) {
        this.propertyList = [
          {
            name: "",
            detail: [
              {
                value: "",
                price: ""
              }
            ]
          }
        ];
      }
      this.modal1 = false;
      this.modal3 = true;
    },
    addList() {
      this.propertyList.push({
        name: "",
        detail: [
          {
            value: "",
            price: ""
          }
        ]
      });
    },
    delList(list, index) {
      list.splice(index, 1);
    },
    addItem(item) {
      item.detail.push({
        value: "",
        price: ""
      });
    },
    delItem(detail, index2) {
      detail.splice(index2, 1);
    },
    handleSubmit3() {
      this.formData.attr = Object.assign([], this.propertyList);
      this.modal3 = false;
      this.modal1 = true;
    },
    // 添加商品详情
    handleEditor() {
      this.modal4 = true;
      this.modal1 = false;
      if (this.itemId) {
        this.content = this.formData.descr;
        this.editor.txt.html(this.formData.descr);
      } else {
        this.content = "";
        this.editor.txt.html("");
      }
    },

    handleSubmit4() {
      this.formData.descr = this.content;
      this.modal4 = false;
      this.modal1 = true;
    },
    handleUp(item) {
      let params = {
        id: item.id,
        trend: 1
      };
      this.$post("mallgoods/move", params).then(res => {
        this.$Message.success("上移成功");
        this.handleSearch();
      });
    },
    handleDown(item) {
      let params = {
        id: item.id,
        trend: 2
      };
      this.$post("mallgoods/move", params).then(res => {
        this.$Message.success("下移成功");
        this.handleSearch();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.formListImg {
  display: inline-block;
  position: relative;
  .delImg {
    position: absolute;
    z-index: 2;
    width: 16px;
    height: 16px;
    top: 5px;
    right: 10px;
  }
}
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