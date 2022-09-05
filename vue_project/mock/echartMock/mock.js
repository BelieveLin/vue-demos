const Mock = require("mockjs");

const data = require("./data.json");

Mock.mock("/dev-mock/home/list", {
    code: 200,
    data
});
