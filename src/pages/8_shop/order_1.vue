<template>
  <div>
    <div class="dt-search-top">
      <div class="dt-search-cells">
        <div class="dt-search-cell">
          <Input v-model="params.keyword" class="dt-search-input" placeholder="请输入订单号、下单账号" />
        </div>
        <div class="dt-search-cell">
          <dt-selectDate @on-select="selectDate" />
        </div>
        <div class="dt-search-cell">
          <Button type="ghost" @click="handleSearch">查询</Button>
        </div>
      </div>
      <div class="dt-search-operation">
        
      </div>
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
        <FormItem label="收货人手机">{{formData.address&&formData.address.phone}}</FormItem>
        <FormItem label="收货人地址">{{formData.address&&formData.address.address}}</FormItem>
        <FormItem label="收货人姓名">{{formData.address&&formData.address.realname}}</FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modal1 = false" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        params: {
          keyword: '',
          order_status: '1',
          start_time: '',
          end_time: '',
        },
        columns: [
          { title: '序号',
            key: 'sort',
            width: 60,
            render: (h, params) => {
              const label = params.index + 1;
              return h('span', {}, label)
            }
          },
          { title: '订单号', key: 'order_code' },
          { title: '下单账号', key: 'username' },
          { title: '订单总价', key: 'total_price' },
          { title: '优惠券抵扣', key: 'coupon_minus' },
          { title: '积分抵扣', key: 'points_minus' },
          { title: '需支付', key: 'real_price' },
          { title: '下单时间',
            key: 'ctime',
            width: 150,
              render: (h, params) => {
                const label = new Date(params.row.ctime*1000).Format("yyyy-MM-dd hh:mm:ss")
                return h('span', {}, label)
              }
          },
          { title: '操作',
            width: 150, 
            key: 'operation' ,
            render: (h, params) => {
              return h('div', [
                  h('span', {
                      class: 'span-active',
                      on: {
                        click: () => {
                          this.handleEdit(params.row);
                        }
                      }
                  }, '详情'),
                  h('span', {
                      class: 'span-del',
                      on: {
                        click: () => {
                          this.handleRemove('mallorder/del',{id:params.row.id})
                        }
                      }
                  }, '删除')
              ]);
            }
          }
        ],
        itemId: 0,
        modal1: false,
        expressList: [],
        formData: {
          order_code: '',
          username: '',
          total_price: '',
          coupon_minus: '',
          points_minus: '',
          real_price: '',
          address: {
            phone: '',
            address: '',
            realname: '',
          },
        },
        rule: {
          
        },
      }
    },
    computed: {
      modelTitle(){
        return this.itemId?'详情':'新增'
      }
    }, 
    mounted () {

    },
    methods: {
      selectDate(val) {
        this.params.start_time = val[0]
        this.params.end_time = val[1]
      },
      handleEdit(item) {
        this.modal1 = true;
        this.itemId = item.id;
        this.formData = Object.assign(this.formData,item);
        this.formData.address = item.address?item.address:{phone: '',address: '',realname: ''};
        // this.$post('mallcategory/detail',{id: item.id}).then( res => {
        //   var data = res.data;
        //   this.formData = Object.assign(this.formData,data);
        // })
      },
    },
  };
</script>