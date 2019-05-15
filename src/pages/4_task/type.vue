<template>
  <div>
    <div class="dt-search-top">
      <div class="dt-search-cells">
        <div class="dt-search-cell">
          <Input v-model="params.keyword" class="dt-search-input" placeholder="请输入分类名称" />
        </div>
        <div class="dt-search-cell">
          <Button type="ghost" @click="handleSearch">查询</Button>
        </div>
      </div>
      <div class="dt-search-operation">
        <Button type="info" @click="handleOrder">排序</Button>
        <Button type="info" @click="handleAdd">新增</Button>
      </div>
    </div>
    <dt-table ref="table" url="taskcategory/list" :params="params" :columns="columns"></dt-table>
    <Modal v-model="modal1" :title="modelTitle" :mask-closable="false">
      <Form ref="form" :model="formData" :rules="rule" :label-width="100">
        <FormItem label="分类名称" prop="cate_name">
          <Input v-model="formData.cate_name" placeholder="请输入分类名称" :maxlength="10"></Input>
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
          <td>{{item.cate_name}}</td>
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
          { title: '名称', key: 'cate_name' },
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
                          this.handleRemove('taskcategory/del',{id:params.row.id})
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
          cate_name: '',
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
        this.$refs.form.resetFields();
      },
      handleEdit(item) {
        this.modal1 = true;
        this.itemId = item.id;
        this.formData = Object.assign(this.formData,item);
        // this.$post('taskcategory/detail',{id: item.id}).then( res => {
        //   var data = res.data;
        //   this.formData = Object.assign(this.formData,data);
        // })
      },
      handleSubmit() {
        if(this.formData.cate_name == ''){
          this.$Message.destroy();
          this.$Message.warning('分类名称为必填项');
          return
        }
        if(this.itemId){
          this.$post('taskcategory/edit',
            {
              id: this.itemId,
              cate_name: this.formData.cate_name
            }
          ).then( res => {
            this.modal1 = false;
            this.handleSearch()
          })
        }else{
          this.$post('taskcategory/add',
            {
              cate_name: this.formData.cate_name
            }
          ).then( res => {
            this.modal1 = false;
            this.handleSearch()
          })
        }
      },
      handleOrder() {
        this.modal2 = true;
        this.$post('taskcategory/list',{}).then( res => {
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
        this.$post('taskcategory/sort',
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