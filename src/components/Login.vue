<template>
    <div>
        <Row type="flex" justify="center">
            <Col span="12" style="height:200px;">
            </Col>
        </Row>
        <Row type="flex" justify="center">
            <Col span="12" style="height:calc(100vh - 200px);">
            <Layout>
                <Content style="display:flex;justify-content:center;background:#eeeeee;">
                    <Card class="Card">

                        <br />
                        <h1 style="text-align:center;font-size:32px;">欢迎回来</h1>
                        <br />
                        <div style="background-color:#dddddd;height:2px;"></div>
                        <br />
                        <div class="demo-login">
                            <Login @on-submit="handleSubmit">
                                <br />
                                <UserName name="username" />
                                <Password name="password" />
                                <div class="demo-auto-login">
                                    <a @click="forgot_password">忘记密码</a>
                                </div>
                                <Submit />
                            </Login>
                        </div>
                    </Card>
                </Content>
            </Layout>
            </Col>
        </Row>


    </div>
</template>
<script>
export default {
    data() {
        return {
            autoLogin: false
        }
    },
    methods: {
        handleSubmit(valid, { username, password }) {
            if (valid) {
                this.$Modal.info({
                    title: '输入的内容如下：',
                    content: 'username: ' + username + ' | password: ' + password
                });
            }
        },
        forgot_password() {
            this.$Modal.error({
                title: '怎么能忘记呢？',
                content: '忘记了我也没办法!!!'
            });
        }
    }
}
</script>
<style>
body {
    background: #eeeeee !important;
}

.demo-login {
    width: 300px;
    margin: 0 auto !important;
}

.demo-auto-login a {
    margin-bottom: 24px;
    float: right;
}

.Card {
    /* border-radius: 30px; */
    width: 370px;
    /* justify-content: center; */
    box-shadow: 5px 5px 5px 5px #cccccc;
}
</style>
