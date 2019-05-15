<template>
  <div>
    <div class="dt-search-top">
      <div class="dt-search-cells">

      </div>
      <div class="dt-search-operation">
        <Button type="info" @click="handleOrder">排序</Button>
        <Button type="info" @click="handleAdd">新增</Button>
      </div>
    </div>
    <dt-table ref="table" url="taskbanner/list" :params="params" :columns="columns"></dt-table>
    <Modal v-model="modal1" :title="modelTitle" :mask-closable="false">
      <Form ref="form" :model="formData" :rules="rule" :label-width="100">
        <FormItem label="图片" prop="image">
          <img v-if="formData.image" class="formItemImg" :src="formData.image" />
          <Upload type="drag" action="/index.php/admin/upload/upload" :show-upload-list="false" :default-file-list="defaultList" :data="uploadData" name="image" accept=".png, .jpg, .jpeg, .gif" :on-success="onSuccess">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>上传图片</p>
            </div>
          </Upload>
        </FormItem>
        <FormItem label="关联任务" prop="task_id">
          <Select v-model="formData.task_id" style="width:200px">
            <Option v-for="item in taskList" :value="item.id" :key="item.id">{{ item.task_name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="handleSubmit()">保存</Button>
        <Button type="text" @click="modal1 = false" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
    <Modal v-model="modal2" title="排序" :mask-closable="false">
      <table style="width: 100%;text-align: left;">
        <tr>
          <th>名称</th>
          <th>序号</th>
        </tr>
        <tr v-for="item in list2">
          <td><img class="span-img" :src="item.image"></td>
          <td><Input v-model="item.sort" placeholder="请输入序号"></Input></td>
        </tr>
      </table>
      <div slot="footer">
        <Button type="ghost" @click="handleSubmit2()">保存</Button>
        <Button type="text" @click="modal2 = false" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        uploadData: {
          target: 'taskbanner'
        },
        params: {

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
          { title: '图片',
            key: 'image',
            render: (h, params) => {
              const label = params.row.image
              return h('img', {
                class: 'span-img',
                attrs: {
                  src: label
                },
              })
            }
          },
          { title: '关联任务',
            key: 'task',
            render: (h, params) => {
              const label = params.row.task&&params.row.task.task_name
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
                          this.handleRemove('taskbanner/del',{id:params.row.id})
                        }
                      }
                  }, '删除')
              ]);
            }
          }
        ],
        itemId: 0,
        modal1: false,
        taskList: [],
        defaultList: [],
        formData: {
          task_id: '',
          image: '',
          form3: '',
        },
        rule: {
          
        },
        modal2: false,
        list2: [],
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
      handleAdd() {
        this.modal1 = true;
        this.itemId = 0;
        this.getTaskList();
        this.$refs.form.resetFields();
      },
      handleEdit(item) {
        this.modal1 = true;
        this.itemId = item.id;
        this.getTaskList();
        this.formData = Object.assign(this.formData,item);
      },
      handleSubmit() {
        if(this.itemId){
          this.$post('taskbanner/edit',
            {
              id: this.itemId,
              image: this.formData.image,
              task_id: this.formData.task_id
            }
          ).then( res => {
            this.modal1 = false;
            this.handleSearch()
          })
        }else{
          this.$post('taskbanner/add',
            {
              image: this.formData.image,
              task_id: this.formData.task_id
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
      getTaskList() {
        this.$post('task/list',{page_size: 0}).then( res => {
          this.taskList = res.data;
        })
      },
      handleOrder() {
        this.modal2 = true;
        this.$post('taskbanner/list',{}).then( res => {
          this.list2 = res.data.list;
        })
      },
      handleSubmit2() {
        const params = this.list2.map( item => {
          return {
            id: item.id,
            sort: item.sort
          }
        })
        this.$post('taskbanner/sort',
          {
            params: JSON.stringify(params)
          }
        ).then( res => {
          this.modal2 = false;
          this.handleSearch()
        })
      }
    },
  };
</script>