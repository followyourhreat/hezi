<template>
  <div>
    <div class="dt-search-top">
      <div class="dt-search-cells">
        <div class="dt-search-cell">
          <Input v-model="params.keyword" class="dt-search-input" placeholder="请输入消息名称、消息内容查询" />
        </div>
        <div class="dt-search-cell">
          <Button type="ghost" @click="handleSearch">查询</Button>
        </div>
      </div>
      <div class="dt-search-operation">
        <Button type="info" @click="handleAdd">新增</Button>
      </div>
    </div>
    <dt-table ref="table" url="apppush/list" :params="params" :columns="columns"></dt-table>
    <Modal v-model="modal1" :title="modelTitle" :mask-closable="false">
      <Form ref="form" :model="formData" :rules="rule" :label-width="100">
        <FormItem label="消息名称" prop="title">
          <Input v-model="formData.title" placeholder="请输入消息名称"></Input>
        </FormItem>
        <FormItem label="消息内容" prop="content">
          <Input v-model="formData.content" placeholder="请输入消息内容"  type="textarea"></Input>
        </FormItem>
        <FormItem label="推送对象" prop="scope">
          <RadioGroup v-model="formData.scope">
            <Radio label="1">所有人</Radio>
            <Radio label="2">按省份</Radio>
            <Radio label="3">指定用户</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="地区" prop="province_code" v-if="formData.scope =='2'">
          <dt-select v-model="formData.province_code" url="userProvinceModal"/>
        </FormItem>
        <FormItem label="填写账号" prop="users" v-if="formData.scope =='3'">
          <Input v-model="formData.users" placeholder="请输入填写账号"  type="textarea"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="handleSubmit(1)">推送</Button>
        <Button type="ghost" @click="handleSubmit(2)">保存</Button>
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
          { title: '消息名称', key: 'title' },
          { title: '消息内容', key: 'content' },
          { title: '推送对象',
            key: 'scope',
            render: (h, params) => {
              const obj = {'1': '所有人','2': '按省份','3': '指定用户'}
              const label = obj[params.row.scope]
              return h('span', {}, label)
            }
          },
          { title: '是否已推送',
            key: 'is_push',
            render: (h, params) => {
              const obj = {'1': '是','2': '否'}
              const label = obj[params.row.is_push]
              return h('span', {}, label)
            }
          },
          { title: '操作',
            width: 200,
            key: 'operation',
            render: (h, params) => {
              return h('div', [
                  h('span', {
                      class: 'span-active',
                      on: {
                        click: () => {
                          this.handleStatus(params.row);
                        }
                      }
                  }, '推送'),
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
                          this.handleRemove('apppush/del',{id:params.row.id})
                        }
                      }
                  }, '删除')
              ]);
            }
          }
        ],
        itemId: 0,
        modal1: false,
        formData: {
          title: '',
          content: '',
          scope: '1',
          province_code: '',
          users: '',
          is_push: '',
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
      handleStatus(item) {
        this.$post('apppush/push',{id: item.id}).then( res => {
          this.handleSearch();
        })
      },
      handleAdd() {
        this.modal1 = true;
        this.itemId = 0;
        this.$refs.form.resetFields();
      },
      handleEdit(item) {
        this.modal1 = true;
        this.itemId = item.id;
        this.formData = Object.assign(this.formData,item);
      },
      handleSubmit(val) {
        if(this.formData.title == ''){
          this.$Message.destroy();
          this.$Message.warning('消息名称为必填项');
          return
        }
        if(this.formData.content == ''){
          this.$Message.destroy();
          this.$Message.warning('消息内容为必填项');
          return
        }
        const params = {
          title: this.formData.title,
          content: this.formData.content,
          scope: this.formData.scope,
          province_code: this.formData.province_code,
          users: this.formData.users,
          is_push: val,
        }
        if(this.itemId){
          this.$post('apppush/edit',
            {
              id: this.itemId,
              ...params
            }
          ).then( res => {
            this.modal1 = false;
            this.handleSearch()
          })
        }else{
          this.$post('apppush/add',
            {
              ...params
            }
          ).then( res => {
            this.modal1 = false;
            this.handleSearch()
          })
        }
      },
    },
  };
</script>