<template>
  <div class="page">
    <div class="dt-search-top">
      <div class="dt-search-cells">
        <div class="dt-search-cell">
          <Input v-model="params.keyword" class="dt-search-input" placeholder="请输入勋章名称、勋章描述查询"/>
        </div>
        <div class="dt-search-cell">
          <Button type="ghost" @click="handleSearch">查询</Button>
        </div>
      </div>
      <div class="dt-search-operation">
        <Button type="info" @click="handleAdd">新增</Button>
      </div>
    </div>
    <dt-table ref="table" url="medal/list" :params="params" :columns="columns"></dt-table>
    <Modal v-model="modal1" :title="modelTitle" :mask-closable="false">
      <Form ref="form" :model="formData" :rules="rule" :label-width="100">
        <FormItem label="勋章名称" prop="medal_name">
          <Input v-model="formData.medal_name" placeholder="请输入勋章名称"></Input>
        </FormItem>
        <FormItem label="勋章描述" prop="descr">
          <span @click="handleEditor">添加详情</span>
          <!-- <Input v-model="formData.descr" placeholder="请输入勋章描述" type="textarea"></Input> -->
        </FormItem>
        <FormItem label="勋章图标" prop="icon_inactive">
          <img v-if="formData.icon_inactive" class="formItemImg" :src="formData.icon_inactive">
          <Upload
            type="drag"
            action="/index.php/admin/upload/upload"
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
        <FormItem label="点亮图标" prop="icon_active">
          <img v-if="formData.icon_active" class="formItemImg" :src="formData.icon_active">
          <Upload
            type="drag"
            action="/index.php/admin/upload/upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :data="uploadData"
            name="image"
            accept=".png, .jpg, .jpeg, .gif"
            :on-success="onSuccess2"
          >
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>上传图片</p>
            </div>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="handleSubmit()">保存</Button>
        <Button type="text" @click="modal1 = false" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal v-model="modal3" title="勋章规则" :mask-closable="false">
      <Form ref="form3" :model="formData3" :rules="rule3" :label-width="100">
        <FormItem label="刷牙地点个数" prop="brush_site_num">
          <Input v-model="formData3.brush_site_num" placeholder="请输入刷牙地点个数"></Input>
        </FormItem>
        <FormItem label="早上刷牙时间" prop="brush_time">
          <TimePicker
            :value="formData3.brush_time"
            type="time"
            placeholder="请选择刷牙时间"
            format="HH:mm"
            @on-change="dateChange1"
          ></TimePicker>
        </FormItem>
        <FormItem label="晚上刷牙时间" prop="brush_time_evening">
          <TimePicker
            :value="formData3.brush_time_evening"
            type="time"
            placeholder="请选择刷牙时间"
            format="HH:mm"
            @on-change="dateChange2"
          ></TimePicker>
        </FormItem>
        <FormItem label="刷牙完成度" prop="finish_percent">
          <Input v-model="formData3.finish_percent" placeholder="请输入刷牙完成度"></Input>
        </FormItem>
        <FormItem label="日期" prop="form2">
          <dt-selectDate ref="date" @on-select="selectDate"/>
        </FormItem>
        <FormItem label="周期" prop="period">
          <Input v-model="formData3.period" placeholder="请输入周期" style="width: 300px"></Input>
          <Checkbox v-model="formData3.is_series">连续</Checkbox>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="handleSubmit3()">保存</Button>
        <Button type="text" @click="modal3 = false" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal
      v-model="modal4"
      title="勋章详情"
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
        target: "taskbanner"
      },
      params: {
        keyword: ""
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
        {
          title: "积分类型",
          key: "ctime",
          render: (h, params) => {
            const label = new Date(params.row.ctime * 1000).Format(
              "yyyy-MM-dd hh:mm"
            );
            return h("span", {}, label);
          }
        },
        {
          title: "开始日期",
          key: "start_date",
          render: (h, params) => {
            const label = new Date(params.row.start_date * 1000).Format(
              "yyyy-MM-dd hh:mm"
            );
            return h("span", {}, label);
          }
        },
        {
          title: "技术日期",
          key: "ctime",
          render: (h, params) => {
            const label = new Date(params.row.ctime * 1000).Format(
              "yyyy-MM-dd hh:mm"
            );
            return h("span", {}, label);
          }
        },
        { title: "状态", key: "finish_percent" },
        {
          title: "创建日期",
          key: "start_date",
          render: (h, params) => {
            const label = new Date(params.row.start_date * 1000).Format(
              "yyyy-MM-dd hh:mm"
            );
            return h("span", {}, label);
          }
        },
        { title: "激活日期", key: "brush_time" },

        {
          title: "操作",
          width: 150,
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
                      this.handleRemove("medal/del", { id: params.row.id });
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
      defaultList: [],
      formData: {
        medal_name: "",
        descr: "",
        icon_inactive: "",
        icon_active: ""
      },
      rule: {},
      modal3: false,
      formData3: {
        brush_site_num: "",
        brush_time: "",
        brush_time_evening: "",
        finish_percent: "",
        start_date: "",
        end_date: "",
        period: "",
        is_series: true
      },
      rule3: {},
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
    // this.handleCreate();
  },
  methods: {
    handleAdd() {
      this.modal1 = true;
      this.itemId = 0;
      this.$refs.form.resetFields();
    },
    handleEdit(item) {
      this.modal1 = true;
      this.itemId = item.id;
      this.formData = Object.assign(this.formData, item);
    },
    handleSubmit() {
      const params = {
        medal_name: this.formData.medal_name,
        descr: this.formData.descr,
        icon_inactive: this.formData.icon_inactive,
        icon_active: this.formData.icon_active
      };
      if (this.itemId) {
        this.$post("medal/edit", {
          ...params,
          id: this.itemId
        }).then(res => {
          this.modal1 = false;
          this.handleSearch();
        });
      } else {
        this.$post("medal/add", {
          ...params
        }).then(res => {
          this.modal1 = false;
          this.handleSearch();
        });
      }
    },
    onSuccess(response, file, fileList) {
      this.formData.icon_inactive = response.data.path;
    },
    onSuccess2(response, file, fileList) {
      this.formData.icon_active = response.data.path;
    },
    dateChange1(val) {
      this.formData3.brush_time = val;
    },
    dateChange2(val) {
      this.formData3.brush_time_evening = val;
    },
    selectDate(val) {
      this.formData3.start_date = val[0];
      this.formData3.end_date = val[1];
    },
    handleRule(item) {
      this.modal3 = true;
      this.itemId = item.id;
      this.formData3 = Object.assign(this.formData3, item);
      this.formData3.is_series = item.is_series == "1" ? true : false;
      // this.formData3.brush_time = new Date(item.brush_time*1000).Format("yyyy-MM-dd");
      this.formData3.start_date = new Date(item.start_date * 1000).Format(
        "yyyy-MM-dd"
      );
      this.formData3.end_date = new Date(item.end_date * 1000).Format(
        "yyyy-MM-dd"
      );
      this.$refs.date.setDate(
        this.formData3.start_date,
        this.formData3.end_date
      );
    },
    handleSubmit3() {
      const params = {
        brush_site_num: this.formData3.brush_site_num,
        brush_time: this.formData3.brush_time,
        brush_time_evening: this.formData3.brush_time_evening,
        finish_percent: this.formData3.finish_percent,
        start_date: this.formData3.start_date,
        end_date: this.formData3.end_date,
        period: this.formData3.period,
        is_series: this.formData3.is_series ? "1" : "2"
      };
      this.$post("medal/editrule", {
        ...params,
        id: this.itemId
      }).then(res => {
        this.modal3 = false;
        this.handleSearch();
      });
    },
    handleExport() {},
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
    }
  }
};
</script>