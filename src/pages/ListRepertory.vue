<template>
    <!-- 列表在这里 -->
    <Card style="height: 95%;" dis-hover>
        <Button type="primary" style="margin-left: 18px" shape="circle" icon="ios-search" @click="query">查询</Button>
        <br /><br />
        <Table ref="selection" :columns="columns" :data="caseList">
            <template #action="{ row }">
                <Button type="error" size="small" style="margin-right: 5px" @click="async_remove(row)">查看</Button>
                <Button type="primary" size="small" style="margin-right: 5px" @click="reportStart(row)">执行</Button>
            </template>
        </Table>
        <br />
        <Page v-model:model-value="pageNum" :total="total" show-elevator />
    </Card>
</template>
<script>
export default {
    data() {
        return {
            total: 0,
            pageNum: 1,
            caseIndex: '',
            // 接口请求数据存储
            databaseList: [],
            environmentList: [],
            interfaceList: [],
            // 展示单个接口信息
            interfaceJson: {
                "name": "",
                "describe": "",
                "type": "",
                "path": "",
                "body": "",
            },
            // 单接口详情操作
            actionIndex: '',
            // 组装的大字典
            formDate: {
                name: '',
                describe: '',
                environment: '',
                database: '',
                caseinterface_set: [{
                    interface: '',
                    assertion: '',
                    pre_sql: '',
                    post_sql: ''
                }]
            },
            // 校验规则
            ruleDate: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                environment: [
                    { type: 'number', required: true, message: '请选择执行环境', trigger: 'change' }
                ],
                database: [
                    { type: 'number', required: true, message: '请选择数据库', trigger: 'change' }
                ]
            },
            // 列表
            columns: [
                {
                    title: '文件路径',
                    key: 'name'
                },
                {
                    title: '文件描述',
                    key: 'describe'
                },
                {
                    title: '函数名称',
                    key: 'caseinterface_set'
                },
                {
                    title: '函数签名',
                    key: 'update_time'
                },
                {
                    title: '函数说明',
                    key: 'update_time'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 200,
                    align: 'center',
                }
            ],
            caseList: []
            //编辑页面
        }
    },
    watch: {
        pageNum(val) {
            this.axios.get('/path/case/?page=' + this.pageNum).then(
                (response) => {
                    this.caseList = response.data.results;
                    this.count = response.data.count;
                }
            );
        }
    },
    methods: {
        query: function () {
            // 这里请求设置了代理
            this.axios.get('/path/case/').then(
                (response) => {
                    this.caseList = response.data.results;
                    this.count = response.data.count;
                }
            );
            this.axios.get('/path/Environment/').then(
                (response) => { this.environmentList = response.data.results; }
            );
            this.axios.get('/path/Database/').then(
                (response) => { this.databaseList = response.data.results; }
            );
            this.axios.get('/path/interface/').then(
                (response) => { this.interfaceList = response.data.results; }
            );

        },
        // 提交后台
        handleSubmit: function (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if (this.caseIndex) {
                        this.axios.put('/path/case/' + this.caseIndex + '/', this.formDate).then(
                            (response) => {
                                this.$Notice.success({
                                    title: '提交成功'
                                });
                                this.goHome()
                            }
                        )
                    } else {
                        this.axios.post('/path/case/', this.formDate).then(
                            (response) => {
                                this.$Notice.success({
                                    title: '提交成功'
                                });
                                this.goHome()
                            }
                        ).catch(
                            (error) => {
                                this.$Notice.success({
                                    title: '提交失败'
                                });
                                console.log(error);
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
        // 增加单个接口
        handleAdd() {
            this.formDate.caseinterface_set.push({
                interface: '',
                assertion: '',
                pre_sql: '',
                post_sql: ''
            });
        },
        // 删除接口
        handleRemove(index) {
            // 删除指定索引 1 个数据
            this.formDate.caseinterface_set.splice(index, 1)
        },
        //设置单个接口
        handleConfig(index) {
            this.showDetail = true
            this.actionIndex = index
            this.axios.get('/path/interface/' + this.formDate.caseinterface_set[index].interface + '/', this.formDate).then(
                (response) => {
                    this.interfaceJson = response.data
                }
            )
        },

        // 列表方法
        newCase: function () {
            this.show = 'new'
            this.formDate = {
                name: '',
                describe: '',
                environment: '',
                database: '',
                caseinterface_set: [{
                    interface: '',
                    assertion: '',
                    pre_sql: '',
                    post_sql: ''
                }]
            }
            this.caseIndex = ''
        },
        goHome() {
            this.show = 'table'
            this.query()
        },
        edit(row) {
            this.show = 'new'
            this.formDate = row
            this.caseIndex = row.id
        },
        reportStart(row) {
            this.axios.post('/path/report/', { "case": row.id }).then(
                (response) => {
                    this.$Notice.success({
                        title: '执行成功'
                    });
                    this.query();
                }
            );
        },
        async_remove(row) {
            this.$Modal.confirm({
                title: '删除配置项',
                content: '确定删除配置项【' + row.name + '】吗？',
                loading: true,
                onOk: () => {
                    this.axios.delete('/path/case/' + row.id + '/').then(
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