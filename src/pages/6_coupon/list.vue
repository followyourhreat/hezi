<template>
  <div class="page">
    <div class="dt-search-top">
      <div class="dt-search-cells">
        <div class="dt-search-cell">
          优惠券类型：<dt-select v-model="params.coupon_type" class="dt-search-select" url="couponType"/>
        </div>
        <div class="dt-search-cell">
          领取方式：<dt-select v-model="params.fetch_type" class="dt-search-select" url="couponWay"/>
        </div>
        <div class="dt-search-cell">
          <Button type="ghost" @click="handleSearch">查询</Button>
        </div>
      </div>
      <div class="dt-search-operation">
        <Button type="info" @click="handleAdd">新增</Button>
      </div>
    </div>
    <dt-table ref="table" url="coupon/list" :params="params" :columns="columns"></dt-table>
    <Modal v-model="modal1" :title="modelTitle" :mask-closable="false">
      <Form ref="form" :model="formData" :rules="rule" :label-width="100">
        <FormItem label="优惠券类型" prop="coupon_type">
          <dt-select v-model="formData.coupon_type" class="dt-search-select" url="couponTypeModal"/>
        </FormItem>
        <FormItem label="金额" prop="amount">
          <Input v-model="formData.amount" placeholder="请输入金额"></Input>
        </FormItem>
        <FormItem label="满售可用" prop="use_condition">
          <Input v-model="formData.use_condition" placeholder="请输入满售可用"></Input>
        </FormItem>
        <FormItem label="发放张数" prop="number">
          <Input v-model="formData.number" placeholder="请输入发放张数"></Input>
        </FormItem>
        <FormItem label="领取方式" prop="fetch_type">
          <dt-select v-model="formData.fetch_type" class="dt-search-select" url="couponWayModal"/>
        </FormItem>
        <FormItem label="活动日期" prop="form2">
          <dt-selectDate ref="date" @on-select="selectDate"/>
        </FormItem>
        <FormItem label="有效天数" prop="expire">
          <Input v-model="formData.expire" placeholder="请输入有效天数"></Input>
        </FormItem>
        <FormItem label="商品" prop="goods_id" v-if="formData.coupon_type =='2'">
          <Select v-model="formData.goods_id">
            <Option v-for="item in mallgoodsList" :value="item.id" :key="item.id">{{ item.goods_name }}</Option>
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
    data () {
      return {
        params: {
          keyword: '',
          coupon_type: '0',
          fetch_type: '0',
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
          { title: '优惠券类型', 
            key: 'coupon_type',
            render: (h, params) => {
              const obj = {'1': '全品类优惠券','2': '特定品类优惠券'}
              const label = obj[params.row.coupon_type]
              return h('span', {}, label)
            } 
          },
          { title: '金额', key: 'amount' },
          { title: '满售可用', key: 'use_condition' },
          { title: '发放张数', key: 'number' },
          { title: '领取方式', 
            key: 'fetch_type',
            render: (h, params) => {
              const obj = {'1': '公开领取','2': '奖品领取'}
              const label = obj[params.row.fetch_type]
              return h('span', {}, label)
            } 
          },
          { title: '开始日期',
            key: 'start_date',
            width: 150,
            render: (h, params) => {
              const label = new Date(params.row.start_date*1000).Format("yyyy-MM-dd")
              return h('span', {}, label)
            }
          },
          { title: '结束日期',
            key: 'end_date',
            width: 150,
            render: (h, params) => {
              const label = new Date(params.row.end_date*1000).Format("yyyy-MM-dd")
              return h('span', {}, label)
            }
          },
          { title: '有效天数',
            key: 'expire',
            render: (h, params) => {
              var expire = Number(params.row.expire)
              var label = ''
              if(expire < 0){
                label = '已过期'
              }else if(expire == 0){
                label = '今天过期'
              }else{
                label = expire
              }
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
                  }, '编辑'),
                  h('span', {
                      class: 'span-del',
                      on: {
                        click: () => {
                          this.handleRemove('coupon/del',{id:params.row.id})
                        }
                      }
                  }, '删除')
              ]);
            }
          }
        ],
        itemId: 0,
        modal1: false,
        mallgoodsList: [],
        formData: {
          coupon_type: '',
          amount: '',
          use_condition: '',
          number: '',
          start_date: '',
          end_date: '',
          expire: '',
          goods_id: '',
        },
        rule: {
          
        },
      }
    },
    computed: {
      modelTitle(){
        return this.itemId?'编辑':'新增'
      }
    }, 
    mounted () {
      this.getMallgoodsList();
    },
    methods: {
      getMallgoodsList() {
        this.$post('mallgoods/list',{page_size: 0}).then( res => {
          this.mallgoodsList = res.data;
        })
      },
      selectDate(val) {
        this.formData.start_date = val[0]
        this.formData.end_date = val[1]
      },
      handleAdd() {
        this.modal1 = true;
        this.itemId = 0;
        this.$refs.form.resetFields();
        this.$refs.date.setDate('','');
      },
      handleEdit(item) {
        this.modal1 = true;
        this.itemId = item.id;
        this.formData = Object.assign(this.formData,item);
        this.formData.start_date = new Date(item.start_date*1000).Format("yyyy-MM-dd");
        this.formData.end_date = new Date(item.end_date*1000).Format("yyyy-MM-dd");
        this.$refs.date.setDate(this.formData.start_date,this.formData.end_date);
      },
      handleSubmit() {
        const params = {
          coupon_type: this.formData.coupon_type,
          amount: this.formData.amount,
          use_condition: this.formData.use_condition,
          number: this.formData.number,
          fetch_type: this.formData.fetch_type,
          start_date: this.formData.start_date,
          end_date: this.formData.end_date,
          expire: this.formData.expire,
          goods_id: this.formData.goods_id,
        }
        if(this.itemId){
          this.$post('coupon/edit',
            {
              ...params,
              id: this.itemId
            }
          ).then( res => {
            this.modal1 = false;
            this.handleSearch()
          })
        }else{
          this.$post('coupon/add',
            {
              ...params,
            }
          ).then( res => {
            this.modal1 = false;
            this.handleSearch()
          })
        }
      },
      handleExport() {

      }
    },
  };
</script>