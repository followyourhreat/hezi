<template>
  <div class="page">
    <Tabs :animated="false">
      <TabPane label="日志管理" name="name1" v-if="tab[0].checked">
        <log/>
      </TabPane>
      <TabPane label="模块日志管理" name="name2" v-if="tab[1].checked">
        <logmodule/>
      </TabPane>
      <TabPane label="模块状态管理" name="name3" v-if="tab[2].checked">
        <modulestate/>
      </TabPane>
      <TabPane label="WiFi模块管理" name="name4" v-if="tab[3].checked">
        <wifi/>
      </TabPane>
      <TabPane label="扫地机复位" name="name5" v-if="tab[4].checked">
        <sweeperreset/>
      </TabPane>
      <TabPane label="扫地机升级" name="name6" v-if="tab[5].checked">
        <sweeperUpgrade/>
      </TabPane>
      <TabPane label="语音播报" name="name7" v-if="tab[6].checked">
        <voice/>
      </TabPane>
      <TabPane label="服务器信息查看" name="name8" v-if="tab[7].checked">
        <serviceinfo/>
      </TabPane>
      <TabPane label="平台切换" name="name9" v-if="tab[8].checked">
        <platformswtich/>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>

import log from "./log";
import logmodule from "./logmodule";
import modulestate from "./modulestate";
import wifi from "./wifi";
import sweeperreset from "./sweeper-reset";
import sweeperUpgrade from "./sweeper-Upgrade";
import voice from "./voice.vue";
import serviceinfo from "./service-info.vue";
import platformswtich from "./platform-swtich.vue";
export default {
  components: {
    sweeperreset,
    sweeperUpgrade,
    voice,
    serviceinfo,
    platformswtich,
    log,
    logmodule,
    modulestate,
    wifi,
    platformswtich
  },
  data() {
    var pagesRouter = JSON.parse(localStorage.getItem("menuInfo"));
    return {
      tab: pagesRouter[7].child
    };
  },

  mounted() {},

  methods: {}
};
</script>