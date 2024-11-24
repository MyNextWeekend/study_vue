<template>
    <Card style="height: 95%;" dis-hover>
        <Button @click="add()" type="primary" icon="md-add-circle">新增</Button>
        <br><br>
        <Table :columns="columns" :data="data">
            <template #name="{ row }">
                <strong>{{ row.name }}</strong>
            </template>
            <template #action="{ row }">
                <Button type="primary" size="small" style="margin-right: 5px" @click="edit(row)">编辑</Button>
                <Button type="error" size="small" @click="async_remove(row)">删除</Button>
            </template>
        </Table>
        <br />
        <Page v-model:model-value="pageNum" :total="total" show-elevator />
        <!-- 下面是抽屉 -->
        <Drawer :title=title_name v-model='show' width="720" :mask-closable="false" :styles="styles">
            <Form ref="formData" :model="formData" :rules="ruleDate">
                <Row :gutter="32">
                    <Col span="18">
                    <FormItem label="数据库名称" prop="name" label-position="top">
                        <Input v-model="formData.name" placeholder="请输入环境的名称" />
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="22">
                    <FormItem label="数据库描述" label-position="top">
                        <Input v-model="formData.describe" placeholder="请简单描环境的定义">
                        </Input>
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="12">
                    <FormItem label="数据库地址" prop="host" label-position="top">
                        <Input v-model="formData.host" placeholder="127.0.0.1:3306">
                        </Input>
                    </FormItem>
                    </Col>
                    <Col span="12">
                    <FormItem label="状态" prop="state" label-position="top">
                        <Select v-model="formData.state" placeholder="请选择环境状态">
                            <Option :value=1>启用</Option>
                            <Option :value=0>停用</Option>
                        </Select>
                    </FormItem>
                    </Col>
                </Row>
                <Row :gutter="32">
                    <Col span="18">
                    <FormItem label="用户名" prop="user" label-position="top">
                        <Input v-model="formData.user" placeholder="请输入用户名"></Input>
                    </FormItem>
                    </Col>
                    <Col span="18">
                    <FormItem label="密码" prop="password" label-position="top">
                        <Input type="password" v-model="formData.password" placeholder="请输入密码"></Input>
                    </FormItem>
                    </Col>
                    <Col span="18">
                    <FormItem label="库表" prop="database" label-position="top">
                        <Input v-model="formData.database" placeholder="请输入库表名"></Input>
                    </FormItem>
                    </Col>
                </Row>

                <FormItem label="备注" label-position="top">
                    <Input type="textarea" v-model="formData.remarks" :rows="4" placeholder="请输入备注" />
                </FormItem>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="show = false">关闭</Button>
                <Button type="primary" @click="SubmitEvent('formData')">提交</Button>
            </div>
        </Drawer>
    </Card>
</template>
<script>
export default {
    data() {
        return {
            total: 0,
            pageNum: 1,
            statusEums: {
                0: "停用",
                1: "启用"
            },
            index: '',
            // 抽屉
            show: false,
            title_name: '',
            styles: {
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                paddingBottom: '53px',
                position: 'static'
            },
            formData: {
                name: '',
                describe: '',
                addres: '',
                state: '',
                connect: '',
                remarks: ''
            },
            // 列表
            columns: [
                {
                    title: '数据库名称',
                    key: 'name',
                },
                {
                    title: '数据库描述',
                    key: 'describe'
                },
                {
                    title: '数据库地址',
                    key: 'host'
                },
                {
                    title: '状态',
                    key: 'state',
                    render: (h, params) => {
                        return h('span', this.statusEums[params.row.state]);
                    }
                },
                {
                    title: '更新时间',
                    key: 'update_time'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center',
                }
            ],
            data: [],
            // 校验规则
            ruleDate: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                host: [
                    { required: true, message: '请输入数据库地址', trigger: 'blur' }
                ],
                state: [
                    { type: 'number', required: true, message: '请选择状态', trigger: 'change' }
                ],
                user: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                database: [
                    { required: true, message: '请输入连接库表名', trigger: 'blur' }
                ]
            },
        }
    },
    watch: {
        pageNum(val) {
            this.axios.get('/path/Database/?page=' + this.pageNum).then(
                (response) => {
                    this.data = response.data.results;
                    this.count = response.data.count;
                }
            );
        }
    },
    methods: {
        query: function () {
            // 这里请求设置了代理
            this.axios.get('/path/Database/').then(
                (response) => {
                    this.data = response.data.results;
                    this.count = response.data.count;
                }
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
        edit(row) {
            this.show = true
            this.title_name = '编辑'
            this.formData = row
            this.index = row.id
        },
        async_remove(row) {
            this.$Modal.confirm({
                title: '删除配置项',
                content: '确定删除配置项【' + row.name + '】吗？',
                loading: true,
                onOk: () => {
                    this.axios.delete('/path/database/delete',{id:row.id }).then(
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
        },
        SubmitEvent(name) {
            // console.log(this.$refs[name]);
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.index = row.id
                    if (this.index) {
                        this.axios.put('/path/Database/' +  + '/', this.formData).then(
                            (response) => {
                                this.$Notice.success({
                                    title: '修改成功'
                                });
                                this.index = ''
                                this.show = false;
                                this.query();
                            }
                        );
                    } else {
                        this.axios.post('/path/Database/', this.formData).then(
                            (response) => {
                                this.$Notice.success({
                                    title: '提交成功'
                                });
                                this.show = false;
                                this.query();
                            }
                        );
                    }
                } else {
                    this.$Notice.error({
                        title: '请检查输入',
                    });
                }
            })
        },
    },
    created() {
        this.query();
    }
}
</script>
<style>
.demo-drawer-footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
}
</style>