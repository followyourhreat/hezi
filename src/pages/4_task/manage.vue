<template>
  <div>
    <div class="dt-search-top">
      <div class="dt-search-cells">
        <div class="dt-search-cell">
          <Input v-model="params.keyword" class="dt-search-input" placeholder="请输入任务名称" />
        </div>
        <div class="dt-search-cell">
          <Button type="ghost" @click="handleSearch">查询</Button>
        </div>
      </div>
      <div class="dt-search-operation">
        <Button type="info" @click="handleAdd">新增</Button>
      </div>
    </div>
    <dt-table ref="table" url="task/list" :params="params" :columns="columns"></dt-table>
    <Modal v-model="modal1" :title="modelTitle" :mask-closable="false">
      <Form ref="form" :model="formData" :rules="rule" :label-width="100">
        <FormItem label="任务名称" prop="task_name">
          <Input v-model="formData.task_name" placeholder="请输入任务名称" :maxlength="10"></Input>
        </FormItem>
        <FormItem label="任务描述" prop="descr">
          <span @click="handleEditor">添加详情</span><br>(*最佳图片尺寸 宽:1080px 高:1920px)
        </FormItem>
        <FormItem label="分类" prop="category_id">
          <Select v-model="formData.category_id">
            <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{ item.cate_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="可参与地区" prop="bonus_area_code">
          <dt-select v-model="formData.bonus_area_code" url="userProvince" ref="select"/>
        </FormItem>
        <FormItem label="可参与性别" prop="bonus_sex">
          <dt-select v-model="formData.bonus_sex" url="userSex"/>
        </FormItem>
        <FormItem label="可参与年龄段" prop="start_age">
          <dt-select v-model="formData.start_age" url="taskYear" style="width: 150px;"/>
          <dt-select v-model="formData.end_age" url="taskYear" style="width: 150px;"/>
        </FormItem>
        <FormItem label="背景图" prop="image">
          <img v-if="formData.image" class="formItemImg" :src="formData.image" />
          <Upload type="drag" action="/index.php/admin/upload/upload" :show-upload-list="false" :default-file-list="defaultList" :data="uploadData" name="image" accept=".png, .jpg, .jpeg, .gif" :on-success="onSuccess">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>上传图片</p>
            </div>
          </Upload>
        </FormItem>
        <FormItem label="奖励名次" prop="bonus_ranking">
          <Input v-model="formData.bonus_ranking" placeholder="请输入奖励名次"></Input>
        </FormItem>
        <FormItem label="奖品" prop="bonus_type">
          <RadioGroup v-model="formData.bonus_type">
            <Radio label="1">积分</Radio>
            <Radio label="2">优惠券</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="积分" prop="bonus_detail" v-if="formData.bonus_type =='1'">
          <Input v-model="formData.bonus_detail" placeholder="请输入积分"></Input>
        </FormItem>
        <FormItem label="优惠券" prop="bonus_detail" v-if="formData.bonus_type =='2'">
          <Select v-model="formData.bonus_detail">
            <Option v-for="item in couponList" :value="item.id" :key="item.id">{{ item.coupon_name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="handleSubmit()">保存</Button>
        <Button type="text" @click="modal1 = false" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal v-model="modal3" title="任务规则" :mask-closable="false">
      <Form ref="form3" :model="formData3" :rules="rule3" :label-width="100">
        <FormItem label="刷牙地点个数" prop="brush_site_num">
          <Input v-model="formData3.brush_site_num" placeholder="请输入刷牙地点个数"></Input>(*刷牙地点个数越多, 排名越靠前)
        </FormItem>
        <FormItem label="早上刷牙时间" prop="brush_time">
          <!-- <Input v-model="formData3.brush_time" placeholder="请输入刷牙时间"></Input> -->
          <TimePicker :value="formData3.brush_time" type="time" placeholder="请选择刷牙时间" format="HH:mm" @on-change="dateChange1"></TimePicker><br>(*该刷牙时间前后10分钟之内都算有效刷牙)
        </FormItem>
        <FormItem label="中午刷牙时间" prop="brush_time_noon">
          <!-- <Input v-model="formData3.brush_time" placeholder="请输入刷牙时间"></Input> -->
          <TimePicker :value="formData3.brush_time_noon" type="time" placeholder="请选择刷牙时间" format="HH:mm" @on-change="dateChange3"></TimePicker><br>(*该刷牙时间前后10分钟之内都算有效刷牙)
        </FormItem>
        <FormItem label="晚上刷牙时间" prop="brush_time_evening">
          <TimePicker :value="formData3.brush_time_evening" type="time" placeholder="请选择刷牙时间" format="HH:mm" @on-change="dateChange2"></TimePicker><br>(*该刷牙时间前后10分钟之内都算有效刷牙)
        </FormItem>
        <FormItem label="刷牙完成度" prop="finish_percent">
          <Input v-model="formData3.finish_percent" placeholder="请输入刷牙完成度"></Input>
        </FormItem>
        <FormItem label="领取任务日期" prop="form2">
          <dt-selectDate ref="date2" @on-select="selectDate2"/>
        </FormItem>
        <FormItem label="完成任务日期" prop="form2">
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
    <Modal v-model="modal4" title="任务详情" :mask-closable="false" @on-cancel="modal4 = false, modal1 = true" width="1000">
      <Row :gutter="100">
        <Col span="12">
          <div id="editor-toolbar2" class="editor-toolbar"></div>
          <div id="editor-content2" class="editor-content"></div>
        </Col>
        <Col span="8">
          <div class="preview-phone">
            <div class="preview-html"><span v-html="content"></span></div>
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
  import WangeEditor from 'wangeditor';
  export default {
    data () {
      return {
        uploadData: {
          target: 'mallbanner'
        },
        params: {
          keyword: '',
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
          { title: '任务名称', key: 'task_name' },
          // { title: '任务描述', key: 'descr' },
          { title: '类型',
            key: 'bonus_type',
            render: (h, params) => {
              const obj = {'1': '积分','2': '优惠券'}
              const label = obj[params.row.bonus_type]
              return h('span', {}, label)
            }
          },
          { title: '领取开始时间',
            key: 'fetch_start_date',
            width: 120,
              render: (h, params) => {
                const label = new Date(params.row.fetch_start_date*1000).Format("yyyy-MM-dd")
                return h('span', {}, label)
              }
          },
          { title: '领取结束时间',
            key: 'fetch_end_date',
            width: 120,
              render: (h, params) => {
                const label = new Date(params.row.fetch_end_date*1000).Format("yyyy-MM-dd")
                return h('span', {}, label)
              }
          },
          { title: '任务开始时间',
            key: 'start_date',
            width: 120,
              render: (h, params) => {
                const label = new Date(params.row.start_date*1000).Format("yyyy-MM-dd")
                return h('span', {}, label)
              }
          },
          { title: '任务结束时间',
            key: 'end_date',
            width: 120,
              render: (h, params) => {
                const label = new Date(params.row.end_date*1000).Format("yyyy-MM-dd")
                return h('span', {}, label)
              }
          },
          { title: '奖品', key: 'bonus_detail' },
          { title: '奖励名次', key: 'bonus_ranking' },
          { title: '可参与性别',
            key: 'bonus_sex',
            render: (h, params) => {
              const obj = {'0': '所有','1': '男','2': '女'}
              const label = obj[params.row.bonus_sex]
              return h('span', {}, label)
            }
          },
          { title: '可参与年龄段',
            key: 'start_age',
            render: (h, params) => {
              const label = `${params.row.start_age}~${params.row.end_age}`
              return h('span', {}, label)
            }
          },
          { title: '可参与地区', key: 'bonus_area' },
          { title: '参与总人数', key: 'join_num' },
          { title: '完成百分比(%)', key: 'task_finished_percent' },
          { title: '操作',
            width: 150, 
            key: 'operation' ,
            render: (h, params) => {
              return h('div', [
                  h('span', {
                      class: 'span-active',
                      on: {
                        click: () => {
                          this.handleRule(params.row);
                        }
                      }
                  }, '规则'),
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
                          this.handleRemove('task/del',{id:params.row.id})
                        }
                      }
                  }, '删除')
              ]);
            }
          }
        ],
        itemId: 0,
        modal1: false,
        categoryList: [],
        couponList: [],
        defaultList: [],
        formData: {
          task_name: '',
          descr: '',
          category_id: '',
          bonus_area_code: '0',
          bonus_sex: '',
          start_age: '20',
          end_age: '20',
          image: '',
          bonus_ranking: '',
          bonus_type: '1',
          bonus_detail: '',
        },
        rule: {
          
        },
        modal3: false,
        formData3: {
          brush_site_num: '',
          brush_time: '',
          brush_time_noon: '',
          brush_time_evening: '',
          finish_percent: '',
          start_date: '',
          end_date: '',
          fetch_start_date: '',
          fetch_end_date: '',
          period: '',
          is_series: true,
        },
        rule3: {
          
        },
        modal4: false,
        editor: '',
        content: '',
      }
    },
    computed: {
      modelTitle(){
        return this.itemId?'编辑':'新增'
      }
    },
    mounted () {
      this.handleCreate();
    },
    methods: {
      handleAdd() {
        this.modal1 = true;
        this.itemId = 0;
        this.getCategoryList()
        this.getCouponList()
        this.$refs.form.resetFields();
      },
      handleEdit(item) {
        this.modal1 = true;
        this.itemId = item.id;
        this.getCategoryList()
        this.getCouponList()
        this.formData = Object.assign(this.formData,item);
      },
      getCategoryList() {
        this.$post('taskcategory/list',{page_size: 0}).then( res => {
          this.categoryList = res.data;
        })
      },
      getCouponList() {
        this.$post('coupon/list',{page_size: 0}).then( res => {
          this.couponList = res.data;
        })
      },
      handleSubmit() {
        const params = {
          task_name: this.formData.task_name,
          descr: this.formData.descr,
          category_id: this.formData.category_id,
          bonus_area: this.$refs.select.getBalel(),
          bonus_area_code: this.formData.bonus_area_code,
          bonus_sex: this.formData.bonus_sex,
          start_age: this.formData.start_age,
          end_age: this.formData.end_age,
          image: this.formData.image,
          bonus_ranking: this.formData.bonus_ranking,
          bonus_type: this.formData.bonus_type,
          bonus_detail: this.formData.bonus_detail,
        }
        if(this.itemId){
          this.$post('task/edit',
            {
              id: this.itemId,
              ...params
            }
          ).then( res => {
            this.modal1 = false;
            this.handleSearch()
          })
        }else{
          this.$post('task/add',
            {
              ...params
            }
          ).then( res => {
            this.modal1 = false;
            this.handleSearch()
          })
        }
      },
      onSuccess(response, file, fileList){
        this.formData.image = response.data.path
      },
      dateChange1(val) {
        this.formData3.brush_time = val;
      },
      dateChange2(val) {
        this.formData3.brush_time_evening = val;
      },
      dateChange3(val) {
        this.formData3.brush_time_noon = val;
      },
      selectDate(val) {
        this.formData3.start_date = val[0]
        this.formData3.end_date = val[1]
      },
      selectDate2(val) {
        this.formData3.fetch_start_date = val[0]
        this.formData3.fetch_end_date = val[1]
      },
      handleRule(item) {
        this.modal3 = true;
        this.itemId = item.id;
        this.formData3 = Object.assign(this.formData3,item);
        this.formData3.is_series = item.is_series=='1'?true:false;
        // this.formData3.brush_time = new Date(item.brush_time*1000).Format("yyyy-MM-dd");
        this.formData3.start_date = new Date(item.start_date*1000).Format("yyyy-MM-dd");
        this.formData3.end_date = new Date(item.end_date*1000).Format("yyyy-MM-dd");
        this.formData3.fetch_start_date = new Date(item.fetch_start_date*1000).Format("yyyy-MM-dd");
        this.formData3.fetch_end_date = new Date(item.fetch_end_date*1000).Format("yyyy-MM-dd");
        this.$refs.date.setDate(this.formData3.start_date,this.formData3.end_date);
        this.$refs.date2.setDate(this.formData3.fetch_start_date,this.formData3.fetch_end_date);
      },
      handleSubmit3() {
        const params = {
          brush_site_num: this.formData3.brush_site_num,
          brush_time: this.formData3.brush_time,
          brush_time_noon: this.formData3.brush_time_noon,
          brush_time_evening: this.formData3.brush_time_evening,
          finish_percent: this.formData3.finish_percent,
          start_date: this.formData3.start_date,
          end_date: this.formData3.end_date,
          fetch_start_date: this.formData3.fetch_start_date,
          fetch_end_date: this.formData3.fetch_end_date,
          period: this.formData3.period,
          is_series: this.formData3.is_series?'1':'2',
        }
        this.$post('task/editrule',
          {
            ...params,
            id: this.itemId
          }
        ).then( res => {
          this.modal3 = false;
          this.handleSearch()
        })
      },
      // 添加商品详情
      handleEditor(){
        this.modal4 = true;
        this.modal1 = false;
        if(this.itemId){
          this.content = this.formData.descr;
          this.editor.txt.html(this.formData.descr);
        }else{
          this.content = '';
          this.editor.txt.html('');
        }
      },
      handleCreate() {
        // 富文本配置
        let editor = new WangeEditor('#editor-toolbar2','#editor-content2');
        editor.customConfig.debug = true;
        editor.customConfig.uploadImgServer = '/index.php/admin/upload/upload'; // 服务器地址
        editor.customConfig.uploadFileName = 'image'; // 自定义filename
        editor.customConfig.uploadImgParams = { // 设置图片上传参数
          'target': 'mallbanner'
        };
        editor.customConfig.menus = [ // 富文本显示功能配置
          'head',  // 标题
          'bold',  // 粗体
          'fontSize',  // 字号
          'fontName',  // 字体
          'italic',  // 斜体
          'underline',  // 下划线
          'strikeThrough',  // 删除线
          // 'foreColor',  // 文字颜色
          // 'backColor',  // 背景颜色
          'link',  // 插入链接
          // 'list',  // 列表
          'justify',  // 对齐方式
          // 'quote',  // 引用
          // 'emoticon',  // 表情
          'image',  // 插入图片
          // 'table',  // 表格
          // 'video',  // 插入视频
          // 'code' // 插入代码
          'undo',  // 撤销
          'redo'  // 重复
        ]
        // editor.txt.html('<p>请输入正文</p>');
        editor.customConfig.onchange = (html) => {
          this.content = html;
        };
        editor.customConfig.linkImgCallback = function (url) {
          // console.log(url); // url 即插入图片的地址
        };
        editor.customConfig.uploadImgHooks  = {
          customInsert: function (insertImg, result, editor) {
            insertImg(result.data.path)
          }
        };
        editor.create();
        this.editor = editor;
        // this.content = this.formData.descr;
        // this.editor.txt.html(this.formData.descr);
      },
      handleSubmit4(){
        this.formData.descr = this.content
        this.modal4 = false;
        this.modal1 = true;
      },
    },
  };
</script>