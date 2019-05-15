<template>
  <div>
    <div class="dt-search-top">
      <div class="dt-search-cells">
        <div class="dt-search-cell">
          <Input v-model="params.keyword" class="dt-search-input" placeholder="请输入订单号、下单账号"/>
        </div>
        <div class="dt-search-cell">
          <dt-selectDate @on-select="selectDate"/>
        </div>
        <div class="dt-search-cell">
          <dt-select v-model="params.order_status" class="dt-search-select" url="orderStatus"/>
        </div>
        <div class="dt-search-cell">
          <Button type="ghost" @click="handleSearch">查询</Button>
        </div>
      </div>
      <div class="dt-search-operation"></div>
    </div>
    <dt-table ref="table" url="mallorder/list" :params="params" :columns="columns"></dt-table>
    <Modal v-model="modal1" :title="modelTitle" :mask-closable="false">
      <Form ref="form" :model="formData" :rules="rule" :label-width="100">
        <FormItem label="订单号">{{formData.order_code}}</FormItem>
        <FormItem label="下单账号">{{formData.username}}</FormItem>
        <FormItem label="订单总价">{{formData.total_price}}</FormItem>
        <FormItem label="优惠券抵扣">{{formData.coupon_minus}}</FormItem>
        <FormItem label="积分抵扣">{{formData.points_minus}}</FormItem>
        <FormItem label="需支付">{{formData.real_price}}</FormItem>
        <FormItem label="收货人手机">{{formData.address.phone}}</FormItem>
        <FormItem label="收货人地址">{{formData.address.address}}</FormItem>
        <FormItem label="收货人姓名">{{formData.address.realname}}</FormItem>
        <!-- <FormItem label="快递公司" prop="express_name">
          <Select v-model="formData.express_name">
            <Option v-for="item in expressList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>-->
        <FormItem label="快递订单号" prop="express_code">
          <Input v-model="formData.express_code" placeholder="请输入快递订单号"></Input>
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
        order_status: "0",
        start_time: "",
        end_time: ""
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
        { title: "订单号", key: "order_code" },
        { title: "下单账号", key: "username" },
        { title: "订单总价", key: "total_price" },
        { title: "优惠券抵扣", key: "coupon_minus" },
        { title: "积分抵扣", key: "points_minus" },
        { title: "实际支付", key: "real_price" },
        {
          title: "订单状态",
          key: "order_status",
          width: 150,
          render: (h, params) => {
            const obj = {
              "3": "待收货",
              "4": "交易成功",
              "5": "用户取消",
              "6": "交易完成"
            };
            const label = obj[params.row.order_status];
            return h("span", {}, label);
          }
        },
        {
          title: "支付时间",
          key: "notify_time",
          width: 150,
          render: (h, params) => {
            const label = new Date(params.row.notify_time * 1000).Format(
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
                "详情"
              ),
              h(
                "span",
                {
                  class: "span-active",
                  on: {
                    click: () => {
                      this.handleRemove("mallorder/del", { id: params.row.id });
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
      expressList: [],
      formData: {
        order_code: "",
        username: "",
        total_price: "",
        coupon_minus: "",
        points_minus: "",
        real_price: "",
        address: {
          phone: "",
          address: "",
          realname: ""
        },
        express_name: "",
        express_code: ""
      },
      rule: {}
    };
  },
  computed: {
    modelTitle() {
      return this.itemId ? "详情" : "新增";
    }
  },
  mounted() {
    // this.getExpressList();
  },
  methods: {
    getExpressList() {
      this.$post("mallorder/expresslist", {}).then(res => {
        this.expressList = res.data;
      });
    },
    selectDate(val) {
      this.params.start_time = val[0];
      this.params.end_time = val[1];
    },
    handleEdit(item) {
      this.modal1 = true;
      this.itemId = item.id;
      this.formData = Object.assign(this.formData, item);
      this.formData.address = item.address
        ? item.address
        : { phone: "", address: "", realname: "" };
      // this.$post('mallcategory/detail',{id: item.id}).then( res => {
      //   var data = res.data;
      //   this.formData = Object.assign(this.formData,data);
      // })
    },
    handleSubmit() {
      this.$post("mallorder/edit", {
        id: this.itemId,
        // express_name: this.formData.express_name,
        express_code: this.formData.express_code
      }).then(res => {
        this.modal1 = false;
        this.handleSearch();
      });
    }
  }
};
</script>