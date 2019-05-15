<template>
  <div class="page">
    <Col span="6">
        <div class="colPage" style="height: 460px">
          <dt-Section title="任务参与人数排行榜">
            <dt-cell
              v-for="(item, index) in taskrank"
              :key="index"
              :name="item.task_name"
              :number="item.join_num"
              unit="人"
              :width="`${item.percent}%`"
            ></dt-cell>
          </dt-Section>
        </div>
      </Col>
      <Col span="6">
        <div class="colPage" style="height: 460px">
          <dt-Section title="积分兑换商品排行榜">
           <dt-cell
              v-for="(item, index) in taskrank"
              :key="index"
              :name="item.task_name"
              :number="item.join_num"
              unit="人"
              :width="`${item.percent}%`"
            ></dt-cell>
          </dt-Section>
        </div>
      </Col>
      <Col span="6">
        <div class="colPage" style="height: 460px">
          <dt-Section title="设备地区排行榜">
            <dt-cell
              v-for="(item, index) in taskrank"
              :key="index"
              :name="item.task_name"
              :number="item.join_num"
              unit="人"
              :width="`${item.percent}%`"
            ></dt-cell>
          </dt-Section>
        </div>
      </Col>
      <Col span="6">
        <div class="colPage" style="height: 460px">
          <dt-Section title="设备地区排行榜">
            <dt-cell
              v-for="(item, index) in taskrank"
              :key="index"
              :name="item.task_name"
              :number="item.join_num"
              unit="人"
              :width="`${item.percent}%`"
            ></dt-cell>
          </dt-Section>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
import WangeEditor from "wangeditor";
export default {
  data() {
    return {
    
     taskrank: []
    };
  },
  computed: {
  
  },
  mounted() {
     this.getTaskRank();
  },
  methods: {
     //参与人数排行榜
    getTaskRank() {
      this.$post("statistic/taskrank", {}).then(res => {
        this.taskrank = res.data;
      });
    },
  }
};
</script>