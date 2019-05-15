<template>
  <div class="page">
    <Tabs :animated="false" @on-click="onClick">
      <TabPane label="已完成订单" name="name1" v-if="tab[0].checked">
        <order3 ref="order3"/>
      </TabPane>
      <TabPane label="商品banner" name="name2" v-if="tab[1].checked">
        <banner/>
      </TabPane>
      <TabPane label="待发货订单" name="name3" v-if="tab[2].checked">
        <order2/>
      </TabPane>
      <TabPane label="待付款订单" name="name4" v-if="tab[3].checked">
        <order1/>
      </TabPane>
      <TabPane label="结算管理" name="name5" v-if="tab[4].checked">
        <settlement/>
      </TabPane>
      <TabPane label="商品分类" name="name6" v-if="tab[5].checked">
        <type/>
      </TabPane>

      <TabPane label="商品管理" name="name7" v-if="tab[6].checked">
        <manage/>
      </TabPane>
      <TabPane label="售后信息管理" name="name8" v-if="tab[7].checked">
        <service/>
      </TabPane>

      <TabPane label="退款信息管理" name="name9" v-if="tab[8].checked">
        <refund/>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import banner from "./banner";
import type from "./type";
import manage from "./manage";
import order1 from "./order_1";
import order2 from "./order_2";
import order3 from "./order_3";
import settlement from "./settlement.vue";
import service from "./service";
import refund from "./refund";
export default {
  components: {
    banner,
    type,
    manage,
    order1,
    order2,
    order3,
    settlement,
    service,
    refund
  },
  data() {
    var pagesRouter = JSON.parse(localStorage.getItem("menuInfo"));
    return {
      tab: pagesRouter[5].child
    };
  },

  mounted() {
    console.log(JSON.parse(localStorage.getItem("menuInfo"))[5].child);
  },

  methods: {
    onClick(val) {
      if (val == "name6") {
        this.$refs.order3.$refs.table.getList();
      }
    }
  }
};
</script>