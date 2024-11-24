<script>
import HomeHeader from '../components/HomeHeader.vue'
import HomeMenu from '../components/HomeMenu.vue'
</script>

<template>
  <HomeHeader></HomeHeader>
  <Row>
    <Col span="4">
      <HomeMenu></HomeMenu>
    </Col>
    <Col span="18" offset="1">
      <router-view></router-view>
    </Col>
  </Row>
</template>