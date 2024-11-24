<template>
      
     <Input v-model="value" placeholder="Enter something..." clearable style="width: 200px" />
    <Card v-if="show === 'table'" style="height: 95%;" dis-hover>
        <Button @click="newInterface()" type="primary" icon="md-add-circle">新增</Button>
        <Space direction="vertical">
        <Space wrap>
            <Button shape="circle" icon="ios-search" @click="query()"></Button>
        </Space>
    </Space>
             <br /><br />
        
        <Table ref="selection" :columns="columns" :data="interfaceList">
            <template #action="{ row }">
                <Button type="primary" size="small" style="margin-right: 5px" @click="edit(row)">编辑</Button>
                <Button type="error" size="small" @click="async_remove(row)">生成样例</Button>
            </template>
        </Table>
        <br />
        <Page v-model:model-value="pageNum" :total="total" show-elevator />
    </Card>
    <Card v-if="show === 'new'" style="height: 95%;" dis-hover>
        <Col>
        <Form ref="formItem" :model="formItem" :rules="ruleItem" :label-width="80" inline>
            <FormItem label="接口名称" prop="name" style="width:80%">
                <Input v-model="formItem.name" placeholder="请输入接口的名称" clearable></Input>
            </FormItem>
            <br />
            <FormItem label="接口描述" style="width:80%">
                <Input v-model="formItem.describe" placeholder="请简单描述接口的定义或功能" clearable></Input>
            </FormItem>
            <br />
            <FormItem label="请求方式" prop="type" style="width:40%">
                <RadioGroup v-model="formItem.type">
                    <Radio label="get">GET</Radio>
                    <Radio label="post">POST</Radio>
                    <Radio label="put">PUT</Radio>
                    <Radio label="delete">DELETE</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="环境选择" prop="uri" style="width:35%">
                <Select v-model="formItem.uri">
                    <Option v-for="item in environmentList" :key="item" :value="item.uri">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <br />
            <FormItem label="请求地址" prop="path" style="width:80%">
                <Input v-model="formItem.path" clearable placeholder="/hello">
                <template #prepend>
                    <span v-if=formItem.uri>{{ formItem.uri }}</span>
                    <span v-else>请选择环境</span>
                </template>
                </Input>
            </FormItem>
            <FormItem label="请求体" prop="body" style="width:80%"
                v-if="this.formItem.type === 'post' || this.formItem.type === 'put'">
                <Input v-model="formItem.body" type="textarea" :autosize="{ minRows: 2, maxRows: 7 }"
                    placeholder='{"mobile":"#{mobile}","obj":"666"}' maxlength="200" show-word-limit></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="SubmitEvent('formItem')">提交</Button>
                <Button @click="goHome()">返回</Button>
                <Button @click="value = true" style="margin-left: 8px">测试一下</Button>
            </FormItem>
        </Form>

        </Col>
    </Card>
    <div>
        <!-- 抽屉 -->
        <Drawer :closable="false" width="640" v-model="value">
            <p :style="pStyle">请求内容</p>
            <div class="demo-drawer-profile">
                Message: Hello
            </div>
            <Divider />
            <p :style="pStyle">返回内2容</p>
            <div class="demo-drawer-profile">
                {'code':0}
            </div>
        </Drawer>
    </div>
</template>
<script>
export default {
    data() {
        return {
            total: 0,
            pageNum: 1,
            interfaceIndex: '',
            show: 'new',
            // 详情页面参数
            environmentList: [],
            value: false,
            formItem: {
                id:"",
                name: '',
                describe: '',
                type: '',
                uri: '',
                path: '',
                body: ''
            },
            pStyle: {
                fontSize: '16px',
                color: 'rgba(0,0,0,0.85)',
                lineHeight: '24px',
                display: 'block',
                marginBottom: '16px'
            },
            // 校验规则
            ruleItem: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择请求类型', trigger: 'change' }
                ],
                path: [
                    { required: true, message: '请输入地址', trigger: 'blur' }
                ],
                body: [
                    { required: true, message: '请输入请求体', trigger: 'blur' }
                ]
            },
            // 列表参数
            columns: [
                {
                    title: '名称',
                    key: 'name'
                },
                {
                    title: '描述',
                    key: 'describe'
                },
                {
                    title: '表达式',
                    key: 'body'
                },
                {
                    title: '样例',
                    key: 'update_time'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center',
                }
            ],
            interfaceList: [],
        }
    },
    watch: {
        pageNum(val) {
            this.axios.get('/path/interface/?page=' + this.pageNum).then(
                (response) => {
                    this.interfaceList = response.data.results;
                    this.count = response.data.count;
                }
            );
        }
    },
    methods: {
        query: function () {
            // 这里请求设置了代理
            this.axios.get('/path/interface/').then(
                (response) => {
                    this.interfaceList = response.data.results;
                    this.count = response.data.count;
                }
            );
            this.axios.get('/path/Environment/').then(
                (response) => { this.environmentList = response.data.results; }
            );
        },
        add() {
            this.show = true
            this.title_name = '新增'
            this.formData = {
                id:'',
                name: '',
                describe: '',
                host: '',
                state: 1,
                connect: '',
                remarks: ''
            }
            this.index = ''
        },
        SubmitEvent: function (name) {
            // console.log(this.$refs[name]);
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if (this.formItem.type === 'get' | this.formItem.type === 'delete') {
                        this.formItem.body = ''
                    }
                    if (this.interfaceIndex) {
                        this.axios.put('/path/interface/' + this.interfaceIndex + '/', this.formItem)
                            .then((response) => {
                                this.$Notice.success({
                                    title: '提交成功',
                                });
                                this.goHome();
                            });
                    } else {
                        this.axios.post('/path/api/add/', this.formItem)
                            .then((response) => {
                                this.$Notice.success({
                                    title: '提交成功',
                                });
                                this.goHome()
                            }).catch(
                                (error) => {
                                    this.$Notice.error({
                                        title: '提交失败',
                                        desc: error.request.response
                                    });
                                }
                            )
                    }
                } else {
                    this.$Notice.error({
                        title: '请检查输入',
                    });
                }

            })
        },

        newInterface() {
            this.show = 'new'
            this.interfaceIndex = ''
            this.formItem = {
                name: '',
                describe: '',
                type: '',
                uri: '',
                path: '',
                body: ''
            }
        },
        edit(row) {
            this.show = 'new'
            this.formItem = row
            this.interfaceIndex = row.id
        },
        goHome() {
            this.show = 'table'
            this.query()
        },
        async_remove(row) {
            this.$Modal.confirm({
                title: '删除配置项',
                content: '确定删除配置项【' + row.name + '】吗？',
                loading: true,
                onOk: () => {
                    this.axios.delete('/path/interface/' + row.id + '/').then(
                        (response) => {
                            this.$Notice.success({
                                title: '删除成功'
                            });
                            this.$Modal.remove();
                            this.query();
                        }
                    );
                },
                onCancel: () => {
                    this.$Notice.info({
                        title: '已取消',
                    });
                }
            });
        }
    },
    created() {
        this.query();
    }
}
</script>