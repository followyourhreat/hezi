<template>
  <div style="padding: 10px">
    <Row>
      <Col span="16" style="height: 800px">
        <Row>
          <Col span="8">
            <div class="colPage" style="height: 300px">
              <div
                style="height: 300px;display: flex;justify-content: space-around;align-content: flex-start;"
              >
                <div>
                  <p class="podium"></p>
                  <p>昨日销售额</p>
                  <h3 class="number text-red">{{index.day_money}}</h3>
                  <p>本月销售额</p>
                  <h3 class="number">{{index.month_money}}</h3>
                </div>
                <div>
                  <p class="briefcase"></p>
                  <p>昨日商品出售数(件)</p>
                  <h3 class="number text-red">{{index.day_num}}</h3>
                  <p>本月商品出售数(件)</p>
                  <h3 class="number">{{index.month_num}}</h3>
                </div>
              </div>
            </div>
          </Col>
          <Col span="16">
            <div class="colPage" style="height: 300px">
              <dt-Section title="新增用户数">
                <ButtonGroup slot="action">
                  <Button :type="date==7?'ghost':'info'" @click="handleDate(7)">最近7天</Button>
                  <Button :type="date==30?'ghost':'info'" @click="handleDate(30)">最近30天</Button>
                </ButtonGroup>
                <dt-CheckNoData :isNoData="!trendData.length">
                  <dt-Trend color="#ff0000" name="新增用户" :total="userageTotal" :data="trendData"/>
                </dt-CheckNoData>
              </dt-Section>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <div class="colPage" style="height: 460px">
              <dt-Section title="商品销售量排行榜">
                <dt-cell
                  v-for="(item, index) in goodsrank"
                  :key="index"
                  :name="item.goods_name"
                  :number="item.sale_total"
                  unit="件"
                  :width="`${item.percent}%`"
                ></dt-cell>
              </dt-Section>
            </div>
          </Col>
          <Col span="12">
            <div class="colPage" style="height: 460px">
              <dt-Section :title="`用户年龄分段(${userageTotal}人)`">
                <dt-circle container="container1" :seriesData="userage"></dt-circle>
              </dt-Section>
              <dt-Section :title="`用户性别比例(${usersexTotal}人)`">
                <dt-circle container="container2" :seriesData="usersex"></dt-circle>
              </dt-Section>
            </div>
          </Col>
        </Row>
      </Col>
      <Col span="8" style="height: 800px">
        <div class="colPage sale_rank" style="height: 780px">
          <dt-Section title="销售地区排行榜">
            <!-- <dt-Map :mapData="mapData"/> -->
            <!-- <div id="container"></div> -->
            <dt-world :worldList="worldList"/>
            <Table
              ref="table"
              :data="arrList"
              :columns="columns"
              no-data-text="暂时没有数据"
              style="margin: 0px 10px;"
            ></Table>
          </dt-Section>
        </div>
      </Col>
    </Row>
    <Row>
      <Col span="8">
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
      <Col span="8">
        <div class="colPage" style="height: 460px">
          <dt-Section title="积分兑换商品排行榜">
            <dt-cell
              v-for="(item, index) in pointsgoods"
              :key="index"
              :name="item.goods_name"
              :number="item.points"
              unit="积分"
              :width="`${item.percent}%`"
            ></dt-cell>
          </dt-Section>
        </div>
      </Col>
      <Col span="8">
        <div class="colPage" style="height: 460px">
          <dt-Section title="设备地区排行榜">
            <dt-cell
              v-for="(item, index) in devicearea"
              :key="index"
              :name="item.province"
              :number="item.device_num"
              unit="件"
              :width="`${item.percent}%`"
            ></dt-cell>
          </dt-Section>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script >
