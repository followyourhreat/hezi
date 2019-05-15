<template>
  <div class="page">
    <div class="dt-search-top">
      <div class="dt-search-cells">
        <div class="dt-search-cell">
          <Input v-model="params.keyword" class="dt-search-input" placeholder="流水号、订单号、用户账号查询" />
        </div>
        <div class="dt-search-cell">
          支付类型：<dt-select v-model="params.pay_way" class="dt-search-select" url="financeType"/>
        </div>
        <div class="dt-search-cell">
          交易时间：<dt-selectDate @on-select="selectDate" />
        </div>
        <div class="dt-search-cell">
          <Button type="ghost" @click="handleSearch">查询</Button>
        </div>
      </div>
      <div class="dt-search-operation">
        <Button type="info" @click="handleExport">导出</Button>
      </div>
    </div>
    <dt-table ref="table" url="finance/list" :params="params" :columns="columns"></dt-table>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        params: {
          keyword: '',
          pay_way: '0',
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
          { title: '流水号', key: 'notify_trade_no' },
          { title: '订单号', key: 'order_code' },
          { title: '交易金额', key: 'real_price' },
          { title: '支付类型', 
            key: 'pay_way',
            render: (h, params) => {
              const obj = {'1': '支付宝','2': '微信'}
              const label = obj[params.row.pay_way]
              return h('span', {}, label)
            } 
          },
          { title: '购买用户账号', key: 'username' },
          { title: '交易时间',
            key: 'ctime',
            width: 150,
            render: (h, params) => {
              const label = new Date(params.row.ctime*1000).Format("yyyy-MM-dd hh:mm:ss")
              return h('span', {}, label)
            }
          },
        ],
        itemId: 0,
        modal1: false,
        formData: {
          form1: '',
          form2: '',
          form3: '',
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

    },
    methods: {
      selectDate(val) {
        this.params.start_time = val[0]
        this.params.end_time = val[1]
      },
      handleAdd() {
        this.modal1 = true;
        this.itemId = 0;
      },
      handleEdit(item) {
        this.modal1 = true;
        this.itemId = item.id;
      },
      handleSubmit() {
        
      },
      handleExport() {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '确定导出数据 ?',
          onOk: () => {
            this.$post('finance/list',
              {
                ...this.params,
                export: 1
              }
            ).then( res => {
              window.location.href = res.data.filename
            })
          },
          onCancel: () => {

          }
        });
      }
    },
  };
</script>