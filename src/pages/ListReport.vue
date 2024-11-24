<template>
    <!-- 列表在这里 -->
    <Card v-if="show === 'table'" style="height: 95%;" dis-hover>
        <Button type="primary" style="margin-left: 18px" shape="circle" icon="ios-search" @click="query">查询</Button>
        <br /><br />
        <Table ref="selection" :columns="columns" :data="detailList">
            <template #action="{ row }">
                <Button type="error" size="small" style="margin-right: 5px" @click="async_remove(row)">删除</Button>
                <Button type="primary" size="small" style="margin-right: 5px" @click="see(row)">详情</Button>
            </template>
        </Table>
        <br />
        <Page v-model:model-value="pageNum" :total="total" show-elevator />
    </Card>
    <!-- 详情在这里 -->
    <Card v-if="show === 'detail'" style="height: 95%;" dis-hover>
        <PageHeader :title="detail.config.name">
            <template #action>
                <Button type="primary" @click="goHome">返回</Button>
            </template>
            <template #content>
                <DescriptionList :col="2">
                    <Description term="用例描述：">{{ detail.config.describe }}</Description>
                    <Description term="环境：">{{ detail.config.base_url }}</Description>
                    <Description term="数据库地址：">{{ detail.config.db.host }}</Description>
                    <Description term="数据库库名：">{{ detail.config.db.database }}</Description>
                    <Description term="执行人：">{{ detail.create_user }}</Description>
                    <Description term="执行时间：">{{ detail.create_time }}</Description>
                </DescriptionList>
            </template>
            <template #extra>
                <p style="color: #808695">状态</p>
                <p style="font-size: 24px">{{ statusEums[detail.state] }}</p>
            </template>
        </PageHeader>
        <br />
        <Row>
            <Col span="8">
            <Timeline>
                <TimelineItem color="green" v-for="item in detail.reportdetails_set" :key="item">
                    <p class="time" @click="instance(item)">{{ item.request.name }}</p>
                    <!-- <p class="content">{{ item.describe }}</p> -->
                </TimelineItem>
            </Timeline>
            </Col>
            <!-- 下面是接口详细信息 -->
            <Col span="16" v-if="instanceShow">
            <div style="height:500px; overflow:scroll;">
                <Divider orientation="left">请求信息</Divider>
                <p>接口名称：{{ instanceDetail.request.name }}</p>
                <p>接口描述：{{ instanceDetail.request.describe }}</p>
                <p>请求地址：{{ instanceDetail.request.url }}</p>
                <p>请求类型：{{ instanceDetail.request.type }}</p>
                <p>请求体：{{ instanceDetail.request.body }}</p>
                <Divider orientation="left">响应信息</Divider>
                <p>执行时间：{{ instanceDetail.create_time }}</p>
                <p>状态码：{{ instanceDetail.code }}</p>
                <p>返回：{{ instanceDetail.response }}</p>
                <Divider orientation="left">断言</Divider>
                <p>设置：{{ instanceDetail.assertion }}</p>
                <p>返回：{{ instanceDetail.assertion_result }}</p>
                <Divider orientation="left">sql执行情况</Divider>
                <p>前置sql：{{ instanceDetail.pre_sql }}</p>
                <p>返回：{{ instanceDetail.pre_sql_result }}</p>
                <p>后置sql：{{ instanceDetail.post_sql }}</p>
                <p>返回：{{ instanceDetail.post_sql_result }}</p>
            </div>
            </Col>
        </Row>

    </Card>
</template>
<script>
export default {
    data() {
        return {
            total: 0,
            pageNum: 1,
            show: 'table',
            // 列表
            statusEums: {
                0: "执行中",
                1: "失败",
                2: "成功"
            },
            columns: [
                {
                    title: '文件路径',
                    key: 'name',
                    render: (h, params) => {
                        return h('span', params.row.config.name);
                    }
                },
                {
                    title: '函数名称',
                    key: 'describe',
                    render: (h, params) => {
                        return h('span', params.row.config.describe);
                    }
                },
                {
                    title: '状态',
                    key: 'state',
                    render: (h, params) => {
                        return h('span', this.statusEums[params.row.state]);
                    }
                },
                {
                    title: '执行人',
                    key: 'create_user'
                },
                {
                    title: '执行时间',
                    width: 180,
                    key: 'create_time'
                },
                {
                    title: '结束时间',
                    width: 180,
                    key: 'create_time'
                },
                {
                    title: '操作',
                    slot: 'action',
                    width: 150,
                    align: 'center',
                }
            ],
            //列表信息
            detailList: [],
            // 详情信息
            detail: {},
            // 展示单个接口信息
            instanceShow: false,
            instanceDetail: {}

        }
    },
    watch: {
        pageNum(val) {
            this.axios.get('/path/report/?page='+this.pageNum).then(
                (response) => {
                    this.detailList = response.data.results;
                    this.count = response.data.count;
                }
            );
        }
    },
    methods: {
        query() {
            // 这里请求设置了代理
            this.axios.get('/path/report/').then(
                (response) => {
                    this.detailList = response.data.results;
                    this.total = response.data.count;
                }
            );
        },
        see(row) {
            this.instanceShow = false,
                this.show = 'detail',
                this.detail = row
        },
        async_remove(row) {
            this.$Modal.confirm({
                title: '删除配置项',
                content: '确定删除【' + row.config.name + '】执行记录吗？',
                loading: true,
                onOk: () => {
                    this.axios.delete('/path/report/' + row.id + '/').then(
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
        instance(item) {
            // console.log('instance');
            // console.log(item);
            this.instanceDetail = item
            this.instanceShow = !this.instanceShow
        },
        goHome() {
            this.show = 'table'
            this.query()
        },
    },
    created() {
        this.query();
    }

}
</script>
<style scoped>
.time {
    font-size: 14px;
    font-weight: bold;
}

.content {
    padding-left: 5px;
}

.demo-split {
    height: 500px;
    border: 1px solid #dcdee2;
}
</style>