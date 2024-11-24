<template>
    <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
        <Submenu name="1">
            <template #title>
                <Icon type="ios-navigate"></Icon>
                Dashboard
            </template>
            <MenuItem name="1-1">主控台</MenuItem>
            <MenuItem name="1-2">监控页面</MenuItem>
            <MenuItem name="1-3">工作台</MenuItem>
        </Submenu>
        <Submenu name="2">
            <template #title>
                <Icon type="ios-keypad"></Icon>
                代码运行
            </template>
            <MenuItem name="/ArgsConfig" to="/ArgsConfig">参数配置</MenuItem>
            <MenuItem name="/ListRepertory" to="/ListRepertory">仓库详情</MenuItem>
            <MenuItem name="/ListReport" to="/ListReport">执行记录</MenuItem>
            <MenuItem name="2-5" to="/test">仓库配置</MenuItem>
        </Submenu>
        <Submenu name="3">
            <template #title>
                <Icon type="ios-analytics"></Icon>
                造数工具
            </template>
            <MenuItem name="/ListDB" to="/ListDB">数据库</MenuItem>
            <MenuItem name="/ListEnvironment" to="/ListEnvironment">交易环境</MenuItem>
            <MenuItem name="/ListDataPreparation" to="/ListDataPreparation">数据准备</MenuItem>
        </Submenu>
        <Submenu name="4">
            <template #title>
                <Icon type="ios-stats" />
                统计分析
            </template>
            <MenuItem name="4-1">执行结果</MenuItem>
            <MenuItem name="4-2">活跃分析</MenuItem>
            <MenuItem name="4-3">时段分析</MenuItem>
            <!-- <MenuItem name="4-4">用户留存</MenuItem> -->
            <!-- <MenuItem name="4-5">流失用户</MenuItem> -->
        </Submenu>
</Menu>
</template>

<script>
export default {
    data() {
        return {
            activeName: this.$route.path,
            openNames: ['2',]
        }
    },
    watch: {
        // 监听路由的变化，来实现展示正确的菜单
        '$route': function () {
            // console.log(this.$route);
            this.activeName = this.$route.path
        },
        // openNames() {
        //     this.$nextTick(() => {
        //         this.$refs.side_menu.updateOpened();
        //         this.$refs.side_menu.updateActiveName();
        //     })
        // },


    }
}
</script>

