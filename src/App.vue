<script setup>
import HomeHeader from './components/HomeHeader.vue'
import HomeMenu from './components/HomeMenu.vue'
</script>

<template>
  <div class="layout">
        <Layout :style="{height:'100vh'}">
          <HomeHeader></HomeHeader>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff',height:'90vh',overflow: 'auto'}">
                  <HomeMenu></HomeMenu>
                </Sider>
                
                <Layout :style="{padding: '0 24px 24px'}">
                    <Breadcrumb :style="{margin: '24px 0'}">
                        <BreadcrumbItem>Home</BreadcrumbItem>
                        <BreadcrumbItem>Components</BreadcrumbItem>
                        <BreadcrumbItem>Layout</BreadcrumbItem>
                    </Breadcrumb>
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                      <router-view></router-view>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>

<style>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: auto;
}
</style>