export default {
  data() {
    return {
      index: {},
      date: 7,
      trendData: [],
      mapData: [],
      worldList: [],
      arrList: [],
      columns: [
        { title: "排名", key: "rank" },
        { title: "地区名称", key: "province" },
        {
          title: "交易额",
          key: "total_money",
          render: (h, params) => {
            return h("span", "¥ " + params.row.total_money);
          },
          className: "demo-table-info-column"
        }
      ],
      userage: [],
      userageTotal: "",
      usersex: [],
      usersexTotal: "",
      goodsrank: [],
      taskrank: [],
      pointsgoods: [],
      devicearea: []
    };
  },
  mounted() {
    this.getIndex();
    this.getAge();
    this.getNew();
    this.getSex();
    // this.getGoodRank();
    this.getTaskRank();
    this.getPointRank();
    this.getDeviceList();
    this.worldInit();
    // this.mapInit();
    // this.trendData = [['2018-11-01',10],['2018-11-02',24],['2018-11-03',8],['2018-11-04',40],['2018-11-05',16]];
    // this.mapData = [{city: '广西', value: '10'},{city: '广东', value: '20'},{city: '北京', value: '30'}];
  },
  methods: {
    //切换时间
    handleDate(val) {
      this.date = val;
      this.getNew();
    },
    //商品统计
    getIndex() {
      this.$post("statistic/index", {}).then(res => {
        this.index = res.data;
        this.mapData = res.data.rank.map(item => {
          return { city: item.province, value: Number(item.total_money) };
        });
        this.arrList = res.data.rank;
      });
    },
    //新增用户
    getNew() {
      this.$post("statistic/usernew", { range: this.date }).then(res => {
        this.trendData = res.data.trends.map(item => {
          return [item.date, Number(item.new_user)];
        });
        console.log(this.trendData);
      });
    },
    //年龄
    getAge() {
      this.$post("statistic/userage", {}).then(res => {
        var arr = res.data;
        this.userageTotal = arr.total_user;
        //获取总用户数
        this.usersTotal = arr.total_user;
        this.userage = [
          ["小于5岁", Number(arr.age_lt_5)],
          ["5-10岁", Number(arr.age_5_10)],
          ["10-15岁", Number(arr.age_10_15)],
          ["15-20岁", Number(arr.age_15_20)],
          ["20-25岁", Number(arr.age_20_25)],
          ["25-30岁", Number(arr.age_25_30)],
          ["30-35岁", Number(arr.age_30_35)],
          ["35-40岁", Number(arr.age_35_40)],
          ["40-45岁", Number(arr.age_40_45)],
          ["45-50岁", Number(arr.age_45_50)],
          ["大于50岁", Number(arr.age_gt_55)]
        ];
      });
    },
    //性别
    getSex() {
      this.$post("statistic/usersex", {}).then(res => {
        var arr = res.data;
        this.usersexTotal = arr.total_user;
        this.usersex = [
          ["男性", Number(arr.male_user)],
          ["女性", Number(arr.female_user)],
          ["未知", Number(arr.unknow_sex)]
        ];
      });
    },
    //商品销量排行榜
    getGoodRank() {
      this.$post("statistic/goodsrank", {}).then(res => {
        this.goodsrank = res.data;
      });
    },
    //参与人数排行榜
    getTaskRank() {
      this.$post("statistic/taskrank", {}).then(res => {
        this.taskrank = res.data;
      });
    },
    //兑换商品排行榜
    getPointRank() {
      this.$post("statistic/pointsgoods", {}).then(res => {
        this.pointsgoods = res.data;
      });
    },
    //设备地区排行榜
    getDeviceList() {
      this.$post("statistic/devicearea", {}).then(res => {
        this.devicearea = res.data;
      });
    },
    worldInit() {
      this.worldList = [
        { code: "AF", value: 53, name: "Afghanistan" },
        { code: "AL", value: 117, name: "Albania" },
        { code: "DZ", value: 15, name: "Algeria" },
        { code: "AS", value: 342, name: "American Samoa" },
        { code: "AD", value: 181, name: "Andorra" },
        { code: "AO", value: 15, name: "Angola" },
        { code: "AI", value: 202, name: "Antigua and Barbuda" },
        { code: "AR", value: 15, name: "Argentina" },
        { code: "AM", value: 109, name: "Armenia" },
        { code: "AW", value: 597, name: "Aruba" },
        { code: "AU", value: 3, name: "Australia" },
        { code: "AT", value: 102, name: "Austria" },
        { code: "AZ", value: 110, name: "Azerbaijan" },
        { code: "BS", value: 34, name: "Bahamas, The" },
        { code: "BH", value: 1660, name: "Bahrain" },
        { code: "BD", value: 1142, name: "Bangladesh" },
        { code: "BB", value: 636, name: "Barbados" },
        { code: "BY", value: 47, name: "Belarus" },
        { code: "BE", value: 359, name: "Belgium" },
        { code: "BZ", value: 15, name: "Belize" },
        { code: "BJ", value: 80, name: "Benin" },
        { code: "BM", value: 1292, name: "Bermuda" },
        { code: "BT", value: 19, name: "Bhutan" },
        { code: "BO", value: 9, name: "Bolivia" },
        { code: "BA", value: 73, name: "Bosnia and Herzegovina" },
        { code: "BW", value: 4, name: "Botswana" },
        { code: "BR", value: 23, name: "Brazil" },
        { code: "BN", value: 76, name: "Brunei Darussalam" },
        { code: "BG", value: 69, name: "Bulgaria" },
        { code: "BF", value: 60, name: "Burkina Faso" },
        { code: "BI", value: 326, name: "Burundi" },
        { code: "KH", value: 80, name: "Cambodia" },
        { code: "CM", value: 41, name: "Cameroon" },
        { code: "CA", value: 4, name: "Canada" },
        { code: "CV", value: 123, name: "Cape Verde" },
        { code: "KY", value: 234, name: "Cayman Islands" },
        { code: "CF", value: 7, name: "Central African Republic" },
        { code: "TD", value: 9, name: "Chad" },
        { code: "CL", value: 23, name: "Chile" },
        { code: "CN", value: 1600, name: "China" },
        { code: "CO", value: 42, name: "Colombia" },
        { code: "KM", value: 395, name: "Comoros" },
        { code: "CD", value: 29, name: "Congo, Dem. Rep." },
        { code: "CG", value: 12, name: "Congo, Rep." },
        { code: "CR", value: 91, name: "Costa Rica" },
        { code: "CI", value: 62, name: "Cote d'Ivoire" },
        { code: "HR", value: 79, name: "Croatia" },
        { code: "CU", value: 106, name: "Cuba" },
        { code: "CW", value: 321, name: "Curacao" },
        { code: "CY", value: 119, name: "Cyprus" },
        { code: "CZ", value: 136, name: "Czech Republic" },
        { code: "DK", value: 131, name: "Denmark" },
        { code: "DJ", value: 38, name: "Djibouti" },
        { code: "DM", value: 90, name: "Dominica" },
        { code: "DO", value: 205, name: "Dominican Republic" },
        { code: "EC", value: 58, name: "Ecuador" },
        { code: "EG", value: 81, name: "Egypt, Arab Rep." },
        { code: "SV", value: 299, name: "El Salvador" },
        { code: "GQ", value: 25, name: "Equatorial Guinea" },
        { code: "ER", value: 52, name: "Eritrea" },
        { code: "EE", value: 32, name: "Estonia" },
        { code: "ET", value: 83, name: "Ethiopia" },
        { code: "FO", value: 35, name: "Faeroe Islands" },
        { code: "FJ", value: 47, name: "Fiji" },
        { code: "FI", value: 18, name: "Finland" },
        { code: "FR", value: 118, name: "France" },
        { code: "PF", value: 74, name: "French Polynesia" },
        { code: "GA", value: 6, name: "Gabon" },
        { code: "GM", value: 173, name: "Gambia, The" },
        { code: "GE", value: 78, name: "Georgia" },
        { code: "DE", value: 234, name: "Germany" },
        { code: "GH", value: 107, name: "Ghana" },
        { code: "GR", value: 88, name: "Greece" },
        { code: "GL", value: 0, name: "Greenland" },
        { code: "GD", value: 307, name: "Grenada" },
        { code: "GU", value: 333, name: "Guam" },
        { code: "GT", value: 134, name: "Guatemala" },
        { code: "GN", value: 41, name: "Guinea" },
        { code: "GW", value: 54, name: "Guinea-Bissau" },
        { code: "GY", value: 4, name: "Guyana" },
        { code: "HT", value: 363, name: "Haiti" },
        { code: "HN", value: 68, name: "Honduras" },
        { code: "HK", value: 6783, name: "Hong Kong SAR, China" },
        { code: "HU", value: 112, name: "Hungary" },
        { code: "IS", value: 3, name: "Iceland" },
        { code: "IN", value: 394, name: "India" },
        { code: "ID", value: 132, name: "Indonesia" },
        { code: "IR", value: 45, name: "Iran, Islamic Rep." },
        { code: "IQ", value: 73, name: "Iraq" },
        { code: "IE", value: 65, name: "Ireland" },
        { code: "IM", value: 145, name: "Isle of Man" },
        { code: "IL", value: 352, name: "Israel" },
        { code: "IT", value: 206, name: "Italy" },
        { code: "JM", value: 250, name: "Jamaica" },
        { code: "JP", value: 350, name: "Japan" },
        { code: "JO", value: 69, name: "Jordan" },
        { code: "KZ", value: 6, name: "Kazakhstan" },
        { code: "KE", value: 71, name: "Kenya" },
        { code: "KI", value: 123, name: "Kiribati" },
        { code: "KP", value: 202, name: "Korea, Dem. Rep." },
        { code: "KR", value: 504, name: "Korea, Rep." },
        { code: "XK", value: 167, name: "Kosovo" },
        { code: "KW", value: 154, name: "Kuwait" },
        { code: "KG", value: 28, name: "Kyrgyz Republic" },
        { code: "LA", value: 27, name: "Lao PDR" },
        { code: "LV", value: 36, name: "Latvia" },
        { code: "LB", value: 413, name: "Lebanon" },
        { code: "LS", value: 72, name: "Lesotho" },
        { code: "LR", value: 41, name: "Liberia" },
        { code: "LY", value: 4, name: "Libya" },
        { code: "LI", value: 225, name: "Liechtenstein" },
        { code: "LT", value: 53, name: "Lithuania" },
        { code: "LU", value: 195, name: "Luxembourg" },
        { code: "MO", value: 19416, name: "Macao SAR, China" },
        { code: "MK", value: 82, name: "Macedonia, FYR" },
        { code: "MG", value: 36, name: "Madagascar" },
        { code: "MW", value: 158, name: "Malawi" },
        { code: "MY", value: 86, name: "Malaysia" },
        { code: "MV", value: 1053, name: "Maldives" },
        { code: "ML", value: 13, name: "Mali" },
        { code: "MT", value: 1291, name: "Malta" },
        { code: "MH", value: 300, name: "Marshall Islands" },
        { code: "MR", value: 3, name: "Mauritania" },
        { code: "MU", value: 631, name: "Mauritius" },
        { code: "YT", value: 552, name: "Mayotte" },
        { code: "MX", value: 58, name: "Mexico" },
        { code: "FM", value: 159, name: "Micronesia, Fed. Sts." },
        { code: "MD", value: 124, name: "Moldova" },
        { code: "MC", value: 17704, name: "Monaco" },
        { code: "MN", value: 2, name: "Mongolia" },
        { code: "ME", value: 47, name: "Montenegro" },
        { code: "MA", value: 72, name: "Morocco" },
        { code: "MZ", value: 30, name: "Mozambique" },
        { code: "MM", value: 73, name: "Myanmar" },
        { code: "NA", value: 3, name: "Namibia" },
        { code: "NP", value: 209, name: "Nepal" },
        { code: "NL", value: 492, name: "Netherlands" },
        { code: "NC", value: 14, name: "New Caledonia" },
        { code: "NZ", value: 17, name: "New Zealand" },
        { code: "NI", value: 48, name: "Nicaragua" },
        { code: "NE", value: 12, name: "Niger" },
        { code: "NG", value: 174, name: "Nigeria" },
        { code: "MP", value: 132, name: "Northern Mariana Islands" },
        { code: "NO", value: 16, name: "Norway" },
        { code: "OM", value: 9, name: "Oman" },
        { code: "PK", value: 225, name: "Pakistan" },
        { code: "PW", value: 45, name: "Palau" },
        { code: "PA", value: 47, name: "Panama" },
        { code: "PG", value: 15, name: "Papua New Guinea" },
        { code: "PY", value: 16, name: "Paraguay" },
        { code: "PE", value: 23, name: "Peru" },
        { code: "PH", value: 313, name: "Philippines" },
        { code: "PL", value: 126, name: "Poland" },
        { code: "PT", value: 116, name: "Portugal" },
        { code: "PR", value: 449, name: "Puerto Rico" },
        { code: "WA", value: 152, name: "Qatar" },
        { code: "RO", value: 93, name: "Romania" },
        { code: "RU", value: 9, name: "Russian Federation" },
        { code: "RW", value: 431, name: "Rwanda" },
        { code: "WS", value: 65, name: "Samoa" },
        { code: "SM", value: 526, name: "San Marino" },
        { code: "ST", value: 172, name: "Sao Tome and Principe" },
        { code: "SA", value: 14, name: "Saudi Arabia" },
        { code: "SN", value: 65, name: "Senegal" },
        { code: "RS", value: 83, name: "Serbia" },
        { code: "SC", value: 188, name: "Seychelles" },
        { code: "SL", value: 82, name: "Sierra Leone" },
        { code: "SG", value: 7252, name: "Singapore" },
        { code: "SK", value: 113, name: "Slovak Republic" },
        { code: "SI", value: 102, name: "Slovenia" },
        { code: "SB", value: 19, name: "Solomon Islands" },
        { code: "SO", value: 15, name: "Somalia" },
        { code: "ZA", value: 41, name: "South Africa" },
        { code: "SS", value: null, name: "South Sudan" },
        { code: "ES", value: 92, name: "Spain" },
        { code: "LK", value: 333, name: "Sri Lanka" },
        { code: "KN", value: 202, name: "St. Kitts and Nevis" },
        { code: "LC", value: 285, name: "St. Lucia" },
        { code: "MF", value: 556, name: "St. Martin (French part)" },
        {
          code: "VC",
          value: 280,
          name: "St. Vincent and the Grenadines"
        },
        { code: "SD", value: 18, name: "Sudan" },
        { code: "SR", value: 3, name: "Suriname" },
        { code: "SZ", value: 69, name: "Swaziland" },
        { code: "SE", value: 23, name: "Sweden" },
        { code: "CH", value: 196, name: "Switzerland" },
        { code: "SY", value: 111, name: "Syrian Arab Republic" },
        { code: "TJ", value: 49, name: "Tajikistan" },
        { code: "TZ", value: 51, name: "Tanzania" },
        { code: "TH", value: 135, name: "Thailand" },
        { code: "TP", value: 76, name: "Timor-Leste" },
        { code: "TG", value: 111, name: "Togo" },
        { code: "TO", value: 145, name: "Tonga" },
        { code: "TT", value: 261, name: "Trinidad and Tobago" },
        { code: "TN", value: 68, name: "Tunisia" },
        { code: "TR", value: 95, name: "Turkey" },
        { code: "TM", value: 11, name: "Turkmenistan" },
        { code: "TC", value: 40, name: "Turks and Caicos Islands" },
        { code: "TV", value: 328, name: "Tuvalu" },
        { code: "UG", value: 170, name: "Uganda" },
        { code: "UA", value: 79, name: "Ukraine" },
        { code: "AE", value: 90, name: "United Arab Emirates" },
        { code: "UK", value: 257, name: "United Kingdom" },
        { code: "US", value: 34, name: "United States" },
        { code: "UY", value: 19, name: "Uruguay" },
        { code: "UZ", value: 66, name: "Uzbekistan" },
        { code: "VU", value: 20, name: "Vanuatu" },
        { code: "VE", value: 33, name: "Venezuela, RB" },
        { code: "VN", value: 280, name: "Vietnam" },
        { code: "VI", value: 314, name: "Virgin Islands (U.S.)" },
        { code: "PS", value: 690, name: "West Bank and Gaza" },
        { code: "EH", value: 2, name: "Western Sahara" },
        { code: "YE", value: 46, name: "Yemen, Rep." },
        { code: "ZM", value: 17, name: "Zambia" },
        { code: "ZW", value: 32, name: "Zimbabwe" }
      ];
    }
  }
};
</script>
<style lang="less" scoped>
.colPage {
  background: #171721;
  margin: 10px;
}
.title-icon {
  font-size: 20px;
  line-height: 50px;
}
.text-red {
  color: #ff0000;
}
.number {
  line-height: 100px;
  font-size: 30px;
}
.podium {
  margin: 20px 0px 10px 0px;
  height: 28px;
  background: url("../../assets/sale_total.png") no-repeat;
}
.briefcase {
  margin: 20px 0px 10px 0px;
  height: 28px;
  background: url("../../assets/ic_shopping.png") no-repeat;
}
</style>