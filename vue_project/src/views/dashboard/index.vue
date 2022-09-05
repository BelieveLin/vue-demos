<template>
  <div>
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import Card from "./card";
import Sale from "./sale";
import Observe from "./observe";

export default {
  name: "Dashboard",
  components: {
    Card,
    Sale,
    Observe,
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
