import mockRequest from "@/utils/mockRequest";

// 获取数据
export const reqGetEchartsList = () => mockRequest({ url: "/home/list", method: "get" });